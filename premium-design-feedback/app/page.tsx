"use client"

import { useState } from "react"
import { Search, User, Heart, ShoppingCart, Star, ArrowLeft, Sparkles, Send, Store, ChevronRight, ThumbsUp, Check, ArrowRight, Menu, X, Play, Award, Shield, Truck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"

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
  seller: {
    name: string
    rating: number
  }
  reviews: Review[]
}

const products: Product[] = [
  {
    id: 1,
    category: "giyim",
    brand: "Koton",
    title: "Oversize Keten Gomlek",
    price: 349.99,
    originalPrice: 499.99,
    rating: 4.5,
    reviewCount: 1248,
    image: "/placeholder-product-1.jpg",
    sizes: ["S", "M", "L", "XL"],
    colors: ["Beyaz", "Mavi", "Bej"],
    material: "%100 Keten, Dogal Kumas",
    dimensions: "Manken uzerindeki beden: M, Urun Boyu: 75cm, Gogus: 56cm",
    seller: { name: "Koton Resmi Magaza", rating: 9.8 },
    reviews: [
      { id: 1, author: "Elif Yilmaz", rating: 5, date: "12 Ocak 2024", comment: "Harika bir gomlek! Kumas kalitesi cok iyi, yazlik olarak mukemmel. Kesinlikle tavsiye ederim. Rengi tam istedigim gibi cikti.", helpful: 45, verified: true, title: "Tam bekledigim kalite", location: "Istanbul" },
      { id: 2, author: "Ahmet Kaya", rating: 4, date: "8 Ocak 2024", comment: "Kalip guzel ama rengi fotograftakinden bir ton daha koyu. Yine de memnunum, kumas cok yumusak.", helpful: 32, verified: true, title: "Renk biraz farkli", location: "Ankara" },
      { id: 3, author: "Zeynep Mutlu", rating: 5, date: "5 Ocak 2024", comment: "Tam bekledigim gibi geldi. Keten kumas serin tutuyor, yaz icin ideal. Dikisler cok duzgun.", helpful: 28, verified: true, title: "Yaz favorim oldu", location: "Izmir" },
      { id: 4, author: "Murat Sahin", rating: 3, date: "2 Ocak 2024", comment: "Kalibi biraz dar, bir beden buyuk alin derim. Kumas guzel ama dikislerde kucuk hatalar var.", helpful: 67, verified: false, title: "Beden seciminde dikkat", location: "Bursa" },
    ],
  },
  {
    id: 2,
    category: "giyim",
    brand: "Mavi",
    title: "Slim Fit Jean Pantolon",
    price: 599.99,
    originalPrice: 799.99,
    rating: 4.7,
    reviewCount: 2341,
    image: "/placeholder-product-2.jpg",
    sizes: ["28", "30", "32", "34", "36"],
    colors: ["Koyu Mavi", "Acik Mavi"],
    material: "%98 Pamuk, %2 Elastan",
    dimensions: "Manken uzerindeki beden: 32, Bel: 82cm, Paca: 32cm",
    seller: { name: "Mavi Jeans", rating: 9.6 },
    reviews: [
      { id: 1, author: "Can Bulut", rating: 5, date: "15 Ocak 2024", comment: "Mukemmel kalip, tam vucuda oturuyor. Kumas esnek ve rahat. Her gun giyebilirim.", helpful: 89, verified: true, title: "En iyi jean'im", location: "Istanbul" },
      { id: 2, author: "Selin Tekin", rating: 4, date: "10 Ocak 2024", comment: "Guzel pantolon ama ilk yikamada biraz renk atti. Dikkat edin, ayri yikayin.", helpful: 56, verified: true, title: "Ilk yikamada dikkat", location: "Ankara" },
      { id: 3, author: "Burak Aksoy", rating: 5, date: "7 Ocak 2024", comment: "Her zaman Mavi tercih ederim, bu da harika olmus. Kaliteden hic sikayette kalmadim.", helpful: 34, verified: true, title: "Mavi kalitesi", location: "Izmir" },
    ],
  },
  {
    id: 3,
    category: "mobilya",
    brand: "IKEA",
    title: "MALM Cekmeceli Sifonyer",
    price: 4299.00,
    originalPrice: 5499.00,
    rating: 4.6,
    reviewCount: 892,
    image: "/placeholder-product-3.jpg",
    colors: ["Beyaz", "Mese", "Siyah-Kahve"],
    material: "Masif Ahsap, MDF Kaplama, Geri Donusturulebilir Malzeme",
    dimensions: "Genislik: 80cm, Derinlik: 48cm, Yukseklik: 100cm, Agirlik: 45kg",
    seller: { name: "IKEA Turkiye", rating: 9.4 },
    reviews: [
      { id: 1, author: "Deniz Korkmaz", rating: 5, date: "20 Ocak 2024", comment: "Montaji kolay, goruntusu sik. Yatak odasi icin mukemmel. Cekmeceler cok duzgun calisiyor.", helpful: 78, verified: true, title: "Odam inanilmaz degisti", location: "Istanbul" },
      { id: 2, author: "Ayse Levent", rating: 4, date: "18 Ocak 2024", comment: "Guzel urun ama cekmecelerin raylari biraz zayif kalmis. Dikkatli kullanmak lazim.", helpful: 45, verified: true, title: "Raylara dikkat", location: "Ankara" },
      { id: 3, author: "Emre Yildiz", rating: 3, date: "14 Ocak 2024", comment: "Fotograftaki kadar parlak degil, daha mat bir gorunumu var. Ama islevsel, amacina hizmet ediyor.", helpful: 92, verified: false, title: "Bekledigimden farkli", location: "Izmir" },
    ],
  },
  {
    id: 4,
    category: "mobilya",
    brand: "Kelebek",
    title: "Modern TV Unitesi",
    price: 3199.00,
    originalPrice: 3999.00,
    rating: 4.4,
    reviewCount: 567,
    image: "/placeholder-product-4.jpg",
    colors: ["Ceviz", "Beyaz", "Antrasit"],
    material: "Suntalam, Melamin Kaplama, Metal Ayak",
    dimensions: "Genislik: 180cm, Derinlik: 40cm, Yukseklik: 45cm",
    seller: { name: "Kelebek Mobilya", rating: 9.2 },
    reviews: [
      { id: 1, author: "Fatma Nur", rating: 5, date: "22 Ocak 2024", comment: "Salon icin tam istedigim gibi. Modern ve sik gorunuyor. Misafirlerimden cok ovgu aldim.", helpful: 34, verified: true, title: "Salonumun yildizi", location: "Istanbul" },
      { id: 2, author: "Ali Riza", rating: 4, date: "19 Ocak 2024", comment: "Fiyat/performans olarak iyi ama montaj kilavuzu yetersiz. YouTube'dan video izledim.", helpful: 28, verified: true, title: "Montaj zor", location: "Ankara" },
    ],
  },
  {
    id: 5,
    category: "elektronik",
    brand: "Apple",
    title: "iPhone 15 Pro Max 256GB",
    price: 74999.00,
    originalPrice: 84999.00,
    rating: 4.9,
    reviewCount: 3421,
    image: "/placeholder-product-5.jpg",
    colors: ["Titanyum Siyah", "Titanyum Beyaz", "Titanyum Mavi"],
    material: "Titanyum Cerceve, Seramik Shield On Cam, Mat Cam Arka",
    dimensions: "Ekran: 6.7 inc, Agirlik: 221g, Kalinlik: 8.25mm",
    seller: { name: "Apple Turkiye", rating: 9.9 },
    reviews: [
      { id: 1, author: "Kerem Toprak", rating: 5, date: "25 Ocak 2024", comment: "En iyi iPhone deneyimi. Kamera kalitesi inanilmaz, titanyum cerceve premium hissettiriyor. Gecis yapmaya deger.", helpful: 156, verified: true, title: "Hayatimdaki en iyi telefon", location: "Istanbul" },
      { id: 2, author: "Gamze Sever", rating: 5, date: "23 Ocak 2024", comment: "Fiyati yuksek ama degiyor. Batarya omru cok iyi, gun boyu kullansam bile yuzde 30 kaliyor.", helpful: 89, verified: true, title: "Batarya cok iyi", location: "Ankara" },
      { id: 3, author: "Onur Metin", rating: 4, date: "20 Ocak 2024", comment: "Harika telefon ama sarj adaptoru kutudan cikmiyor, ayri almak gerekiyor. Apple'dan beklemezdim.", helpful: 134, verified: true, title: "Adaptor yok", location: "Izmir" },
    ],
  },
  {
    id: 6,
    category: "elektronik",
    brand: "Samsung",
    title: '65" QLED 4K Smart TV',
    price: 42999.00,
    originalPrice: 54999.00,
    rating: 4.7,
    reviewCount: 1876,
    image: "/placeholder-product-6.jpg",
    colors: ["Siyah"],
    material: "Metal Cerceve, Quantum Dot Ekran, Plastik Arka Panel",
    dimensions: "Ekran: 65 inc, Genislik: 145cm, Yukseklik: 83cm, Agirlik: 21kg",
    seller: { name: "Samsung Turkiye", rating: 9.7 },
    reviews: [
      { id: 1, author: "Hakan Demir", rating: 5, date: "24 Ocak 2024", comment: "Goruntu kalitesi muhtesem, QLED teknolojisi gercekten fark yaratiyor. Film izlemek bambaska.", helpful: 78, verified: true, title: "Sinema deneyimi", location: "Istanbul" },
      { id: 2, author: "Sibel Aydin", rating: 4, date: "21 Ocak 2024", comment: "Cok guzel TV ama Tizen isletim sistemi bazen yavas kalabiliyor. Genel olarak memnunum.", helpful: 45, verified: true, title: "Sistem biraz yavas", location: "Ankara" },
    ],
  },
  {
    id: 7,
    category: "outdoor",
    brand: "The North Face",
    title: "Thermoball Eco Mont",
    price: 5499.00,
    originalPrice: 6999.00,
    rating: 4.8,
    reviewCount: 654,
    image: "/placeholder-product-7.jpg",
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["Siyah", "Lacivert", "Haki"],
    material: "Geri Donusturulmus Polyester, Thermoball Eco Yalitim, DWR Su Itici Kaplama",
    dimensions: "Manken uzerindeki beden: L, Urun Agirligi: 450g",
    seller: { name: "The North Face", rating: 9.5 },
    reviews: [
      { id: 1, author: "Berk Ozturk", rating: 5, date: "26 Ocak 2024", comment: "Dag yuruyuslerinde mukemmel. Hafif ama cok sicak tutuyor. Kalitesi hissediliyor.", helpful: 67, verified: true, title: "Dagda olmaz olmazim", location: "Bolu" },
      { id: 2, author: "Ceren Kaplan", rating: 5, date: "22 Ocak 2024", comment: "Kalitesi bekledigimden de iyi cikti. Kis icin ideal, soguk havalarda bile icimi isitti.", helpful: 45, verified: true, title: "Kis kurtaricim", location: "Erzurum" },
      { id: 3, author: "Tolga Yavuz", rating: 4, date: "18 Ocak 2024", comment: "Guzel mont ama fermuar biraz sert, kullandikca yumusar umarim. Genel olarak memnunum.", helpful: 34, verified: false, title: "Fermuar sert", location: "Ankara" },
    ],
  },
  {
    id: 8,
    category: "outdoor",
    brand: "Salomon",
    title: "X Ultra 4 GTX Outdoor Ayakkabi",
    price: 4299.00,
    originalPrice: 5199.00,
    rating: 4.7,
    reviewCount: 1123,
    image: "/placeholder-product-8.jpg",
    sizes: ["40", "41", "42", "43", "44", "45"],
    colors: ["Siyah/Gri", "Mavi/Turuncu", "Yesil/Siyah"],
    material: "Gore-Tex Su Gecirmez Membran, Contagrip MA Taban, Sentetik Ust",
    dimensions: "Agirlik: 385g (42 numara), Taban Yuksekligi: 10mm",
    seller: { name: "Salomon Turkiye", rating: 9.6 },
    reviews: [
      { id: 1, author: "Serkan Mutlu", rating: 5, date: "27 Ocak 2024", comment: "Gore-Tex gercekten ise yariyor, yagmurda bile ayagim kuru kaldi. Trekking icin super.", helpful: 89, verified: true, title: "Yagmurda bile kuru", location: "Rize" },
      { id: 2, author: "Pinar Erdem", rating: 4, date: "24 Ocak 2024", comment: "Cok rahat ama kalip dar, yarim numara buyuk almanizi oneririm. Performansi mukemmel.", helpful: 112, verified: true, title: "Yarim numara buyuk alin", location: "Antalya" },
      { id: 3, author: "Cem Basaran", rating: 5, date: "20 Ocak 2024", comment: "Trekking icin mukemmel. Tutus kuvveti kayalik zeminlerde bile harika. Tavsiye ederim.", helpful: 56, verified: true, title: "Kayaliklarda bile tutuyor", location: "Mugla" },
    ],
  },
]

