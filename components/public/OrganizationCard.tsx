import { Card, CardContent } from "@/components/ui/card"
import { ExternalLink, Star } from "lucide-react"

interface OrganizationProps {
  name: string
  acronym: string
  description: string
  website?: string
  logo?: string
}

export function OrganizationCard({ name, acronym, description, website }: OrganizationProps) {
  return (
    <Card className="group relative h-full bg-white rounded-[2rem] border border-gray-100 shadow-[0_10px_40px_rgba(0,0,0,0.02)] hover:shadow-[0_40px_80px_rgba(59,10,104,0.08)] transition-all duration-700 hover:-translate-y-2 overflow-hidden flex flex-col p-8">
      {/* Stars Header like the Organizations page mockup */}
      <div className="flex gap-1 mb-6">
        {[1, 2, 3, 4, 5].map(i => (
            <Star key={i} className="h-3.5 w-3.5 fill-[#d4af37] text-[#d4af37]" />
        ))}
      </div>

      <CardContent className="p-0 flex flex-col flex-1">
        <p className="text-gray-600 mb-8 text-sm font-medium leading-relaxed flex-1 italic">
          &quot;{description}&quot;
        </p>
        
        <div className="flex items-center gap-4 mt-auto pt-6 border-t border-gray-50">
            <div className="h-12 w-12 rounded-2xl bg-[#f4ecf9] group-hover:bg-[#3b0a68] flex items-center justify-center text-[#3b0a68] group-hover:text-white font-black text-xs flex-shrink-0 transition-colors duration-500">
                {acronym}
            </div>
            <div className="flex-1">
                <h3 className="font-black text-base leading-tight text-gray-900 group-hover:text-[#3b0a68] transition-colors mb-1">{name}</h3>
                <p className="text-[10px] text-[#d4af37] font-black uppercase tracking-widest leading-none">Organisation Affiliée</p>
            </div>
            
            {website && (
                <a 
                    href={website} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="h-10 w-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 hover:text-[#3b0a68] hover:bg-white border border-transparent hover:border-gray-100 transition-all shadow-sm"
                >
                    <ExternalLink className="h-4 w-4" />
                </a>
            )}
        </div>
      </CardContent>
    </Card>
  )
}
