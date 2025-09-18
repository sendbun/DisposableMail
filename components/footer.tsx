"use client"

import Link from "next/link"
import { Twitter, Github, Linkedin, Globe } from "lucide-react"
import Image from "next/image"
import { useTranslations, useLocale } from 'next-intl'
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { useRouter, usePathname } from 'next/navigation'

export function Footer() {
  const t = useTranslations()
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()

  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'es', name: 'Español', flag: '🇪🇸' },
  ]

  const handleLanguageChange = (newLocale: string) => {
    // Remove the current locale from the pathname
    const pathWithoutLocale = pathname.replace(`/${locale}`, '') || '/'
    // Navigate to the new locale
    router.push(`/${newLocale}${pathWithoutLocale}`)
  }

  const currentLanguage = languages.find(lang => lang.code === locale)

  return (
    <footer className="border-t bg-background">
      <div className="w-full max-w-[1400px] mx-auto py-12">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Image src="/logo.png" alt="Logo" width={118} height={48} />
            </div>
            <p className="text-sm text-muted-foreground">
              {t('footer.description')}
            </p>
            <div className="flex space-x-4">
              <Twitter className="h-5 w-5 text-muted-foreground hover:text-primary cursor-pointer" />
              <Github className="h-5 w-5 text-muted-foreground hover:text-primary cursor-pointer" />
              <Linkedin className="h-5 w-5 text-muted-foreground hover:text-primary cursor-pointer" />
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-4">{t('footer.features')}</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href={`/${locale}/features/auto_expiration`} className="text-muted-foreground hover:text-primary">
                  {t('footer.autoExpiration')}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/features/custom_domain`} className="text-muted-foreground hover:text-primary">
                  {t('footer.customDomain')}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/features/email_forwarding`} className="text-muted-foreground hover:text-primary">
                  {t('footer.emailForwarding')}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">{t('footer.services')}</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href={`/${locale}/5-minutes-temporary-email`} className="text-muted-foreground hover:text-primary">
                  {t('footer.fiveMinEmail')}
                </Link>
              </li>
              <li>
                <Link href="#" className="text-muted-foreground hover:text-primary">
                  {t('footer.tenMinEmail')}
                </Link>
              </li>
              <li>
                <Link href="#" className="text-muted-foreground hover:text-primary">
                  {t('footer.oneHourEmail')}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">{t('footer.company')}</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href={`/${locale}/about`} className="text-muted-foreground hover:text-primary">
                  {t('footer.about')}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/privacy`} className="text-muted-foreground hover:text-primary">
                  {t('footer.privacyPolicy')}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/terms`} className="text-muted-foreground hover:text-primary">
                  {t('footer.termsOfService')}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/contact`} className="text-muted-foreground hover:text-primary">
                  {t('footer.contact')}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <Globe className="h-4 w-4" />
              {t('footer.language')}
            </h3>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full justify-start"
                >
                  <span className="mr-2">{currentLanguage?.flag}</span>
                  {currentLanguage?.name}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-48">
                {languages.map((language) => (
                  <DropdownMenuItem
                    key={language.code}
                    onClick={() => handleLanguageChange(language.code)}
                    className={locale === language.code ? 'bg-accent' : ''}
                  >
                    <span className="mr-2">{language.flag}</span>
                    {language.name}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
          <p>{t('footer.copyright')}</p>
        </div>
      </div>
    </footer>
  )
}
