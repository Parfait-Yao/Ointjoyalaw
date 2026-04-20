import { Heart, ExternalLink, Star, Globe } from "lucide-react"
import NextImage from "next/image"
import Link from "next/link"

interface OrganizationProps {
  id?: string
  name: string
  acronym: string
  description: string
  websiteUrl?: string | null
  imageUrl?: string | null
  role?: string | null
}

export function OrganizationCard({ name, acronym, description, websiteUrl, imageUrl, role }: OrganizationProps) {
  return (
    <div className="bg-white rounded-[24px] shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100 p-5 flex flex-col h-full text-left relative overflow-hidden group">
      {/* Top Row */}
      <div className="flex justify-between items-start mb-4 relative z-10">
        {/* Avatar and Role Stack */}
        <div className="flex -space-x-2">
          <div className="w-12 h-12 rounded-full border-2 border-white overflow-hidden shadow-sm bg-gray-100 flex items-center justify-center shrink-0 z-10 relative">
            {imageUrl ? (
              <NextImage src={imageUrl} alt={name} fill className="object-cover" sizes="48px" />
            ) : (
              <span className="text-sm font-black text-gray-400">
                {acronym ? acronym : name.substring(0, 2).toUpperCase()}
              </span>
            )}
          </div>
          {/* Role badge rendered as a stack element */}
          {role && (
            <div className="flex items-center pl-4 -ml-2 bg-gray-50/80 backdrop-blur-sm h-12 rounded-r-full pr-4 border border-gray-100 z-0 text-[10px] font-bold text-gray-500 uppercase tracking-wider">
              {role}
            </div>
          )}
        </div>

        {/* Bookmark/Heart Button */}
        <button className="w-10 h-10 rounded-2xl border border-gray-200 flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 hover:border-red-100 transition-colors shrink-0 bg-white">
          <Heart className="w-5 h-5" />
        </button>
      </div>

      {/* Title and Description */}
      <h3 className="text-[17px] font-bold text-gray-900 tracking-tight leading-tight mb-2 relative z-10">
        {name}
      </h3>
      <p className="text-sm text-gray-500/90 leading-relaxed line-clamp-2 mb-6 flex-1 relative z-10">
        {description || "Une organisation au service de l'œuvre globale du ministère, apportant impact et soutien."}
      </p>

      {/* Action Buttons */}
      <div className="flex items-center gap-3 w-full mt-auto relative z-10">
        {websiteUrl ? (
          <a
            href={websiteUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 h-10 rounded-xl border border-gray-200 flex items-center justify-center gap-2 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors bg-white shadow-sm"
          >
            <ExternalLink className="w-4 h-4" /> Voir
          </a>
        ) : (
          <div className="flex-1 h-10 rounded-xl border border-gray-200 flex items-center justify-center gap-2 text-sm font-semibold text-gray-400 opacity-50 cursor-not-allowed bg-gray-50 shadow-sm">
            <Globe className="w-4 h-4" /> Voir
          </div>
        )}

        <Link
          href="/contact"
          className="flex-[1.2] h-10 rounded-xl bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center gap-2 text-sm font-semibold transition-colors shadow-sm"
        >
          <Star className="w-4 h-4" /> Rejoindre
        </Link>
      </div>
    </div>
  )
}
