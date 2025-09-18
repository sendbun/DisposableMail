import {getTranslations} from 'next-intl/server'

export default async function AboutPage({params}:{params: Promise<{locale:string}>}) {
  const {locale} = await params
  const t = await getTranslations({locale})
  return (
    <div className="container max-w-3xl mx-auto py-16">
      <h1 className="text-3xl font-bold mb-4">{t('pages.about.title')}</h1>
      <p className="text-muted-foreground">{t('pages.about.body')}</p>
    </div>
  )
}


