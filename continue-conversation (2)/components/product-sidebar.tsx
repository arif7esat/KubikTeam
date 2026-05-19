"use client"

import Image from "next/image"
import { Search } from "lucide-react"
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from "framer-motion"
import { useRef, useState, useEffect, useCallback, memo } from "react"

interface Product {
  id: string
  name: string
  image: string
  seller: string
}

interface ProductSidebarProps {
  products: Product[]
  isOpen: boolean
  searchQuery: string
  onSearchChange: (query: string) => void
  allProducts: Product[]
  activeProductId?: string | null
  onChatSelect?: (productId: string) => void
}

// Individual product item with physics-based scaling - memoized to prevent hook issues
const DockItem = memo(function DockItem({ 
  product, 
  mouseY,
  onDragStart,
  onDragEnd,
  isSelected,
  isActive,
  onSelect,
  onChatSelect,
  waveScale,
}: { 
  product: Product
  mouseY: ReturnType<typeof useMotionValue<number>>
  onDragStart: (e: React.DragEvent<HTMLDivElement>, product: Product) => void
  onDragEnd: () => void
  isSelected: boolean
  isActive: boolean
  onSelect: (product: Product, isMulti: boolean) => void
  onChatSelect: (productId: string) => void
  waveScale: number
}) {
  const ref = useRef<HTMLDivElement>(null)
  
  // Calculate distance from mouse to item center
  const distance = useTransform(mouseY, (val) => {
    if (!ref.current || val === -1000) return 150
    const bounds = ref.current.getBoundingClientRect()
    const itemCenterY = bounds.top + bounds.height / 2
    return Math.abs(val - itemCenterY)
  })
  
  // Map distance to scale - Dock effect values
  const baseScale = useTransform(distance, [0, 50, 100, 150], [1.4, 1.2, 1.08, 1])
  
  // Combine with wave scale
  const combinedScale = useTransform(baseScale, (s) => s * waveScale)
  
  // Apply spring physics
  const scale = useSpring(combinedScale, {
    stiffness: 150,
    damping: 15,
    mass: 0.1,
  })
  
  // Border and shadow based on proximity - always call hooks unconditionally
  const borderOpacity = useTransform(distance, [0, 100], [1, 0])
  const shadowOpacity = useTransform(distance, [0, 100], [0.35, 0.08])
  
  const borderOpacitySpring = useSpring(borderOpacity, { stiffness: 150, damping: 15, mass: 0.1 })
  const shadowOpacitySpring = useSpring(shadowOpacity, { stiffness: 150, damping: 15, mass: 0.1 })

  // Derive border from proximity, selection, or active state
  const borderColorValue = useTransform(borderOpacitySpring, (o) => 
    isActive ? `rgba(201, 168, 76, 1)` : 
    isSelected ? `rgba(201, 168, 76, 0.8)` : 
    `rgba(201, 168, 76, ${o})`
  )
  const boxShadowValue = useTransform(shadowOpacitySpring, (o) => 
    isActive ? `0 0 16px rgba(201, 168, 76, 0.6)` :
    isSelected ? `0 0 12px rgba(201, 168, 76, 0.4)` : 
    `0 6px 20px rgba(201, 168, 76, ${o})`
  )

  // Handle click - CMD/CTRL for multi-select, normal click for chat switch
  const handleClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    const isMulti = e.metaKey || e.ctrlKey
    
    if (isMulti) {
      // Multi-select mode for drag & drop
      onSelect(product, true)
    } else {
      // Normal click - switch to this chat
      onChatSelect(product.id)
    }
  }, [product, onSelect, onChatSelect])

  const handleDrag = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    onDragStart(e, product)
  }, [product, onDragStart])

  return (
    <motion.div
      ref={ref}
      draggable
      onClick={handleClick}
      onDragStart={handleDrag}
      onDragEnd={onDragEnd}
      style={{
        width: 56,
        height: 56,
        borderRadius: "50%",
        overflow: "visible",
        cursor: "grab",
        flexShrink: 0,
        scale,
        transformOrigin: "center center",
        position: "relative",
      }}
      whileTap={{ scale: 0.95 }}
    >
      <motion.div
        style={{
          width: "100%",
          height: "100%",
          borderRadius: "50%",
          overflow: "hidden",
          borderWidth: isActive ? 3 : isSelected ? 2.5 : 2,
          borderStyle: "solid",
          borderColor: borderColorValue,
          boxShadow: boxShadowValue,
          background: isActive ? "rgba(201, 168, 76, 0.15)" : isSelected ? "rgba(201, 168, 76, 0.1)" : "transparent",
        }}
      >
        <Image
          src={product.image}
          alt={product.name}
          width={56}
          height={56}
          style={{ width: "100%", height: "100%", objectFit: "cover", pointerEvents: "none" }}
          draggable={false}
        />
      </motion.div>
      
      {/* Selection indicator badge */}
      <AnimatePresence>
        {isSelected && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            style={{
              position: "absolute",
              top: -2,
              right: -2,
              width: 16,
              height: 16,
              borderRadius: "50%",
              background: "#C9A84C",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 10,
              color: "white",
              fontWeight: 600,
              boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
            }}
          >
            ✓
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
})

