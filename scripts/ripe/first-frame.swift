// A film's first frame, as a JPEG — for a poster that is exactly what
// the film opens on, so nothing jumps when it starts.
//
//   swift scripts/ripe/first-frame.swift <film> <out.jpg>
//
// Uses AVFoundation, which every Mac has.

@preconcurrency import AVFoundation
import AppKit

let args = CommandLine.arguments
guard args.count >= 3 else {
  FileHandle.standardError.write("usage: first-frame.swift <film> <out.jpg>\n".data(using: .utf8)!)
  exit(2)
}
let asset = AVURLAsset(url: URL(fileURLWithPath: args[1]))
let gen = AVAssetImageGenerator(asset: asset)
gen.appliesPreferredTrackTransform = true
gen.requestedTimeToleranceBefore = .zero
gen.requestedTimeToleranceAfter = .zero
let done = DispatchSemaphore(value: 0)
var failed = false
Task {
  do {
    let (image, _) = try await gen.image(at: .zero)
    let rep = NSBitmapImageRep(cgImage: image)
    guard let data = rep.representation(using: .jpeg, properties: [.compressionFactor: 0.9]) else { throw NSError(domain: "frame", code: 1) }
    try data.write(to: URL(fileURLWithPath: args[2]))
    print("\(image.width)x\(image.height)")
  } catch {
    FileHandle.standardError.write("first-frame: \(error)\n".data(using: .utf8)!)
    failed = true
  }
  done.signal()
}
done.wait()
exit(failed ? 1 : 0)
