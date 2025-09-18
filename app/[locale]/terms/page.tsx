import {getTranslations} from 'next-intl/server'

export default async function TermsPage({params}:{params: Promise<{locale:string}>}) {
  const {locale} = await params
  const t = await getTranslations({locale})
  return (
    <div className="container max-w-3xl mx-auto py-16">
      <h1 className="text-3xl font-bold mb-4">{t('pages.terms.title')}</h1>
      <p className="text-muted-foreground whitespace-pre-line">{t('pages.terms.body')}</p>
    </div>
  )
}


