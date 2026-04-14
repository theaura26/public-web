export default function Placeholder({
  width,
  height,
  label,
  className = '',
  aspect,
}: {
  width: number
  height: number
  label: string
  className?: string
  aspect?: string
}) {
  return (
    <div
      className={`placeholder-img rounded ${className}`}
      style={{ aspectRatio: aspect || `${width}/${height}`, width: '100%' }}
    >
      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--text-dim)', letterSpacing: 0.5, position: 'relative', zIndex: 1 }}>
        {width} &times; {height}
      </span>
      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'rgba(255,255,255,0.15)', textTransform: 'uppercase', letterSpacing: 1, position: 'relative', zIndex: 1 }}>
        {label}
      </span>
    </div>
  )
}
