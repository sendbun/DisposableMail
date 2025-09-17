import createMiddleware from 'next-intl/middleware'
import {locales, defaultLocale} from './lib/i18n-config'

export default createMiddleware({
	locales: Array.from(locales),
	defaultLocale
})

export const config = {
	matcher: ['/((?!api|_next|_vercel|.*\\..*).*)']
}