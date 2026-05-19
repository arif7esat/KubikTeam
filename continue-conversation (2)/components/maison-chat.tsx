"use client"

import { useState, useRef, useEffect, useMemo, useCallback } from "react"
import { ProductSidebar } from "./product-sidebar"
import { ChatHeader } from "./chat-header"
import { ChatMessage } from "./chat-message"
import { ChatInput } from "./chat-input"
import { MaisonTypingIndicator } from "./maison-typing-indicator"
import type { PendingProduct } from "./pending-products"
import type { RealityScoreData } from "./reality-score-card"

interface ComparisonData {
  products: PendingProduct[]
  isActive: boolean
}

interface Message {
  id: string
  content: string
  isAi: boolean
  timestamp: string
  isNew?: boolean
  isStreaming?: boolean
  edited?: boolean
  uiType?: "text" | "reality_score" | "comparison"
  uiData?: RealityScoreData
  comparisonData?: ComparisonData
}

// Chat history for each product
interface ChatHistory {
  messages: Message[]
  pendingProducts: PendingProduct[]
}

const PRODUCTS = [
  { id: "maison-silk-blouse-001", name: "Silk Blouse", image: "/products/shirt-1.jpg", seller: "Maison Atelier" },
  { id: "maison-gold-earrings-002", name: "Gold Earrings", image: "/products/earrings.jpg", seller: "Maison Atelier" },
  { id: "maison-leather-bag-003", name: "Leather Handbag", image: "/products/handbag.jpg", seller: "Maison Atelier" },
  { id: "maison-sunglasses-004", name: "Designer Sunglasses", image: "/products/sunglasses.jpg", seller: "Maison Atelier" },
  { id: "maison-cashmere-scarf-005", name: "Cashmere Scarf", image: "/products/scarf.jpg", seller: "Maison Atelier" },
  { id: "maison-heels-006", name: "Designer Heels", image: "/products/heels.jpg", seller: "Maison Atelier" },
]

const DEFAULT_CHIPS = [
  "Compare reality scores",
  "Analyze fabric quality",
  "Summarize user reviews",
  "Find matching pieces",
  "Check authenticity signals",
]

const INITIAL_MESSAGES: Message[] = [
  {
    id: "1",
    content: "Welcome to Maison Atelier. I'm here to help you discover our curated collection of luxury pieces. How may I assist you today?",
    isAi: true,
    timestamp: "10:30 AM",
  },
]