const categories = ["New In", "Women", "Men", "Home", "Tech", "Sale"]

const categoryLabels: Record<ProductCategory, string> = {
  giyim: "Fashion",
  mobilya: "Living",
  elektronik: "Technology",
  outdoor: "Adventure",
}

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

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
              <button className="h-10 w-10 flex items-center justify-center rounded-full bg-secondary/50 text-foreground hover:bg-secondary hover:text-accent transition-all duration-300">
                <User className="h-[18px] w-[18px]" strokeWidth={1.5} />
              </button>
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
                Summer Collection 2024
              </span>
              <h2 className="font-serif text-[clamp(2.5rem,6vw,5rem)] text-foreground leading-[0.95] mb-8 font-light">
                The Art of
                <br />
                <em className="font-normal">Understated</em>
                <br />
                Elegance
              </h2>
              <p className="text-muted-foreground text-lg leading-relaxed mb-12 max-w-md">
                Curated pieces that transcend seasons. Discover our exclusive selection of premium essentials.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  size="lg" 
                  className="bg-foreground text-background hover:bg-foreground/90 h-14 px-12 text-[13px] tracking-[0.15em] font-normal group rounded-full"
                >
                  Explore Collection
                  <ArrowRight className="h-4 w-4 ml-3 group-hover:translate-x-1 transition-transform" strokeWidth={1.5} />
                </Button>
                <Button 
                  size="lg" 
                  variant="outline"
                  className="border-foreground/20 text-foreground hover:bg-foreground hover:text-background h-14 px-8 text-[13px] tracking-[0.15em] font-normal group rounded-full"
                >
                  <Play className="h-4 w-4 mr-3" strokeWidth={1.5} fill="currentColor" />
                  Watch Film
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
                <span className="text-[10px] tracking-[0.2em] text-accent uppercase">Editor&apos;s Pick</span>
              </div>
              <p className="text-sm text-foreground leading-relaxed">
                &ldquo;The definitive destination for modern luxury.&rdquo;
              </p>
              <p className="text-xs text-muted-foreground mt-2">Vogue Turkiye</p>
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
        Back to Collection
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
                  <p><span className="text-foreground">Material:</span> {product.material}</p>
                  <p><span className="text-foreground">Dimensions:</span> {product.dimensions}</p>
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

            {/* AI Reality Filter */}
            <div className="mt-8 border border-accent/30 bg-gradient-to-b from-accent/5 to-transparent p-8 lg:p-10 rounded-[2rem]">
              <div className="flex items-start gap-4 mb-10">
                <div className="h-14 w-14 bg-accent/10 flex items-center justify-center flex-shrink-0 rounded-2xl">
                  <Sparkles className="h-5 w-5 text-accent" strokeWidth={1.5} />
                </div>
                <div>
                  <h3 className="text-base font-medium text-foreground tracking-wide">
                    Reality Filter
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">AI-Powered Product Analysis</p>
                </div>
              </div>

              <div className="flex justify-center mb-10">
                <RealityScoreCircle score={78} />
              </div>

              <p className="text-sm text-muted-foreground leading-relaxed mb-8 text-center">
                Get an authentic view of this product based on real customer photos and reviews.
              </p>

              <div className="space-y-4">
                <div className="relative">
                  <Input
                    placeholder="Ask AI about this product..."
                    value={aiMessage}
                    onChange={(e) => setAiMessage(e.target.value)}
                    className="bg-background border-border h-14 pr-14 text-sm rounded-full pl-6"
                  />
                  <button className="absolute right-2 top-1/2 -translate-y-1/2 h-10 w-10 flex items-center justify-center text-muted-foreground hover:text-accent transition-colors rounded-full hover:bg-accent/10">
                    <Send className="h-4 w-4" strokeWidth={1.5} />
                  </button>
                </div>

                <Button className="w-full bg-accent hover:bg-accent/90 text-accent-foreground h-14 text-[13px] tracking-[0.15em] font-normal rounded-full">
                  <Sparkles className="h-4 w-4 mr-2" strokeWidth={1.5} />
                  Analyze Product
                </Button>

                <div className="pt-6 border-t border-border">
                  <p className="text-[10px] text-muted-foreground mb-4 tracking-[0.2em] uppercase">
                    Suggested Questions
                  </p>
                  <div className="space-y-2">
                    {[
                      "How does this look in real life?",
                      "What are the common complaints?",
                      "Size and fit recommendations?",
                    ].map((q, i) => (
                      <button
                        key={i}
                        className="block w-full text-left text-sm text-muted-foreground hover:text-accent transition-colors py-3 px-4 rounded-xl hover:bg-secondary/50"
                        onClick={() => setAiMessage(q)}
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
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
