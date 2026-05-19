"use client"

import { useState, useCallback } from "react"
import { cn } from "@/lib/utils"
import { Copy, RefreshCw, ThumbsUp, ThumbsDown, Check, Pencil, X } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { RealityScoreCard, type RealityScoreData } from "./reality-score-card"
import { ComparisonDashboard } from "./comparison-dashboard"
import type { PendingProduct } from "./pending-products"

interface ComparisonData {
  products: PendingProduct[]
  isActive: boolean
}

interface ChatMessageProps {
  id: string
  content: string
  isAi: boolean
  timestamp?: string
  isNew?: boolean
  isStreaming?: boolean
  edited?: boolean
  uiType?: "text" | "reality_score" | "comparison"
  uiData?: RealityScoreData
  comparisonData?: ComparisonData
  onCopy?: () => void
  onRegenerate?: (id: string) => void
  onFeedback?: (id: string, type: "up" | "down") => void
  onEdit?: (id: string, newContent: string) => void
  onCloseComparison?: (messageId: string) => void
}

export function ChatMessage({ 
  id,
  content, 
  isAi, 
  timestamp, 
  isNew = false,
  isStreaming = false,
  edited = false,
  uiType = "text",
  uiData,
  comparisonData,
  onCopy = () => {},
  onRegenerate = () => {},
  onFeedback = () => {},
  onEdit = () => {},
  onCloseComparison = () => {}
}: ChatMessageProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [copied, setCopied] = useState(false)
  const [feedbackGiven, setFeedbackGiven] = useState<"up" | "down" | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [editValue, setEditValue] = useState(content)

  // FIX 4: Improved copy with multiple fallbacks
  const handleCopy = useCallback(async () => {
    if (!content) return
    
    try {
      // Try modern clipboard API first
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(content)
        setCopied(true)
        onCopy()
        setTimeout(() => setCopied(false), 2000)
        return
      }
    } catch (err) {
      // Continue to fallback
    }

    // Fallback: Create a temporary textarea
    try {
      const textarea = document.createElement('textarea')
      textarea.value = content
      textarea.style.cssText = 'position:fixed;left:-9999px;top:-9999px;'
      document.body.appendChild(textarea)
      textarea.focus()
      textarea.select()
      
      const successful = document.execCommand('copy')
      document.body.removeChild(textarea)
      
      if (successful) {
        setCopied(true)
        onCopy()
        setTimeout(() => setCopied(false), 2000)
      }
    } catch (err) {
      console.warn("Copy failed:", err)
    }
  }, [content, onCopy])

  const handleRegenerate = useCallback(() => {
    try {
      if (typeof onRegenerate !== "function") return
      onRegenerate(id)
    } catch (err) {
      console.error("Regenerate failed:", err)
    }
  }, [id, onRegenerate])

  // FIX 5: Safe feedback handler with visual state
  const handleFeedback = useCallback((type: "up" | "down") => {
    try {
      // Toggle off if same button pressed
      if (feedbackGiven === type) {
        setFeedbackGiven(null)
        return
      }
      setFeedbackGiven(type)
      if (typeof onFeedback === "function") {
        onFeedback(id, type)
      }
    } catch (err) {
      console.error("Feedback failed:", err)
    }
  }, [id, onFeedback, feedbackGiven])

  const handleConfirmEdit = useCallback(() => {
    try {
      if (editValue.trim() && editValue !== content) {
        onEdit(id, editValue.trim())
      }
      setIsEditing(false)
    } catch (err) {
      console.error("Edit failed:", err)
    }
  }, [id, editValue, content, onEdit])

  const handleCancelEdit = useCallback(() => {
    setEditValue(content)
    setIsEditing(false)
  }, [content])

  // Render Reality Score Card for generative UI
  if (uiType === "reality_score" && uiData) {
    return (
      <div
        className={cn(
          "flex w-full justify-start",
          isNew && "animate-in fade-in slide-in-from-bottom-3 duration-500"
        )}
      >
        <RealityScoreCard data={uiData} />
      </div>
    )
  }

  // Render Comparison Dashboard for comparison UI
  if (uiType === "comparison" && comparisonData) {
    return (
      <div
        className={cn(
          "flex w-full justify-start",
          isNew && "animate-in fade-in slide-in-from-bottom-3 duration-500"
        )}
      >
        <AnimatePresence>
          {comparisonData.isActive ? (
            <ComparisonDashboard 
              products={comparisonData.products}
              onClose={() => onCloseComparison(id)}
            />
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-white border border-[#E8E4DC] rounded-2xl px-4 py-3 shadow-sm"
            >
              <div className="flex items-center gap-2 text-[#6B6660]">
                <div className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]" />
                <span className="text-xs font-medium">
                  Compared: {comparisonData.products.map(p => p.name).join(" vs ")}
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    )
  }

  // FIX 2: Edit mode with dust gold color
  if (!isAi && isEditing) {
    return (
      <motion.div
        initial={{ scale: 0.98 }}
        animate={{ scale: 1 }}
        className="flex w-full justify-end"
      >
        <div style={{ maxWidth: "72%" }}>
          <textarea
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            autoFocus
            rows={3}
            style={{
              width: "100%",
              minWidth: 280,
              background: "#4A3728",
              color: "#FFFFFF",
              border: "1.5px solid #C9A84C",
              borderRadius: 14,
              padding: "10px 14px",
              fontFamily: "Inter, system-ui",
              fontSize: 13,
              lineHeight: 1.5,
              resize: "none",
              outline: "none",
            }}
          />
          {/* FIX 3: Smaller buttons with dust gold hover */}
          <div style={{ display: "flex", justifyContent: "flex-end", gap: 6, marginTop: 6 }}>
            <button
              onClick={handleCancelEdit}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 4,
                padding: "5px 10px",
                borderRadius: 8,
                fontSize: 11,
                fontFamily: "Inter, system-ui",
                cursor: "pointer",
                border: "1px solid #D4B483",
                background: "transparent",
                color: "#9A8F82",
                transition: "all 0.15s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "#C9A84C"
                e.currentTarget.style.color = "#FFFFFF"
                e.currentTarget.style.borderColor = "#C9A84C"
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "transparent"
                e.currentTarget.style.color = "#9A8F82"
                e.currentTarget.style.borderColor = "#D4B483"
              }}
            >
              <X size={10} /> Cancel
            </button>

            <button
              onClick={handleConfirmEdit}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 4,
                padding: "5px 10px",
                borderRadius: 8,
                fontSize: 11,
                fontFamily: "Inter, system-ui",
                cursor: "pointer",
                border: "1px solid #D4B483",
                background: "transparent",
                color: "#9A8F82",
                transition: "all 0.15s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "#C9A84C"
                e.currentTarget.style.color = "#FFFFFF"
                e.currentTarget.style.borderColor = "#C9A84C"
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "transparent"
                e.currentTarget.style.color = "#9A8F82"
                e.currentTarget.style.borderColor = "#D4B483"
              }}
            >
              <Check size={10} /> Confirm
            </button>
          </div>
        </div>
      </motion.div>
    )
  }

  // User message with pencil at bottom-right
  if (!isAi) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          position: "relative",
          paddingBottom: 24,
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={cn(isNew && "animate-in fade-in slide-in-from-bottom-3 duration-500")}
      >
        <div
          style={{
            maxWidth: "72%",
            background: "#4A3728",
            color: "#FFFFFF",
            borderRadius: 14,
            padding: "10px 14px",
            wordBreak: "break-word",
            overflowWrap: "break-word",
            whiteSpace: "pre-wrap",
            position: "relative",
          }}
        >
          <p style={{ margin: 0, fontFamily: "Inter, system-ui", fontSize: 13.5, lineHeight: 1.6 }}>
            {content}
          </p>
          {edited && (
            <span style={{ fontSize: 9, opacity: 0.45, marginLeft: 4 }}>(edited)</span>
          )}
          {timestamp && (
            <div style={{ fontSize: 10, opacity: 0.45, marginTop: 3 }}>{timestamp}</div>
          )}
        </div>

        {/* Pencil icon at bottom-right */}
        <AnimatePresence>
          {isHovered && (
            <motion.button
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.85 }}
              transition={{ duration: 0.12 }}
              onClick={() => setIsEditing(true)}
              title="Edit message"
              style={{
                position: "absolute",
                bottom: 2,
                right: 0,
                width: 24,
                height: 24,
                borderRadius: 6,
                border: "1px solid #E8E2D5",
                background: "rgba(255,255,255,0.95)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                color: "#9A8F82",
                zIndex: 10,
              }}
            >
              <Pencil size={11} />
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    )
  }

  // AI message
  return (
    <div
      className={cn(
        "flex w-full relative group justify-start",
        isNew && "animate-in fade-in slide-in-from-bottom-3 duration-500"
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        style={{
          maxWidth: "72%",
          wordBreak: "break-word",
          overflowWrap: "break-word",
          whiteSpace: "pre-wrap",
        }}
        className="bg-white border-t-2 border-[#D4AF37] rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm text-[#2C2824]"
      >
        {/* AI Indicator */}
        <div className="flex items-center gap-2 mb-2 pb-2 border-b border-[#E8E4DC]">
          <div className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] shadow-[0_0_4px_rgba(212,175,55,0.5)]" />
          <span className="text-[10px] uppercase tracking-[0.15em] text-[#D4AF37] font-serif font-medium">
            Maison Assistant
          </span>
        </div>
        
        <p className="text-[13.5px] leading-[1.6] font-sans text-[#3D3833]">
          {content}
          {isStreaming && (
            <motion.span
              animate={{ opacity: [1, 0, 1] }}
              transition={{ duration: 0.8, repeat: Infinity }}
              style={{
                display: "inline-block",
                width: 2,
                height: 12,
                background: "#C9A84C",
                borderRadius: 1,
                marginLeft: 2,
                verticalAlign: "middle",
              }}
            />
          )}
        </p>
        
        {timestamp && (
          <span className="block mt-2 text-[9px] tracking-wide text-[#A09A92]">
            {timestamp}
          </span>
        )}
      </div>

      {/* Hover Actions */}
      <AnimatePresence>
        {isHovered && !isStreaming && (
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            transition={{ duration: 0.12 }}
            className="absolute -bottom-7 left-0 flex items-center gap-0.5 bg-white/95 backdrop-blur-sm border border-[#E8E4DC] rounded-full px-1.5 py-0.5 shadow-sm"
          >
            <button
              onClick={handleCopy}
              className="p-1 rounded-full text-[#6B6660] hover:text-[#D4AF37] hover:bg-[#D4AF37]/10 transition-all duration-150"
              title="Copy"
            >
              {copied ? (
                <Check className="w-3 h-3 text-green-600" />
              ) : (
                <Copy className="w-3 h-3" />
              )}
            </button>

            <button
              onClick={handleRegenerate}
              className="p-1 rounded-full text-[#6B6660] hover:text-[#D4AF37] hover:bg-[#D4AF37]/10 transition-all duration-150"
              title="Regenerate"
            >
              <RefreshCw className="w-3 h-3" />
            </button>

            <div className="w-px h-3 bg-[#E8E4DC] mx-0.5" />

            {/* FIX 5: Thumbs with darker selected state */}
            <button
              onClick={() => handleFeedback("up")}
              className={cn(
                "p-1 rounded-full transition-all duration-150",
                feedbackGiven === "up" 
                  ? "text-[#A88B2A] bg-[#C9A84C]/25" 
                  : "text-[#6B6660] hover:text-[#C9A84C] hover:bg-[#C9A84C]/10"
              )}
              title="Good response"
            >
              <ThumbsUp className="w-3 h-3" />
            </button>

            <button
              onClick={() => handleFeedback("down")}
              className={cn(
                "p-1 rounded-full transition-all duration-150",
                feedbackGiven === "down" 
                  ? "text-[#A88B2A] bg-[#C9A84C]/25" 
                  : "text-[#6B6660] hover:text-[#C9A84C] hover:bg-[#C9A84C]/10"
              )}
              title="Poor response"
            >
              <ThumbsDown className="w-3 h-3" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
