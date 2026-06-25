// components/ControlGapChart.tsx
'use client'

import { motion, easeInOut } from 'framer-motion'

interface ControlGapChartProps {
  adoption?: number
  control?: number
  animate?: boolean
  compact?: boolean
}

// viewBox space
const W = 600
const H = 340
const PAD = 36

// Map a 0-6 score to a curve end-height (higher score => higher curve).
// Defaults give the canonical "adoption steep, control shallow" illustration.
function endY(score: number | undefined, fallback: number): number {
  const s = typeof score === 'number' ? Math.max(0, Math.min(6, score)) : null
  const top = PAD
  const bottom = H - PAD
  if (s === null) return fallback
  return bottom - (s / 6) * (bottom - top)
}

// Cubic path from bottom-left baseline rising to (W-PAD, endHeight).
function curvePath(endYVal: number): string {
  const x0 = PAD
  const y0 = H - PAD
  const x1 = W - PAD
  const cx = PAD + (x1 - x0) * 0.55
  return `M ${x0} ${y0} C ${cx} ${y0}, ${cx} ${endYVal}, ${x1} ${endYVal}`
}

export default function ControlGapChart({
  adoption,
  control,
  animate = true,
  compact = false,
}: ControlGapChartProps) {
  const adoptionY = endY(adoption, PAD + 18) // steep by default
  const controlY = endY(control, H - PAD - 90) // shallow by default

  const adoptionD = curvePath(adoptionY)
  const controlD = curvePath(controlY)

  // Shaded gap between the two end points on the right edge.
  const gapPath = `M ${W - PAD} ${adoptionY} L ${W - PAD} ${controlY} L ${PAD} ${H - PAD} Z`

  const draw = animate
    ? { initial: { pathLength: 0 }, animate: { pathLength: 1 }, transition: { duration: 1.1, ease: easeInOut } }
    : {}

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      role="img"
      aria-label="Two curves: Adoption Velocity rising fast above Control Maturity rising slowly, with the gap between them shaded as the Control Gap."
      className={compact ? 'w-full max-w-sm' : 'w-full max-w-2xl'}
    >
      {/* axes */}
      <line x1={PAD} y1={H - PAD} x2={W - PAD} y2={H - PAD} stroke="currentColor" strokeOpacity="0.2" />
      <line x1={PAD} y1={PAD} x2={PAD} y2={H - PAD} stroke="currentColor" strokeOpacity="0.2" />

      {/* shaded control gap */}
      <motion.path
        d={gapPath}
        className="fill-rose-500/15"
        initial={animate ? { opacity: 0 } : false}
        animate={animate ? { opacity: 1 } : undefined}
        transition={{ delay: 0.9, duration: 0.6 }}
      />

      {/* control maturity (slow) */}
      <motion.path d={controlD} fill="none" className="stroke-sky-400" strokeWidth={3} {...draw} />
      {/* adoption velocity (fast) */}
      <motion.path d={adoptionD} fill="none" className="stroke-emerald-400" strokeWidth={3} {...draw} />

      {!compact && (
        <>
          <text x={W - PAD} y={adoptionY - 10} textAnchor="end" className="fill-emerald-400 text-[13px] font-medium">
            Adoption Velocity
          </text>
          <text x={W - PAD} y={controlY + 22} textAnchor="end" className="fill-sky-400 text-[13px] font-medium">
            Control Maturity
          </text>
          <text
            x={(W - PAD + PAD) / 2}
            y={(adoptionY + (H - PAD)) / 2}
            textAnchor="middle"
            className="fill-rose-300 text-[13px] font-semibold"
          >
            The Control Gap
          </text>
        </>
      )}
    </svg>
  )
}
