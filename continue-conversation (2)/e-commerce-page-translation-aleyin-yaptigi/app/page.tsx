"use client"

import { useState } from "react"
import { Search, User, Heart, ShoppingCart, Star, ArrowLeft, Sparkles, Send, Store, ChevronRight, ThumbsUp, Check, ArrowRight, Menu, X, Play, Award, Shield, Truck, Tag, Package, MapPin, CreditCard, MessageSquare, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"

// Helper function for consistent number formatting (prevents hydration mismatch)
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
  avatar?: string
  title?: string
  location?: string
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
  sizes?: string[]
  colors?: string[]
  material: string
  dimensions: string
  description?: string
  specs?: { key: string; value: string }[]
  seller: {
    name: string
    rating: number
  }
  reviews: Review[]
}

const products: Product[] = [
  {
    id: 1,
    category: "elektronik",
    brand: "Apple",
    title: "Pencil (USB-C) MUWA3ZE/A",
    price: 999.99,
    originalPrice: 1199.988,
    rating: 4.732704402515723,
    reviewCount: 2544,
    image: "https://cdn.dsmcdn.com/ty1610/prod/QC/20241202/10/5eafa70b-63e3-3aaa-940d-95d6e753f010/1_org_zoom.jpg",
    material: "",
    dimensions: "",
    description: "",
    specs: [{"key":"Mouse Hassasiyeti (Dpi)","value":"1000 - 5000 Dpi"},{"key":"Mouse Tipi","value":"Optik"},{"key":"Bağlantılar","value":"Bluetooth"},{"key":"Garanti Tipi","value":"Resmi Distribütör Garantili"},{"key":"Renk","value":"Beyaz"},{"key":"Garanti Süresi","value":"2 Yıl"},{"key":"Buton Sayısı","value":"2"},{"key":"Özellik","value":"Kablosuz"}],
    seller: { name: "Apple", rating: 9.5 },
    reviews: [
      
    ]
  },
  {
    id: 2,
    category: "giyim",
    brand: "Bilinmiyor",
    title: "Bürke Erkek Krem Renk Kaliteli Esnek Likralı Bilek Boy Kumaş Pantolon (100-130 kg battal beden 40-42-44)",
    price: 999.99,
    originalPrice: 1199.988,
    rating: 4.5,
    reviewCount: 0,
    image: "https://cdn.dsmcdn.com/sfint/prod/fp/search_1761135568801.svg",
    material: "",
    dimensions: "",
    description: "",
    specs: [],
    seller: { name: "Satıcı", rating: 9.5 },
    reviews: [
      
    ]
  },
  {
    id: 3,
    category: "mobilya",
    brand: "IKEA",
    title: "Ahşap 27,5 Cm Bambu Tabaklık - Tabak Standı Ahşap Kahverengi Mutfak 1",
    price: 999.99,
    originalPrice: 1199.988,
    rating: 4.21319018404908,
    reviewCount: 652,
    image: "https://cdn.dsmcdn.com/ty1395/product/media/images/prod/QC/20240702/20/71848794-f5fd-3770-b7c9-23d6d9c814c5/1_org_zoom.jpg",
    material: "Ahşap",
    dimensions: "",
    description: "",
    specs: [{"key":"Materyal","value":"Ahşap"},{"key":"Parça Sayısı","value":"1"},{"key":"Renk","value":"Kahverengi"}],
    seller: { name: "IKEA", rating: 9.5 },
    reviews: [
      
    ]
  },
  {
    id: 4,
    category: "mobilya",
    brand: "Kelebek",
    title: "Krem Gelin Battaniye Seti Fransız Güpürlüdür Çeyizlik",
    price: 999.99,
    originalPrice: 1199.988,
    rating: 3.994161801501251,
    reviewCount: 1199,
    image: "https://cdn.dsmcdn.com/ty1445/product/media/images/prod/QC/20240726/18/5191ce17-792f-3cf4-b22e-fb8f40340252/1_org_zoom.jpg",
    material: "Polyester",
    dimensions: "220 x 240",
    description: "",
    specs: [{"key":"Materyal","value":"Polyester"},{"key":"Boyut/Ebat","value":"220 x 240"},{"key":"Özellik","value":"Antibakteriyel"},{"key":"Renk","value":"Beyaz"},{"key":"Dolgu Materyali","value":"Belirtilmemiş"},{"key":"Desen","value":"Geometrik"},{"key":"Materyal Bileşeni","value":"100% Polyester"},{"key":"Yıkama Talimatı","value":"30 DERECEDE YIKANABİLİR"},{"key":"Kutu Durumu","value":"Kutu yok"}],
    seller: { name: "Kelebek", rating: 9.5 },
    reviews: [
      
    ]
  },
  {
    id: 5,
    category: "giyim",
    brand: "Koton",
    title: "İndigo Stone Erkek Jeans 5WAM40120ID",
    price: 999.99,
    originalPrice: 1199.988,
    rating: 4.3577981651376145,
    reviewCount: 218,
    image: "https://cdn.dsmcdn.com/ty1805/prod/QC_ENRICHMENT/20251227/19/5f236384-7a57-331b-bb93-0c6f6eeaa531/1_org_zoom.jpg",
    material: "Tekstil",
    dimensions: "",
    description: "",
    specs: [{"key":"Paça Tipi","value":"Boru Paça"},{"key":"Materyal","value":"Tekstil"},{"key":"Kemer/Kuşak Durumu","value":"Kemersiz"},{"key":"Bel","value":"Normal Bel"},{"key":"Renk","value":"Lacivert"},{"key":"Cep","value":"5 Cep"},{"key":"Ürün Tipi","value":"Düz"},{"key":"Koleksiyon","value":"Basic"},{"key":"Boy","value":"Regular"},{"key":"Kumaş Tipi","value":"Denim"},{"key":"Siluet","value":"Straight"},{"key":"Ortam","value":"Casual/Günlük"},{"key":"Kalıp","value":"Slim"},{"key":"Desen","value":"Düz"},{"key":"Ek Özellik","value":"Yıkamalı"},{"key":"Kapama Şekli","value":"Düğmeli"},{"key":"Dokuma Tipi","value":"Rigid"},{"key":"Sürdürülebilirlik Detayı","value":"Hayır"},{"key":"Persona","value":"Cool & Comfort"},{"key":"Materyal Bileşeni","value":"99% Pamuk, 1% Elastan"},{"key":"Yıkama Talimatı","value":"Detaylı bakım talimatları için lütfen ürün etiketini kontrol ediniz."},{"key":"Kutu Durumu","value":"Kutu yok"}],
    seller: { name: "Koton", rating: 9.5 },
    reviews: [
      
    ]
  },
  {
    id: 6,
    category: "giyim",
    brand: "Koton",
    title: "Pamuklu Normal Bel Skinny Fit Jean Pantolon - Michael Jean",
    price: 999.99,
    originalPrice: 1199.988,
    rating: 4.475609756097561,
    reviewCount: 82,
    image: "https://cdn.dsmcdn.com/ty1767/prod/QC_PREP/20251009/17/f79cf230-e1a6-3cf8-b2c4-0e10d7a6d63e/1_org_zoom.jpg",
    material: "Tekstil",
    dimensions: "",
    description: "",
    specs: [{"key":"Paça Tipi","value":"Boru Paça"},{"key":"Kalıp","value":"Skinny"},{"key":"Materyal","value":"Tekstil"},{"key":"Kumaş Tipi","value":"Belirtilmemiş"},{"key":"Bel","value":"Belirtilmemiş"},{"key":"Desen","value":"Düz"},{"key":"Renk","value":"Altın"},{"key":"Cep","value":"5"},{"key":"Astar Durumu","value":"Astarsız"},{"key":"Boy","value":"Belirtilmemiş"},{"key":"Siluet","value":"Skinny"},{"key":"Ortam","value":"Casual/Günlük"},{"key":"Dokuma Tipi","value":"Kumaş"},{"key":"Kemer/Kuşak Durumu","value":"Kemersiz"},{"key":"Sürdürülebilirlik Detayı","value":"Hayır"},{"key":"Materyal Bileşeni","value":"%99 PAMUK, %1 ELASTAN"},{"key":"Yıkama Talimatı","value":"Detaylı bakım talimatları için lütfen ürün etiketini kontrol ediniz."},{"key":"Kutu Durumu","value":"Kutu yok"}],
    seller: { name: "Koton", rating: 9.5 },
    reviews: [
      
    ]
  },
  {
    id: 7,
    category: "outdoor",
    brand: "Salomon",
    title: "Su ve Soğuğa Karşı Dayanıklı Erkek Kışlık Outdoor Ayakkabısı",
    price: 999.99,
    originalPrice: 1199.988,
    rating: 4.382530120481927,
    reviewCount: 332,
    image: "https://cdn.dsmcdn.com/ty1764/prod/QC_ENRICHMENT/20251002/12/d8b5857f-38a3-3ea7-a089-5844ef12754e/1_org_zoom.jpg",
    material: "Tekstil",
    dimensions: "",
    description: "",
    specs: [{"key":"Dış Materyal","value":"Tekstil"},{"key":"Materyal","value":"Keten"},{"key":"Kumaş Teknolojisi","value":"Gore-Tex"},{"key":"Bağlama Şekli","value":"Bağcıklı"},{"key":"Renk","value":"Gri"},{"key":"Taban Teknolojisi","value":"Vibram"},{"key":"Kalıp","value":"Regular"},{"key":"Alt Taban Materyali","value":"Kauçuk"},{"key":"Topuk Boyu","value":"Kısa Topuklu (1- 4 cm)"},{"key":"İç Astar & İç Taban Materyali","value":"Tekstil"},{"key":"Materyal Bileşeni","value":"100% Suni Deri"},{"key":"Topuk Tipi","value":"Düz Topuklu"},{"key":"Desen","value":"Düz"},{"key":"Kumaş Tipi","value":"Dokuma"},{"key":"Koleksiyon","value":"Sportswear"},{"key":"Ek Özellik","value":"Su itici"},{"key":"Sürdürülebilirlik Detayı","value":"Hayır"},{"key":"Ortam","value":"Sportswear"}],
    seller: { name: "Salomon", rating: 9.5 },
    reviews: [
      
    ]
  },
  {
    id: 8,
    category: "elektronik",
    brand: "Samsung",
    title: "Toz Torbasız Elektrikli Süpürge VC07R302MVP/TR",
    price: 999.99,
    originalPrice: 1199.988,
    rating: 4.654343807763401,
    reviewCount: 3787,
    image: "https://cdn.dsmcdn.com/ty1714/prod/QC_ENRICHMENT/20250725/15/5b8819a4-4377-3839-a003-40bff45729c9/1_org_zoom.jpg",
    material: "",
    dimensions: "",
    description: "",
    specs: [{"key":"Garanti Süresi","value":"2 Yıl"},{"key":"Ses Seviyesi","value":"71 Dba - 80 Dba"},{"key":"Uygulama Üzerinden Kontrol","value":"Yok"},{"key":"Güç (Watt)","value":"501 - 1000 Watt"},{"key":"Garanti Tipi","value":"Resmi Distribütör Garantili"},{"key":"Özellik","value":"Toz Torbasız"},{"key":"Hazne Kapasitesi","value":"1500+ L"},{"key":"Hepa Filtre","value":"EPA"},{"key":"Güç Kontrolü","value":"Mekanik"},{"key":"Frekans","value":"50 Hz / 60 Hz"},{"key":"Voltaj","value":"220 - 240 V"},{"key":"Filtre Seçeneği","value":"Filtresiz"},{"key":"Haritalama","value":"Yok"},{"key":"Turbo Başlık","value":"Yok"},{"key":"Kir Algılama","value":"Yok"},{"key":"Çalışma Tipi","value":"Elektrikli"}],
    seller: { name: "Samsung", rating: 9.5 },
    reviews: [
      
    ]
  },
  {
    id: 9,
    category: "outdoor",
    brand: "THE NORTH FACE",
    title: "Thermoball Unisex Siyah Bot",
    price: 999.99,
    originalPrice: 1199.988,
    rating: 4.538461538461538,
    reviewCount: 156,
    image: "https://cdn.dsmcdn.com/ty1625/prod/QC/20250117/18/42d472c1-5710-3b1b-affb-eefa5f422cce/1_org_zoom.jpg",
    material: "Suya Dayanıklı",
    dimensions: "",
    description: "",
    specs: [{"key":"Topuk Tipi","value":"Düz Topuklu"},{"key":"Topuk Boyu","value":"Kısa Topuklu (1- 4 cm)"},{"key":"Kumaş Teknolojisi","value":"Suya Dayanıklı"},{"key":"Desen","value":"Düz"},{"key":"Kutu Durumu","value":"Kutulu"},{"key":"Kullanım Alanı","value":"Günlük"},{"key":"Bağlama Şekli","value":"Bağcıklı"},{"key":"Materyal","value":"Belirtilmemiş"},{"key":"Renk","value":"Siyah"},{"key":"Dış Materyal","value":"Suni Deri"},{"key":"Alt Taban Materyali","value":"Kauçuk"},{"key":"İç Astar & İç Taban Materyali","value":"Tekstil"},{"key":"Persona","value":"Cool & Comfort"},{"key":"Ek Özellik","value":"Su Geçirmez"},{"key":"Materyal Bileşeni","value":"100% sentetik deri"},{"key":"Yıkama Talimatı","value":"type 4"},{"key":"Ürün Detayı","value":"Suni Deri"},{"key":"Burun Tipi","value":"Yuvarlak"},{"key":"Ortam","value":"Casual/Günlük"},{"key":"Sezon","value":"Kış"},{"key":"Kalıp","value":"Regular"}],
    seller: { name: "THE NORTH FACE", rating: 9.5 },
    reviews: [
      
    ]
  },
];

