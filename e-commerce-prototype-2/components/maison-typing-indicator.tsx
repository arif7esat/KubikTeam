"use client"

import { motion, AnimatePresence } from "framer-motion"

interface MaisonTypingIndicatorProps {
  isVisible: boolean
}

export function MaisonTypingIndicator({ isVisible }: MaisonTypingIndicatorProps) {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 8 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          style={{
            background: "#FFFFFF",
            border: "1px solid #E8E2D5",
            borderRadius: 16,
            padding: "14px 18px",
            maxWidth: 200,
            alignSelf: "flex-start",
          }}
        >
          {/* Header row — same as all AI bubbles */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 7,
              marginBottom: 10,
              paddingBottom: 10,
              borderBottom: "1px solid #F0EEE6",
            }}
          >
            <div
              style={{
                width: 7,
                height: 7,
                borderRadius: "50%",
                background: "#C9A84C",
              }}
            />
            <span
              style={{
                fontFamily: "Inter, system-ui",
                fontSize: 10,
                letterSpacing: "0.13em",
                color: "#C9A84C",
                fontWeight: 500,
              }}
            >
              MAISON ASSISTANT
            </span>
          </div>

          {/* Three dots — all same gold, wave animation */}
          <div
            style={{
              display: "flex",
              gap: 5,
              alignItems: "center",
              height: 20,
            }}
          >
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                animate={{
                  y: [0, -5, 0],
                  opacity: [0.4, 1, 0.4],
                }}
                transition={{
                  duration: 1.1,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: i * 0.18,
                }}
                style={{
                  width: 7,
                  height: 7,
                  borderRadius: "50%",
                  background: "#C9A84C",
                }}
              />
            ))}
          </div>

          {/* Subtle label below dots */}
          <p
            style={{
              fontFamily: "Inter, system-ui",
              fontSize: 10,
              color: "#C9A84C",
              letterSpacing: "0.08em",
              margin: "8px 0 0",
              opacity: 0.6,
            }}
          >
            Analyzing...
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
