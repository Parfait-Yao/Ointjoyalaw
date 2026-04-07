import Link from "next/link"
import { Calendar, MapPin } from "lucide-react"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { format } from "date-fns"
import { fr } from "date-fns/locale"

interface EventProps {
  id: string
  title: string
  description: string
  startDate: Date | string
  location?: string | null
  imageUrl?: string | null
}

export function EventCard({ id, title, description, startDate, location, imageUrl }: EventProps) {
  const date = new Date(startDate)

  return (
    <Card className="overflow-hidden flex flex-col hover:shadow-lg transition-shadow duration-300">
      <div className="relative w-full h-48 bg-gray-200">
        {imageUrl ? (
          <img src={imageUrl} alt={title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            Aucune image
          </div>
        )}
      </div>
      <CardHeader className="pb-4">
        <h3 className="font-bold text-xl line-clamp-1">{title}</h3>
      </CardHeader>
      <CardContent className="flex-grow space-y-4">
        <p className="text-gray-600 line-clamp-2 text-sm">{description}</p>
        <div className="space-y-2 text-sm text-gray-500">
          <div className="flex items-center">
            <Calendar className="mr-2 h-4 w-4 text-purple-700" />
            {format(date, "d MMMM yyyy 'à' HH:mm", { locale: fr })}
          </div>
          {location && (
            <div className="flex items-center">
              <MapPin className="mr-2 h-4 w-4 text-purple-700" />
              <span className="line-clamp-1">{location}</span>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter>
        <Button asChild className="w-full bg-yellow-500 hover:bg-yellow-600 text-gray-900 border-none">
          <Link href={`/evenements/${id}`}>Voir les détails</Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
