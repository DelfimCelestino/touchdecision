"use client"

import gsap from "gsap"
import { Download } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { Button } from "./ui/button"

interface BeforeInstallPromptEvent extends Event {
  prompt: () => void
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>
}

const InstallModal = () => {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null)
  const [isInstalled, setIsInstalled] = useState(false)
  const poupup = useRef(null)

  useEffect(() => {
    const handler = (e: BeforeInstallPromptEvent) => {
      e.preventDefault()
      setDeferredPrompt(e)
    }

    window.addEventListener("beforeinstallprompt", handler as EventListener)

    // Check if PWA is already installed
    if (
      window.matchMedia("(display-mode: standalone)").matches ||
      (window.navigator as any).standalone
    ) {
      setIsInstalled(true)
    }

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handler as EventListener,
      )
    }
  }, [])
  useEffect(() => {
    gsap.fromTo(
      poupup.current,
      { opacity: 0, y: 100 },
      { opacity: 1, y: 0, delay: 0.5, ease: "power3.out" },
    )
  }, [deferredPrompt])

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt()
      const choiceResult = await deferredPrompt.userChoice
      if (choiceResult.outcome === "accepted") {
        console.log("PWA installed")
      } else {
        console.log("PWA installation dismissed")
      }
      setDeferredPrompt(null)
    }
  }
  return (
    <>
      {!isInstalled && deferredPrompt && (
        <div
          ref={poupup}
          className="fixed bottom-0 left-0 right-0 z-50 flex flex-col items-center justify-center gap-2 rounded-tl-3xl rounded-tr-3xl bg-green-500 p-2 text-zinc-50"
        >
          <p className="text-center text-xs font-bold lg:text-base">
            Heii, o que acha de instalar o Touch Decision ? clique no botão
            abaixo para instalar o Touch Decision no seu dispositivo
          </p>
          <Button
            className="flex items-center gap-2"
            onClick={handleInstallClick}
          >
            Instalar agora <Download className="h-4 w-4" />
          </Button>
        </div>
      )}
    </>
  )
}

export default InstallModal
