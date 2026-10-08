// Titles as artwork: each set in a font and traced to an SVG path, so a
// page can show the lettering without serving the font.
//
// Called by title-svgs.mjs:
//
//   swift scripts/ripe/title-svgs.swift <font> <out dir> <fill> <slug=Title>…
//
// Set as the page set them in type: the font's kerning, ligatures and
// contextual forms, with stylistic set 2: its swash capitals, and no tails
// hung under the middle of a word (set 1 hangs one under "Looking"). One
// <path> per title. Each viewBox is tight to its ink across, and the
// same height for every title — the font's ascent to descent, or more
// where a swash reaches past them — so set at one height on a page, the
// titles share one size and one baseline.
// Uses CoreText, which every Mac has.

import CoreText
import Foundation

let args = CommandLine.arguments
guard args.count >= 5 else {
  FileHandle.standardError.write("usage: title-svgs.swift <font> <out dir> <fill> <slug=Title>…\n".data(using: .utf8)!)
  exit(2)
}
let fontURL = URL(fileURLWithPath: args[1]) as CFURL
let outDir = URL(fileURLWithPath: args[2])
let fill = args[3]
let SIZE: CGFloat = 200

guard let descs = CTFontManagerCreateFontDescriptorsFromURL(fontURL) as? [CTFontDescriptor], let base = descs.first else {
  FileHandle.standardError.write("title-svgs: can't read \(args[1])\n".data(using: .utf8)!)
  exit(1)
}
let features: [[CFString: Any]] = [[kCTFontOpenTypeFeatureTag: "ss02", kCTFontOpenTypeFeatureValue: 1]]
let desc = CTFontDescriptorCreateCopyWithAttributes(base, [kCTFontFeatureSettingsAttribute: features] as CFDictionary)
let font = CTFontCreateWithFontDescriptor(desc, SIZE, nil)

func n(_ v: CGFloat) -> String {
  let r = (v * 100).rounded() / 100
  return r == r.rounded() ? String(Int(r)) : String(format: "%.2f", r)
}
func escape(_ s: String) -> String {
  s.replacingOccurrences(of: "&", with: "&amp;").replacingOccurrences(of: "<", with: "&lt;")
}

try FileManager.default.createDirectory(at: outDir, withIntermediateDirectories: true)

func trace(_ title: String) -> CGPath {
  let text = NSAttributedString(string: title, attributes: [kCTFontAttributeName as NSAttributedString.Key: font])
  let line = CTLineCreateWithAttributedString(text)
  let ink = CGMutablePath()
  for run in CTLineGetGlyphRuns(line) as! [CTRun] {
    let count = CTRunGetGlyphCount(run)
    var glyphs = [CGGlyph](repeating: 0, count: count)
    var points = [CGPoint](repeating: .zero, count: count)
    CTRunGetGlyphs(run, CFRange(location: 0, length: count), &glyphs)
    CTRunGetPositions(run, CFRange(location: 0, length: count), &points)
    let attrs = CTRunGetAttributes(run) as NSDictionary
    let runFont = attrs[kCTFontAttributeName] as! CTFont
    for i in 0..<count {
      var at = CGAffineTransform(translationX: points[i].x, y: points[i].y)
      if let g = CTFontCreatePathForGlyph(runFont, glyphs[i], &at) { ink.addPath(g) }
    }
  }
  return ink
}

let titles: [(slug: String, title: String)] = args.dropFirst(4).compactMap { pair in
  guard let eq = pair.firstIndex(of: "=") else { return nil }
  return (String(pair[..<eq]), String(pair[pair.index(after: eq)...]))
}
let inks = titles.map { trace($0.title) }
/* One band for all: from the lowest descender (or swash) to the highest. */
let top = max(CTFontGetAscent(font), inks.map { $0.boundingBoxOfPath.maxY }.max() ?? 0)
let bottom = min(-CTFontGetDescent(font), inks.map { $0.boundingBoxOfPath.minY }.min() ?? 0)

for (k, t) in titles.enumerated() {
  let (slug, title) = t
  let ink = inks[k]
  let tight = ink.boundingBoxOfPath
  let box = CGRect(x: tight.minX, y: bottom, width: tight.width, height: top - bottom)
  // Font space has y up; SVG has y down. Flip about the ink's box, and
  // move its corner to the origin.
  let X = { (p: CGPoint) in n(p.x - box.minX) }
  let Y = { (p: CGPoint) in n(box.maxY - p.y) }
  var d = ""
  ink.applyWithBlock { el in
    let e = el.pointee, p = e.points
    switch e.type {
    case .moveToPoint: d += "M\(X(p[0])) \(Y(p[0]))"
    case .addLineToPoint: d += "L\(X(p[0])) \(Y(p[0]))"
    case .addQuadCurveToPoint: d += "Q\(X(p[0])) \(Y(p[0])) \(X(p[1])) \(Y(p[1]))"
    case .addCurveToPoint: d += "C\(X(p[0])) \(Y(p[0])) \(X(p[1])) \(Y(p[1])) \(X(p[2])) \(Y(p[2]))"
    case .closeSubpath: d += "Z"
    @unknown default: break
    }
  }
  let svg = """
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 \(n(box.width)) \(n(box.height))" width="\(n(box.width))" height="\(n(box.height))" role="img" aria-label="\(escape(title))">
  <title>\(escape(title))</title>
  <path fill="\(fill)" d="\(d)"/>
  </svg>

  """
  try svg.write(to: outDir.appendingPathComponent("\(slug).svg"), atomically: true, encoding: .utf8)
  print("\(slug).svg  \(n(box.width))×\(n(box.height))")
}