// Generate initial chat history for each product
const generateInitialChatHistories = (): Record<string, ChatHistory> => {
  const histories: Record<string, ChatHistory> = {}
  PRODUCTS.forEach((product) => {
    histories[product.id] = {
      messages: [
        {
          id: `${product.id}-welcome`,
          content: `Welcome to the ${product.name} conversation. I can help you with details about materials, styling suggestions, authentication, and comparisons. What would you like to know?`,
          isAi: true,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ],
      pendingProducts: [],
    }
  })
  return histories
}

export function MaisonChat() {
  // Active product/chat
  const [activeProductId, setActiveProductId] = useState<string | null>(null)
  
  // Chat histories for all products
  const [chatHistories, setChatHistories] = useState<Record<string, ChatHistory>>(() => generateInitialChatHistories())
  
  // General chat pending products (when no product is active)
  const [generalPendingProducts, setGeneralPendingProducts] = useState<PendingProduct[]>([])
  
  // Current messages (derived from active chat or general)
  const [generalMessages, setGeneralMessages] = useState<Message[]>(INITIAL_MESSAGES)
  
  const messages = activeProductId 
    ? (chatHistories[activeProductId]?.messages || [])
    : generalMessages
  
  // Pending products derived from active chat or general
  const pendingProducts = activeProductId
    ? (chatHistories[activeProductId]?.pendingProducts || [])
    : generalPendingProducts
  
  const setMessages = useCallback((updater: Message[] | ((prev: Message[]) => Message[])) => {
    if (activeProductId) {
      setChatHistories(prev => {
        const newMessages = typeof updater === 'function' 
          ? updater(prev[activeProductId]?.messages || [])
          : updater
        return {
          ...prev,
          [activeProductId]: {
            ...prev[activeProductId],
            messages: newMessages,
          }
        }
      })
    } else {
      setGeneralMessages(updater as Message[] | ((prev: Message[]) => Message[]))
    }
  }, [activeProductId])
  
  const setPendingProducts = useCallback((updater: PendingProduct[] | ((prev: PendingProduct[]) => PendingProduct[])) => {
    if (activeProductId) {
      setChatHistories(prev => {
        const newPending = typeof updater === 'function' 
          ? updater(prev[activeProductId]?.pendingProducts || [])
          : updater
        return {
          ...prev,
          [activeProductId]: {
            ...prev[activeProductId],
            pendingProducts: newPending,
          }
        }
      })
    } else {
      setGeneralPendingProducts(updater as PendingProduct[] | ((prev: PendingProduct[]) => PendingProduct[]))
    }
  }, [activeProductId])
  
  const [inputValue, setInputValue] = useState("")
  const [currentProduct, setCurrentProduct] = useState({ name: "Maison Collection", seller: "Maison Atelier" })
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [activeComparisonMessageId, setActiveComparisonMessageId] = useState<string | null>(null)
  const [isTyping, setIsTyping] = useState(false)
  const [suggestionChips, setSuggestionChips] = useState<string[]>(DEFAULT_CHIPS)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const chatAreaRef = useRef<HTMLDivElement>(null)
  const [userScrolling, setUserScrolling] = useState(false)

  // Filter products based on search query
  const filteredProducts = useMemo(() => {
    if (!searchQuery.trim()) return PRODUCTS
    const query = searchQuery.toLowerCase()
    return PRODUCTS.filter(
      product => 
        product.name.toLowerCase().includes(query) ||
        product.seller.toLowerCase().includes(query)
    )
  }, [searchQuery])

  // Smooth auto-scroll
  const scrollToBottom = useCallback(() => {
    if (!userScrolling) {
      messagesEndRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "end",
      })
    }
  }, [userScrolling])

  // Detect user scrolling
  useEffect(() => {
    const chatArea = chatAreaRef.current
    if (!chatArea) return

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = chatArea
      const isAtBottom = scrollHeight - scrollTop - clientHeight < 100
      setUserScrolling(!isAtBottom)
    }

    chatArea.addEventListener("scroll", handleScroll)
    return () => chatArea.removeEventListener("scroll", handleScroll)
  }, [])

  // Auto-scroll on new messages and typing state
  useEffect(() => {
    scrollToBottom()
  }, [messages, isTyping, scrollToBottom])

  const handleSend = () => {
    if (!inputValue.trim()) return

    const newMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      isAi: false,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      isNew: true,
    }

    setMessages((prev) => [...prev, newMessage])
    setInputValue("")
    setIsTyping(true)

    // Simulate AI response with streaming
    setTimeout(() => {
      // Check if user asked for reality score comparison
      const shouldShowRealityScore = inputValue.toLowerCase().includes("reality score") || 
                                     inputValue.toLowerCase().includes("compare score")
      
      if (shouldShowRealityScore) {
        setIsTyping(false)
        const realityScoreMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: "",
          isAi: true,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          isNew: true,
          uiType: "reality_score",
          uiData: {
            type: "reality_score",
            product: {
              name: "Silk Blouse",
              score: 92,
              matchLabel: "92% Match",
              signals: [
                { label: "Material Quality", value: 95, status: "positive" },
                { label: "Craftsmanship", value: 88, status: "positive" },
                { label: "Value Score", value: 85, status: "neutral" },
                { label: "Authenticity", value: 98, status: "positive" },
              ],
              verdict: "Exceptional quality with premium Italian silk and meticulous stitching.",
            },
            comparison: {
              name: "Gold Earrings",
              score: 89,
              matchLabel: "89% Match",
              signals: [
                { label: "Material Quality", value: 96, status: "positive" },
                { label: "Craftsmanship", value: 92, status: "positive" },
                { label: "Value Score", value: 78, status: "neutral" },
                { label: "Authenticity", value: 99, status: "positive" },
              ],
              verdict: "Handcrafted 18k gold with timeless design and excellent resale value.",
            },
          },
        }
        setMessages((prev) => [...prev, realityScoreMessage])
      } else {
        // FEATURE 5: Streaming AI response
        const aiMessageId = (Date.now() + 1).toString()
        const fullResponse = getAiResponse(inputValue)
        
        // Add empty AI message first
        const aiResponse: Message = {
          id: aiMessageId,
          content: "",
          isAi: true,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          isNew: true,
          isStreaming: true,
        }
        setMessages((prev) => [...prev, aiResponse])
        setIsTyping(false)
        
        // Stream the response token by token
        let currentIndex = 0
        const streamInterval = setInterval(() => {
          if (currentIndex < fullResponse.length) {
            const chunkSize = Math.floor(Math.random() * 3) + 1 // 1-3 chars at a time
            const nextIndex = Math.min(currentIndex + chunkSize, fullResponse.length)
            const newContent = fullResponse.slice(0, nextIndex)
            
            setMessages((prev) => 
              prev.map((msg) => 
                msg.id === aiMessageId 
                  ? { ...msg, content: newContent }
                  : msg
              )
            )
            currentIndex = nextIndex
          } else {
            clearInterval(streamInterval)
            // Mark streaming as complete
            setMessages((prev) => 
              prev.map((msg) => 
                msg.id === aiMessageId 
                  ? { ...msg, isStreaming: false }
                  : msg
              )
            )
          }
        }, 12) // ~12ms per chunk for natural reading rhythm
      }
    }, 1500)
  }

  // FEATURE 3: Handle message edit
  const handleEdit = useCallback((messageId: string, newContent: string) => {
    setMessages((prev) => 
      prev.map((msg) => 
        msg.id === messageId 
          ? { ...msg, content: newContent, edited: true }
          : msg
      )
    )
  }, [])

  // Handle message actions
  const handleCopy = useCallback(() => {
    // Copy already handled in component, this is for tracking
  }, [])

  const handleRegenerate = useCallback((messageId: string) => {
    setIsTyping(true)
    setTimeout(() => {
      setIsTyping(false)
      setMessages((prev) => 
        prev.map((msg) => 
          msg.id === messageId 
            ? { ...msg, content: "I've refined my response. " + msg.content, isNew: true }
            : msg
        )
      )
    }, 1200)
  }, [])

  const handleFeedback = useCallback((messageId: string, type: "up" | "down") => {
    // Silent feedback - just log for now
    console.log(`Feedback for message ${messageId}: ${type}`)
  }, [])

  // Handle product drop - adds to pending list for comparison
  const handleProductDrop = useCallback((productData: { id: string; name: string; seller: string; url: string }) => {
    // Find the full product data including image
    const fullProduct = PRODUCTS.find(p => p.id === productData.id)
    if (!fullProduct) return
    
    // Don't add the product if it's the active chat's product
    if (productData.id === activeProductId) {
      return // Can't add the current chat's product to pending
    }
    
    // Check if already in pending list
    if (pendingProducts.some(p => p.id === productData.id)) {
      return // Already added
    }
    
    // Add to pending products (max 4)
    if (pendingProducts.length < 4) {
      setPendingProducts(prev => [...prev, {
        id: fullProduct.id,
        name: fullProduct.name,
        image: fullProduct.image,
        seller: fullProduct.seller,
      }])
      
      // Update suggestion chips for dropped product
      setSuggestionChips([
        `Analyze ${fullProduct.name}`,
        "Compare with similar items",
        "Check material quality",
        "Read authenticity signals",
        "Show reality score",
      ])
    }
  }, [pendingProducts, activeProductId, setPendingProducts])

  // Remove a product from pending list
  const handleRemovePending = useCallback((id: string) => {
    setPendingProducts(prev => {
      const updated = prev.filter(p => p.id !== id)
      // Reset chips if no products pending
      if (updated.length === 0) {
        setSuggestionChips(DEFAULT_CHIPS)
      }
      return updated
    })
  }, [setPendingProducts])

  // Handle comparison trigger
  const handleCompare = useCallback(() => {
    if (pendingProducts.length >= 2) {
      const productsToCompare = [...pendingProducts]
      const comparisonMessageId = Date.now().toString()
      
      setPendingProducts([])
      setSuggestionChips(DEFAULT_CHIPS)
      
      // Add comparison as a message with embedded dashboard
      const comparisonMessage: Message = {
        id: comparisonMessageId,
        content: `Comparing ${productsToCompare.map(p => p.name).join(" vs ")}`,
        isAi: true,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        isNew: true,
        uiType: "comparison",
        comparisonData: {
          products: productsToCompare,
          isActive: true,
        },
      }
      setMessages(prev => [...prev, comparisonMessage])
      
      // Store the comparison message ID for closing
      setActiveComparisonMessageId(comparisonMessageId)
    }
  }, [pendingProducts, setPendingProducts, setMessages])

  // Close comparison view - deactivate the comparison message
  const handleCloseComparison = useCallback((messageId: string) => {
    // Mark the comparison as inactive in the message
    setMessages(prev => prev.map(msg => 
      msg.id === messageId && msg.comparisonData
        ? { ...msg, comparisonData: { ...msg.comparisonData, isActive: false } }
        : msg
    ))
    setActiveComparisonMessageId(null)
    
    // Add AI response about the comparison
    const aiResponse: Message = {
      id: Date.now().toString(),
      content: "I've completed the analysis. Based on the comparison, each piece has unique strengths. Would you like me to elaborate on any specific aspect, or shall we explore other items from our collection?",
      isAi: true,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      isNew: true,
    }
    setMessages(prev => [...prev, aiResponse])
  }, [setMessages])

  // Handle drag over chat area
  const handleChatDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }, [])

  // Handle drop on chat area
  const handleChatDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    const data = e.dataTransfer.getData("application/json")
    if (data) {
      try {
        const productData = JSON.parse(data)
        // Handle both single product and array of products
        if (Array.isArray(productData)) {
          productData.forEach((product) => handleProductDrop(product))
        } else {
          handleProductDrop(productData)
        }
      } catch (error) {
        console.error("Failed to parse dropped data:", error)
      }
    }
  }, [handleProductDrop])

  // Handle suggestion chip selection
  const handleSuggestionSelect = useCallback(() => {
    // Optionally auto-send the suggestion
  }, [])

  // Handle chat selection from sidebar
  const handleChatSelect = useCallback((productId: string) => {
    // Don't reload if already on this chat - prevents unnecessary state changes and API calls
    if (productId === activeProductId) return
    
    const product = PRODUCTS.find(p => p.id === productId)
    if (product) {
      setActiveProductId(productId)
      setCurrentProduct({ name: product.name, seller: product.seller })
      // Each chat has its own pending products, so we don't clear them
      // The derived state will automatically show the new chat's pending products
      setSuggestionChips([
        `Analyze ${product.name}`,
        "Check material quality",
        "Read authenticity signals",
        "Show reality score",
        "Compare with others",
      ])
    }
  }, [activeProductId])

  // Handle new chat - reset to general view
  const handleNewChat = useCallback(() => {
    setActiveProductId(null)
    setGeneralMessages([{
      id: Date.now().toString(),
      content: "Welcome to Maison Atelier. I'm here to help you discover our curated collection of luxury pieces. How may I assist you today?",
      isAi: true,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    }])
    setInputValue("")
    setSearchQuery("")
    setGeneralPendingProducts([]) // Clear general chat's pending products for fresh start
    setActiveComparisonMessageId(null)
    setSuggestionChips(DEFAULT_CHIPS)
    setCurrentProduct({ name: "Maison Collection", seller: "Maison Atelier" })
  }, [])

  // Handle multi-product drop
  const handleMultiProductDrop = useCallback((productData: { id: string; name: string; seller: string; url: string } | { id: string; name: string; seller: string; url: string }[]) => {
    const products = Array.isArray(productData) ? productData : [productData]
    
    products.forEach((product) => {
      handleProductDrop(product)
    })
  }, [handleProductDrop])

  return (
    <div className="flex h-screen w-full bg-[#FAF9F6]">
      {/* Left Sidebar */}
      <ProductSidebar 
        products={filteredProducts} 
        isOpen={isSidebarOpen}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        allProducts={PRODUCTS}
        activeProductId={activeProductId}
        onChatSelect={handleChatSelect}
      />

      {/* Main Chat Area */}
      <main className="flex-1 flex flex-col h-full overflow-hidden bg-[#FAF9F6]">
        {/* Sticky Header with Toggle */}
        <ChatHeader
          productName={currentProduct.name}
          sellerName={currentProduct.seller}
          isSidebarOpen={isSidebarOpen}
          onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
          onNewChat={handleNewChat}
        />

        {/* Messages Container - Also acts as drop zone */}
        <div 
          ref={chatAreaRef}
          className="flex-1 overflow-y-auto px-6 md:px-10 py-8 space-y-5"
          onDragOver={handleChatDragOver}
          onDrop={handleChatDrop}
        >
          {messages.map((message) => (
            <ChatMessage
              key={message.id}
              id={message.id}
              content={message.content}
              isAi={message.isAi}
              timestamp={message.timestamp}
              isNew={message.isNew}
              isStreaming={message.isStreaming}
              edited={message.edited}
              uiType={message.uiType}
              uiData={message.uiData}
              comparisonData={message.comparisonData}
              onCopy={handleCopy}
              onRegenerate={handleRegenerate}
              onFeedback={handleFeedback}
              onEdit={handleEdit}
              onCloseComparison={handleCloseComparison}
            />
          ))}
          
          {/* Typing Indicator */}
          <MaisonTypingIndicator isVisible={isTyping} />
          
          <div ref={messagesEndRef} style={{ height: 1 }} />
        </div>

        {/* Input Bar (Drop Zone) */}
        <ChatInput
          value={inputValue}
          onChange={setInputValue}
          onSend={handleSend}
          onDrop={handleProductDrop}
          pendingProducts={pendingProducts}
          onRemovePending={handleRemovePending}
          onCompare={handleCompare}
          showSuggestions={!isTyping}
          suggestionChips={suggestionChips}
          onSuggestionSelect={handleSuggestionSelect}
        />
      </main>
    </div>
  )
}