// Streaming "Not found" text component - only renders once per search
const NotFoundStreaming = memo(function NotFoundStreaming({ searchId, onComplete }: { searchId: string, onComplete: () => void }) {
  const fullText = "Not found. Ask the Maison Assistant to find it for you..."
  const [displayedText, setDisplayedText] = useState("")
  const [phase, setPhase] = useState<"typing" | "showing" | "fading">("typing")
  const completedRef = useRef(false)

  useEffect(() => {
    // Reset state when searchId changes
    setDisplayedText("")
    setPhase("typing")
    completedRef.current = false
    
    let currentIndex = 0
    const typingInterval = setInterval(() => {
      if (currentIndex < fullText.length) {
        setDisplayedText(fullText.slice(0, currentIndex + 1))
        currentIndex++
      } else {
        clearInterval(typingInterval)
        setPhase("showing")
        
        // Start fade out after 3 seconds
        const fadeTimeout = setTimeout(() => {
          setPhase("fading")
          // Complete after fade animation
          const completeTimeout = setTimeout(() => {
            if (!completedRef.current) {
              completedRef.current = true
              onComplete()
            }
          }, 500)
          return () => clearTimeout(completeTimeout)
        }, 3000)
        
        return () => clearTimeout(fadeTimeout)
      }
    }, 35)

    return () => {
      clearInterval(typingInterval)
    }
  }, [searchId, onComplete])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: phase === "fading" ? 0 : 1 }}
      transition={{ duration: phase === "fading" ? 0.5 : 0.3 }}
      style={{
        padding: "16px 8px",
        textAlign: "center",
        fontFamily: "Inter, system-ui",
        fontSize: 11,
        color: "#9A8F82",
        fontStyle: "italic",
        lineHeight: 1.5,
      }}
    >
      {displayedText}
      {phase === "typing" && (
        <motion.span
          animate={{ opacity: [1, 0] }}
          transition={{ duration: 0.5, repeat: Infinity }}
          style={{ marginLeft: 1 }}
        >
          |
        </motion.span>
      )}
    </motion.div>
  )
})

