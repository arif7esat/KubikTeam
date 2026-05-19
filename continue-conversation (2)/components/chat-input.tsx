"use client"

import { useState, useCallback, useRef, useEffect } from "react"
import { cn } from "@/lib/utils"
import { Send, Paperclip, Sparkles, Scale, Maximize2, X } from "lucide-react"
import { PendingProducts, type PendingProduct } from "./pending-products"
import { SuggestionChips } from "./suggestion-chips"
import { motion, AnimatePresence } from "framer-motion"

interface ChatInputProps {
  value: string
  onChange: (value: string) => void
  onSend: () => void
  onDrop: (productData: { id: string; name: string; seller: string; url: string }) => void
  pendingProducts: PendingProduct[]
  onRemovePending: (id: string) => void
  onCompare: () => void
  showSuggestions?: boolean
  suggestionChips?: string[]
  onSuggestionSelect?: (text: string) => void
}

export function ChatInput({ 
  value, 
  onChange, 
  onSend, 
  onDrop,
  pendingProducts,
  onRemovePending,
  onCompare,
  showSuggestions = true,
  suggestionChips = [],
  onSuggestionSelect
}: ChatInputProps) {
  const [isDragOver, setIsDragOver] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const [isMultiline, setIsMultiline] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // FEATURE 2: Auto-resize textarea
  const autoResizeTextarea = useCallback((el: HTMLTextAreaElement) => {
    el.style.height = "auto"
    const newHeight = Math.min(el.scrollHeight, 160) // max 160px (~6 lines)
    el.style.height = `${newHeight}px`
    setIsMultiline(el.scrollHeight > 52) // > 2 lines
  }, [])

  // Reset height when value is cleared
  useEffect(() => {
    if (textareaRef.current) {
      autoResizeTextarea(textareaRef.current)
    }
  }, [value, autoResizeTextarea])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragOver(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragOver(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragOver(false)

    const data = e.dataTransfer.getData("application/json")
    if (data) {
      try {
        const productData = JSON.parse(data)
        // Handle both single product and array of products
        if (Array.isArray(productData)) {
          productData.forEach((product) => onDrop(product))
        } else {
          onDrop(productData)
        }
      } catch (error) {
        console.error("Failed to parse dropped data:", error)
      }
    }
  }, [onDrop])

  // FEATURE 1: Keyboard behavior - Enter sends, Shift+Enter newline
  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      if (value.trim()) {
        onSend()
      }
    }
    // Shift+Enter: do nothing special — textarea handles newline natively
  }, [value, onSend])

  const handleSuggestionClick = useCallback((text: string) => {
    onChange(text)
    onSuggestionSelect?.(text)
  }, [onChange, onSuggestionSelect])

  // FEATURE 4: Reality Score trigger
  const handleRealityScoreTrigger = useCallback(() => {
    onChange("compare score")
    setTimeout(() => onSend(), 50)
  }, [onChange, onSend])

  const canCompare = pendingProducts.length >= 2

  return (
    <div
      className={cn(
        "sticky bottom-0 z-20 bg-[#FAF9F6] border-t border-[#E8E4DC] px-6 py-4",
        "transition-all duration-400",
        isDragOver && "bg-[#D4AF37]/8"
      )}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {/* Drop Zone Indicator */}
      <AnimatePresence>
        {isDragOver && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="absolute inset-3 flex items-center justify-center bg-gradient-to-br from-[#D4AF37]/10 to-[#D4AF37]/5 border-2 border-dashed border-[#D4AF37] rounded-xl pointer-events-none"
          >
            <div className="flex items-center gap-3 text-[#D4AF37]">
              <Sparkles className="w-6 h-6 animate-pulse" />
              <span className="text-sm font-serif font-medium tracking-wide">Drop to add for comparison</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Pending Products Display */}
      <PendingProducts products={pendingProducts} onRemove={onRemovePending} />

      {/* Suggestion Chips */}
      <SuggestionChips 
        chips={suggestionChips}
        onSelect={handleSuggestionClick}
        visible={showSuggestions && suggestionChips.length > 0 && !value.trim()}
      />

      <div className={cn(
        "flex items-end gap-3 bg-white rounded-2xl border px-4 py-2.5 relative",
        "shadow-[0_4px_20px_rgba(0,0,0,0.04)] transition-all duration-400",
        isDragOver 
          ? "border-[#D4AF37] shadow-[0_0_0_4px_rgba(212,175,55,0.15),0_8px_32px_rgba(212,175,55,0.2)] bg-[#FFFDF8]" 
          : "border-[#E8E4DC]"
      )}>
        {/* Attachment Button */}
        <button
          type="button"
          className="p-2 rounded-full text-[#6B6660] hover:text-[#3D3833] hover:bg-gray-100 transition-all duration-200 flex-shrink-0 mb-0.5"
          aria-label="Attach file"
        >
          <Paperclip className="w-5 h-5" />
        </button>

        {/* FEATURE 1 & 2: Textarea Input Field (replaces input) */}
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => {
            onChange(e.target.value)
            autoResizeTextarea(e.target)
          }}
          onKeyDown={handleKeyDown}
          placeholder={pendingProducts.length > 0 
            ? "Add a message or drop more products..." 
            : "Type a message or drop a product..."
          }
          rows={1}
          className={cn(
            "flex-1 bg-transparent text-[15px] text-[#2C2824] placeholder:text-[#B5AFA7]",
            "focus:outline-none font-sans leading-[1.5] py-2 resize-none"
          )}
          style={{
            maxHeight: 160,
            overflowY: "auto",
            whiteSpace: "pre-wrap",
          }}
        />

        {/* FEATURE 2: Expand button - appears when input has > 2 lines */}
        <AnimatePresence>
          {isMultiline && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              onClick={() => setIsExpanded(true)}
              title="Expand message"
              className="absolute top-2 right-12 p-1.5 rounded-md border border-[#D4B483] bg-white/90 hover:bg-[#D4AF37]/10 text-[#9A8F82] cursor-pointer transition-all duration-150"
            >
              <Maximize2 size={13} />
            </motion.button>
          )}
        </AnimatePresence>

        {/* FEATURE 4: Reality Score Button */}
        <button
          onClick={handleRealityScoreTrigger}
          title="Generate Reality Score"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[#C9A84C] bg-transparent hover:bg-[#C9A84C]/10 transition-all duration-150 flex-shrink-0 mb-0.5"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <circle cx="7" cy="7" r="5.5" stroke="#C9A84C" strokeWidth="1.2" />
            <circle cx="7" cy="7" r="3" stroke="#C9A84C" strokeWidth="1" strokeDasharray="2 1.5" />
          </svg>
          <span className="text-[10px] uppercase tracking-[0.08em] text-[#C9A84C] font-medium hidden sm:inline">
            Score
          </span>
        </button>

        {/* Compare Button - Only shows when 2+ items pending */}
        <AnimatePresence>
          {canCompare && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8, width: 0 }}
              animate={{ opacity: 1, scale: 1, width: "auto" }}
              exit={{ opacity: 0, scale: 0.8, width: 0 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
              type="button"
              onClick={onCompare}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-full mb-0.5",
                "bg-gradient-to-r from-[#D4AF37]/10 to-[#D4AF37]/20",
                "border border-[#D4AF37]/40 text-[#B8960C]",
                "hover:from-[#D4AF37]/20 hover:to-[#D4AF37]/30 hover:border-[#D4AF37]",
                "transition-all duration-200 font-serif text-[13px] font-medium whitespace-nowrap flex-shrink-0"
              )}
            >
              <Scale className="w-4 h-4" />
              Compare ({pendingProducts.length})
            </motion.button>
          )}
        </AnimatePresence>

        {/* Send Button */}
        <button
          type="button"
          onClick={onSend}
          disabled={!value.trim()}
          className={cn(
            "p-2.5 rounded-full transition-all duration-300 flex-shrink-0 mb-0.5",
            value.trim()
              ? "bg-gradient-to-br from-[#D4AF37] to-[#B8960C] text-white hover:from-[#C9A430] hover:to-[#A68A0A] shadow-md hover:shadow-lg hover:shadow-[#D4AF37]/25"
              : "bg-[#E8E4DC] text-[#6B6660] cursor-not-allowed"
          )}
          aria-label="Send message"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>

      {/* FEATURE 2: Expanded textarea overlay */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsExpanded(false)}
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(0,0,0,0.35)",
              display: "flex",
              alignItems: "flex-end",
              justifyContent: "center",
              zIndex: 50,
              padding: "0 0 80px",
            }}
          >
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 20, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              style={{
                width: 640,
                maxWidth: "90vw",
                background: "#FFFFFF",
                borderRadius: 16,
                border: "1px solid #E8E2D5",
                padding: 16,
              }}
            >
              <p style={{ fontSize: 11, color: "#9A8F82", marginBottom: 8, letterSpacing: "0.06em", textTransform: "uppercase" }}>
                Editing Message
              </p>
              <textarea
                value={value}
                onChange={(e) => onChange(e.target.value)}
                rows={8}
                autoFocus
                style={{
                  width: "100%",
                  resize: "none",
                  border: "none",
                  outline: "none",
                  fontFamily: "Inter, system-ui",
                  fontSize: 14,
                  color: "#3D2E1E",
                  lineHeight: 1.6,
                }}
              />
              <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 12 }}>
                <button
                  onClick={() => setIsExpanded(false)}
                  style={{
                    padding: "7px 16px",
                    borderRadius: 8,
                    border: "1px solid #E8E2D5",
                    background: "transparent",
                    color: "#9A8F82",
                    fontSize: 13,
                    cursor: "pointer",
                  }}
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    setIsExpanded(false)
                    if (value.trim()) onSend()
                  }}
                  style={{
                    padding: "7px 16px",
                    borderRadius: 8,
                    border: "none",
                    background: "#C9A84C",
                    color: "#FFFFFF",
                    fontSize: 13,
                    cursor: "pointer",
                    fontFamily: "Inter, system-ui",
                  }}
                >
                  Send
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
