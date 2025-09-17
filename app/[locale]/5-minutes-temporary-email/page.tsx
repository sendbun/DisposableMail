"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Copy, RefreshCw, Mail, Clock, Shield, AlertTriangle, CheckCircle, Loader2 } from "lucide-react"
import { initialize5MinEmailAccount, loadFiveMinEmailData, getTimeRemaining, isAccountExpired, cleanupExpired5MinAccounts, clearFiveMinEmailData, type EmailAccount } from "@/lib/email-service"
import Link from "next/link"
import {useLocale} from 'next-intl'
import { useRouter } from "next/navigation"
import { toast } from "sonner"

export default function FiveMinutesEmailPage() {
  const locale = useLocale()
  const [email, setEmail] = useState("")
  const [accountId, setAccountId] = useState<string | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [timeLeft, setTimeLeft] = useState(300) // 5 minutes in seconds
  const [account, setAccount] = useState<EmailAccount | null>(null)
  const router = useRouter()

  // Initialize 5-minute email account
  useEffect(() => {
    initializeAccount()
  }, [])

  // Timer effect for countdown
  useEffect(() => {
    if (!account || !account.expires_at) return

    const timer = setInterval(() => {
      const remaining = getTimeRemaining(account)
      setTimeLeft(remaining)

      if (remaining <= 0) {
        // Account expired, clean up and redirect
        handleAccountExpiry()
      }
    }, 1000)

    return () => clearInterval(timer)
  }, [account])

  const initializeAccount = async () => {
    try {
      setIsLoading(true)
      
      // Clean up any expired accounts first
      await cleanupExpired5MinAccounts()
      
      // Check for existing valid 5-minute account
      const existingData = loadFiveMinEmailData()
      if (existingData?.currentAccount && !isAccountExpired(existingData.currentAccount)) {
        const existingAccount = existingData.currentAccount
        setAccount(existingAccount)
        setEmail(existingAccount.email)
        setAccountId(existingAccount.id)
        setTimeLeft(getTimeRemaining(existingAccount))
        
        toast.success("5-minute email loaded!", {
          id: "five-min-email-loaded",
          description: "Your existing 5-minute email has been restored."
        })
        return
      }

      // Create new 5-minute account
      const newAccount = await initialize5MinEmailAccount()
      setAccount(newAccount)
      setEmail(newAccount.email)
      setAccountId(newAccount.id)
      setTimeLeft(getTimeRemaining(newAccount))
      
      toast.success("5-minute email created!", {
        description: "Your temporary email will expire in 5 minutes."
      })
    } catch (err) {
      console.error('Error initializing 5-minute account:', err)
      
      // Fallback to mock email
      const mockEmail = `temp.5min.${Date.now()}@sendbun.com`
      setEmail(mockEmail)
      setAccountId(Date.now().toString())
      setTimeLeft(300)
      
      toast.info("Demo mode", {
        description: "Using demo 5-minute email due to API issues."
      })
    } finally {
      setIsLoading(false)
    }
  }

  const generateNewEmail = async () => {
    try {
      setIsGenerating(true)
      
      // Clean up existing account if any
      if (account) {
        await cleanupExpired5MinAccounts()
      }
      
      // Create new 5-minute account
      const newAccount = await initialize5MinEmailAccount()
      setAccount(newAccount)
      setEmail(newAccount.email)
      setAccountId(newAccount.id)
      setTimeLeft(getTimeRemaining(newAccount))
      
      toast.success("New 5-minute email created!", {
        description: "Your new temporary email will expire in 5 minutes."
      })
    } catch (err) {
      console.error('Error generating new 5-minute email:', err)
      
      // Fallback to mock email
      const mockEmail = `temp.5min.${Date.now()}@sendbun.com`
      setEmail(mockEmail)
      setAccountId(Date.now().toString())
      setTimeLeft(300)
      
      toast.info("Demo mode", {
        description: "Using demo 5-minute email due to API issues."
      })
    } finally {
      setIsGenerating(false)
    }
  }

  const handleAccountExpiry = async () => {
    // Clean up expired account
    await cleanupExpired5MinAccounts()
    
    toast.error("Email expired!", {
      description: "Your 5-minute email has been automatically deleted."
    })
    
    // Redirect to home page after a short delay
    setTimeout(() => {
      router.push('../')
    }, 2000)
  }

  const copyEmail = () => {
    navigator.clipboard.writeText(email)
    toast.success("Email copied!", {
      description: "The 5-minute temporary email has been copied to your clipboard."
    })
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const useCases = [
    "Quick account verification",
    "One-time downloads",
    "Newsletter signups",
    "Testing forms",
    "Avoiding spam",
    "Privacy protection",
  ]

  const features = [
    {
      icon: Clock,
      title: "Auto-Expires in 5 Minutes",
      description: "Perfect for quick tasks and immediate verification",
    },
    { icon: Shield, title: "Maximum Privacy", description: "No traces left after expiration" },
    { icon: Mail, title: "Instant Delivery", description: "Receive emails immediately" },
  ]

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="text-center">Creating 5-Minute Email</CardTitle>
            <CardDescription className="text-center">
              Setting up your temporary email account...
            </CardDescription>
          </CardHeader>
          <CardContent className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="w-full max-w-[1400px] mx-auto text-center">
          <Badge variant="secondary" className="mb-4">
            <Clock className="h-3 w-3 mr-1" />
            5-Minute Auto-Expiry
          </Badge>

          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            5-Minute
            <br />
            <span className="bg-gradient-to-r from-[#1b294b] to-[#2252ba] bg-clip-text text-transparent">
              Temporary Email
            </span>
          </h1>

          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Ultra-short temporary emails that automatically expire in 5 minutes. Perfect for quick verifications and
            maximum privacy.
          </p>

          {/* Email Generator with Timer */}
          <Card className="max-w-2xl mx-auto mb-8">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="text-left">
                  <CardTitle>Your 5-Minute Email</CardTitle>
                  <CardDescription>This email will expire automatically in 5 minutes</CardDescription>
                </div>
                <div className="text-right">
                  <div className={`text-2xl font-mono font-bold ${timeLeft <= 60 ? 'text-[#1b294b]' : timeLeft <= 120 ? 'text-[#2252ba]' : 'text-[#2294ba]'}`}>
                    {formatTime(timeLeft)}
                  </div>
                  <div className="text-xs text-muted-foreground">Time Left</div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input value={email} readOnly className="font-mono text-sm" />
                <Button onClick={copyEmail} size="icon" variant="outline">
                  <Copy className="h-4 w-4" />
                </Button>
              </div>

              <div className="bg-orange-50 dark:bg-orange-950 border border-orange-200 dark:border-orange-800 rounded-lg p-4">
                <div className="flex items-center gap-2 text-orange-700 dark:text-orange-300">
                  <AlertTriangle className="h-4 w-4" />
                  <span className="font-medium">Auto-Expiry Warning</span>
                </div>
                <p className="text-sm text-orange-600 dark:text-orange-400 mt-1">
                  This email will be permanently deleted in {formatTime(timeLeft)}. Make sure to complete your task quickly.
                </p>
              </div>

              <Link href={`/${locale}/inbox`}>
                <Button className="w-full mt-4" size="lg" disabled={isLoading}>
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Mail className="h-4 w-4 mr-2" />
                  )}
                  Open Inbox
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/50">
        <div className="w-full max-w-[1400px] mx-auto ">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Why 5-Minute Emails?</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Sometimes you need maximum privacy with minimal exposure time
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardHeader>
                  <feature.icon className="h-12 w-12 mx-auto mb-4 text-black" />
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="py-20">
        <div className="w-full max-w-[1400px] mx-auto ">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">Perfect For Quick Tasks</h2>
              <p className="text-muted-foreground mb-8">
                5-minute temporary emails are ideal when you need immediate access but want to ensure complete privacy
                and automatic cleanup.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {useCases.map((useCase, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                    <span className="text-sm">{useCase}</span>
                  </div>
                ))}
              </div>
            </div>

            <Card className="p-8">
              <div className="text-center">
                <Clock className="h-16 w-16 mx-auto mb-4 text-red-500" />
                <h3 className="text-2xl font-bold mb-4">Auto-Expiry Process</h3>
                <div className="space-y-4 text-left">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center mt-0.5">
                      1
                    </div>
                    <div>
                      <div className="font-medium">Email Generated</div>
                      <div className="text-sm text-muted-foreground">5-minute countdown begins</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center mt-0.5">
                      2
                    </div>
                    <div>
                      <div className="font-medium">Receive Emails</div>
                      <div className="text-sm text-muted-foreground">Use normally during active period</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-red-500 text-white text-xs flex items-center justify-center mt-0.5">
                      3
                    </div>
                    <div>
                      <div className="font-medium">Auto-Delete</div>
                      <div className="text-sm text-muted-foreground">Complete removal after 5 minutes</div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Privacy Section */}
      <section className="py-20 bg-[#f9f9fa]">
        <div className="w-full max-w-[1400px] mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Maximum Privacy Guaranteed</h2>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            With 5-minute auto-expiry, your digital footprint is minimized to the absolute minimum. Perfect for users
            who prioritize privacy above all else.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-500 mb-2">100%</div>
              <div className="text-sm text-muted-foreground">Auto-Deletion Rate</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-500 mb-2">5min</div>
              <div className="text-sm text-muted-foreground">Maximum Exposure</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-500 mb-2">0</div>
              <div className="text-sm text-muted-foreground">Data Retention</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
