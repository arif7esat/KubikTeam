"use client"

import { motion } from "framer-motion"

interface BrandToggleProps {
  isOpen: boolean
  onClick: () => void
}

export function BrandToggle({ isOpen, onClick }: BrandToggleProps) {
  return (
    <motion.button
      onClick={onClick}
      className="relative w-10 h-10 flex items-center justify-center rounded-xl bg-gradient-to-br from-[#FAF9F6] to-white border border-[#E8E4DC] hover:border-[#D4AF37]/50 transition-colors duration-200 group shadow-sm"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      aria-label={isOpen ? "Close collection" : "Open collection"}
    >
      <svg
        viewBox="0 0 36 36"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-7 h-7"
      >
        {/* Product Box Base - Solid Foundation */}
        <motion.path
          d="M6 14L18 8L30 14V26L18 32L6 26V14Z"
          stroke="#D4AF37"
          strokeWidth="1.8"
          strokeLinejoin="round"
          fill="none"
          initial={false}
          animate={{ 
            opacity: isOpen ? 1 : 0.7,
            scale: isOpen ? 1 : 0.95
          }}
          style={{ transformOrigin: "18px 20px" }}
          transition={{ duration: 0.35, ease: "easeOut" }}
        />
        
        {/* Box Center Line */}
        <motion.path
          d="M18 20V32"
          stroke="#D4AF37"
          strokeWidth="1.5"
          strokeLinecap="round"
          initial={false}
          animate={{ opacity: isOpen ? 0.8 : 0.5 }}
          transition={{ duration: 0.3 }}
        />
        
        {/* Box Side Lines */}
        <motion.path
          d="M6 14L18 20L30 14"
          stroke="#D4AF37"
          strokeWidth="1.5"
          strokeLinejoin="round"
          initial={false}
          animate={{ opacity: isOpen ? 0.8 : 0.5 }}
          transition={{ duration: 0.3 }}
        />
        
        {/* Elegant Hanger - Rising Above */}
        <motion.path
          d="M18 4V6M13 10C13 7.5 15.5 6 18 6C20.5 6 23 7.5 23 10"
          stroke="#D4AF37"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
          initial={false}
          animate={{ 
            y: isOpen ? 0 : 1,
            opacity: isOpen ? 1 : 0.6
          }}
          transition={{ duration: 0.35, ease: "easeOut" }}
        />
        
        {/* Clock Arc - Time/History Element */}
        <motion.circle
          cx="18"
          cy="20"
          r="5"
          stroke="#D4AF37"
          strokeWidth="1.5"
          fill="none"
          strokeDasharray="31.42"
          initial={false}
          animate={{ 
            strokeDashoffset: isOpen ? 0 : 10,
            opacity: isOpen ? 0.9 : 0.5
          }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />
        
        {/* Clock Hands - Premium Detail */}
        <motion.g
          initial={false}
          animate={{ 
            rotate: isOpen ? 0 : 45,
            opacity: isOpen ? 1 : 0.4
          }}
          style={{ transformOrigin: "18px 20px" }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          <path
            d="M18 17.5V20H20.5"
            stroke="#D4AF37"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </motion.g>
        
        {/* Central Diamond Accent - Luxury Mark */}
        <motion.path
          d="M18 18L19.5 20L18 22L16.5 20L18 18Z"
          fill="#D4AF37"
          initial={false}
          animate={{ 
            scale: isOpen ? 1 : 0.5,
            opacity: isOpen ? 0.8 : 0.3
          }}
          style={{ transformOrigin: "18px 20px" }}
          transition={{ duration: 0.3 }}
        />
      </svg>
      
      {/* Subtle glow effect when active */}
      <motion.div
        className="absolute inset-0 rounded-xl bg-gradient-to-br from-[#D4AF37]/20 to-[#D4AF37]/10 pointer-events-none"
        initial={false}
        animate={{ 
          opacity: isOpen ? 0.5 : 0,
          scale: isOpen ? 1 : 0.9
        }}
        transition={{ duration: 0.25 }}
      />
      
      {/* Premium border highlight */}
      <motion.div
        className="absolute inset-0 rounded-xl border-2 border-[#D4AF37] pointer-events-none"
        initial={false}
        animate={{ 
          opacity: isOpen ? 0.6 : 0,
          scale: isOpen ? 1 : 0.95
        }}
        transition={{ duration: 0.3 }}
      />
    </motion.button>
  )
}
