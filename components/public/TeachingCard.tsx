import { BookOpen, Youtube, FileText } from "lucide-react"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface TeachingProps {
  id: string
  title: string
  youtubeUrl?: string | null
  pdfUrl?: string | null
  publishedAt: Date | string
}

export function TeachingCard({ title, youtubeUrl, pdfUrl, publishedAt }: TeachingProps) {
  const date = new Date(publishedAt).toLocaleDateString("fr-FR")

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3 border-b border-gray-100">
        <div className="flex items-start justify-between">
          <h3 className="font-semibold text-lg line-clamp-2 pr-4">{title}</h3>
          <BookOpen className="text-purple-700 h-6 w-6 flex-shrink-0" />
        </div>
        <p className="text-xs text-gray-400 mt-2">Publié le {date}</p>
      </CardHeader>
      <CardContent className="pt-4 pb-2" />
      <CardFooter className="flex gap-2">
        {youtubeUrl && (
          <Button variant="outline" asChild className="flex-1 border-gray-200 hover:bg-red-50 hover:text-red-600 hover:border-red-200">
            <a href={youtubeUrl} target="_blank" rel="noopener noreferrer">
              <Youtube className="mr-2 h-4 w-4" /> Vidéo
            </a>
          </Button>
        )}
        {pdfUrl && (
          <Button variant="outline" asChild className="flex-1 border-gray-200 hover:bg-gray-100">
            <a href={pdfUrl} target="_blank" rel="noopener noreferrer">
              <FileText className="mr-2 h-4 w-4" /> Support PDF
            </a>
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}
