import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
} from "@/components/ui/dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { GithubIcon, LinkedinIcon } from "lucide-react"
import Link from "next/link"
import { Button } from "./ui/button"

interface DialogProps {
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

const links = [
  {
    name: "Github",
    href: "https://github.com/delfimcelestino",
    icon: <GithubIcon className="h-4 w-4" />,
  },
  {
    name: "Linkedin",
    href: "https://linkedin.com/in/delfim-celestino-6187252b4",
    icon: <LinkedinIcon className="h-4 w-4" />,
  },
]
const CreatorDialog = ({ open, onOpenChange }: DialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader className="flex items-center justify-center">
          <Avatar>
            <AvatarImage src="https://github.com/delfimcelestino.png" />
            <AvatarFallback>DC</AvatarFallback>
          </Avatar>
          <h1>Delfim Celestino</h1>
          <DialogDescription>
            "Criador do Touch Decision – Porque, às vezes, a decisão mais
            difícil é escolher qual dedo destacar!"
          </DialogDescription>
        </DialogHeader>

        <div className="my-4 flex items-center justify-center gap-2">
          {links.map((link) => (
            <Button asChild variant="outline" key={link.name}>
              <Link href={link.href} target="_blank" rel="noopener noreferrer">
                {link.icon}
              </Link>
            </Button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default CreatorDialog
