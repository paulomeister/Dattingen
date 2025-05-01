import Link from "next/link"
import { UserCircle } from "lucide-react"

export function Navbar() {
  return (
    <header className="w-full border-b border-border bg-background">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <Link href="/" className="text-xl font-bold text-primary">
            Normativas
          </Link>
        </div>
        <nav className="hidden md:flex items-center space-x-6">
          <Link href="/list-normatives" className="text-muted-foreground hover:text-primary transition-colors">
            Normativas
          </Link>
          <Link href="/create-normative" className="text-muted-foreground hover:text-primary transition-colors">
            Crear
          </Link>
          <Link href="/upload-normative" className="text-muted-foreground hover:text-primary transition-colors">
            Subir
          </Link>
        </nav>
        <div className="flex items-center gap-4">
          <Link href="/profile">
            <UserCircle className="h-8 w-8 text-primary hover:text-secondary transition-colors" />
          </Link>
        </div>
      </div>
    </header>
  )
}
