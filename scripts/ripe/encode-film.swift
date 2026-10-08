// A film, re-encoded for the web.
//
// Called by grade-10-days.mjs for the page's banner:
//
//   swift scripts/ripe/encode-film.swift <in> <out.mp4> <long edge px> <bits per second> [sound]
//
// H.264, scaled so its long edge is at most the given size, at the given
// average bitrate ("auto": about 0.1 bit a pixel a frame, from 600kbps to
// 2.5Mbps — enough for a film shown at most ~600px wide), with no sound unless "sound" is given (then its first
// audio track, as AAC at 128kbps), and with its index at the front so it
// starts playing before it has finished downloading. Nothing else about
// the picture changes. Uses AVFoundation, which every Mac has; ffmpeg
// isn't installed here, and avconvert can't set a bitrate.

@preconcurrency import AVFoundation

let args = CommandLine.arguments
guard args.count >= 5, let longEdge = Double(args[3]), args[4] == "auto" || Int(args[4]) != nil else {
  FileHandle.standardError.write("usage: encode-film.swift <in> <out.mp4> <long edge px> <bits per second>\n".data(using: .utf8)!)
  exit(2)
}
let keepSound = args.count >= 6 && args[5] == "sound"
let src = URL(fileURLWithPath: args[1])
let dst = URL(fileURLWithPath: args[2])
try? FileManager.default.removeItem(at: dst)

let asset = AVURLAsset(url: src)
let done = DispatchSemaphore(value: 0)
var failed = false

Task {
  do {
    guard let track = try await asset.loadTracks(withMediaType: .video).first else { throw NSError(domain: "film", code: 1) }
    let natural = try await track.load(.naturalSize)
    let transform = try await track.load(.preferredTransform)
    let shown = natural.applying(transform)
    let (w0, h0) = (abs(shown.width), abs(shown.height))
    let scale = min(1, longEdge / max(w0, h0))
    let w = Int((w0 * scale / 2).rounded()) * 2
    let h = Int((h0 * scale / 2).rounded()) * 2
    let fps = Double(try await track.load(.nominalFrameRate))
    let bitrate = Int(args[4]) ?? min(2_500_000, max(600_000, Int(Double(w * h) * (fps > 0 ? fps : 30) * 0.1)))

    let reader = try AVAssetReader(asset: asset)
    let out = AVAssetReaderTrackOutput(track: track, outputSettings: [
      kCVPixelBufferPixelFormatTypeKey as String: kCVPixelFormatType_32BGRA,
    ])
    reader.add(out)

    let writer = try AVAssetWriter(outputURL: dst, fileType: .mp4)
    writer.shouldOptimizeForNetworkUse = true
    let input = AVAssetWriterInput(mediaType: .video, outputSettings: [
      AVVideoCodecKey: AVVideoCodecType.h264,
      AVVideoWidthKey: w,
      AVVideoHeightKey: h,
      AVVideoScalingModeKey: AVVideoScalingModeResizeAspectFill,
      AVVideoCompressionPropertiesKey: [
        AVVideoAverageBitRateKey: bitrate,
        AVVideoProfileLevelKey: AVVideoProfileLevelH264HighAutoLevel,
      ],
    ])
    input.transform = transform
    input.expectsMediaDataInRealTime = false
    writer.add(input)

    /* The sound, decoded and written again as AAC, when asked for. */
    var sound: (AVAssetReaderTrackOutput, AVAssetWriterInput)? = nil
    if keepSound, let audio = try await asset.loadTracks(withMediaType: .audio).first {
      let aOut = AVAssetReaderTrackOutput(track: audio, outputSettings: [AVFormatIDKey: kAudioFormatLinearPCM])
      reader.add(aOut)
      let aIn = AVAssetWriterInput(mediaType: .audio, outputSettings: [
        AVFormatIDKey: kAudioFormatMPEG4AAC,
        AVNumberOfChannelsKey: 2,
        AVSampleRateKey: 44100,
        AVEncoderBitRateKey: 128_000,
      ])
      aIn.expectsMediaDataInRealTime = false
      writer.add(aIn)
      sound = (aOut, aIn)
    }

    reader.startReading()
    writer.startWriting()
    writer.startSession(atSourceTime: .zero)

    /* Picture and sound are pumped side by side, each on its own queue,
       and the file is finished once both have run out. */
    func pump(_ output: AVAssetReaderTrackOutput, _ into: AVAssetWriterInput, _ label: String) async {
      let queue = DispatchQueue(label: label)
      await withCheckedContinuation { (finished: CheckedContinuation<Void, Never>) in
        into.requestMediaDataWhenReady(on: queue) {
          while into.isReadyForMoreMediaData {
            if let buffer = output.copyNextSampleBuffer() {
              into.append(buffer)
            } else {
              into.markAsFinished()
              finished.resume()
              return
            }
          }
        }
      }
    }
    async let picture: Void = pump(out, input, "film")
    if let (aOut, aIn) = sound { await pump(aOut, aIn, "sound") }
    await picture
    await writer.finishWriting()
    if writer.status != .completed { throw writer.error ?? NSError(domain: "film", code: 2) }
    print("\(w)x\(h)")
  } catch {
    FileHandle.standardError.write("encode-film: \(error)\n".data(using: .utf8)!)
    failed = true
  }
  done.signal()
}
done.wait()
exit(failed ? 1 : 0)
