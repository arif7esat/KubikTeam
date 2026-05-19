"use client"

import Image from "next/image"
import { X } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"

export interface PendingProduct {
  id: string
  name: string
  image: string
  seller: string
}

interface PendingProductsProps {
  products: PendingProduct[]
  onRemove: (id: string) => void
}

export function PendingProducts({ products, onRemove }: PendingProductsProps) {
  if (products.length === 0) return null

  return (
    <div className="flex flex-wrap gap-2 mb-3">
      <AnimatePresence mode="popLayout">
        {products.map((product, index) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, scale: 0.8, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: -10 }}
            transition={{ 
              type: "spring", 
              stiffness: 400, 
              damping: 25,
              delay: index * 0.05 
            }}
            className={cn(
              "flex items-center gap-2 pl-1.5 pr-2 py-1.5 rounded-full",
              "bg-gradient-to-r from-[#FAF9F6] to-white",
              "border border-[#D4AF37]/30 shadow-sm",
              "hover:border-[#D4AF37]/60 hover:shadow-md",
              "transition-all duration-200"
            )}
          >
            {/* Mini product image */}
            <div className="relative w-6 h-6 rounded-full overflow-hidden border border-[#D4AF37]/40 flex-shrink-0">
              <Image
                src={product.image}
                alt={product.name}
                fill
                className="object-cover"
                sizes="24px"
              />
            </div>
            
            {/* Product label */}
            <span className="text-[11px] font-serif font-medium text-[#3D3833] whitespace-nowrap">
              {product.name}
            </span>
            
            {/* Item letter badge */}
            <span className="text-[9px] font-sans font-bold text-[#D4AF37] bg-[#D4AF37]/10 px-1.5 py-0.5 rounded">
              {String.fromCharCode(65 + index)}
            </span>
            
            {/* Remove button */}
            <button
              type="button"
              onClick={() => onRemove(product.id)}
              className="p-0.5 rounded-full text-[#A09A92] hover:text-[#D4AF37] hover:bg-[#D4AF37]/10 transition-colors duration-150"
              aria-label={`Remove ${product.name}`}
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}
