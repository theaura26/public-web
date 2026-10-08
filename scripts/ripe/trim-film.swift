// A film, cut shorter.
//
// Called by grade-10-days.mjs for films listed in its TRIM table:
//
//   swift scripts/ripe/trim-film.swift <in> <out.mp4> <seconds off the start> <seconds off the end>
//
// Copies the picture as it is (passthrough — no re-encode, so no loss),
// keeping only the time between the two cuts, with its index at the front
// so it starts playing before it has finished downloading. The original
// is never touched. Uses AVFoundation, which every Mac has.

@preconcurrency import AVFoundation

let args = CommandLine.arguments
guard args.count >= 5, let head = Double(args[3]), let tail = Double(args[4]) else {
  FileHandle.standardError.write("usage: trim-film.swift <in> <out.mp4> <seconds off the start> <seconds off the end>\n".data(using: .utf8)!)
  exit(2)
}
let src = URL(fileURLWithPath: args[1])
let dst = URL(fileURLWithPath: args[2])
try? FileManager.default.removeItem(at: dst)

let asset = AVURLAsset(url: src)
let done = DispatchSemaphore(value: 0)
var failed = false

Task {
  do {
    let duration = try await asset.load(.duration).seconds
    let start = max(0, head)
    let end = duration - max(0, tail)
    guard end > start else { throw NSError(domain: "trim", code: 1, userInfo: [NSLocalizedDescriptionKey: "nothing left after the cuts"]) }
    guard let export = AVAssetExportSession(asset: asset, presetName: AVAssetExportPresetPassthrough) else {
      throw NSError(domain: "trim", code: 2)
    }
    export.outputURL = dst
    export.outputFileType = .mp4
    export.shouldOptimizeForNetworkUse = true
    export.timeRange = CMTimeRange(
      start: CMTime(seconds: start, preferredTimescale: 600),
      end: CMTime(seconds: end, preferredTimescale: 600))
    await export.export()
    if export.status != .completed { throw export.error ?? NSError(domain: "trim", code: 3) }
    print(String(format: "%.2fs → %.2fs", duration, end - start))
  } catch {
    FileHandle.standardError.write("trim-film: \(error)\n".data(using: .utf8)!)
    failed = true
  }
  done.signal()
}
done.wait()
exit(failed ? 1 : 0)
