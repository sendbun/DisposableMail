"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Copy, RefreshCw, Mail, Loader2, AlertCircle, CheckCircle } from "lucide-react"
import { toast } from "sonner"
import { initializeEmailAccount, loadEmailData, clearEmailData, type EmailAccount } from "@/lib/email-service"
import Link from "next/link"
import { useTranslations, useLocale } from 'next-intl'

export function EmailGenerator() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [accountId, setAccountId] = useState<string | null>(null)
  const t = useTranslations()
  const locale = useLocale()

  // Initialize email account on component mount
  useEffect(() => {
    initializeAccount()
  }, [])

  const initializeAccount = async () => {
    try {
      setIsLoading(true)
      setError(null)
      
      // Check for existing account in localStorage
      const existingData = loadEmailData()
      if (existingData?.currentAccount) {
        const account = existingData.currentAccount
        setEmail(account.email)
        setPassword(account.password)
        setAccountId(account.id)
        setIsLoading(false)
        
        toast.success(t('emailGenerator.emailLoaded'), {
          description: t('emailGenerator.emailLoadedDescription')
        })
        return
      }

      // Create new account
      const account = await initializeEmailAccount()
      setEmail(account.email)
      setPassword(account.password)
      setAccountId(account.id)
      
      // Check if this is a mock account (API failed)
      if (account.domain_id === 'mock') {
        toast.info(t('emailGenerator.demoMode'), {
          description: t('emailGenerator.demoModeDescription')
        })
      } else {
        toast.success(t('emailGenerator.emailCreated'), {
          description: t('emailGenerator.emailCreatedDescription')
        })
      }
    } catch (err) {
      console.error('Error initializing account:', err)
      setError(err instanceof Error ? err.message : 'Failed to create email account')
      
      // Fallback to mock email
      setEmail("temp.user.12345@sendbun.com")
      setPassword("temp123456")
      setAccountId(Date.now().toString())
      
      toast.info(t('emailGenerator.demoModeFallback'), {
        description: t('emailGenerator.demoModeFallbackDescription')
      })
    } finally {
      setIsLoading(false)
    }
  }

  const generateNewAccount = async () => {
    try {
      setIsGenerating(true)
      setError(null)
      
      toast.info(t('emailGenerator.generatingNew'), {
        description: t('emailGenerator.generatingNewDescription')
      })
      
      // Clear existing data
      clearEmailData()
      
      // Create new account
      const account = await initializeEmailAccount()
      setEmail(account.email)
      setPassword(account.password)
      setAccountId(account.id)
      
      // Check if this is a mock account (API failed)
      if (account.domain_id === 'mock') {
        toast.info(t('emailGenerator.demoMode'), {
          description: t('emailGenerator.demoModeDescription')
        })
      } else {
        toast.success(t('emailGenerator.newEmailCreated'), {
          description: t('emailGenerator.newEmailCreatedDescription')
        })
      }
    } catch (err) {
      console.error('Error generating new account:', err)
      setError(err instanceof Error ? err.message : 'Failed to generate new email')
      
      // Fallback to mock email
      setEmail("temp.user." + Date.now() + "@sendbun.com")
      setPassword("temp123456")
      setAccountId(Date.now().toString())
      
      toast.info(t('emailGenerator.demoModeFallback'), {
        description: t('emailGenerator.demoModeFallbackDescription')
      })
    } finally {
      setIsGenerating(false)
    }
  }

  const copyEmail = () => {
    navigator.clipboard.writeText(email)
    toast.success(t('emailGenerator.emailCopied'), {
      description: t('emailGenerator.emailCopiedDescription')
    })
  }

  if (isLoading) {
    return (
      <Card className="max-w-2xl mx-auto mb-8">
        <CardHeader>
          <CardTitle className="text-left">{t('emailGenerator.title')}</CardTitle>
          <CardDescription className="text-left">
            {t('emailGenerator.creating')}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="max-w-2xl mx-auto mb-8">
      <CardHeader>
        <CardTitle className="text-left">{t('emailGenerator.title')}</CardTitle>
        <CardDescription className="text-left">
          {t('emailGenerator.description')}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <div className="bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg p-4">
            <div className="flex items-center gap-2 text-red-700 dark:text-red-300">
              <AlertCircle className="h-4 w-4" />
              <span className="font-medium">Error</span>
            </div>
            <p className="text-sm text-red-600 dark:text-red-400 mt-1">
              {error}
            </p>
          </div>
        )}

        <div className="flex gap-2">
          <Input value={email} readOnly className="font-mono text-sm" />
          <Button onClick={copyEmail} size="icon" variant="outline">
            <Copy className="h-4 w-4" />
          </Button>
          <Button onClick={generateNewAccount} size="icon" disabled={isGenerating}>
            <RefreshCw className={`h-4 w-4 ${isGenerating ? "animate-spin" : ""}`} />
          </Button>
        </div>

        <Link href={`/${locale}/inbox`}>
          <Button className="w-full mt-3" size="lg">
            <Mail className="h-4 w-4 mr-2" />
            {t('emailGenerator.openInbox')}
          </Button>
        </Link>

        {/* {accountId && (
          <div className="text-xs text-muted-foreground text-center">
            Account ID: {accountId}
          </div>
        )} */}
      </CardContent>
    </Card>
  )
} 