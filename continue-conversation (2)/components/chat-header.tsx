"use client"

import { MessageSquarePlus } from "lucide-react"

interface ChatHeaderProps {
  productName: string
  sellerName: string
  avatarUrl?: string
  isSidebarOpen: boolean
  onToggleSidebar: () => void
  onNewChat?: () => void
}

export function ChatHeader({ 
  productName, 
  sellerName, 
  isSidebarOpen,
  onToggleSidebar,
  onNewChat,
}: ChatHeaderProps) {
  return (
    <header 
      style={{
        position: "sticky",
        top: 0,
        zIndex: 20,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 14,
        padding: "14px 24px",
        borderBottom: "1px solid #EAE5DC",
        background: "#F8F6F1",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        {/* Sidebar toggle button */}
        <button
          onClick={onToggleSidebar}
          title={isSidebarOpen ? "Hide sidebar" : "Show sidebar"}
          style={{
            width: 40,
            height: 40,
            borderRadius: 10,
            border: "1.5px solid #D4B483",
            background: isSidebarOpen ? "rgba(201,168,76,0.08)" : "transparent",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            transition: "background 0.2s ease, border-color 0.2s ease",
            flexShrink: 0,
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.background = "rgba(201,168,76,0.14)"
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.background = isSidebarOpen
              ? "rgba(201,168,76,0.08)"
              : "transparent"
          }}
        >
          {/* Plain cube icon */}
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#C9A84C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
            <polyline points="3.27 6.96 12 12.01 20.73 6.96"/>
            <line x1="12" y1="22.08" x2="12" y2="12"/>
          </svg>
        </button>

        {/* Text */}
        <div style={{ minWidth: 0 }}>
          <h1
            style={{
              fontFamily: "Playfair Display, Georgia, serif",
              fontSize: 17,
              fontWeight: 600,
              color: "#2C1F0E",
              margin: 0,
              letterSpacing: "0.01em",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {productName || "Untitled Product"}
          </h1>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              marginTop: 2,
            }}
          >
            <span
              style={{
                fontFamily: "Inter, system-ui",
                fontSize: 11,
                color: "#9A8F82",
                letterSpacing: "0.06em",
                textTransform: "uppercase",
              }}
            >
              {sellerName || "Maison Atelier"}
            </span>
            {/* Verified dot */}
            <div
              style={{
                width: 5,
                height: 5,
                borderRadius: "50%",
                background: "#C9A84C",
                opacity: 0.7,
              }}
            />
            <span
              style={{
                fontFamily: "Inter, system-ui",
                fontSize: 10,
                color: "#C9A84C",
                letterSpacing: "0.08em",
              }}
            >
              VERIFIED SELLER
            </span>
          </div>
        </div>
      </div>

      {/* New Chat Button */}
      {onNewChat && (
        <button
          onClick={onNewChat}
          title="New Chat"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            padding: "8px 14px",
            borderRadius: 20,
            border: "1.5px solid #D4B483",
            background: "transparent",
            cursor: "pointer",
            transition: "all 0.2s ease",
            fontFamily: "Inter, system-ui",
            fontSize: 11,
            fontWeight: 500,
            color: "#9A8F82",
            letterSpacing: "0.02em",
          }}
          onMouseEnter={(e) => {
            const el = e.currentTarget as HTMLElement
            el.style.background = "rgba(201,168,76,0.1)"
            el.style.borderColor = "#C9A84C"
            el.style.color = "#C9A84C"
          }}
          onMouseLeave={(e) => {
            const el = e.currentTarget as HTMLElement
            el.style.background = "transparent"
            el.style.borderColor = "#D4B483"
            el.style.color = "#9A8F82"
          }}
        >
          <MessageSquarePlus size={14} />
          <span>New Chat</span>
        </button>
      )}
    </header>
  )
}
