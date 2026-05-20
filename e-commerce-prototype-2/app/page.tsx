"use client"

import { useState, useEffect, useRef } from "react"
import { Search, User, Heart, ShoppingCart, Star, ArrowLeft, Sparkles, Send, Store, ChevronRight, Loader2, AlertTriangle, Lightbulb, Database, MessageCircle, Check, ThumbsUp, ArrowRight, Menu, X, Play, Award, Shield, Truck, Clock, History, MapPin, Package, LogOut, Settings, ExternalLink, MessageSquare } from "lucide-react"
import { MaisonChat } from "@/components/maison-chat"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetTrigger, SheetClose } from "@/components/ui/sheet"
import { Separator } from "@/components/ui/separator"


function formatNumber(num: number): string {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
}

function formatPrice(num: number): string {
  return num.toFixed(2).replace(".", ",").replace(/\B(?=(\d{3})+(?!\d))/g, ".")
}

type ProductCategory = "giyim" | "mobilya" | "elektronik" | "outdoor"

type Review = {
  id: number
  author: string
  rating: number
  date: string
  comment: string
  helpful: number
  verified?: boolean
  title?: string
  location?: string
  images?: { id: number; imageUrl: string; caption: string }[]
}

type Product = {
  id: number
  category: ProductCategory
  brand: string
  title: string
  price: number
  originalPrice: number
  rating: number
  reviewCount: number
  image: string
  imageUrls?: string[]
  sizes?: string[]
  colors?: string[]
  material: string
  dimensions: string
  description?: string
  specs?: { specKey: string; specValue: string }[]
  seller: { name: string; rating: number }
  reviews: Review[]
}

const categoryLabels: Record<ProductCategory, string> = {
  giyim: "Moda",
  mobilya: "Yaşam",
  elektronik: "Teknoloji",
  outdoor: "Macera",
}

const categoryFromBackend: Record<string, ProductCategory> = {
  GIYIM: "giyim", MOBILYA: "mobilya", ELEKTRONIK: "elektronik", OUTDOOR: "outdoor",
}

const navbarCats = ["Yeni", "Kadın", "Erkek", "Ev", "Teknoloji", "İndirim"]

const FALLBACK_PRODUCTS: Product[] = [
  { id:1, category:"elektronik", brand:"Apple", title:"Pencil (USB-C) MUWA3ZE/A", price:3749, originalPrice:4500, rating:4.7, reviewCount:2544, image:"https://cdn.dsmcdn.com/ty1610/prod/QC/20241202/10/5eafa70b-63e3-3aaa-940d-95d6e753f010/1_org_zoom.jpg", material:"", dimensions:"", specs:[{specKey:"Bağlantılar",specValue:"Bluetooth"},{specKey:"Garanti Tipi",specValue:"Resmi Distribütör Garantili"},{specKey:"Garanti Süresi",specValue:"2 Yıl"},{specKey:"Özellik",specValue:"Kablosuz"}], seller:{name:"Apple",rating:9.9}, reviews:[{id:1,author:"**** ****",rating:5,date:"",comment:"çok güzel ipadimle çok yakıştı",helpful:156,verified:true,images:[{id:1,imageUrl:"https://cdn.dsmcdn.com/mnresize/-/820/prod-product-review-media_1768435207133/img/2019922/2020919/2042853/779208863/137451613-1769116093270.jpeg",caption:"Kullanıcı fotoğrafı"}]}] },
  { id:2, category:"giyim", brand:"Bürke", title:"Erkek Krem Likralı Bilek Boy Kumaş Pantolon", price:1000, originalPrice:1200, rating:4.5, reviewCount:1467, image:"https://cdn.dsmcdn.com/mnresize/620/920/ty1775/prod/QC_ENRICHMENT/20251016/12/19654148-362a-3e5a-96cd-7087815e621e/1_org.jpg", material:"", dimensions:"", specs:[{specKey:"Kumaş Tipi",specValue:"Likralı"},{specKey:"Boy",specValue:"Bilek Boy"}], sizes:["40","42","44"], colors:["Krem"], seller:{name:"Bürke",rating:9.0}, reviews:[{id:1,author:"**** ****",rating:5,date:"",comment:"eşim için aldım çok beğendik",helpful:38,verified:true}] },
  { id:3, category:"mobilya", brand:"IKEA", title:"Ahşap 27,5 Cm Bambu Tabaklık", price:467, originalPrice:560, rating:4.2, reviewCount:652, image:"https://cdn.dsmcdn.com/ty1395/product/media/images/prod/QC/20240702/20/71848794-f5fd-3770-b7c9-23d6d9c814c5/1_org_zoom.jpg", material:"Ahşap", dimensions:"", specs:[{specKey:"Materyal",specValue:"Ahşap"},{specKey:"Parça Sayısı",specValue:"1"},{specKey:"Renk",specValue:"Kahverengi"}], seller:{name:"IKEA",rating:9.4}, reviews:[{id:1,author:"E** Ç**",rating:5,date:"",comment:"Mükemmellll!",helpful:9,verified:true}] },
  { id:4, category:"mobilya", brand:"Kelebek", title:"Krem Gelin Battaniye Seti Fransız Güpürlü", price:1889, originalPrice:2267, rating:4.0, reviewCount:1199, image:"https://cdn.dsmcdn.com/ty1445/product/media/images/prod/QC/20240726/18/5191ce17-792f-3cf4-b22e-fb8f40340252/1_org_zoom.jpg", material:"Polyester", dimensions:"220x240", specs:[{specKey:"Materyal",specValue:"Polyester"},{specKey:"Boyut/Ebat",specValue:"220 x 240"},{specKey:"Özellik",specValue:"Antibakteriyel"},{specKey:"Dolgu Materyali",specValue:"Belirtilmemiş"}], seller:{name:"Kelebek",rating:9.2}, reviews:[{id:1,author:"A** Y**",rating:5,date:"",comment:"Çeyizlik aldım çok beğendim",helpful:34,verified:true}] },
  { id:5, category:"giyim", brand:"Koton", title:"İndigo Stone Erkek Jeans 5WAM40120ID", price:1399, originalPrice:1679, rating:4.4, reviewCount:218, image:"https://cdn.dsmcdn.com/ty1805/prod/QC_ENRICHMENT/20251227/19/5f236384-7a57-331b-bb93-0c6f6eeaa531/1_org_zoom.jpg", material:"Tekstil", dimensions:"", specs:[{specKey:"Kalıp",specValue:"Slim"},{specKey:"Kumaş Tipi",specValue:"Denim"},{specKey:"Materyal Bileşeni",specValue:"99% Pamuk, 1% Elastan"},{specKey:"Renk",specValue:"Lacivert"},{specKey:"Boy",specValue:"Regular"}], sizes:["28","30","32","34","36"], colors:["Lacivert"], seller:{name:"Koton",rating:9.3}, reviews:[{id:1,author:"E** E**",rating:5,date:"",comment:"tavsiye ederim",helpful:48,verified:true}] },
  { id:6, category:"giyim", brand:"Koton", title:"Pamuklu Normal Bel Skinny Fit Jean Pantolon", price:1291, originalPrice:1549, rating:4.5, reviewCount:82, image:"https://cdn.dsmcdn.com/ty1767/prod/QC_PREP/20251009/17/f79cf230-e1a6-3cf8-b2c4-0e10d7a6d63e/1_org_zoom.jpg", material:"Tekstil", dimensions:"", specs:[{specKey:"Kalıp",specValue:"Skinny"},{specKey:"Materyal Bileşeni",specValue:"%99 PAMUK, %1 ELASTAN"},{specKey:"Kumaş Tipi",specValue:"Kumaş"},{specKey:"Renk",specValue:"Altın"}], sizes:["S","M","L","XL"], colors:["Altın"], seller:{name:"Koton",rating:9.5}, reviews:[{id:1,author:"P** A**",rating:5,date:"",comment:"Ürünü çok beğendik, kullanışlı ve yumuşak",helpful:38,verified:true,images:[{id:1,imageUrl:"https://cdn.dsmcdn.com/mnresize/-/820/prod-product-review-media-migrated_1755700289924/img/2018925/2029892/2025904/953290757/3911692-1762535602089.jpeg",caption:"Kullanıcı fotoğrafı"}]}] },
  { id:7, category:"outdoor", brand:"Salomon", title:"Su ve Soğuğa Dayanıklı Erkek Kışlık Outdoor Ayakkabı", price:9222, originalPrice:11067, rating:4.4, reviewCount:332, image:"https://cdn.dsmcdn.com/ty1764/prod/QC_ENRICHMENT/20251002/12/d8b5857f-38a3-3ea7-a089-5844ef12754e/1_org_zoom.jpg", material:"Tekstil", dimensions:"", specs:[{specKey:"Kumaş Teknolojisi",specValue:"Gore-Tex"},{specKey:"Taban Teknolojisi",specValue:"Vibram"},{specKey:"Ek Özellik",specValue:"Su itici"},{specKey:"Dış Materyal",specValue:"Tekstil"}], sizes:["40","41","42","43","44","45"], colors:["Gri"], seller:{name:"Salomon",rating:9.6}, reviews:[{id:1,author:"S** M**",rating:5,date:"",comment:"Yağmurda bile ayağım kuru kaldı",helpful:89,verified:true}] },
  { id:8, category:"elektronik", brand:"Samsung", title:"Toz Torbasız Elektrikli Süpürge", price:4499, originalPrice:5399, rating:4.7, reviewCount:3787, image:"https://cdn.dsmcdn.com/ty1714/prod/QC_ENRICHMENT/20250725/15/5b8819a4-4377-3839-a003-40bff45729c9/1_org_zoom.jpg", material:"", dimensions:"", specs:[{specKey:"Özellik",specValue:"Toz Torbasız"},{specKey:"Güç (Watt)",specValue:"501-1000W"},{specKey:"Garanti Süresi",specValue:"2 Yıl"},{specKey:"Hazne Kapasitesi",specValue:"1500+ L"}], seller:{name:"Samsung",rating:9.7}, reviews:[{id:1,author:"H** D**",rating:5,date:"",comment:"Emme gücü muhteşem, sessiz çalışıyor",helpful:78,verified:true}] },
  { id:9, category:"outdoor", brand:"The North Face", title:"Thermoball Unisex Siyah Bot", price:6319, originalPrice:7583, rating:4.5, reviewCount:156, image:"https://cdn.dsmcdn.com/ty1625/prod/QC/20250117/18/42d472c1-5710-3b1b-affb-eefa5f422cce/1_org_zoom.jpg", material:"Suya Dayanıklı", dimensions:"", specs:[{specKey:"Kumaş Teknolojisi",specValue:"Suya Dayanıklı"},{specKey:"Ek Özellik",specValue:"Su Geçirmez"},{specKey:"Sezon",specValue:"Kış"},{specKey:"Kalıp",specValue:"Regular"}], sizes:["38","39","40","41","42","43","44"], colors:["Siyah"], seller:{name:"The North Face",rating:9.5}, reviews:[{id:1,author:"B** Ö**",rating:5,date:"",comment:"Dağ yürüyüşlerinde müthiş",helpful:67,verified:true}] },
]

