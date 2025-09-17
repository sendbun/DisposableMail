import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "../globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { LanguageSwitcher } from "@/components/language-switcher"
import { Toaster } from "sonner"
import { NextIntlClientProvider } from 'next-intl'
import { notFound } from 'next/navigation'

import {messagesMap} from '../../messages'
import type {AppLocale} from '../../i18n'

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "TempMail - Temporary Email Service",
  description: "Generate temporary email addresses for privacy and security",
  generator: 'v0.dev'
}

export default async function LocaleLayout({
    children,
    params
}: {
    children: React.ReactNode,
    params: Promise<{locale: string}>
}) {
    const {locale} = await params
    const safeLocale = (['en','es'].includes(locale) ? locale : 'en') as AppLocale
    const messages = messagesMap[safeLocale]
    console.log('[i18n] layout', {locale, safeLocale, messagesLoaded: !!messages})

  return (
    <html lang={safeLocale} suppressHydrationWarning>
      <body className={inter.className}>
        <NextIntlClientProvider locale={safeLocale} messages={messages}>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
            <div className="min-h-screen bg-background">
              <Header />
              <main>{children}</main>
              <Footer />
            </div>
            <Toaster 
              position="top-right"
              richColors
              closeButton
              duration={4000}
            />
            <LanguageSwitcher />
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
