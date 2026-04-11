"use client"

import NextImage from "next/image"
import { Sparkles } from "lucide-react"
import { ReactNode } from "react"

interface CloudImage {
  url: string
  h?: string
  height?: string // compatibility for different page formats
  mt: string
}

interface ImageCloudHeroProps {
  images: CloudImage[]
  badgeText: string
  title: ReactNode
  description: string
  children?: ReactNode // for extra info like frequency/alerts
}

export function ImageCloudHero({ images, badgeText, title, description, children }: ImageCloudHeroProps) {
  return (
    <div className="bg-white">
      {/* ── IMAGE CLOUD ─────────────────── */}
      <section className="pt-20 pb-12 overflow-hidden bg-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-4 md:gap-6 items-start">
            {images.map((img, idx) => (
              <div 
                key={idx}
                className={`relative ${img.h || img.height || "h-64"} w-32 md:w-48 rounded-[2rem] overflow-hidden shadow-2xl transform transition-transform duration-1000 hover:scale-105 active:scale-95 ${img.mt} animate-float`}
                style={{ animationDelay: `${idx * 0.6}s` }}
              >
                <NextImage 
                  src={img.url} 
                  alt="Atmosphere" 
                  fill 
                  priority={idx < 3}
                  className="object-cover" 
                  sizes="(max-w-768px) 128px, 192px"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#3b0a68]/20" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HEADER CONTENT ────────────────────── */}
      <section className="pb-24 bg-white relative z-10">
        <div className="container mx-auto px-4 text-center">
            <div className="inline-flex items-center gap-2 bg-[#f4ecf9] border border-[#3b0a68]/10 rounded-full px-5 py-2 mb-10 shadow-sm animate-fade-in">
                <Sparkles className="h-3 w-3 text-[#d4af37]" />
                <span className="text-[11px] font-black tracking-[0.2em] text-[#3b0a68] uppercase">{badgeText}</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-gray-900 mb-8 leading-[0.95] tracking-tight max-w-5xl mx-auto animate-fade-in">
                {title}
            </h1>
            
            <p className="text-xl text-gray-500 font-medium max-w-2xl mx-auto mb-16 leading-relaxed">
                {description}
            </p>

            {children}
        </div>

        <style jsx global>{`
          @keyframes float {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-15px); }
          }
          .animate-float {
            animation: float 6s ease-in-out infinite;
          }
          @keyframes fade-in {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .animate-fade-in {
            animation: fade-in 1s ease-out forwards;
          }
        `}</style>
      </section>
    </div>
  )
}
