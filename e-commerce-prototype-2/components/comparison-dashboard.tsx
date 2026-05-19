"use client"

import Image from "next/image"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { Star, TrendingUp, Shield, Sparkles } from "lucide-react"

interface ComparisonProduct {
  id: string
  name: string
  image: string
  seller: string
}

interface ComparisonDashboardProps {
  products: ComparisonProduct[]
  onClose: () => void
}

// Generate mock comparison data
function generateComparisonData(product: ComparisonProduct, index: number) {
  const scores = [
    { label: "Quality", value: 85 + Math.floor(Math.random() * 15), icon: Star },
    { label: "Value", value: 70 + Math.floor(Math.random() * 25), icon: TrendingUp },
    { label: "Authenticity", value: 90 + Math.floor(Math.random() * 10), icon: Shield },
    { label: "Style Match", value: 75 + Math.floor(Math.random() * 20), icon: Sparkles },
  ]
  
  const insights = [
    "Premium craftsmanship with attention to detail",
    "Excellent material quality and durability",
    "Timeless design suitable for multiple occasions",
    "Strong resale value in secondary market",
  ]
  
  return {
    ...product,
    overallScore: Math.floor(scores.reduce((acc, s) => acc + s.value, 0) / scores.length),
    scores,
    insights: insights.slice(0, 2 + index),
    letter: String.fromCharCode(65 + index),
  }
}

function ScoreRing({ value, size = 80, strokeWidth = 6 }: { value: number; size?: number; strokeWidth?: number }) {
  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const offset = circumference - (value / 100) * circumference
  
  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#E8E4DC"
          strokeWidth={strokeWidth}
        />
        {/* Progress circle */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#D4AF37"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1, ease: "easeOut", delay: 0.3 }}
        />
      </svg>
      {/* Center value */}
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.span 
          className="text-lg font-serif font-semibold text-[#2C2824]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          {value}
        </motion.span>
      </div>
    </div>
  )
}

export function ComparisonDashboard({ products, onClose }: ComparisonDashboardProps) {
  const comparisonData = products.map((p, i) => generateComparisonData(p, i))
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="bg-white rounded-2xl border border-[#E8E4DC] shadow-lg overflow-hidden"
    >
      {/* Header */}
      <div className="px-6 py-4 border-b border-[#E8E4DC] bg-gradient-to-r from-[#FAF9F6] to-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-[#D4AF37] shadow-[0_0_8px_rgba(212,175,55,0.5)]" />
            <h3 className="text-sm font-serif font-semibold text-[#2C2824] uppercase tracking-wider">
              Product Comparison
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-[11px] text-[#8B8178] hover:text-[#D4AF37] font-medium transition-colors"
          >
            Close Analysis
          </button>
        </div>
      </div>
      
      {/* Comparison Grid */}
      <div className={cn(
        "grid gap-4 p-6",
        products.length === 2 ? "grid-cols-2" : products.length === 3 ? "grid-cols-3" : "grid-cols-2 lg:grid-cols-4"
      )}>
        {comparisonData.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 + 0.2 }}
            className="flex flex-col items-center p-4 rounded-xl bg-[#FAF9F6] border border-[#E8E4DC]/50"
          >
            {/* Product Image & Letter Badge */}
            <div className="relative mb-4">
              <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-[#D4AF37] shadow-md">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  className="object-cover"
                  sizes="64px"
                />
              </div>
              <span className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-[#D4AF37] text-white text-[11px] font-bold flex items-center justify-center shadow-sm">
                {item.letter}
              </span>
            </div>
            
            {/* Product Name */}
            <h4 className="text-[13px] font-serif font-semibold text-[#2C2824] text-center mb-1">
              {item.name}
            </h4>
            <span className="text-[10px] text-[#8B8178] mb-4">{item.seller}</span>
            
            {/* Overall Score Ring */}
            <ScoreRing value={item.overallScore} />
            <span className="text-[10px] text-[#8B8178] mt-2 uppercase tracking-wider">Overall Score</span>
            
            {/* Individual Scores */}
            <div className="w-full mt-4 space-y-2">
              {item.scores.map((score) => (
                <div key={score.label} className="flex items-center gap-2">
                  <score.icon className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span className="text-[10px] text-[#8B8178] flex-1">{score.label}</span>
                  <div className="w-16 h-1.5 bg-[#E8E4DC] rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-[#D4AF37] rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${score.value}%` }}
                      transition={{ duration: 0.8, delay: index * 0.1 + 0.5 }}
                    />
                  </div>
                  <span className="text-[10px] font-medium text-[#2C2824] w-6 text-right">{score.value}</span>
                </div>
              ))}
            </div>
            
            {/* Key Insights */}
            <div className="w-full mt-4 pt-4 border-t border-[#E8E4DC]">
              <span className="text-[9px] uppercase tracking-wider text-[#A09A92] block mb-2">Key Insights</span>
              <ul className="space-y-1">
                {item.insights.map((insight, i) => (
                  <li key={i} className="text-[10px] text-[#5C5750] flex items-start gap-1.5">
                    <span className="text-[#D4AF37] mt-0.5">•</span>
                    {insight}
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        ))}
      </div>
      
      {/* Footer with recommendation */}
      <div className="px-6 py-4 border-t border-[#E8E4DC] bg-gradient-to-r from-[#D4AF37]/5 to-transparent">
        <p className="text-[12px] text-[#5C5750] font-sans">
          <span className="font-serif font-semibold text-[#D4AF37]">Maison Recommendation:</span>{" "}
          Based on your preferences, <span className="font-medium">{comparisonData[0]?.name}</span> offers the best overall value with exceptional quality scores.
        </p>
      </div>
    </motion.div>
  )
}