export function ProductSidebar({ products, isOpen, searchQuery, onSearchChange, allProducts, activeProductId, onChatSelect }: ProductSidebarProps) {
  // Track mouse Y position across the sidebar
  const mouseY = useMotionValue(-1000)
  
  // Multi-select state
  const [selectedProducts, setSelectedProducts] = useState<Set<string>>(new Set())
  
  // Wave animation state
  const [waveScales, setWaveScales] = useState<Record<string, number>>({})
  
  // Not found state - use ID to track unique searches
  const [notFoundSearchId, setNotFoundSearchId] = useState<string | null>(null)
  const lastSearchRef = useRef("")

  // Handle search with wave effect
  const handleSearch = useCallback((query: string) => {
    onSearchChange(query)
    
    if (query.trim() && query !== lastSearchRef.current) {
      lastSearchRef.current = query
      
      // We need to filter allProducts to find matches
      const lowerQuery = query.toLowerCase()
      const matchingProducts = allProducts.filter(p => 
        p.name.toLowerCase().includes(lowerQuery) ||
        p.seller.toLowerCase().includes(lowerQuery)
      )
      
      if (matchingProducts.length > 0) {
        // Hide not found message
        setNotFoundSearchId(null)
        
        // Trigger sequential wave animation on matches
        const ids = matchingProducts.map(p => p.id)
        ids.forEach((id, index) => {
          setTimeout(() => {
            setWaveScales(prev => ({ ...prev, [id]: 1.3 }))
            setTimeout(() => {
              setWaveScales(prev => ({ ...prev, [id]: 1 }))
            }, 200)
          }, index * 100)
        })
      } else {
        // Show not found with unique ID
        setNotFoundSearchId(Date.now().toString())
      }
    } else if (!query.trim()) {
      lastSearchRef.current = ""
      setNotFoundSearchId(null)
    }
  }, [onSearchChange, allProducts])

  // Handle Enter key for search
  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch(searchQuery)
    }
  }, [handleSearch, searchQuery])

  // Handle product selection (multi-select with CMD/CTRL only)
  const handleSelect = useCallback((product: Product, isMulti: boolean) => {
    if (!isMulti) return // Only handle multi-select here
    
    setSelectedProducts(prev => {
      const newSet = new Set(prev)
      // Toggle selection
      if (newSet.has(product.id)) {
        newSet.delete(product.id)
      } else {
        newSet.add(product.id)
      }
      return newSet
    })
  }, [])

  // Handle drag start with multi-select support
  const handleDragStart = useCallback((e: React.DragEvent<HTMLDivElement>, product: Product) => {
    // Get selected products from current state
    const selectedIds = Array.from(selectedProducts)
    
    let productsToDrag: Product[]
    
    // If there are selected products and the dragged one is among them, drag all selected
    // Otherwise, if there are selected products but dragging a non-selected one, drag all selected + this one
    // If nothing selected, just drag this one
    if (selectedIds.length > 0) {
      if (selectedIds.includes(product.id)) {
        // Dragging a selected item - drag all selected
        productsToDrag = selectedIds
          .map(id => allProducts.find(p => p.id === id))
          .filter((p): p is Product => p !== undefined)
      } else {
        // Dragging a non-selected item while others are selected - include all selected + this one
        const allIds = [...selectedIds, product.id]
        productsToDrag = allIds
          .map(id => allProducts.find(p => p.id === id))
          .filter((p): p is Product => p !== undefined)
      }
    } else {
      // Nothing selected - just drag this one
      productsToDrag = [product]
    }
    
    const payload = productsToDrag.map(p => ({
      id: p.id,
      name: p.name,
      seller: p.seller,
      url: `/products/${p.id}`
    }))
    
    // Set drag data - array if multiple, single object if one
    e.dataTransfer.setData("application/json", JSON.stringify(
      payload.length === 1 ? payload[0] : payload
    ))
    e.dataTransfer.effectAllowed = "copy"
    
    // Set custom drag image if multiple products
    if (productsToDrag.length > 1) {
      const dragLabel = document.createElement("div")
      dragLabel.textContent = `${productsToDrag.length} items`
      dragLabel.style.cssText = "position: fixed; top: -100px; left: -100px; background: #C9A84C; color: white; padding: 6px 12px; border-radius: 14px; font-size: 12px; font-weight: 500; font-family: Inter, system-ui; box-shadow: 0 2px 8px rgba(0,0,0,0.15);"
      document.body.appendChild(dragLabel)
      e.dataTransfer.setDragImage(dragLabel, 40, 12)
      setTimeout(() => document.body.removeChild(dragLabel), 0)
    }
  }, [selectedProducts, allProducts])
  
  // Handle chat selection (normal click)
  const handleChatSwitch = useCallback((productId: string) => {
    if (onChatSelect) {
      onChatSelect(productId)
    }
  }, [onChatSelect])

  // Clear selection when drag ends
  const handleDragEnd = useCallback(() => {
    setSelectedProducts(new Set())
  }, [])

  // Clear not found message
  const handleNotFoundComplete = useCallback(() => {
    setNotFoundSearchId(null)
  }, [])

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.aside
          initial={{ width: 0, opacity: 0 }}
          animate={{ width: 100, opacity: 1 }}
          exit={{ width: 0, opacity: 0 }}
          transition={{ duration: 0.25, ease: "easeInOut" }}
          onMouseMove={(e) => mouseY.set(e.clientY)}
          onMouseLeave={() => mouseY.set(-1000)}
          style={{
            background: "#F8F6F1",
            borderRight: "1px solid #EAE5DC",
            display: "flex",
            flexDirection: "column",
            padding: "16px 8px",
            gap: 12,
            overflowY: "auto",
            overflowX: "visible",
            flexShrink: 0,
          }}
        >
          {/* "COLLECTION" heading */}
          <h2
            style={{
              fontFamily: "Inter, system-ui",
              fontSize: 9,
              fontWeight: 600,
              letterSpacing: "0.12em",
              color: "#9A8F82",
              margin: 0,
              textTransform: "uppercase",
              textAlign: "center",
            }}
          >
            Collection
          </h2>

          {/* Search bar */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 4,
              background: "#FFFFFF",
              border: "1px solid #E8E2D5",
              borderRadius: 14,
              padding: "5px 8px",
              width: "100%",
              boxSizing: "border-box",
            }}
          >
            <Search size={11} color="#9A8F82" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Search"
              style={{
                border: "none",
                outline: "none",
                background: "transparent",
                fontFamily: "Inter, system-ui",
                fontSize: 10,
                color: "#3D2E1E",
                width: "100%",
              }}
            />
          </div>

          {/* Multi-select hint */}
          <AnimatePresence>
            {selectedProducts.size > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                style={{
                  fontSize: 8,
                  color: "#C9A84C",
                  textAlign: "center",
                  fontFamily: "Inter, system-ui",
                }}
              >
                {selectedProducts.size} selected
              </motion.div>
            )}
          </AnimatePresence>

          {/* Product circles with physics-based Apple Dock effect */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 8,
              alignItems: "center",
              paddingTop: 4,
              position: "relative",
            }}
          >
            {/* Always render all products but hide non-matching ones */}
            {allProducts.map((product) => {
              const isVisible = products.some(p => p.id === product.id)
              return (
                <div key={product.id} style={{ display: isVisible ? "block" : "none" }}>
                  <DockItem
                    product={product}
                    mouseY={mouseY}
                    onDragStart={handleDragStart}
                    onDragEnd={handleDragEnd}
                    isSelected={selectedProducts.has(product.id)}
                    isActive={activeProductId === product.id}
                    onSelect={handleSelect}
                    onChatSelect={handleChatSwitch}
                    waveScale={waveScales[product.id] || 1}
                  />
                </div>
              )
            })}
            
            {/* Show not found message when no products match */}
            {products.length === 0 && notFoundSearchId && (
              <NotFoundStreaming 
                searchId={notFoundSearchId} 
                onComplete={handleNotFoundComplete} 
              />
            )}
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  )
}