function getAiResponse(input: string): string {
  const lowered = input.toLowerCase()
  
  if (lowered.includes("silk") || lowered.includes("blouse")) {
    return "Our Silk Blouse is crafted from 100% mulberry silk, featuring a relaxed yet refined silhouette. It's available in ivory and champagne. The fabric drapes beautifully and pairs exceptionally with our tailored trousers or a flowing skirt for evening wear."
  }
  
  if (lowered.includes("earring") || lowered.includes("gold")) {
    return "The Gold Earrings are handcrafted in 18k gold with a subtle brushed finish. They're designed to complement both daytime elegance and evening sophistication. Each pair comes in our signature Maison presentation box."
  }
  
  if (lowered.includes("bag") || lowered.includes("handbag") || lowered.includes("leather")) {
    return "Our Leather Handbag is made from full-grain Italian leather that develops a beautiful patina over time. The interior features multiple compartments and a detachable shoulder strap. It's the perfect size for essentials plus a tablet."
  }
  
  if (lowered.includes("sunglasses")) {
    return "These Designer Sunglasses feature acetate frames with gold-tipped temples. The lenses offer 100% UV protection while maintaining optical clarity. They come with a leather case and cleaning cloth."
  }
  
  if (lowered.includes("scarf") || lowered.includes("cashmere")) {
    return "Our Cashmere Scarf is woven from the finest Mongolian cashmere, offering exceptional softness and warmth. The generous dimensions allow for various styling options — draped, wrapped, or worn as a light shawl."
  }
  
  if (lowered.includes("heels") || lowered.includes("shoes")) {
    return "The Designer Heels feature a comfortable 70mm heel height with a cushioned insole. Made in Italy from premium leather, they're designed for both elegance and wearability throughout the evening."
  }
  
  if (lowered.includes("compare") || lowered.includes("comparison") || lowered.includes("analyzing")) {
    return "I see you're comparing multiple items. Each piece in our collection has unique characteristics. The comparison dashboard above shows quality scores, value assessments, and key insights for each product. Would you like me to highlight specific differences?"
  }

  if (lowered.includes("fabric") || lowered.includes("quality") || lowered.includes("material")) {
    return "At Maison Atelier, we source only the finest materials. Our silks come from heritage mills in Como, Italy. Our leathers are full-grain from Tuscany. Every cashmere piece is woven from Grade-A Mongolian fibers. Would you like me to elaborate on any specific material?"
  }

  if (lowered.includes("authenticity") || lowered.includes("authentic")) {
    return "Every Maison Atelier piece comes with a certificate of authenticity and is individually numbered. Our authentication process includes a holographic seal, unique serial number, and registration in our global database. You can verify any piece through our concierge service."
  }
  
  return "That's a wonderful choice. Would you like me to provide more details about materials, sizing, or perhaps suggest complementary pieces from our collection? You can also drag multiple products to compare them side-by-side."
}