const categories = ["New In", "Women", "Men", "Home", "Tech", "Sale"]

const categoryLabels: Record<ProductCategory, string> = {
  giyim: "Fashion",
  mobilya: "Living",
  elektronik: "Technology",
  outdoor: "Adventure",
}

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isAccountOpen, setIsAccountOpen] = useState(false)

  // Mock data for AI Reality Check History
  const aiChatHistory = [
    { id: 1, productName: "Samsung QLED TV 55\"", sellerName: "TechStore Pro", image: "/placeholder.svg" },
    { id: 2, productName: "Organic Cotton Shirt", sellerName: "EcoWear", image: "/placeholder.svg" },
    { id: 3, productName: "Camping Tent 4-Person", sellerName: "OutdoorLife", image: "/placeholder.svg" },
    { id: 4, productName: "Modern Lounge Chair", sellerName: "HomeStyle", image: "/placeholder.svg" },
  ]

  return (
    <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/30">
      <div className="max-w-[1800px] mx-auto">
        {/* Top bar */}
        <div className="hidden lg:flex items-center justify-center py-2 border-b border-border/30 text-xs tracking-[0.2em] text-muted-foreground">
          Complimentary shipping on orders over 500 TL
        </div>
        
        <div className="px-6 lg:px-12">
          <div className="flex items-center justify-between h-20 lg:h-24">
            {/* Mobile menu */}
            <button 
              className="lg:hidden text-foreground p-2 rounded-full hover:bg-secondary transition-colors"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-5 w-5" strokeWidth={1} /> : <Menu className="h-5 w-5" strokeWidth={1} />}
            </button>

            {/* Logo */}
            <div className="absolute left-1/2 -translate-x-1/2 lg:static lg:translate-x-0">
              <h1 className="font-serif text-2xl lg:text-3xl tracking-[0.15em] font-light text-foreground">
                MAISON
              </h1>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-2 mx-auto bg-secondary/50 px-3 py-2 rounded-full">
              {categories.map((category) => (
                <button
                  key={category}
                  className="text-[12px] tracking-[0.1em] uppercase text-muted-foreground hover:text-foreground hover:bg-background px-5 py-2.5 rounded-full transition-all duration-300"
                >
                  {category}
                </button>
              ))}
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-2 lg:gap-3">
              <button className="hidden lg:flex h-10 w-10 items-center justify-center rounded-full bg-secondary/50 text-foreground hover:bg-secondary hover:text-accent transition-all duration-300">
                <Search className="h-[18px] w-[18px]" strokeWidth={1.5} />
              </button>
              
              {/* Account Sheet */}
              <Sheet open={isAccountOpen} onOpenChange={setIsAccountOpen}>
                <SheetTrigger asChild>
                  <button className="h-10 w-10 flex items-center justify-center rounded-full bg-secondary/50 text-foreground hover:bg-secondary hover:text-accent transition-all duration-300">
                    <User className="h-[18px] w-[18px]" strokeWidth={1.5} />
                  </button>
                </SheetTrigger>
                <SheetContent side="right" className="w-full sm:max-w-md bg-background border-l border-border overflow-y-auto">
                  <SheetHeader className="px-6 pt-6 pb-4 border-b border-border/50">
                    <SheetTitle className="font-serif text-xl tracking-wide font-light">My Account</SheetTitle>
                  </SheetHeader>
                  
                  <div className="px-6 py-6 space-y-8">
                    {/* Personal Information */}
                    <div>
                      <div className="flex items-center gap-3 mb-4">
                        <div className="h-8 w-8 rounded-full bg-accent/10 flex items-center justify-center">
                          <User className="h-4 w-4 text-accent" strokeWidth={1.5} />
                        </div>
                        <h3 className="text-[11px] tracking-[0.2em] text-muted-foreground uppercase">Personal Information</h3>
                      </div>
                      <div className="flex items-center gap-4 p-4 bg-secondary/30 rounded-2xl">
                        <div className="h-14 w-14 rounded-full bg-muted border border-border flex items-center justify-center">
                          <User className="h-6 w-6 text-muted-foreground" strokeWidth={1.5} />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-foreground">Guest User</p>
                          <p className="text-xs text-muted-foreground">guest@example.com</p>
                        </div>
                      </div>
                    </div>

                    {/* My Orders */}
                    <div>
                      <div className="flex items-center gap-3 mb-4">
                        <div className="h-8 w-8 rounded-full bg-accent/10 flex items-center justify-center">
                          <Package className="h-4 w-4 text-accent" strokeWidth={1.5} />
                        </div>
                        <h3 className="text-[11px] tracking-[0.2em] text-muted-foreground uppercase">My Orders</h3>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between p-4 bg-secondary/30 rounded-2xl hover:bg-secondary/50 transition-colors cursor-pointer">
                          <div className="flex items-center gap-3">
                            <Clock className="h-4 w-4 text-muted-foreground" strokeWidth={1.5} />
                            <span className="text-sm text-foreground">Order #12847</span>
                          </div>
                          <Badge variant="secondary" className="text-[10px] bg-accent/10 text-accent">In Transit</Badge>
                        </div>
                        <div className="flex items-center justify-between p-4 bg-secondary/30 rounded-2xl hover:bg-secondary/50 transition-colors cursor-pointer">
                          <div className="flex items-center gap-3">
                            <Check className="h-4 w-4 text-accent" strokeWidth={1.5} />
                            <span className="text-sm text-foreground">Order #12653</span>
                          </div>
                          <Badge variant="secondary" className="text-[10px] bg-secondary text-muted-foreground">Delivered</Badge>
                        </div>
                      </div>
                    </div>

                    {/* Addresses & Payment */}
                    <div>
                      <div className="flex items-center gap-3 mb-4">
                        <div className="h-8 w-8 rounded-full bg-accent/10 flex items-center justify-center">
                          <MapPin className="h-4 w-4 text-accent" strokeWidth={1.5} />
                        </div>
                        <h3 className="text-[11px] tracking-[0.2em] text-muted-foreground uppercase">Addresses & Payment</h3>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <button className="flex items-center gap-2 p-4 bg-secondary/30 rounded-2xl hover:bg-secondary/50 transition-colors text-left">
                          <MapPin className="h-4 w-4 text-muted-foreground" strokeWidth={1.5} />
                          <span className="text-sm text-foreground">Addresses</span>
                        </button>
                        <button className="flex items-center gap-2 p-4 bg-secondary/30 rounded-2xl hover:bg-secondary/50 transition-colors text-left">
                          <CreditCard className="h-4 w-4 text-muted-foreground" strokeWidth={1.5} />
                          <span className="text-sm text-foreground">Payment</span>
                        </button>
                      </div>
                    </div>

                    {/* AI Reality Check History - Core Feature */}
                    <div>
                      <div className="flex items-center gap-3 mb-4">
                        <div className="h-8 w-8 rounded-full bg-accent/10 flex items-center justify-center">
                          <Sparkles className="h-4 w-4 text-accent" strokeWidth={1.5} />
                        </div>
                        <h3 className="text-[11px] tracking-[0.2em] text-accent uppercase font-medium">AI Reality Check History</h3>
                      </div>
                      <div className="space-y-2">
                        {aiChatHistory.map((chat) => (
                          <button 
                            key={chat.id}
                            className="w-full flex items-center gap-3 p-4 bg-secondary/30 rounded-2xl hover:bg-secondary/50 transition-colors text-left group"
                          >
                            {/* Mini Thumbnail with hover effect */}
                            <div className="relative">
                              <div 
                                className="h-10 w-10 rounded-xl bg-muted/50 border border-border flex-shrink-0 cursor-zoom-in transition-transform duration-300 ease-out group-hover:scale-125 group-hover:shadow-lg group-hover:z-10 overflow-hidden"
                              >
                                <div className="w-full h-full bg-gradient-to-br from-muted to-border" />
                              </div>
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-foreground truncate">
                                {chat.productName} - {chat.sellerName}
                              </p>
                              <div className="flex items-center gap-2 mt-1">
                                <MessageSquare className="h-3 w-3 text-muted-foreground" strokeWidth={1.5} />
                                <span className="text-xs text-muted-foreground">Chat ID: #{chat.id}</span>
                              </div>
                            </div>
                            <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-accent transition-colors" strokeWidth={1.5} />
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>

              <button className="hidden lg:flex h-10 w-10 items-center justify-center rounded-full bg-secondary/50 text-foreground hover:bg-secondary hover:text-accent transition-all duration-300">
                <Heart className="h-[18px] w-[18px]" strokeWidth={1.5} />
              </button>
              <button className="relative h-10 w-10 flex items-center justify-center rounded-full bg-foreground text-background hover:bg-foreground/90 transition-all duration-300">
                <ShoppingCart className="h-[18px] w-[18px]" strokeWidth={1.5} />
                <span className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center text-[10px] bg-accent text-accent-foreground rounded-full font-medium">
                  2
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu overlay */}
        {isMenuOpen && (
          <div className="lg:hidden absolute inset-x-4 top-full mt-2 bg-background rounded-3xl border border-border shadow-soft-lg">
            <nav className="px-6 py-6 space-y-2">
              {categories.map((category) => (
                <button
                  key={category}
                  className="block w-full text-left text-base tracking-[0.1em] text-foreground px-4 py-3 rounded-2xl hover:bg-secondary transition-colors"
                >
                  {category}
                </button>
              ))}
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}

function HeroBanner() {
  return (
    <div className="relative bg-secondary overflow-hidden">
      <div className="max-w-[1800px] mx-auto">
        <div className="grid lg:grid-cols-2 min-h-[85vh]">
          {/* Left - Content */}
          <div className="flex flex-col justify-center px-6 lg:px-20 py-20 lg:py-32 order-2 lg:order-1">
            <div className="max-w-xl stagger-children">
              <span className="inline-block text-[11px] tracking-[0.4em] text-accent uppercase mb-8 font-medium">
                The Ultimate Marketplace
              </span>
              <h2 className="font-serif text-[clamp(2.5rem,6vw,5rem)] text-foreground leading-[0.95] mb-8 font-light">
                Everything You Need,
                <br />
                <em className="font-normal">All in One</em>
                <br />
                Place
              </h2>
              <p className="text-muted-foreground text-lg leading-relaxed mb-12 max-w-md">
                From the latest tech gadgets and modern furniture to trendy fashion and outdoor gear. Discover top brands across all categories.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  size="lg" 
                  className="bg-foreground text-background hover:bg-foreground/90 h-14 px-12 text-[13px] tracking-[0.15em] font-normal group rounded-full"
                >
                  Start Shopping
                  <ArrowRight className="h-4 w-4 ml-3 group-hover:translate-x-1 transition-transform" strokeWidth={1.5} />
                </Button>
                <Button 
                  size="lg" 
                  variant="outline"
                  className="border-foreground/20 text-foreground hover:bg-foreground hover:text-background h-14 px-8 text-[13px] tracking-[0.15em] font-normal group rounded-full"
                >
                  <Tag className="h-4 w-4 mr-3" strokeWidth={1.5} />
                  View Daily Deals
                </Button>
              </div>
            </div>
          </div>

          {/* Right - Visual */}
          <div className="relative order-1 lg:order-2 min-h-[50vh] lg:min-h-full">
            <div className="absolute inset-0 bg-gradient-to-br from-muted to-border flex items-center justify-center">
              <div className="text-center">
                <span className="font-serif text-[120px] lg:text-[200px] text-foreground/5 leading-none">M</span>
              </div>
            </div>
            {/* Floating badge */}
            <div className="absolute bottom-8 left-8 lg:bottom-16 lg:left-16 bg-background/95 backdrop-blur-sm p-6 max-w-[240px] rounded-3xl shadow-soft">
              <div className="flex items-center gap-3 mb-3">
                <div className="h-8 w-8 rounded-full bg-accent/10 flex items-center justify-center">
                  <Award className="h-4 w-4 text-accent" strokeWidth={1.5} />
                </div>
                <span className="text-[10px] tracking-[0.2em] text-accent uppercase">Verified Platform</span>
              </div>
              <p className="text-sm text-foreground leading-relaxed">
                &ldquo;The most trusted marketplace for smart and secure shopping.&rdquo;
              </p>
              <p className="text-xs text-muted-foreground mt-2">User Reviews</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function TrustBar() {
  const items = [
    { icon: Truck, label: "Free Shipping", sub: "Orders over 500 TL" },
    { icon: Shield, label: "Secure Payment", sub: "256-bit SSL" },
    { icon: Award, label: "Authenticity", sub: "100% Guaranteed" },
  ]

  return (
    <div className="py-8 lg:py-12">
      <div className="max-w-[1800px] mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-3 gap-4">
          {items.map((item, i) => (
            <div key={i} className="py-6 lg:py-8 text-center bg-secondary/50 rounded-3xl">
              <div className="h-12 w-12 mx-auto mb-4 rounded-full bg-background flex items-center justify-center shadow-soft">
                <item.icon className="h-5 w-5 text-foreground" strokeWidth={1.5} />
              </div>
              <p className="text-[13px] text-foreground tracking-wide">{item.label}</p>
              <p className="text-[11px] text-muted-foreground mt-1">{item.sub}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function StarRating({ rating, size = "default" }: { rating: number; size?: "default" | "large" | "small" }) {
  const starSize = size === "large" ? "h-5 w-5" : size === "small" ? "h-3 w-3" : "h-3.5 w-3.5"
  return (
    <div className="flex items-center gap-0.5">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          className={`${starSize} ${
            i < Math.floor(rating)
              ? "fill-accent text-accent"
              : i < rating
              ? "fill-accent/50 text-accent"
              : "text-border"
          }`}
          strokeWidth={1}
        />
      ))}
    </div>
  )
}

function ProductCard({
  product,
  onClick,
  featured = false,
}: {
  product: Product
  onClick: () => void
  featured?: boolean
}) {
  const discount = Math.round(
    ((product.originalPrice - product.price) / product.originalPrice) * 100
  )

  return (
    <div
      className={`group cursor-pointer ${featured ? 'col-span-2 row-span-2' : ''}`}
      onClick={onClick}
    >
      <div className={`relative ${featured ? 'aspect-[4/5]' : 'aspect-[3/4]'} bg-secondary overflow-hidden mb-6 rounded-3xl`}>
        <div className="absolute inset-0 bg-gradient-to-br from-muted/30 to-muted flex items-center justify-center image-zoom">
          <span className={`${featured ? 'text-[120px]' : 'text-6xl'} text-foreground/[0.03] font-serif`}>
            {product.brand.charAt(0)}
          </span>
        </div>
        
        {/* Discount badge */}
        <div className="absolute top-5 left-5">
          <span className="text-[10px] tracking-[0.2em] text-background bg-foreground px-4 py-2 rounded-full uppercase font-medium">
            Save {discount}%
          </span>
        </div>

        {/* Quick actions */}
        <div className="absolute top-5 right-5 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-x-2 group-hover:translate-x-0">
          <button
            className="h-11 w-11 flex items-center justify-center bg-background/95 backdrop-blur-sm hover:bg-foreground hover:text-background transition-colors duration-300 rounded-full shadow-soft"
            onClick={(e) => e.stopPropagation()}
          >
            <Heart className="h-4 w-4" strokeWidth={1.5} />
          </button>
          <button
            className="h-11 w-11 flex items-center justify-center bg-background/95 backdrop-blur-sm hover:bg-foreground hover:text-background transition-colors duration-300 rounded-full shadow-soft"
            onClick={(e) => e.stopPropagation()}
          >
            <ShoppingCart className="h-4 w-4" strokeWidth={1.5} />
          </button>
        </div>

        {/* Quick view on hover */}
        <div className="absolute inset-x-5 bottom-5 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-2 group-hover:translate-y-0">
          <Button 
            variant="secondary" 
            size="sm"
            className="w-full bg-background text-foreground hover:bg-background/90 text-[11px] tracking-[0.15em] uppercase h-12 rounded-full shadow-soft"
          >
            Quick View
          </Button>
        </div>
      </div>

      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <p className="text-[10px] tracking-[0.25em] text-muted-foreground uppercase">
            {product.brand}
          </p>
          <div className="flex items-center gap-1.5">
            <StarRating rating={product.rating} size="small" />
            <span className="text-[10px] text-muted-foreground">
              ({formatNumber(product.reviewCount)})
            </span>
          </div>
        </div>
        
        <h3 className={`${featured ? 'text-lg' : 'text-sm'} text-foreground leading-snug group-hover:text-accent transition-colors duration-300`}>
          {product.title}
        </h3>
        
        <div className="flex items-baseline gap-3 pt-1">
          <span className={`${featured ? 'text-xl' : 'text-base'} font-medium text-foreground`}>
            {formatPrice(product.price)} TL
          </span>
          <span className="text-sm text-muted-foreground line-through line-through-animated">
            {formatPrice(product.originalPrice)} TL
          </span>
        </div>
      </div>
    </div>
  )
}

function HomePage({
  onProductClick,
}: {
  onProductClick: (product: Product) => void
}) {
  const productsByCategory = products.reduce((acc, product) => {
    if (!acc[product.category]) {
      acc[product.category] = []
    }
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
            <span className="text-[10px] tracking-[0.4em] text-accent uppercase mb-4 block font-medium">
              Curated Selection
            </span>
            <h2 className="font-serif text-4xl lg:text-5xl text-foreground font-light">
              This Week&apos;s Edit
            </h2>
          </div>
          <button className="text-[13px] text-muted-foreground hover:text-foreground transition-colors flex items-center gap-3 group tracking-[0.1em] uppercase">
            View All Products
            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" strokeWidth={1} />
          </button>
        </div>

        {(Object.keys(categoryLabels) as ProductCategory[]).map((category, catIndex) => (
          <div key={category} className="mb-24 last:mb-0">
            <div className="flex items-center gap-6 mb-10">
              <span className="text-[11px] tracking-[0.3em] text-accent uppercase font-medium">
                0{catIndex + 1}
              </span>
              <h3 className="text-xl tracking-[0.05em] text-foreground font-light">
                {categoryLabels[category]}
              </h3>
              <div className="flex-1 h-px bg-border" />
            </div>

            {/* Asymmetric grid - featured first item */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12">
              {productsByCategory[category]?.map((product, index) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onClick={() => onProductClick(product)}
                  featured={index === 0 && catIndex === 0}
                />
              ))}
            </div>
          </div>
        ))}
      </section>
    </main>
  )
}

function MagazineReviewCard({ review, variant = "default" }: { review: Review; variant?: "featured" | "default" | "compact" }) {
  if (variant === "featured") {
    return (
      <div className="col-span-full lg:col-span-2 row-span-2 bg-foreground text-background p-10 lg:p-14 flex flex-col rounded-[2.5rem] shadow-soft-lg">
        <div className="flex items-center gap-4 mb-8">
          <div className="h-16 w-16 rounded-full bg-gradient-to-br from-accent/30 to-accent/10 flex items-center justify-center">
            <span className="text-xl font-serif text-background">{review.author.charAt(0)}</span>
          </div>
          <div>
            <p className="text-base text-background font-medium">{review.author}</p>
            <div className="flex items-center gap-3 mt-1">
              <span className="text-sm text-background/60">{review.location}</span>
              {review.verified && (
                <span className="flex items-center gap-1.5 text-xs text-accent bg-accent/10 px-3 py-1 rounded-full">
                  <Check className="h-3 w-3" strokeWidth={2} />
                  Verified
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="flex-1">
          <div className="mb-6">
            <StarRating rating={review.rating} size="large" />
          </div>
          {review.title && (
            <h4 className="font-serif text-2xl lg:text-3xl text-background leading-tight mb-6">
              &ldquo;{review.title}&rdquo;
            </h4>
          )}
          <p className="text-lg text-background/80 leading-relaxed">
            {review.comment}
          </p>
        </div>

        <div className="flex items-center justify-between pt-8 mt-8 border-t border-background/10">
          <span className="text-sm text-background/50">{review.date}</span>
          <button className="flex items-center gap-2 text-sm text-background/60 hover:text-background transition-colors bg-background/10 px-4 py-2 rounded-full">
            <ThumbsUp className="h-4 w-4" strokeWidth={1.5} />
            Helpful ({review.helpful})
          </button>
        </div>
      </div>
    )
  }

  if (variant === "compact") {
    return (
      <div className="bg-secondary/50 p-6 rounded-2xl hover:bg-secondary/70 transition-colors">
        <div className="flex items-start gap-4">
          <div className="h-12 w-12 rounded-full bg-gradient-to-br from-muted to-border flex-shrink-0 flex items-center justify-center">
            <span className="text-sm text-muted-foreground font-medium">{review.author.charAt(0)}</span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2 mb-2">
              <p className="text-sm font-medium text-foreground truncate">{review.author}</p>
              <StarRating rating={review.rating} size="small" />
            </div>
            <p className="text-sm text-muted-foreground line-clamp-2">{review.comment}</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-secondary/50 p-8 flex flex-col rounded-3xl hover:shadow-soft transition-all">
      <div className="flex items-center justify-between mb-6">
        <StarRating rating={review.rating} />
        {review.verified && (
          <span className="flex items-center gap-1.5 text-[10px] tracking-[0.1em] text-accent uppercase bg-accent/10 px-3 py-1.5 rounded-full">
            <Check className="h-3 w-3" strokeWidth={2} />
            Verified
          </span>
        )}
      </div>
      
      {review.title && (
        <h4 className="font-serif text-lg text-foreground mb-4 leading-snug">
          {review.title}
        </h4>
      )}
      
      <p className="text-sm text-muted-foreground leading-relaxed flex-1 mb-6">
        {review.comment}
      </p>
      
      <div className="flex items-center justify-between pt-6 border-t border-border/50">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-muted to-border flex items-center justify-center">
            <span className="text-xs text-muted-foreground font-medium">{review.author.charAt(0)}</span>
          </div>
          <div>
            <p className="text-sm text-foreground">{review.author}</p>
            <p className="text-[10px] text-muted-foreground">{review.location} - {review.date}</p>
          </div>
        </div>
        <button className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors bg-secondary px-3 py-2 rounded-full">
          <ThumbsUp className="h-3 w-3" strokeWidth={1.5} />
          {review.helpful}
        </button>
      </div>
    </div>
  )
}

function RatingBreakdown({ reviews, rating, reviewCount }: { reviews: Review[]; rating: number; reviewCount: number }) {
  const ratingCounts = [5, 4, 3, 2, 1].map(star => ({
    star,
    count: reviews.filter(r => Math.floor(r.rating) === star).length,
    percentage: (reviews.filter(r => Math.floor(r.rating) === star).length / reviews.length) * 100
  }))

  return (
    <div className="bg-secondary/30 p-8 lg:p-12 rounded-[2rem]">
      <div className="flex flex-col lg:flex-row lg:items-center gap-8 lg:gap-16">
        {/* Score */}
        <div className="text-center lg:text-left">
          <div className="flex items-baseline gap-2 justify-center lg:justify-start">
            <span className="font-serif text-6xl text-foreground">{rating}</span>
            <span className="text-2xl text-muted-foreground">/5</span>
          </div>
          <div className="mt-3">
            <StarRating rating={rating} size="large" />
          </div>
          <p className="text-sm text-muted-foreground mt-3">
            Based on {formatNumber(reviewCount)} reviews
          </p>
        </div>

        {/* Bars */}
        <div className="flex-1 space-y-3">
          {ratingCounts.map(({ star, percentage }) => (
            <div key={star} className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground w-4">{star}</span>
              <Star className="h-3 w-3 text-accent fill-accent" strokeWidth={1} />
              <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                <div 
                  className="h-full bg-accent rounded-full transition-all duration-700"
                  style={{ width: `${percentage}%` }}
                />
              </div>
              <span className="text-xs text-muted-foreground w-10 text-right">{Math.round(percentage)}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function CustomerReviews({ reviews, rating, reviewCount }: { reviews: Review[]; rating: number; reviewCount: number }) {
  const featuredReview = reviews.find(r => r.rating >= 4 && r.helpful > 30) || reviews[0]
  const otherReviews = reviews.filter(r => r.id !== featuredReview.id)

  return (
    <section className="mt-24 pt-24 border-t border-border">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-12">
        <div>
          <span className="text-[10px] tracking-[0.4em] text-accent uppercase mb-4 block font-medium">
            Customer Stories
          </span>
          <h3 className="font-serif text-3xl lg:text-4xl text-foreground font-light">
            What People Are Saying
          </h3>
        </div>
        <button className="text-[13px] text-muted-foreground hover:text-foreground transition-colors flex items-center gap-3 group tracking-[0.1em] uppercase">
          Write a Review
          <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" strokeWidth={1} />
        </button>
      </div>

      {/* Rating breakdown */}
      <RatingBreakdown reviews={reviews} rating={rating} reviewCount={reviewCount} />

      {/* Magazine-style grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mt-8">
        <MagazineReviewCard review={featuredReview} variant="featured" />
        {otherReviews.slice(0, 2).map((review) => (
          <MagazineReviewCard key={review.id} review={review} />
        ))}
      </div>

      {/* Compact reviews */}
      {otherReviews.length > 2 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-5">
          {otherReviews.slice(2).map((review) => (
            <MagazineReviewCard key={review.id} review={review} variant="compact" />
          ))}
        </div>
      )}

      {/* Load more */}
      <div className="mt-12 text-center">
        <Button 
          variant="outline" 
          className="border-foreground text-foreground hover:bg-foreground hover:text-background h-14 px-12 text-[13px] tracking-[0.15em] font-normal rounded-full"
        >
          Load More Reviews
          <ChevronRight className="h-4 w-4 ml-2" strokeWidth={1.5} />
        </Button>
      </div>
    </section>
  )
}

function RealityScoreCircle({ score }: { score: number }) {
  const circumference = 2 * Math.PI * 45
  const strokeDashoffset = circumference - (score / 100) * circumference

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg className="w-32 h-32 -rotate-90">
        <circle
          cx="64"
          cy="64"
          r="45"
          stroke="currentColor"
          strokeWidth="1"
          fill="none"
          className="text-border"
        />
        <circle
          cx="64"
          cy="64"
          r="45"
          stroke="currentColor"
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
          className="text-accent"
          style={{
            strokeDasharray: circumference,
            strokeDashoffset: strokeDashoffset,
            transition: "stroke-dashoffset 1s cubic-bezier(0.16, 1, 0.3, 1)",
          }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-serif text-4xl text-foreground">{score}</span>
        <span className="text-[9px] tracking-[0.3em] text-muted-foreground uppercase mt-1">Reality</span>
      </div>
    </div>
  )
}

function ProductDetailPage({
  product,
  onBack,
}: {
  product: Product
  onBack: () => void
}) {
  const [selectedSize, setSelectedSize] = useState<string | null>(null)
  const [selectedColor, setSelectedColor] = useState<string | null>(product.colors?.[0] || null)
  const [aiMessage, setAiMessage] = useState("")
  const [isAnalyzed, setIsAnalyzed] = useState(false)
  const [continueMessage, setContinueMessage] = useState("")

  const discount = Math.round(
    ((product.originalPrice - product.price) / product.originalPrice) * 100
  )

  const sizeLabel = product.category === "giyim" || product.category === "outdoor" 
    ? "Size" 
    : product.category === "elektronik" && product.sizes 
    ? "Storage"
    : product.sizes ? "Size" : null

  return (
    <main className="max-w-[1800px] mx-auto px-6 lg:px-12 py-8 lg:py-16">
      <button
        className="mb-10 text-[13px] text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-3 group tracking-[0.1em] uppercase bg-secondary/50 px-5 py-3 rounded-full"
        onClick={onBack}
      >
            <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" strokeWidth={1.5} />
            Back to All Products
          </button>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-20">
        {/* Left - Images */}
        <div className="lg:col-span-7">
          <div className="sticky top-32">
            <div className="grid grid-cols-4 gap-4">
              {/* Main image */}
              <div className="col-span-4 aspect-[4/5] bg-secondary overflow-hidden relative group rounded-[2rem]">
                <div className="absolute inset-0 bg-gradient-to-br from-muted/20 to-muted flex items-center justify-center">
                  <span className="font-serif text-[200px] text-foreground/[0.02]">
                    {product.brand.charAt(0)}
                  </span>
                </div>
                <div className="absolute top-6 left-6">
                  <span className="text-[10px] tracking-[0.2em] text-background bg-foreground px-5 py-2.5 rounded-full uppercase font-medium">
                    Save {discount}%
                  </span>
                </div>
                <button className="absolute top-6 right-6 h-12 w-12 flex items-center justify-center bg-background/95 backdrop-blur-sm hover:bg-foreground hover:text-background transition-all duration-300 rounded-full shadow-soft">
                  <Heart className="h-4 w-4" strokeWidth={1.5} />
                </button>
              </div>
              
              {/* Thumbnails */}
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className={`aspect-square bg-secondary overflow-hidden cursor-pointer transition-all duration-300 rounded-2xl ${
                    i === 1 ? "ring-2 ring-foreground ring-offset-2" : "hover:ring-2 hover:ring-border hover:ring-offset-2"
                  }`}
                >
                  <div className="w-full h-full bg-gradient-to-br from-muted/20 to-muted flex items-center justify-center">
                    <span className="text-2xl text-foreground/[0.03] font-serif">
                      {product.brand.charAt(0)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right - Product Info */}
        <div className="lg:col-span-5">
          <div className="lg:max-w-lg">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-[11px] tracking-[0.15em] text-muted-foreground uppercase mb-6">
              <span>{categoryLabels[product.category]}</span>
              <ChevronRight className="h-3 w-3" strokeWidth={1} />
              <span>{product.brand}</span>
            </div>

            {/* Title & Rating */}
            <h1 className="font-serif text-3xl lg:text-4xl text-foreground leading-tight mb-4 font-light">
              {product.title}
            </h1>

            <div className="flex items-center gap-4 mb-8">
              <StarRating rating={product.rating} size="large" />
              <span className="text-sm text-muted-foreground">
                {product.rating} ({formatNumber(product.reviewCount)} reviews)
              </span>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-4 pb-8 border-b border-border">
              <span className="text-3xl text-foreground font-light">
                {formatPrice(product.price)} TL
              </span>
              <span className="text-lg text-muted-foreground line-through">
                {formatPrice(product.originalPrice)} TL
              </span>
              <Badge className="bg-accent/10 text-accent border-0 text-[10px] tracking-[0.1em] uppercase px-4 py-1.5 rounded-full">
                {discount}% off
              </Badge>
            </div>

            {/* Color Selection */}
            {product.colors && (
              <div className="py-8 border-b border-border">
                <p className="text-[11px] tracking-[0.2em] text-muted-foreground uppercase mb-5">
                  Color: <span className="text-foreground">{selectedColor}</span>
                </p>
                <div className="flex flex-wrap gap-3">
                  {product.colors.map((color) => (
                    <button
                      key={color}
                      className={`px-6 py-3 text-sm transition-all duration-300 rounded-full ${
                        selectedColor === color
                          ? "bg-foreground text-background"
                          : "bg-secondary text-foreground hover:bg-muted"
                      }`}
                      onClick={() => setSelectedColor(color)}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Size Selection */}
            {product.sizes && sizeLabel && (
              <div className="py-8 border-b border-border">
                <div className="flex items-center justify-between mb-5">
                  <p className="text-[11px] tracking-[0.2em] text-muted-foreground uppercase">
                    {sizeLabel}
                  </p>
                  <button className="text-xs text-muted-foreground hover:text-foreground transition-colors hover-underline">
                    Size Guide
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      className={`min-w-[60px] h-12 px-5 text-sm transition-all duration-300 rounded-full ${
                        selectedSize === size
                          ? "bg-foreground text-background"
                          : "bg-secondary text-foreground hover:bg-muted"
                      }`}
                      onClick={() => setSelectedSize(size)}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Add to Cart */}
            <div className="py-8 space-y-4">
              <Button
                size="lg"
                className="w-full bg-foreground text-background hover:bg-foreground/90 h-14 text-[13px] tracking-[0.15em] font-normal group rounded-full"
              >
                <ShoppingCart className="h-4 w-4 mr-3" strokeWidth={1.5} />
                Add to Cart
                <span className="ml-auto text-background/60 group-hover:text-background transition-colors">
                  {formatPrice(product.price)} TL
                </span>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="w-full border-foreground/20 text-foreground hover:bg-secondary h-14 text-[13px] tracking-[0.15em] font-normal rounded-full"
              >
                <Heart className="h-4 w-4 mr-3" strokeWidth={1.5} />
                Add to Wishlist
              </Button>
            </div>

            {/* Product Details Accordion */}
            <div className="border-t border-border">
              <details className="group" open>
                <summary className="flex items-center justify-between cursor-pointer py-6 text-sm text-foreground">
                  <span className="tracking-[0.1em] uppercase text-[13px]">Product Details</span>
                  <ChevronRight className="h-4 w-4 transition-transform group-open:rotate-90" strokeWidth={1} />
                </summary>
                <div className="pb-6 space-y-4 text-sm text-muted-foreground">
                  {product.description && (
                     <div className="mb-6 text-sm text-muted-foreground leading-relaxed" 
                          dangerouslySetInnerHTML={{ __html: product.description }} />
                  )}
                  {product.specs && product.specs.length > 0 ? (
                    <div className="space-y-2">
                      {product.specs.map((spec, index) => (
                        <div key={index} className="flex justify-between py-1 border-b border-border/30 last:border-0">
                          <span className="text-foreground font-medium pr-4">{spec.key}</span>
                          <span className="text-right">{spec.value}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <>
                      <p><span className="text-foreground">Material:</span> {product.material}</p>
                      <p><span className="text-foreground">Dimensions:</span> {product.dimensions}</p>
                    </>
                  )}
                </div>
              </details>
              
              <details className="group border-t border-border">
                <summary className="flex items-center justify-between cursor-pointer py-6 text-sm text-foreground">
                  <span className="tracking-[0.1em] uppercase text-[13px]">Shipping & Returns</span>
                  <ChevronRight className="h-4 w-4 transition-transform group-open:rotate-90" strokeWidth={1} />
                </summary>
                <div className="pb-6 space-y-3 text-sm text-muted-foreground">
                  <p className="flex items-center gap-3">
                    <Truck className="h-4 w-4 text-accent" strokeWidth={1} />
                    Free shipping on orders over 500 TL
                  </p>
                  <p className="flex items-center gap-3">
                    <Check className="h-4 w-4 text-accent" strokeWidth={1} />
                    14-day free returns
                  </p>
                  <p className="flex items-center gap-3">
                    <Shield className="h-4 w-4 text-accent" strokeWidth={1} />
                    Secure checkout
                  </p>
                </div>
              </details>
            </div>

            {/* Seller Info */}
            <div className="py-6 border-t border-border">
              <div className="flex items-center gap-4">
                <div className="h-14 w-14 bg-secondary flex items-center justify-center rounded-2xl">
                  <Store className="h-5 w-5 text-muted-foreground" strokeWidth={1.5} />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-foreground">{product.seller.name}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <Star className="h-3 w-3 fill-accent text-accent" strokeWidth={1} />
                    <span className="text-xs text-muted-foreground">
                      Seller Rating: {product.seller.rating}/10
                    </span>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="text-xs tracking-[0.1em] uppercase h-10 px-5 rounded-full">
                  View Store
                </Button>
              </div>
            </div>

            {/* AI Reality Check Agent */}
            <div className="mt-8 border border-accent/30 bg-gradient-to-b from-accent/5 to-transparent rounded-[2rem] overflow-hidden relative flex flex-col">
              {/* Header - Conditional based on analysis state */}
              {!isAnalyzed ? (
                /* Default Header - Sparkle icon */
                <div className="p-8 lg:p-10 pb-0">
                  <div className="flex items-start gap-4 mb-6">
                    <div className="h-14 w-14 bg-accent/10 flex items-center justify-center flex-shrink-0 rounded-2xl">
                      <Sparkles className="h-5 w-5 text-accent" strokeWidth={1.5} />
                    </div>
                    <div>
                      <h3 className="text-base font-medium text-foreground tracking-wide">
                        Reality Check Agent
                      </h3>
                      <p className="text-sm text-muted-foreground mt-1">AI-Powered Product Analysis</p>
                    </div>
                  </div>
                </div>
              ) : (
                /* Post-Analysis Header - Compact */
                <div className="px-6 lg:px-8 py-4 border-b border-border/50">
                  <div className="flex items-center gap-3">
                    <div 
                      className="h-10 w-10 bg-muted/50 border border-border flex-shrink-0 rounded-xl cursor-zoom-in transition-transform duration-300 ease-out hover:scale-125 hover:shadow-lg hover:z-10"
                      aria-label="Product photo placeholder"
                    />
                    <div className="flex flex-col justify-center min-w-0">
                      <h3 className="text-sm font-semibold text-foreground truncate">
                        [PRODUCT NAME PLACEHOLDER] - [SELLER NAME PLACEHOLDER]
                      </h3>
                      <p className="text-xs text-muted-foreground">Active conversation</p>
                    </div>
                  </div>
                </div>
              )}

              {!isAnalyzed ? (
                /* Default State - Pre-Analysis */
                <div className="px-8 lg:px-10 pb-8 lg:pb-10">
                  <p className="text-sm text-muted-foreground leading-relaxed mb-8 text-center">
                    How close does this product truly match the studio shots? Authenticated analysis based on user photos and reviews.
                  </p>

                  <div className="space-y-4">
                    <div className="relative">
                      <Input
                        placeholder="Consult with AI..."
                        value={aiMessage}
                        onChange={(e) => setAiMessage(e.target.value)}
                        className="bg-background border-border h-14 pr-14 text-sm rounded-full pl-6"
                      />
                      <button className="absolute right-2 top-1/2 -translate-y-1/2 h-10 w-10 flex items-center justify-center text-muted-foreground hover:text-accent transition-colors rounded-full hover:bg-accent/10">
                        <Send className="h-4 w-4" strokeWidth={1.5} />
                      </button>
                    </div>

                    <Button 
                      className="w-full bg-accent hover:bg-accent/90 text-accent-foreground h-14 text-[13px] tracking-[0.15em] font-normal rounded-full"
                      onClick={() => setIsAnalyzed(true)}
                    >
                      <Sparkles className="h-4 w-4 mr-2" strokeWidth={1.5} />
                      Analyze
                    </Button>

                    <div className="pt-6 border-t border-border">
                      <p className="text-[10px] text-muted-foreground mb-4 tracking-[0.2em] uppercase">
                        Suggested Questions
                      </p>
                      <div className="space-y-2">
                        {[
                          "How is the fit of this shirt?",
                          "How is the fabric quality?",
                          "Is the color as shown?",
                        ].map((q, i) => (
                          <button
                            key={i}
                            className="block w-full text-left text-sm text-muted-foreground hover:text-accent transition-colors py-3 px-4 rounded-xl hover:bg-secondary/50"
                            onClick={() => setAiMessage(q)}
                          >
                            • {q}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                /* Post-Analysis State */
                <div className="flex flex-col flex-1 min-h-0">
                  {/* Scrollable conversation area */}
                  <div className="flex-1 overflow-y-auto px-8 lg:px-10 pt-6 pb-4">
                    {/* Reality Score */}
                    <div className="flex justify-center mb-8">
                      <RealityScoreCircle score={87} />
                    </div>

                    {/* General Summary */}
                    <div className="bg-secondary/50 rounded-2xl p-5 mb-4">
                      <h4 className="text-[11px] tracking-[0.2em] text-accent uppercase mb-3 font-medium">
                        General Summary
                      </h4>
                      <p className="text-sm text-foreground leading-relaxed">
                        This TV matches the studio photos very closely in color and brightness, with minor glare differences mentioned in reviews. Overall, customers report high satisfaction with the visual accuracy.
                      </p>
                    </div>

                    {/* Key Review Insights */}
                    <div className="bg-secondary/50 rounded-2xl p-5 mb-4">
                      <h4 className="text-[11px] tracking-[0.2em] text-accent uppercase mb-3 font-medium">
                        Key Review Insights
                      </h4>
                      <ul className="space-y-2 text-sm text-foreground">
                        <li className="flex items-start gap-2">
                          <Check className="h-4 w-4 text-accent mt-0.5 flex-shrink-0" strokeWidth={2} />
                          <span>Verified users appreciate the color accuracy.</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <Check className="h-4 w-4 text-accent mt-0.5 flex-shrink-0" strokeWidth={2} />
                          <span>Some reviewers noted better-than-expected sound.</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <Check className="h-4 w-4 text-accent mt-0.5 flex-shrink-0" strokeWidth={2} />
                          <span>QLED technology delivers vibrant, true-to-life visuals.</span>
                        </li>
                      </ul>
                    </div>

                    {/* AI Response bubble */}
                    <div className="flex gap-3 mb-4">
                      <div className="h-8 w-8 bg-accent/10 flex items-center justify-center flex-shrink-0 rounded-full">
                        <Sparkles className="h-4 w-4 text-accent" strokeWidth={1.5} />
                      </div>
                      <div className="bg-secondary/30 rounded-2xl rounded-tl-sm p-4 flex-1">
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          Based on 1,876 verified reviews, this Samsung QLED TV consistently delivers on its advertised features. Would you like me to dive deeper into any specific aspect?
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Sticky Chat Bar */}
                  <div className="sticky bottom-0 bg-gradient-to-t from-background via-background to-transparent pt-4 px-8 lg:px-10 pb-8 lg:pb-10">
                    <div className="relative">
                      <Input
                        placeholder="Continue talking with Agent..."
                        value={continueMessage}
                        onChange={(e) => setContinueMessage(e.target.value)}
                        className="bg-background border-border h-14 pr-14 text-sm rounded-full pl-6 shadow-soft"
                      />
                      <button className="absolute right-2 top-1/2 -translate-y-1/2 h-10 w-10 flex items-center justify-center bg-accent text-accent-foreground hover:bg-accent/90 transition-colors rounded-full">
                        <Send className="h-4 w-4" strokeWidth={1.5} />
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Customer Reviews */}
          <CustomerReviews 
            reviews={product.reviews} 
            rating={product.rating} 
            reviewCount={product.reviewCount} 
          />
        </div>
      </div>
    </main>
  )
}

export default function EcommercePage() {
  const [currentView, setCurrentView] = useState<"home" | "product">("home")
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product)
    setCurrentView("product")
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const handleBackToHome = () => {
    setCurrentView("home")
    setSelectedProduct(null)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      {currentView === "home" ? (
        <HomePage onProductClick={handleProductClick} />
      ) : (
        selectedProduct && (
          <ProductDetailPage product={selectedProduct} onBack={handleBackToHome} />
        )
      )}
    </div>
  )
}