type BackendChatResponse = {
  reply: string; matchScore: number; visualInsights: string
  warnings: string[]; followUpQuestions: string[]; dataSources: string[]
}

type ChatMessage = { role: "user" | "assistant"; content: string; data?: BackendChatResponse }

/* ================================================================
   NAVBAR
   ================================================================ */
function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const recentOrders = [
    { id: "TRX-2024-0892", product: "Pamuklu Skinny Jean", date: "15 Mayıs 2026", status: "Kargoya verildi", price: 449.99 },
    { id: "TRX-2024-0812", product: "Bambu Tabaklık", date: "2 Mayıs 2026", status: "Teslim edildi", price: 189.90 },
  ]
  return (
    <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border">
      <div className="bg-foreground text-background text-center py-2.5 px-4">
        <p className="text-[11px] tracking-[0.2em] uppercase">
          500 TL üzeri ücretsiz kargo &nbsp;|&nbsp; Kolay 14 Gün İade
        </p>
      </div>
      <div className="max-w-[1800px] mx-auto px-6 lg:px-12">
        <div className="flex items-center justify-between h-20">
          <button className="lg:hidden text-foreground" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X className="h-5 w-5" strokeWidth={1.5} /> : <Menu className="h-5 w-5" strokeWidth={1.5} />}
          </button>
          <a href="/" className="text-2xl tracking-[0.15em] text-foreground font-serif">SMARTCART</a>
          <nav className="hidden lg:flex items-center gap-10">
            {navbarCats.map((cat) => (
              <a key={cat} href="#" className="text-[11px] tracking-[0.2em] text-muted-foreground hover:text-foreground transition-colors uppercase">{cat}</a>
            ))}
          </nav>
          <div className="flex items-center gap-5">
            <button className="text-muted-foreground hover:text-foreground transition-colors"><Search className="h-4 w-4" strokeWidth={1.5} /></button>
            <button className="text-muted-foreground hover:text-foreground transition-colors hidden sm:block"><Heart className="h-4 w-4" strokeWidth={1.5} /></button>
            <button className="text-muted-foreground hover:text-foreground transition-colors relative">
              <ShoppingCart className="h-4 w-4" strokeWidth={1.5} />
              <Badge className="absolute -top-2 -right-2 h-4 w-4 flex items-center justify-center p-0 text-[9px] bg-accent text-accent-foreground rounded-full">2</Badge>
            </button>
            <Sheet>
              <SheetTrigger asChild>
                <button className="text-muted-foreground hover:text-foreground transition-colors hidden sm:block"><User className="h-4 w-4" strokeWidth={1.5} /></button>
              </SheetTrigger>
              <SheetContent side="right" className="w-full sm:max-w-md p-0 bg-background">
                <div className="flex flex-col h-full">
                  <SheetHeader className="px-6 pt-6 pb-4 border-b border-border/50">
                    <SheetTitle className="font-serif text-xl tracking-wide font-light">Hesabım</SheetTitle>
                  </SheetHeader>
                  <div className="flex-1 overflow-y-auto px-6 py-6 space-y-8">
                    {/* Siparişlerim */}
                    <div>
                      <div className="flex items-center gap-2.5 mb-4">
                        <Package className="h-4 w-4 text-accent" strokeWidth={1.5} />
                        <h3 className="text-[11px] tracking-[0.2em] text-foreground uppercase font-medium">Siparişlerim</h3>
                      </div>
                      <div className="space-y-3">
                        {recentOrders.map((order) => (
                          <div key={order.id} className="bg-secondary/50 p-4 rounded-2xl hover:bg-secondary/70 transition-colors cursor-pointer">
                            <div className="flex items-center justify-between mb-1.5">
                              <span className="text-[10px] tracking-[0.1em] text-muted-foreground uppercase">{order.id}</span>
                              <span className="text-[10px] text-accent bg-accent/10 px-2.5 py-1 rounded-full">{order.status}</span>
                            </div>
                            <p className="text-sm text-foreground truncate">{order.product}</p>
                            <div className="flex items-center justify-between mt-2">
                              <span className="text-xs text-muted-foreground">{order.date}</span>
                              <span className="text-sm text-foreground font-medium">{formatPrice(order.price)} TL</span>
                            </div>
                          </div>
                        ))}
                      </div>
                      <button className="w-full text-center text-[11px] text-muted-foreground hover:text-foreground transition-colors mt-4 flex items-center justify-center gap-1.5 tracking-[0.1em] uppercase">
                        Tüm Siparişler <ExternalLink className="h-3 w-3" strokeWidth={1} />
                      </button>
                    </div>
                    <Separator className="bg-border/50" />
                    {/* Adreslerim */}
                    <div>
                      <div className="flex items-center gap-2.5 mb-4">
                        <MapPin className="h-4 w-4 text-accent" strokeWidth={1.5} />
                        <h3 className="text-[11px] tracking-[0.2em] text-foreground uppercase font-medium">Adreslerim</h3>
                      </div>
                      <div className="space-y-3">
                        <div className="bg-secondary/50 p-4 rounded-2xl hover:bg-secondary/70 transition-colors cursor-pointer border border-accent/20">
                          <p className="text-sm text-foreground font-medium">Ev</p>
                          <p className="text-xs text-muted-foreground mt-1">Bağdat Caddesi No:42 D:8, Kadıköy / İstanbul</p>
                        </div>
                        <div className="bg-secondary/50 p-4 rounded-2xl hover:bg-secondary/70 transition-colors cursor-pointer">
                          <p className="text-sm text-foreground font-medium">İş</p>
                          <p className="text-xs text-muted-foreground mt-1">Levent Plaza K:12, Beşiktaş / İstanbul</p>
                        </div>
                      </div>
                      <button className="w-full text-center text-[11px] text-muted-foreground hover:text-foreground transition-colors mt-4 flex items-center justify-center gap-1.5 tracking-[0.1em] uppercase">
                        Yeni Adres Ekle <ExternalLink className="h-3 w-3" strokeWidth={1} />
                      </button>
                    </div>
                  </div>
                  <div className="px-6 py-4 border-t border-border mt-auto space-y-2">
                    <button className="w-full flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors py-3 rounded-full bg-secondary/50">
                      <Settings className="h-4 w-4" strokeWidth={1.5} />
                      Hesap Ayarları
                    </button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
      {isMenuOpen && (
        <div className="lg:hidden border-t border-border bg-background">
          <nav className="flex flex-col p-6 gap-6">
            {navbarCats.map((cat) => (
              <a key={cat} href="#" className="text-sm text-muted-foreground hover:text-foreground" onClick={() => setIsMenuOpen(false)}>{cat}</a>
            ))}
          </nav>
        </div>
      )}
    </header>
  )
}

