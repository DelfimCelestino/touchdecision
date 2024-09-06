import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
} from "@/components/ui/dialog"
import { Button } from "./ui/button"
import { GithubIcon, LinkedinIcon } from "lucide-react"
import Link from "next/link"

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

const InfoModal = ({ open, onOpenChange }: DialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader className="flex items-center justify-center">
          <h1 className="text-2xl font-bold">Sobre o Touch Decision</h1>
          <DialogDescription className="mt-2 text-center">
            "Se você já se pegou em um dilema sobre quem vai pagar a conta ou
            quem vai enfrentar o desafio de hoje, o Touch Decision está aqui
            para ajudar! Com este jogo, tudo o que você precisa fazer é colocar
            seus dedos na tela. O Touch Decision vai decidir aleatoriamente quem
            vai se aventurar ou pagar a conta! É a maneira mais divertida e
            justa de resolver disputas e tomar decisões. Prepare-se para a
            diversão e deixe a sorte decidir!"
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

export default InfoModal
