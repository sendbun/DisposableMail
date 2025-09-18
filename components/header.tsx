"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu, Moon, Sun, Mail, Inbox } from "lucide-react"
import { useTheme } from "next-themes"
import { useTranslations, useLocale } from 'next-intl'

export function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const { theme, setTheme } = useTheme()
  const t = useTranslations()
  const locale = useLocale()
  if (typeof window !== 'undefined') {
    // Log active locale for debugging
    console.log('[i18n] header locale', locale)
  }

  const navigation = [
    { name: t('navigation.home'), href: `/${locale}` },
    { name: t('navigation.inbox'), href: `/${locale}/inbox` },
    { name: t('navigation.fiveMinEmail'), href: `/${locale}/5-minutes-temporary-email` },
  ]

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="w-full max-w-[1400px] mx-auto flex h-16 items-center justify-between">
        <Link href={`/${locale}`} className="flex items-center space-x-2">
          <Image src="/logo.png" alt="Logo" width={118} height={48} />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          {navigation.map((item) => (
            <div key={item.name} className="relative group">
              <Link href={item.href} className="text-sm font-medium transition-colors hover:text-primary">
                {item.name}
              </Link>
              {/* {item.submenu && (
                <div className="absolute top-full left-0 mt-2 w-48 bg-background border rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                  {item.submenu.map((subitem) => (
                    <Link
                      key={subitem.name}
                      href={subitem.href}
                      className="block px-4 py-2 text-sm hover:bg-accent rounded-md"
                    >
                      {subitem.name}
                    </Link>
                  ))}
                </div>
              )} */}
            </div>
          ))}
        </nav>
 
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="icon" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
            <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          </Button>

          {/* Mobile Navigation */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <nav className="flex flex-col space-y-4 mt-8">
                {navigation.map((item) => (
                  <div key={item.name}>
                    <Link href={item.href} className="text-lg font-medium" onClick={() => setIsOpen(false)}>
                      {item.name}
                    </Link>
                    {/* {item.submenu && (
                      <div className="ml-4 mt-2 space-y-2">
                        {item.submenu.map((subitem) => (
                          <Link
                            key={subitem.name}
                            href={subitem.href}
                            className="block text-sm text-muted-foreground"
                            onClick={() => setIsOpen(false)}
                          >
                            {subitem.name}
                          </Link>
                        ))}
                      </div>
                    )} */}
                  </div>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
