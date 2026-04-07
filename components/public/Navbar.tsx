import Link from "next/link"
import { Button } from "@/components/ui/button"

export function Navbar() {
  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-xl font-bold tracking-tight text-primary">
            Ointjoyalaw
          </span>
        </Link>
        <div className="hidden md:flex gap-6 items-center flex-1 justify-center shrink-0">
          <Link href="/leader" className="text-sm font-medium hover:text-primary transition-colors">Notre Leader</Link>
          <Link href="/evenements" className="text-sm font-medium hover:text-primary transition-colors">Événements</Link>
          <Link href="/enseignements" className="text-sm font-medium hover:text-primary transition-colors">Enseignements</Link>
          <Link href="/organisations" className="text-sm font-medium hover:text-primary transition-colors">Organisations</Link>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/dons">
            <Button variant="secondary" className="shadow-md">Faire un Don</Button>
          </Link>
        </div>
      </div>
    </nav>
  )
}
