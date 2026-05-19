"use client"

import { motion, AnimatePresence } from "framer-motion"

const DEFAULT_CHIPS = [
  "Compare reality scores",
  "Analyze fabric quality",
  "Summarize user reviews",
  "Find matching pieces",
  "Check authenticity signals",
]

interface SuggestionChipsProps {
  chips?: string[]
  onSelect: (text: string) => void
  visible: boolean
}

export function SuggestionChips({
  chips = DEFAULT_CHIPS,
  onSelect,
  visible,
}: SuggestionChipsProps) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 6 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="flex gap-2 overflow-x-auto pb-1 mb-3 scrollbar-hide"
          style={{ scrollbarWidth: "none" }}
        >
          {chips.map((chip, i) => (
            <motion.button
              key={chip}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05, duration: 0.2 }}
              onClick={() => onSelect(chip)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex-shrink-0 px-3.5 py-1.5 rounded-full border border-[#D4B483] bg-[#C9A84C]/[0.06] text-[#8B6914] text-[12px] font-sans tracking-[0.02em] cursor-pointer whitespace-nowrap transition-all duration-150 hover:bg-[#C9A84C]/[0.14] hover:border-[#C9A84C]"
            >
              {chip}
            </motion.button>
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  )
}
