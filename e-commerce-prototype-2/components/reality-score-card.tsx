"use client"

import { motion } from "framer-motion"

export interface RealityScoreData {
  type: "reality_score"
  product: {
    name: string
    imageUrl?: string
    score: number // 0–100
    matchLabel: string // e.g. "92% Match"
    signals: {
      label: string
      value: number // 0–100, for mini progress bars
      status: "positive" | "neutral" | "warning"
    }[]
    verdict: string // 1-sentence summary
  }
  comparison?: {
    name: string
    imageUrl?: string
    score: number
    matchLabel: string
    signals: {
      label: string
      value: number
      status: "positive" | "neutral" | "warning"
    }[]
    verdict: string
  }
}

function CircularScore({ score, size = 72 }: { score: number; size?: number }) {
  const radius = (size - 8) / 2
  const circumference = 2 * Math.PI * radius
  const strokeDash = (score / 100) * circumference

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#F0EEE6"
          strokeWidth={5}
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={score >= 75 ? "#C9A84C" : score >= 50 ? "#D4B483" : "#B0A090"}
          strokeWidth={5}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: circumference - strokeDash }}
          transition={{ duration: 1.2, ease: "easeOut", delay: 0.2 }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-[16px] font-semibold font-serif text-[#3D2E1E] leading-none">
          {score}
        </span>
        <span className="text-[9px] text-[#9A8F82] tracking-[0.05em]">/ 100</span>
      </div>
    </div>
  )
}

function ProductScorePanel({ product }: { product: RealityScoreData["product"] }) {
  const statusColor = {
    positive: "#7A9E5A",
    neutral: "#9A8F82",
    warning: "#C27B3A",
  }

  return (
    <div className="flex-1 p-4 bg-[#FAFAF8] rounded-xl border border-[#EAE5DC]">
      {/* Product name */}
      <p className="font-serif text-[14px] font-semibold text-[#3D2E1E] mb-3 leading-tight">
        {product.name}
      </p>

      {/* Score ring + label */}
      <div className="flex items-center gap-3.5 mb-3.5">
        <CircularScore score={product.score} />
        <div>
          <p className="font-sans text-[12px] text-[#9A8F82] mb-0.5 tracking-[0.08em] uppercase">
            Reality Score
          </p>
          <p className="font-serif text-[18px] font-bold text-[#C9A84C]">
            {product.matchLabel}
          </p>
        </div>
      </div>

      {/* Signal bars */}
      <div className="flex flex-col gap-1.5">
        {product.signals.map((sig) => (
          <div key={sig.label}>
            <div className="flex justify-between mb-0.5">
              <span className="text-[11px] text-[#6B6259] font-sans">{sig.label}</span>
              <span
                className="text-[11px] font-medium"
                style={{ color: statusColor[sig.status] }}
              >
                {sig.value}%
              </span>
            </div>
            <div className="h-[3px] bg-[#EAE5DC] rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${sig.value}%` }}
                transition={{ duration: 0.8, ease: "easeOut", delay: 0.4 }}
                className="h-full rounded-full"
                style={{ background: statusColor[sig.status] }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Verdict */}
      <p className="font-sans text-[11px] text-[#9A8F82] mt-3 italic leading-relaxed">
        &quot;{product.verdict}&quot;
      </p>
    </div>
  )
}

export function RealityScoreCard({ data }: { data: RealityScoreData }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="bg-white border border-[#E8E2D5] rounded-2xl px-4 py-4 max-w-[520px] self-start"
    >
      {/* Header */}
      <div className="flex items-center gap-2 mb-3.5 pb-3 border-b border-[#F0EEE6]">
        <div className="w-2 h-2 rounded-full bg-[#C9A84C]" />
        <span className="font-sans text-[11px] tracking-[0.12em] text-[#C9A84C] font-medium uppercase">
          Maison Assistant
        </span>
      </div>

      {/* Score panels */}
      <div className="flex gap-2.5">
        <ProductScorePanel product={data.product} />
        {data.comparison && <ProductScorePanel product={data.comparison} />}
      </div>
    </motion.div>
  )
}