/* ================================================================
   HERO BANNER
   ================================================================ */
function HeroBanner() {
  return (
    <section className="relative bg-background overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-secondary via-background to-secondary/50" />
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-1/4 w-64 h-64 bg-accent/5 rounded-full blur-3xl" />
      </div>
      <div className="relative max-w-[1800px] mx-auto px-6 lg:px-12">
        <div className="pt-16 pb-16 lg:pt-24 lg:pb-20">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-3 mb-6 px-5 py-2 rounded-full bg-secondary/50 backdrop-blur-sm border border-border">
              <Sparkles className="h-3.5 w-3.5 text-accent" strokeWidth={1.5} />
              <span className="text-[10px] tracking-[0.4em] text-muted-foreground uppercase">Yapay Zeka Destekli</span>
            </div>
            <h1 className="font-serif text-5xl lg:text-8xl text-foreground tracking-tight leading-none mb-8 font-light">
              Alışverişte Gerçeği<br /><span className="italic">Keşfet</span>
            </h1>
            <p className="text-lg lg:text-xl text-muted-foreground max-w-xl mx-auto mb-12 leading-relaxed font-light">
              Her ürünün gerçek yüzünü kullanıcı yorumları ve AI analiziyle ortaya çıkar.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button size="lg" className="bg-foreground text-background hover:bg-foreground/90 px-12 h-14 text-[13px] tracking-[0.15em] group rounded-full">
                Keşfet <ArrowRight className="h-4 w-4 ml-3 group-hover:translate-x-1 transition-transform" strokeWidth={1.5} />
              </Button>
              <Button size="lg" variant="outline" className="border-foreground/20 text-foreground hover:bg-secondary px-10 h-14 text-[13px] tracking-[0.15em] rounded-full">
                <Play className="h-4 w-4 mr-2" strokeWidth={1.5} /> Nasıl Çalışır
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ================================================================
   TRUST BAR
   ================================================================ */
function TrustBar() {
  return (
    <div className="bg-secondary/50 border-y border-border">
      <div className="max-w-[1800px] mx-auto px-6 lg:px-12 flex items-center justify-center lg:justify-between flex-wrap gap-8 py-8">
        {[
          { icon: <Truck className="h-4 w-4" strokeWidth={1.5} />, label: "500 TL üzeri ücretsiz kargo" },
          { icon: <Award className="h-4 w-4" strokeWidth={1.5} />, label: "AI Doğrulama · Gerçeklik Analizi" },
          { icon: <Shield className="h-4 w-4" strokeWidth={1.5} />, label: "256-bit SSL Güvenli Ödeme" },
        ].map((item, i) => (
          <div key={i} className="flex items-center gap-3 text-sm text-muted-foreground">
            {item.icon}<span className="text-[12px] tracking-[0.1em] uppercase">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ================================================================
   STAR RATING
   ================================================================ */
function StarRating({ rating, size = "default" }: { rating: number; size?: "default" | "large" | "small" }) {
  const starSize = size === "large" ? "h-5 w-5" : size === "small" ? "h-3 w-3" : "h-3.5 w-3.5"
  return (
    <div className="flex items-center gap-0.5">
      {[...Array(5)].map((_, i) => (
        <Star key={i} className={`${starSize} ${i < Math.floor(rating) ? "fill-accent text-accent" : i < rating ? "fill-accent/50 text-accent" : "text-border"}`} strokeWidth={1} />
      ))}
    </div>
  )
}

/* ================================================================
   PRODUCT CARD
   ================================================================ */
function ProductCard({ product, onClick, featured = false }: { product: Product; onClick: () => void; featured?: boolean }) {
  const discount = product.price > 0 && product.originalPrice > product.price
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0
  return (
    <div className={`group cursor-pointer ${featured ? 'col-span-2 row-span-2' : ''}`} onClick={onClick}>
      <div className={`relative ${featured ? 'aspect-[4/5]' : 'aspect-[3/4]'} bg-secondary overflow-hidden mb-6 rounded-3xl`}>
        <img src={product.image} alt={product.title} className="absolute inset-0 w-full h-full object-cover image-zoom"
          onError={(e) => { const t = e.target as HTMLImageElement; t.style.display = 'none' }} />
        <div className="absolute top-5 left-5">
          <span className="text-[10px] tracking-[0.2em] text-background bg-foreground px-4 py-2 rounded-full uppercase font-medium">Save {discount}%</span>
        </div>
        <div className="absolute top-5 right-5 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-x-2 group-hover:translate-x-0">
          <button className="h-11 w-11 flex items-center justify-center bg-background/95 backdrop-blur-sm hover:bg-foreground hover:text-background transition-colors duration-300 rounded-full shadow-soft" onClick={(e) => e.stopPropagation()}><Heart className="h-4 w-4" strokeWidth={1.5} /></button>
          <button className="h-11 w-11 flex items-center justify-center bg-background/95 backdrop-blur-sm hover:bg-foreground hover:text-background transition-colors duration-300 rounded-full shadow-soft" onClick={(e) => e.stopPropagation()}><ShoppingCart className="h-4 w-4" strokeWidth={1.5} /></button>
        </div>
        <div className="absolute inset-x-5 bottom-5 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-2 group-hover:translate-y-0">
          <Button variant="secondary" size="sm" className="w-full bg-background text-foreground hover:bg-background/90 text-[11px] tracking-[0.15em] uppercase h-12 rounded-full shadow-soft">Hızlı Bakış</Button>
        </div>
      </div>
      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <p className="text-[10px] tracking-[0.25em] text-muted-foreground uppercase">{product.brand}</p>
          <div className="flex items-center gap-1.5"><StarRating rating={product.rating} size="small" /><span className="text-[10px] text-muted-foreground">({formatNumber(product.reviewCount)})</span></div>
        </div>
        <h3 className={`${featured ? 'text-lg' : 'text-sm'} text-foreground leading-snug group-hover:text-accent transition-colors duration-300`}>{product.title}</h3>
        <div className="flex items-baseline gap-3 pt-1">
          <span className={`${featured ? 'text-xl' : 'text-base'} font-medium text-foreground`}>
            {product.price > 0 ? formatPrice(product.price) + ' TL' : '—'}
          </span>
          {product.price > 0 && product.originalPrice > product.price && (
            <span className="text-sm text-muted-foreground line-through line-through-animated">{formatPrice(product.originalPrice)} TL</span>
          )}
        </div>
      </div>
    </div>
  )
}

/* ================================================================
   MAGAZINE REVIEW CARD
   ================================================================ */
function MagazineReviewCard({ review, variant = "default" }: { review: Review; variant?: "featured" | "default" | "compact" }) {
  if (variant === "featured") {
    return (
      <div className="col-span-full lg:col-span-2 row-span-2 bg-foreground text-background p-10 lg:p-14 flex flex-col rounded-[2.5rem] shadow-soft-lg">
        <div className="flex items-center gap-4 mb-8">
          <div className="h-16 w-16 rounded-full bg-gradient-to-br from-accent/30 to-accent/10 flex items-center justify-center"><span className="text-xl font-serif text-background">{review.author.charAt(0)}</span></div>
          <div>
            <p className="text-base text-background font-medium">{review.author}</p>
            <div className="flex items-center gap-3 mt-1">
              <span className="text-sm text-background/60">{review.location}</span>
              {review.verified && <span className="flex items-center gap-1.5 text-xs text-accent bg-accent/10 px-3 py-1 rounded-full"><Check className="h-3 w-3" strokeWidth={2} />Doğrulanmış</span>}
            </div>
          </div>
        </div>
        <div className="flex-1">
          <div className="mb-6"><StarRating rating={review.rating} size="large" /></div>
          {review.title && <h4 className="font-serif text-2xl lg:text-3xl text-background leading-tight mb-6">&ldquo;{review.title}&rdquo;</h4>}
          <p className="text-lg text-background/80 leading-relaxed">{review.comment}</p>
          {review.images && review.images.length > 0 && (
            <div className="flex gap-2 mt-4 overflow-x-auto">
              {review.images.map((img, i) => <img key={i} src={img.imageUrl} className="w-16 h-16 rounded-xl object-cover border border-background/20 flex-shrink-0" />)}
            </div>
          )}
        </div>
        <div className="flex items-center justify-between pt-8 mt-8 border-t border-background/10">
          <span className="text-sm text-background/50">{review.date}</span>
          <button className="flex items-center gap-2 text-sm text-background/60 hover:text-background transition-colors bg-background/10 px-4 py-2 rounded-full"><ThumbsUp className="h-4 w-4" strokeWidth={1.5} />Faydalı ({review.helpful})</button>
        </div>
      </div>
    )
  }
  if (variant === "compact") {
    return (
      <div className="bg-secondary/50 p-6 rounded-2xl hover:bg-secondary/70 transition-colors">
        <div className="flex items-start gap-4">
          <div className="h-12 w-12 rounded-full bg-gradient-to-br from-muted to-border flex-shrink-0 flex items-center justify-center"><span className="text-sm text-muted-foreground font-medium">{review.author.charAt(0)}</span></div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2 mb-2"><p className="text-sm font-medium text-foreground truncate">{review.author}</p><StarRating rating={review.rating} size="small" /></div>
            <p className="text-sm text-muted-foreground line-clamp-2">{review.comment}</p>
            {review.images && review.images.length > 0 && (
              <div className="flex gap-1.5 mt-2 overflow-x-auto">{review.images.slice(0,2).map((img, i) => <img key={i} src={img.imageUrl} className="w-10 h-10 rounded-lg object-cover flex-shrink-0" />)}</div>
            )}
          </div>
        </div>
      </div>
    )
  }
  return (
    <div className="bg-secondary/50 p-8 flex flex-col rounded-3xl hover:shadow-soft transition-all">
      <div className="flex items-center justify-between mb-6"><StarRating rating={review.rating} />{review.verified && <span className="flex items-center gap-1.5 text-[10px] tracking-[0.1em] text-accent uppercase bg-accent/10 px-3 py-1.5 rounded-full"><Check className="h-3 w-3" strokeWidth={2} />Doğrulanmış</span>}</div>
      {review.title && <h4 className="font-serif text-lg text-foreground mb-4 leading-snug">{review.title}</h4>}
      <p className="text-sm text-muted-foreground leading-relaxed flex-1 mb-6">{review.comment}</p>
      {review.images && review.images.length > 0 && (
        <div className="flex gap-2 mb-4 overflow-x-auto">{review.images.map((img, i) => <img key={i} src={img.imageUrl} className="w-16 h-16 rounded-xl object-cover border border-border/30 flex-shrink-0 cursor-pointer hover:opacity-80" onClick={() => window.open(img.imageUrl, '_blank')} />)}</div>
      )}
      <div className="flex items-center justify-between pt-6 border-t border-border/50">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-muted to-border flex items-center justify-center"><span className="text-xs text-muted-foreground font-medium">{review.author.charAt(0)}</span></div>
          <div><p className="text-sm text-foreground">{review.author}</p><p className="text-[10px] text-muted-foreground">{review.location} - {review.date}</p></div>
        </div>
        <button className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors bg-secondary px-3 py-2 rounded-full"><ThumbsUp className="h-3 w-3" strokeWidth={1.5} />{review.helpful}</button>
      </div>
    </div>
  )
}

/* ================================================================
   RATING BREAKDOWN
   ================================================================ */
function RatingBreakdown({ reviews, rating, reviewCount }: { reviews: Review[]; rating: number; reviewCount: number }) {
  const ratingCounts = [5,4,3,2,1].map(star => ({ star, count: reviews.filter(r => Math.floor(r.rating) === star).length, percentage: (reviews.filter(r => Math.floor(r.rating) === star).length / Math.max(reviews.length,1)) * 100 }))
  return (
    <div className="bg-secondary/50 p-8 lg:p-10 mb-8 rounded-[2rem]">
      <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
        <div className="text-center"><div className="font-serif text-5xl text-foreground mb-2">{isNaN(rating) ? '—' : rating.toFixed(1)}</div><StarRating rating={rating} size="large" /><p className="text-sm text-muted-foreground mt-2">{formatNumber(reviewCount)} değerlendirme</p></div>
        <div className="flex-1 space-y-2.5">
          {ratingCounts.map(({ star, count, percentage }) => (
            <div key={star} className="flex items-center gap-3"><span className="text-sm text-muted-foreground w-4">{star}</span><div className="flex-1 h-2 bg-muted overflow-hidden rounded-full"><div className="h-full bg-accent transition-all duration-700 rounded-full" style={{ width: `${percentage}%` }} /></div><span className="text-sm text-muted-foreground w-10 text-right">{count}</span></div>
          ))}
        </div>
      </div>
    </div>
  )
}

/* ================================================================
   CUSTOMER REVIEWS
   ================================================================ */
function CustomerReviews({ reviews, rating, reviewCount, showOnlyWithImages, setShowOnlyWithImages }: { reviews: Review[]; rating: number; reviewCount: number; showOnlyWithImages: boolean; setShowOnlyWithImages: (v: boolean) => void }) {
  const [showAll, setShowAll] = useState(false)
  const filtered = showOnlyWithImages ? reviews.filter(r => r.images && r.images.length > 0) : reviews
  const visibleCount = showAll ? filtered.length : Math.min(filtered.length, 12)
  const visibleReviews = filtered.slice(0, visibleCount)
  const featuredReview = visibleReviews.find(r => r.rating >= 5 && r.comment.length > 30) || visibleReviews[0]
  const otherReviews = visibleReviews.filter(r => r.id !== featuredReview?.id)
  const noResult = showOnlyWithImages && filtered.length === 0
  const imageCount = reviews.filter(r => r.images && r.images.length > 0).length

  return (
    <div className="mt-24">
      <div className="flex items-end justify-between mb-12">
        <div>
          <span className="text-[10px] tracking-[0.4em] text-accent uppercase mb-4 block font-medium">Müşteri Deneyimleri</span>
          <h2 className="font-serif text-3xl text-foreground font-light">Yorumlar Ne Diyor</h2>
        </div>
        <div className="flex items-center gap-3">
          <Button variant={showOnlyWithImages ? "default" : "outline"} size="sm" onClick={() => setShowOnlyWithImages(!showOnlyWithImages)} className="text-[11px] tracking-[0.1em] uppercase rounded-full px-5">
            📸 Fotoğraflı ({imageCount})
          </Button>
          <span className="text-sm text-muted-foreground">{formatNumber(reviewCount)} yorum</span>
        </div>
      </div>
      <RatingBreakdown reviews={reviews} rating={rating} reviewCount={reviewCount} />
      {noResult ? (
        <div className="text-center py-16 text-muted-foreground">
          <p className="text-sm">Bu ürün için fotoğraflı yorum bulunamadı.</p>
          <button className="text-accent text-sm mt-3 hover-underline" onClick={() => setShowOnlyWithImages(false)}>Tüm yorumları göster</button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
            {featuredReview && <MagazineReviewCard review={featuredReview} variant="featured" />}
            {otherReviews.slice(0, 3).map(review => <MagazineReviewCard key={review.id} review={review} variant="compact" />)}
          </div>
          {otherReviews.length > 3 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-10">
              {otherReviews.slice(3).map(review => <MagazineReviewCard key={review.id} review={review} variant="default" />)}
            </div>
          )}
          {filtered.length > 12 && (
            <div className="text-center mt-8">
              <Button variant="outline" onClick={() => setShowAll(!showAll)} className="border-foreground text-foreground hover:bg-foreground hover:text-background h-14 px-12 text-[13px] tracking-[0.15em] font-normal rounded-full">
                {showAll ? 'Daha Az Göster' : `Tüm ${filtered.length} Yorumu Göster`}
                <ChevronRight className={`h-4 w-4 ml-2 transition-transform ${showAll ? 'rotate-90' : ''}`} strokeWidth={1.5} />
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  )
}

/* ================================================================
   REALITY SCORE CIRCLE
   ================================================================ */
function RealityScoreCircle({ score }: { score: number }) {
  const circumference = 2 * Math.PI * 45
  const strokeDashoffset = circumference - (score / 100) * circumference
  return (
    <div className="relative inline-flex items-center justify-center">
      <svg className="w-32 h-32 -rotate-90">
        <circle cx="64" cy="64" r="45" stroke="currentColor" strokeWidth="1" fill="none" className="text-border" />
        <circle cx="64" cy="64" r="45" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" className="text-accent"
          style={{ strokeDasharray: circumference, strokeDashoffset, transition: "stroke-dashoffset 1s cubic-bezier(0.16, 1, 0.3, 1)" }} />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-serif text-4xl text-foreground">{score}</span>
        <span className="text-[9px] tracking-[0.3em] text-muted-foreground uppercase mt-1">Reality</span>
      </div>
    </div>
  )
}

function SentimentBadge({ score }: { score: number }) {
  if (score >= 75) return <span className="text-xs font-semibold text-emerald-400">● ÇOK İYİ</span>
  if (score >= 50) return <span className="text-xs font-semibold text-amber-400">● ORTA</span>
  return <span className="text-xs font-semibold text-rose-400">● DİKKATLİ OL</span>
}

/* ================================================================
   PRODUCT DETAIL PAGE — MAISON layout + SmartCart functionality
   ================================================================ */
function ProductDetailPage({ product, onBack, onProductChange }: { product: Product; onBack: () => void; onProductChange?: (productId: number) => void }) {
  const [selectedSize, setSelectedSize] = useState<string | null>(null)
  const [selectedColor, setSelectedColor] = useState<string | null>(product.colors?.[0] || null)
  const [aiMessage, setAiMessage] = useState("")
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [matchScore, setMatchScore] = useState<number | null>(null)
  const [selectedImage, setSelectedImage] = useState(0)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [liveProduct, setLiveProduct] = useState<Product | null>(null)
  const [liveReviews, setLiveReviews] = useState<Review[]>([])
  const [showOnlyWithImages, setShowOnlyWithImages] = useState(false)

  // Fetch live data from backend
  useEffect(() => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"
    fetch(`${apiUrl}/api/products/${product.id}`)
      .then(r => r.json())
      .then((data: any) => {
        const rawPrice = typeof data.price === 'number' ? data.price : parseFloat(data.price) || product.price
        const price = rawPrice > 0 ? rawPrice : product.price
        const reviews = data.reviews || []
        const rating = reviews.length > 0
          ? Math.round((reviews.reduce((s: number, r: any) => s + (r.rating || 5), 0) / reviews.length) * 10) / 10
          : product.rating
        setLiveProduct({
          ...product,
          image: data.imageUrls?.[0] || data.imageUrl?.split(',')[0] || product.image,
          imageUrls: data.imageUrls || (data.imageUrl ? data.imageUrl.split(',').map((u: string) => u.trim()) : product.imageUrls),
          price,
          originalPrice: price > 0 ? Math.round(price * 1.30) : product.originalPrice,
          rating,
          reviewCount: reviews.length || product.reviewCount,
          material: data.specs?.find((s: any) => ['kumas','malzeme','material','kumaş'].includes((s.specKey||'').toLowerCase()))?.specValue || product.material || "",
          dimensions: data.specs?.filter((s: any) => (s.specKey||'').match(/(boyut|cm|olcu|ölçü|ebat|genislik|yukseklik|derinlik)/)).map((s: any) => `${s.specKey}: ${s.specValue}`).join(' — ') || product.dimensions || "",
          sizes: data.specs?.find((s: any) => s.specKey === 'beden_tablosu' || s.specKey === 'numaralar' || s.specKey === 'bedenler')?.specValue?.split(/[-,\s]+/).filter((s: string) => s.trim().length > 0) || product.sizes,
          colors: data.specs?.find((s: any) => s.specKey === 'renkler')?.specValue?.split(' ').filter((s: string) => s.trim().length > 0) || product.colors,
          specs: (data.specs || []).map((s: any) => ({ specKey: s.specKey || s.key || '', specValue: s.specValue || s.value || '' })),
          description: data.description || product.description || "",
        })
        const apiReviews = reviews
        setLiveReviews(
          apiReviews.length > 0
            ? apiReviews.slice(0, 200).map((r: any, i: number) => ({
                id: r.id || i, author: r.username || r.userName || 'Kullanıcı', rating: r.rating || 5,
                date: r.date ? new Date(r.date).toLocaleDateString('tr-TR') : "",
                comment: r.comment || '', helpful: r.helpfulCount || Math.floor(Math.random() * 50),
                verified: r.trusted !== false, title: r.comment?.length > 40 ? r.comment.substring(0, 40) + '...' : r.comment,
                location: '',
                images: (r.images || []).map((img: any) => ({ id: img.id || Math.random(), imageUrl: img.imageUrl || img.originalUrl || '', caption: img.caption || 'Kullanıcı fotoğrafı' })).filter((img: any) => img.imageUrl),
              }))
            : product.reviews
        )
      }).catch(() => { setLiveProduct(null); setLiveReviews([]) })
  }, [product.id])

  const displayProduct = liveProduct || product
  const displayImages = displayProduct.imageUrls && displayProduct.imageUrls.length > 0 ? displayProduct.imageUrls : [displayProduct.image]
  const displayReviews = liveReviews.length > 0 ? liveReviews : product.reviews
  const rawDiscount = displayProduct.price > 0 && displayProduct.originalPrice > displayProduct.price
    ? Math.round(((displayProduct.originalPrice - displayProduct.price) / displayProduct.originalPrice) * 100)
    : 0
  const sizeLabel = displayProduct.category === "giyim" || displayProduct.category === "outdoor"
    ? "Beden"
    : displayProduct.category === "elektronik" && displayProduct.sizes
    ? "Depolama"
    : displayProduct.sizes ? "Numara" : null

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }) }, [messages])

  const sendMessage = async (message: string) => {
    if (!message.trim() || isLoading) return
    setError(null); setIsLoading(true); setAiMessage("")
    const userMsg: ChatMessage = { role: "user", content: message }
    setMessages(prev => [...prev, userMsg])
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"
      const response = await fetch(`${apiUrl}/api/chat`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: product.id, message, history: messages.map(m => `${m.role}: ${m.content}`) }),
      })
      if (!response.ok) { const ed = await response.json().catch(() => ({})); throw new Error(ed.error || "Bir hata oluştu") }
      const data: BackendChatResponse = await response.json()
      setMatchScore(data.matchScore)
      setMessages(prev => [...prev, { role: "assistant", content: data.reply, data }])
    } catch (e) { setError(e instanceof Error ? e.message : "Bağlantı hatası") }
    finally { setIsLoading(false) }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => { if (e.key === "Enter") sendMessage(aiMessage) }

  return (
    <main className="max-w-[1800px] mx-auto px-6 lg:px-8 py-8 lg:py-16">
      <button className="mb-10 text-[13px] text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-3 group tracking-[0.1em] uppercase bg-secondary/50 px-5 py-3 rounded-full" onClick={onBack}>
        <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" strokeWidth={1.5} /> Koleksiyona Dön
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10">
        {/* SOL — Görseller */}
        <div className="lg:col-span-4">
          <div className="sticky top-24">
            {/* Ana resim */}
            <div className="aspect-[3/4] max-h-[50vh] bg-secondary overflow-hidden relative group rounded-[2rem] mx-auto">
              <img src={displayImages[selectedImage]} alt={displayProduct.title}
                className="absolute inset-0 w-full h-full object-cover"
                onError={(e) => { const t = e.target as HTMLImageElement; t.src = displayProduct.image }} />
              <img key={selectedImage} src={displayImages[selectedImage]} alt={displayProduct.title}
                className="absolute inset-0 w-full h-full object-cover"
                style={{ animation: 'imageFadeIn 0.6s ease-out forwards', opacity: 0 }}
                onError={(e) => { const t = e.target as HTMLImageElement; t.src = displayProduct.image }} />
                {selectedImage > 0 && (
                  <button onClick={(e) => { e.stopPropagation(); setSelectedImage(selectedImage - 1) }}
                    className="absolute left-3 top-1/2 -translate-y-1/2 h-10 w-10 flex items-center justify-center bg-background/70 backdrop-blur-md hover:bg-background/90 rounded-full shadow-soft opacity-0 group-hover:opacity-100 transition-all duration-300">
                    <ChevronRight className="h-5 w-5 rotate-180 text-foreground" strokeWidth={1} />
                  </button>
                )}
                {selectedImage < displayImages.length - 1 && (
                  <button onClick={(e) => { e.stopPropagation(); setSelectedImage(selectedImage + 1) }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 h-10 w-10 flex items-center justify-center bg-background/70 backdrop-blur-md hover:bg-background/90 rounded-full shadow-soft opacity-0 group-hover:opacity-100 transition-all duration-300">
                    <ChevronRight className="h-5 w-5 text-foreground" strokeWidth={1} />
                  </button>
                )}
                {displayImages.length > 1 && (
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 px-3 py-1.5 rounded-full bg-background/50 backdrop-blur-md opacity-0 group-hover:opacity-100 transition-all duration-300">
                    {displayImages.map((_, i) => (
                      <button key={i} onClick={(e) => { e.stopPropagation(); setSelectedImage(i) }}
                        className={`rounded-full transition-all duration-300 ${i === selectedImage ? 'w-5 h-1.5 bg-foreground' : 'w-1.5 h-1.5 bg-foreground/40 hover:bg-foreground/60'}`} />
                    ))}
                  </div>
                )}
              <div className="absolute top-6 left-6"><span className="text-[10px] tracking-[0.2em] text-background bg-foreground px-5 py-2.5 rounded-full uppercase font-medium">%{rawDiscount}</span></div>
              <button className="absolute top-6 right-6 h-12 w-12 flex items-center justify-center bg-background/95 backdrop-blur-sm hover:bg-foreground hover:text-background transition-all duration-300 rounded-full shadow-soft"><Heart className="h-4 w-4" strokeWidth={1.5} /></button>
            </div>

            {/* Küçük resimler — ana resimle aynı genişlikte */}
            <div className="grid grid-cols-3 gap-2 mt-3 mx-auto" style={{ maxWidth: 'calc(50vh * 3/4)' }}>
              {displayImages.map((url, i) => (
                <div key={i}
                  className={`aspect-square bg-secondary overflow-hidden cursor-pointer transition-all duration-300 rounded-xl ${i === selectedImage ? "ring-2 ring-foreground ring-offset-1" : "opacity-60 hover:opacity-100"}`}
                  onClick={() => setSelectedImage(i)}>
                  <img src={`${url.split('?')[0]}?w=150`} alt="" className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* SAĞ — Ürün Bilgi + AI */}
        <div className="lg:col-span-8">
          <div className="w-full">
            <div className="flex items-center gap-2 text-[11px] tracking-[0.15em] text-muted-foreground uppercase mb-6">
              <span>{categoryLabels[displayProduct.category]}</span><ChevronRight className="h-3 w-3" strokeWidth={1} /><span>{displayProduct.brand}</span>
            </div>
            <h1 className="font-serif text-3xl lg:text-4xl text-foreground leading-tight mb-4 font-light">{displayProduct.title}</h1>
            <div className="flex items-center gap-4 mb-8"><StarRating rating={displayProduct.rating} size="large" />
              <span className="text-sm text-muted-foreground">{isNaN(displayProduct.rating) ? '—' : displayProduct.rating.toFixed(1)} ({formatNumber(displayProduct.reviewCount)} değerlendirme)</span></div>
            <div className="flex items-baseline gap-4 pb-8 border-b border-border">
              <span className="text-3xl text-foreground font-light">
                {displayProduct.price > 0 ? formatPrice(displayProduct.price) + ' TL' : 'Fiyat bilgisi yok'}
              </span>
              {displayProduct.price > 0 && displayProduct.originalPrice > displayProduct.price && (
                <>
                  <span className="text-lg text-muted-foreground line-through">{formatPrice(displayProduct.originalPrice)} TL</span>
                  <Badge className="bg-accent/10 text-accent border-0 text-[10px] tracking-[0.1em] uppercase px-4 py-1.5 rounded-full">%{rawDiscount} indirim</Badge>
                </>
              )}
            </div>
            {displayProduct.sizes && sizeLabel && (
              <div className="py-8 border-b border-border">
                <div className="flex items-center justify-between mb-5"><p className="text-[11px] tracking-[0.2em] text-muted-foreground uppercase">{sizeLabel}</p></div>
                <div className="flex flex-wrap gap-2">
                  {displayProduct.sizes.map((size) => (
                    <button key={size} className={`min-w-[60px] h-12 px-5 text-sm transition-all duration-300 rounded-full ${selectedSize === size ? "bg-foreground text-background" : "bg-secondary text-foreground hover:bg-muted"}`} onClick={() => setSelectedSize(size)}>{size}</button>
                  ))}
                </div>
              </div>
            )}
            {displayProduct.colors && (
              <div className="py-8 border-b border-border">
                <p className="text-[11px] tracking-[0.2em] text-muted-foreground uppercase mb-5">Renk: <span className="text-foreground">{selectedColor}</span></p>
                <div className="flex flex-wrap gap-3">
                  {displayProduct.colors.map((color) => (
                    <button key={color} className={`px-6 py-3 text-sm transition-all duration-300 rounded-full ${selectedColor === color ? "bg-foreground text-background" : "bg-secondary text-foreground hover:bg-muted"}`} onClick={() => setSelectedColor(color)}>{color}</button>
                  ))}
                </div>
              </div>
            )}
            <div className="pt-8 space-y-4">
              <Button size="lg" className="w-full bg-foreground text-background hover:bg-foreground/90 h-14 text-sm tracking-[0.1em] group rounded-full">
                Sepete Ekle <span className="ml-auto text-background/60 font-light">{formatPrice(displayProduct.price)} TL</span>
              </Button>
              <Button size="lg" variant="outline" className="w-full border-border text-foreground hover:bg-secondary h-14 text-sm rounded-full"><Heart className="h-4 w-4 mr-2" strokeWidth={1.5} />Favorilere Ekle</Button>
            </div>

            {/* Ürün Detay Accordion */}
            <div className="mt-8 border-t border-border pt-8 space-y-4">
              <details className="group border-b border-border/50 pb-4">
                <summary className="flex items-center justify-between cursor-pointer text-[13px] text-foreground font-medium tracking-[0.05em] list-none"><span>Ürün Detayları</span><ChevronRight className="h-4 w-4 text-muted-foreground group-open:rotate-90 transition-transform" strokeWidth={1} /></summary>
                <div className="mt-3 space-y-2 text-sm text-muted-foreground">
                  {displayProduct.description && (
                    <div className="mb-4 text-sm text-muted-foreground leading-relaxed italic border-l-2 border-accent/30 pl-4" dangerouslySetInnerHTML={{ __html: displayProduct.description }} />
                  )}
                  {displayProduct.specs && displayProduct.specs.length > 0 ? (
                    displayProduct.specs.map((spec, i) => (
                      <div key={i} className="flex items-start justify-between py-1.5 border-b border-border/20 last:border-0">
                        <span className="text-foreground/80 font-medium text-xs w-1/3 pr-2">{spec.specKey}</span>
                        <span className="text-right text-xs w-2/3">{spec.specValue}</span>
                      </div>
                    ))
                  ) : (
                    <>
                      {displayProduct.material && <p><span className="text-foreground">Malzeme:</span> {displayProduct.material}</p>}
                      {displayProduct.dimensions && <p><span className="text-foreground">Ölçüler:</span> {displayProduct.dimensions}</p>}
                      <p><span className="text-foreground">Kategori:</span> {categoryLabels[displayProduct.category]}</p>
                      <p><span className="text-foreground">Marka:</span> {displayProduct.brand}</p>
                    </>
                  )}
                </div>
              </details>
              <details className="group border-b border-border/50 pb-4">
                <summary className="flex items-center justify-between cursor-pointer text-[13px] text-foreground font-medium tracking-[0.05em] list-none"><span>Kargo & İade</span><ChevronRight className="h-4 w-4 text-muted-foreground group-open:rotate-90 transition-transform" strokeWidth={1} /></summary>
                <p className="mt-3 text-sm text-muted-foreground leading-relaxed">500 TL üzeri ücretsiz kargo. 14 gün içinde ücretsiz iade.</p>
              </details>
            </div>

            {/* Satıcı */}
            <div className="mt-8 bg-secondary/50 p-6 rounded-2xl flex items-center gap-4">
              <div className="h-12 w-12 rounded-full bg-gradient-to-br from-muted to-border flex items-center justify-center"><Store className="h-5 w-5 text-muted-foreground" strokeWidth={1.5} /></div>
              <div className="flex-1"><p className="text-sm text-foreground font-medium">{displayProduct.seller.name}</p><p className="text-xs text-muted-foreground">Satıcı Puanı: {displayProduct.seller.rating}</p></div>
            </div>

            {/* AI Panel — Maison Chat */}
            <div className="mt-3">
              <MaisonChat
                products={[]}
                initialProductId={product.id}
                initialProductName={displayProduct.title}
                initialSellerName={displayProduct.seller.name}
                initialProductImage={displayImages[0]}
                apiUrl={process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"}
                onProductNavigate={onProductChange}
              />
            </div>
          </div>
        </div>
      </div>

      {/* YORUMLAR — tam genişlik */}
      <CustomerReviews reviews={displayReviews} rating={displayProduct.rating} reviewCount={displayProduct.reviewCount} showOnlyWithImages={showOnlyWithImages} setShowOnlyWithImages={setShowOnlyWithImages} />
    </main>
  )
}

/* ================================================================
   HOME PAGE
   ================================================================ */
function HomePage({ onProductClick, recommendations, products }: { onProductClick: (p: Product) => void; recommendations: { product: Product; why: string }[]; products: Product[] }) {
  const productsByCategory = products.reduce((acc, product) => {
    if (!acc[product.category]) acc[product.category] = []
    acc[product.category].push(product)
    return acc
  }, {} as Record<ProductCategory, Product[]>)

  return (
    <main>
      <HeroBanner />
      <TrustBar />
      <section className="max-w-[1800px] mx-auto px-6 lg:px-12 py-24 lg:py-32">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-16">
          <div>
            <span className="text-[10px] tracking-[0.4em] text-accent uppercase mb-4 block font-medium">Seçilmiş Koleksiyon</span>
            <h2 className="font-serif text-4xl lg:text-5xl text-foreground font-light">Haftanın Seçkisi</h2>
          </div>
          <button className="text-[13px] text-muted-foreground hover:text-foreground transition-colors flex items-center gap-3 group tracking-[0.1em] uppercase">Tüm Ürünler<ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" strokeWidth={1} /></button>
        </div>
        {(Object.keys(categoryLabels) as ProductCategory[]).map((category, catIndex) => (
          <div key={category} className="mb-24 last:mb-0">
            <div className="flex items-center gap-6 mb-10">
              <span className="text-[11px] tracking-[0.3em] text-accent uppercase font-medium">0{catIndex + 1}</span>
              <h3 className="text-xl tracking-[0.05em] text-foreground font-light">{categoryLabels[category]}</h3>
              <div className="flex-1 h-px bg-border" />
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12">
              {productsByCategory[category]?.map((product, index) => (
                <ProductCard key={product.id} product={product} onClick={() => onProductClick(product)} featured={index === 0 && catIndex === 0} />
              ))}
            </div>
          </div>
        ))}
        {recommendations.length > 0 && (
          <div className="mt-32">
            <div className="flex items-center gap-6 mb-10">
              <span className="text-[11px] tracking-[0.3em] text-accent uppercase font-medium">✦</span>
              <h3 className="text-xl tracking-[0.05em] text-foreground font-light">Senin İçin Öneriler</h3>
              <div className="flex-1 h-px bg-border" />
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12">
              {recommendations.map(({ product }) => <ProductCard key={product.id} product={product} onClick={() => onProductClick(product)} />)}
            </div>
          </div>
        )}
      </section>
    </main>
  )
}

/* ================================================================
   MAIN ECOMMERCE PAGE
   ================================================================ */
export default function EcommercePage() {
  const [currentView, setCurrentView] = useState<"home" | "product">("home")
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [recommendations, setRecommendations] = useState<{ product: Product; why: string }[]>([])
  const [viewedIds, setViewedIds] = useState<number[]>([])
  const [products, setProducts] = useState<Product[]>(FALLBACK_PRODUCTS)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL
    if (!apiUrl || apiUrl === "http://localhost:8080") return
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 4000)
    fetch(`${apiUrl}/api/products`, { signal: controller.signal })
      .then(r => { if (!r.ok) throw new Error("API error"); return r.json() })
      .then(data => {
        clearTimeout(timeout)
        const mapped = (data as any[]).map((p: any) => {
          const rawPrice = typeof p.price === 'number' ? p.price : parseFloat(p.price) || 0
          const reviews = p.reviews || []
          const rawRating = reviews.length > 0
            ? reviews.reduce((s: number, r: any) => s + (r.rating || 5), 0) / reviews.length
            : (p.averageRating || 4.5)
          const rating = Math.round(rawRating * 10) / 10
          const price = rawPrice > 0 ? rawPrice : 0
          const originalPrice = price > 0 ? Math.round(price * 1.30) : 0
          return {
            id: p.id, category: categoryFromBackend[p.category] || "giyim", brand: p.brand || "",
            title: p.name || p.title || "", price, originalPrice,
            rating, reviewCount: reviews.length || p.reviewCount || 0,
            image: p.primaryImageUrl || (p.imageUrl ? p.imageUrl.split(',')[0].trim() : ""),
            imageUrls: p.imageUrls || (p.imageUrl ? p.imageUrl.split(',').map((u: string) => u.trim()).filter(Boolean) : []),
            sizes: (p.category === 'GIYIM' || p.category === 'OUTDOOR') ? ['S','M','L','XL'] : undefined,
            colors: ['Varsayılan'],
            material: p.specs?.find((s: any) => ['kumas','malzeme','material','kumaş'].includes((s.specKey||'').toLowerCase()))?.specValue || "",
            dimensions: p.specs?.filter((s: any) => (s.specKey||'').match(/(boyut|cm|olcu|ölçü|ebat|genislik|yukseklik|derinlik)/)).map((s: any) => `${s.specKey}: ${s.specValue}`).join(' — ') || "",
            specs: (p.specs || []).map((s: any) => ({ specKey: s.specKey || s.key || '', specValue: s.specValue || s.value || '' })),
            description: p.description || "",
            seller: { name: p.sellerName || p.brand || "Satıcı", rating: 9.5 },
            reviews: reviews.slice(0, 50).map((r: any, i: number) => ({
              id: r.id || i, author: r.username || r.userName || "Kullanıcı", rating: r.rating || 5,
              date: r.date ? new Date(r.date).toLocaleDateString('tr-TR') : "",
              comment: r.comment || "", helpful: r.helpfulCount || Math.floor(Math.random() * 80),
              verified: r.trusted !== false, title: r.comment?.length > 40 ? r.comment.substring(0, 40) + '...' : r.comment,
              location: "",
              images: (r.images || []).map((img: any) => ({ id: img.id || Math.random(), imageUrl: img.imageUrl || img.originalUrl || "", caption: img.caption || "Kullanıcı fotoğrafı" })).filter((img: any) => img.imageUrl),
            })),
          }
        })
        if (mapped.length > 0) setProducts(mapped)
      })
      .catch(() => { clearTimeout(timeout) })
  }, [])

  const handleProductClick = (product: Product) => {
    setViewedIds(prev => prev.includes(product.id) ? prev : [...prev, product.id])
    setSelectedProduct(product); setCurrentView("product")
    requestAnimationFrame(() => { window.scrollTo({ top: 0, behavior: "instant" }) })
  }

  const handleProductChange = (productId: number) => {
    const target = products.find(p => p.id === productId)
    if (target) {
      setSelectedProduct(target)
      setViewedIds(prev => prev.includes(productId) ? prev : [...prev, productId])
      requestAnimationFrame(() => { window.scrollTo({ top: 0, behavior: "smooth" }) })
    }
  }

  const handleBackToHome = () => { setCurrentView("home"); setSelectedProduct(null); window.scrollTo({ top: 0, behavior: "smooth" }) }

  useEffect(() => {
    if (viewedIds.length === 0) return
    fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"}/api/recommendations?viewed=${viewedIds.join(',')}&limit=4`)
      .then(r => r.json()).then(data => {
        setRecommendations(((data.products || []) as any[]).map((p: any, i: number) => ({
          product: {
            id: p.id, category: categoryFromBackend[p.category] || "giyim", brand: p.brand || "", title: p.name || "",
            price: p.price || 0, originalPrice: Math.round((p.price || 0) * 1.3),
            rating: p.reviews?.length > 0 ? p.reviews.reduce((s: number, r: any) => s + r.rating, 0) / p.reviews.length : 0,
            reviewCount: p.reviews?.length || 0, image: p.primaryImageUrl || (p.imageUrl ? p.imageUrl.split(',')[0] : ""),
            imageUrls: p.imageUrls || (p.imageUrl ? p.imageUrl.split(',').map((u: string) => u.trim()) : []),
            sizes: undefined, colors: ['Varsayılan'], material: "", dimensions: "",
            seller: { name: p.brand || "Satıcı", rating: 9.0 }, reviews: [],
          }, why: data.reasons?.[i]?.why || '',
        })))
      }).catch(() => {})
  }, [viewedIds])

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      {loading ? (
        <main className="max-w-[1800px] mx-auto px-6 lg:px-12 py-32 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-accent border-t-transparent mx-auto mb-4" />
          <p className="text-sm text-muted-foreground">Ürünler yükleniyor...</p>
        </main>
      ) : currentView === "home" ? (
        <HomePage onProductClick={handleProductClick} recommendations={recommendations} products={products} />
      ) : (
        selectedProduct && <ProductDetailPage product={selectedProduct} onBack={handleBackToHome} onProductChange={handleProductChange} />
      )}
    </div>
  )
}
