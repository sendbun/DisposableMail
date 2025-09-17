import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Shield, Clock, Users, Star, CheckCircle, RefreshCw, Mail, BookOpen, HelpCircle, Settings, AlertTriangle } from "lucide-react"
import { EmailGenerator } from "@/components/email-generator"
import { getTranslations } from 'next-intl/server'
import {locales} from '../../i18n'
import Link from 'next/link'

export default async function HomePage({params}:{params: Promise<{locale:string}>}) {
  const {locale} = await params
  const t = await getTranslations({locale})
  const benefits = [
    {
      icon: Shield,
      title: t('home.privacyProtection'),
      description: t('home.privacyProtectionDescription'),
    },
    { icon: Clock, title: t('home.autoExpiration'), description: t('home.autoExpirationDescription') },
    { icon: RefreshCw, title: t('home.instantGeneration'), description: t('home.instantGenerationDescription') },
    { icon: Mail, title: t('home.realInbox'), description: t('home.realInboxDescription') },
  ]

  const testimonials = [
    {
      name: t('testimonials.sarahChen.name'),
      role: t('testimonials.sarahChen.role'),
      content: t('testimonials.sarahChen.content'),
      rating: 5,
    },
    { name: t('testimonials.mikeJohnson.name'), role: t('testimonials.mikeJohnson.role'), content: t('testimonials.mikeJohnson.content'), rating: 5 },
    { name: t('testimonials.emmaDavis.name'), role: t('testimonials.emmaDavis.role'), content: t('testimonials.emmaDavis.content'), rating: 5 },
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="w-full max-w-[1400px] mx-auto text-center">
          <Badge variant="secondary" className="mb-4">
            <Users className="h-3 w-3 mr-1" />
            {t('home.trustedBy')}
          </Badge>

          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-[#1b294b] to-[#2252ba] bg-clip-text text-transparent">
            {t('home.title')}
          </h1>

          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            {t('home.subtitle')}
          </p>

          {/* Email Generator */}
          <EmailGenerator />

          <div className="flex flex-wrap justify-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <CheckCircle className="h-4 w-4 text-green-500" />
              {t('home.noRegistration')}
            </div>
            <div className="flex items-center gap-1">
              <CheckCircle className="h-4 w-4 text-green-500" />
              {t('home.anonymous')}
            </div>
            <div className="flex items-center gap-1">
              <CheckCircle className="h-4 w-4 text-green-500" />
              {t('home.autoDelete')}
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-[#f9f9fa]">
        <div className="w-full max-w-[1400px]  mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">{t('home.whyChoose')}</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              {t('home.whyChooseDescription')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardHeader>
                  <benefit.icon className="h-12 w-12 mx-auto mb-4 text-black" />
                  <CardTitle className="text-lg">{benefit.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{benefit.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20">
        <div className="w-full max-w-[1400px] mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-black mb-2">2M+</div>
              <div className="text-muted-foreground">{t('home.activeUsers')}</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-black mb-2">50M+</div>
              <div className="text-muted-foreground">{t('home.emailsGenerated')}</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-black mb-2">99.9%</div>
              <div className="text-muted-foreground">{t('home.uptime')}</div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-muted/50">
        <div className="w-full max-w-[1400px] mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">{t('home.whatUsersSay')}</h2>
            <p className="text-muted-foreground">{t('home.whatUsersSayDescription')}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <Card key={index}>
                <CardHeader>
                  <div className="flex items-center gap-1 mb-2">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <CardDescription>"{testimonial.content}"</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="font-semibold">{testimonial.name}</div>
                  <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Tech Section */}
      <section className="py-20 bg-[#f9f9fa]">
        <div className="w-full max-w-[1400px] mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">{t('techSection.title')}</h2>
          </div>

          <div className="prose prose-lg max-w-none">
            <div className="mb-8">
              <p className="text-muted-foreground leading-relaxed mb-4">
                {t('techSection.intro')}
              </p>
              <p className="text-muted-foreground leading-relaxed">
                {t('techSection.problem')}
              </p>
            </div>

            <div className="mb-8">
              <h3 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                <BookOpen className="h-6 w-6 text-blue-600" />
                {t('techSection.whatIsTitle')}
              </h3>
              <p className="text-muted-foreground leading-relaxed mb-4">
                {t('techSection.whatIsDescription')}
              </p>
              <p className="text-muted-foreground leading-relaxed">
                {t('techSection.whatIsDescription2')}
              </p>
            </div>

            <div className="mb-8">
              <h3 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                <HelpCircle className="h-6 w-6 text-green-600" />
                {t('techSection.whyNeedTitle')}
              </h3>
              <p className="text-muted-foreground leading-relaxed mb-4">
                {t('techSection.whyNeedDescription')}
              </p>
              <p className="text-muted-foreground leading-relaxed mb-6">
                {t('techSection.whyNeedDescription2')}
              </p>
              
              <p className="text-muted-foreground leading-relaxed mb-4 font-medium">
                {t('techSection.legitimateReasons')}
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <Card className="p-4">
                  <CardContent className="p-0">
                    <h4 className="font-semibold mb-2 text-blue-600">{t('techSection.reason1Title')}</h4>
                    <p className="text-sm text-muted-foreground">{t('techSection.reason1')}</p>
                  </CardContent>
                </Card>
                
                <Card className="p-4">
                  <CardContent className="p-0">
                    <h4 className="font-semibold mb-2 text-green-600">{t('techSection.reason2Title')}</h4>
                    <p className="text-sm text-muted-foreground">{t('techSection.reason2')}</p>
                  </CardContent>
                </Card>
                
                <Card className="p-4">
                  <CardContent className="p-0">
                    <h4 className="font-semibold mb-2 text-purple-600">{t('techSection.reason3Title')}</h4>
                    <p className="text-sm text-muted-foreground">{t('techSection.reason3')}</p>
                  </CardContent>
                </Card>
                
                <Card className="p-4">
                  <CardContent className="p-0">
                    <h4 className="font-semibold mb-2 text-red-600">{t('techSection.reason4Title')}</h4>
                    <p className="text-sm text-muted-foreground">{t('techSection.reason4')}</p>
                  </CardContent>
                </Card>
              </div>
            </div>

            <div className="mb-8">
              <h3 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                <Settings className="h-6 w-6 text-orange-600" />
                {t('techSection.howToChooseTitle')}
              </h3>
              <p className="text-muted-foreground leading-relaxed mb-4">
                {t('techSection.howToChooseDescription')}
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                <div className="flex items-start gap-3 p-3 bg-white rounded-lg border">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-muted-foreground">{t('techSection.criteria1')}</p>
                </div>
                <div className="flex items-start gap-3 p-3 bg-white rounded-lg border">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-muted-foreground">{t('techSection.criteria2')}</p>
                </div>
                <div className="flex items-start gap-3 p-3 bg-white rounded-lg border">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-muted-foreground">{t('techSection.criteria3')}</p>
                </div>
                <div className="flex items-start gap-3 p-3 bg-white rounded-lg border">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-muted-foreground">{t('techSection.criteria4')}</p>
                </div>
                <div className="flex items-start gap-3 p-3 bg-white rounded-lg border">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-muted-foreground">{t('techSection.criteria5')}</p>
                </div>
                <div className="flex items-start gap-3 p-3 bg-white rounded-lg border">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-muted-foreground">{t('techSection.criteria6')}</p>
                </div>
              </div>
            </div>

            <div className="mb-8">
              <h3 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                <Mail className="h-6 w-6 text-indigo-600" />
                {t('techSection.howToUseTitle')}
              </h3>
              <p className="text-muted-foreground leading-relaxed mb-4">
                {t('techSection.howToUseDescription')}
              </p>
              <p className="text-muted-foreground leading-relaxed mb-4">
                {t('techSection.howToUseDescription2')}
              </p>
              <p className="text-muted-foreground leading-relaxed">
                {t('techSection.howToUseDescription3')}
              </p>
            </div>

            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg border border-blue-200">
              <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-blue-600" />
                {t('techSection.conclusionTitle')}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {t('techSection.conclusion')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="w-full max-w-[1400px] mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">{t('home.readyToProtect')}</h2>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            {t('home.readyToProtectDescription')}
          </p>
          <Link href="inbox">
            <Button size="lg" className="text-lg px-8">
              {t('home.getStartedNow')}
            </Button>
          </Link>
        </div>
      </section>
    </div>
  )
}

export function generateStaticParams() {
  return Array.from(locales).map((locale) => ({locale}))
}

export const revalidate = 0
