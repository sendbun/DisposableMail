"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { 
  Mail, 
  Clock, 
  User, 
  Paperclip, 
  Eye, 
  EyeOff, 
  RefreshCw, 
  Trash2,
  Search,
  Filter,
  Inbox,
  AlertTriangle,
  Copy,
  Hash,
  Plus,
  X,
  Calendar,
  FileText,
  Timer,
  Wifi,
  WifiOff
} from "lucide-react"
import { toast } from "sonner"
import { loadFiveMinEmailData, clearFiveMinEmailData } from "@/lib/email-service"
import { EmailNotificationClient } from "@/lib/email-notification-client"
import { EmailDetailModal } from "@/components/email-detail-modal"
import Link from "next/link"
import {useLocale} from 'next-intl'
import { useRouter } from "next/navigation"

interface EmailAddress {
  full: string
  host: string
  mail: string
  mailbox: string
  personal: string
}

interface MailHeaders {
  cc: EmailAddress[]
  to: EmailAddress[]
  bcc: EmailAddress[]
  from: EmailAddress[]
}

interface Email {
  count: number
  parent_email_id: number
  id: number
  folder: string
  size: string
  is_seen: string
  mail_headers: MailHeaders
  body: string
  subject: string
  date: string
  have_attachments: boolean
  html: string
  user_id: number
  to: string
  to_: EmailAddress[]
  from_: EmailAddress[]
  from: string
}

interface FullEmail {
  id: number
  folder: string
  size: string
  is_seen: string
  to: string
  _from: EmailAddress[]
  from: string
  body: string
  html: string
  subject: string
  date: string
  have_attachments: boolean
  attachments: any[]
}

interface PaginationData {
  currentPage: number
  pageSize: number
  totalItems: number
  totalPages: number
  hasNextPage: boolean
}

interface InboxResponse {
  status: boolean
  data: Email[]
  folder: string
  pagination: PaginationData
}

export default function FiveMinuteInboxPage() {
  const locale = useLocale()
  const router = useRouter()
  const [emails, setEmails] = useState<Email[]>([])
  const [pagination, setPagination] = useState<PaginationData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [fullEmail, setFullEmail] = useState<FullEmail | null>(null)
  const [isLoadingEmail, setIsLoadingEmail] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterFolder, setFilterFolder] = useState("inbox,spam")
  const [hasEmailAccount, setHasEmailAccount] = useState(false)
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false)
  const [timeLeft, setTimeLeft] = useState<number>(0)
  const [wsConnectionStatus, setWsConnectionStatus] = useState<{ isConnected: boolean; reconnectAttempts: number; isEnabled: boolean }>({ isConnected: false, reconnectAttempts: 0, isEnabled: false })

  const emailData = loadFiveMinEmailData()
  const emailAccountId = emailData?.currentAccount?.id
  const currentEmail = emailData?.currentAccount?.email

  // WebSocket client ref
  const wsClientRef = useRef<EmailNotificationClient | null>(null)
  const wsInitializedRef = useRef(false)
  const refreshTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const lastLoadTimeRef = useRef(0)
  const LOAD_THROTTLE_MS = 2000 // Minimum 2 seconds between loads
  const recentNotificationsRef = useRef<Set<string>>(new Set())
  const NOTIFICATION_DEDUP_MS = 5000 // 5 seconds to prevent duplicate notifications

  // Throttled loadEmails function
  const loadEmails = useCallback(async () => {
    if (!emailAccountId) return

    // Throttle rapid calls
    const now = Date.now()
    if (now - lastLoadTimeRef.current < LOAD_THROTTLE_MS) {
      console.log('Throttling email load request')
      return
    }
    lastLoadTimeRef.current = now

    try {
      setIsLoading(true)
      const response = await fetch(
        `/api/emails?emailAccountId=${emailAccountId}&folder=${filterFolder}&page=${currentPage}`
      )
      const result = await response.json()

      if (result.success) {
        setEmails(result.data.data || [])
        setPagination(result.data.pagination)
      } else {
        // If API fails, show demo emails or empty state
        console.warn('Failed to load emails from API:', result.error)
        setEmails([])
        setPagination(null)
        
        // Check if this is a mock account
        const emailData = loadFiveMinEmailData()
        if (emailData?.currentAccount?.domain_id === 'mock') {
          toast.info("Demo mode", {
            description: "API is unavailable. Showing demo inbox."
          })
        } else {
          toast.error("Failed to load emails", {
            description: "Could not fetch emails. Please try again later."
          })
        }
      }
    } catch (error) {
      console.error('Error loading emails:', error)
      setEmails([])
      setPagination(null)
      
      // Check if this is a mock account
      const emailData = loadFiveMinEmailData()
      if (emailData?.currentAccount?.domain_id === 'mock') {
        toast.info("Demo mode", {
          description: "API is unavailable. Showing demo inbox."
        })
      } else {
        toast.error("Error", {
          description: "Failed to load emails. Please try again later."
        })
      }
    } finally {
      setIsLoading(false)
    }
  }, [emailAccountId, filterFolder, currentPage])

  // Debounced refresh function to prevent multiple rapid refreshes
  const debouncedRefresh = useCallback(() => {
    if (refreshTimeoutRef.current) {
      clearTimeout(refreshTimeoutRef.current)
    }
    
    refreshTimeoutRef.current = setTimeout(() => {
      // Show refresh toast for WebSocket-triggered refreshes
      const refreshToastId = toast.info("Refreshing inbox...", {
        description: "Fetching latest emails.",
        duration: Infinity
      })
      
      loadEmails().finally(() => {
        // Dismiss the refresh toast
        toast.dismiss(refreshToastId)
      })
    }, 1000) // Wait 1 second before refreshing
  }, [loadEmails])

  // Initialize WebSocket only once
  useEffect(() => {
    if (wsInitializedRef.current) return
    
    const wsUrl = process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:8001'
    
    try {
      wsClientRef.current = new EmailNotificationClient(wsUrl)
      wsInitializedRef.current = true
      
      // Check if WebSocket was disabled due to REST API URL
      if (wsClientRef.current && !wsClientRef.current.isWebSocketAvailable()) {
        const isRestApi = wsUrl.includes('uapi.sendbun.com')
        if (isRestApi) {
          // WebSocket disabled due to REST API URL
        }
      }
    } catch (error) {
      // Continue without WebSocket functionality
      wsInitializedRef.current = true
    }
  }, [])

  // Set up WebSocket event handlers and connection monitoring
  useEffect(() => {
    if (!wsClientRef.current || !emailAccountId || !currentEmail) return

    // Set up connection status monitoring
    const updateConnectionStatus = () => {
      if (wsClientRef.current) {
        const status = wsClientRef.current.getConnectionStatus()
        setWsConnectionStatus({
          isConnected: status.isConnected,
          reconnectAttempts: status.reconnectAttempts,
          isEnabled: status.isEnabled
        })
        
        // If WebSocket is connected and we have email account data, authenticate
        if (status.isConnected && status.isEnabled && emailAccountId && currentEmail) {
          wsClientRef.current.authenticate(emailAccountId.toString())
          wsClientRef.current.joinEmailRoom(currentEmail)
        }
      }
    }

    // Set up email notification handler only once
    const handleNewEmail = (notification: any) => {
      // Create a unique key for this notification to prevent duplicates
      const notificationKey = `${notification.from || 'unknown'}-${notification.subject || 'no-subject'}-${Date.now()}`
      
      // Check if we've shown a similar notification recently
      const isDuplicate = Array.from(recentNotificationsRef.current).some(key => {
        const [from, subject] = key.split('-').slice(0, 2)
        return from === (notification.from || 'unknown') && 
               subject === (notification.subject || 'no-subject')
      })
      
      if (isDuplicate) {
        console.log('Skipping duplicate notification:', notificationKey)
        return
      }
      
      // Add to recent notifications and clean up old ones
      recentNotificationsRef.current.add(notificationKey)
      setTimeout(() => {
        recentNotificationsRef.current.delete(notificationKey)
      }, NOTIFICATION_DEDUP_MS)
      
      // Show toast notification
      toast.success("New email received!", {
        description: `From: ${notification.from || 'Unknown sender'}`,
        duration: 5000
      })
      
      // Use debounced refresh to prevent multiple rapid API calls
      debouncedRefresh()
    }

    // Clear any existing callbacks and register the new one
    wsClientRef.current.clearNotificationCallbacks()
    wsClientRef.current.onNewEmail(handleNewEmail)

    // Update status every 2 seconds
    const statusInterval = setInterval(updateConnectionStatus, 2000)

    // Cleanup function
    return () => {
      clearInterval(statusInterval)
      if (refreshTimeoutRef.current) {
        clearTimeout(refreshTimeoutRef.current)
      }
      // Clear callbacks when this effect is cleaned up
      if (wsClientRef.current) {
        wsClientRef.current.clearNotificationCallbacks()
      }
      // Clear recent notifications
      recentNotificationsRef.current.clear()
    }
  }, [emailAccountId, currentEmail, debouncedRefresh])

  // Cleanup WebSocket on component unmount
  useEffect(() => {
    return () => {
      if (wsClientRef.current) {
        wsClientRef.current.disconnect()
      }
      if (refreshTimeoutRef.current) {
        clearTimeout(refreshTimeoutRef.current)
      }
      // Clear recent notifications
      recentNotificationsRef.current.clear()
    }
  }, [])

  useEffect(() => {
    // Check if email account exists
    let polling: NodeJS.Timeout | null = null;
    let attempts = 0;
    const maxAttempts = 10; // 10 x 200ms = 2 seconds

    const checkEmailAccount = () => {
      const data = loadFiveMinEmailData()
      if (data?.currentAccount) {
        setHasEmailAccount(true)
        // Calculate time left
        const now = new Date().getTime()
        const expiryTime = new Date(data.currentAccount.expires_at!).getTime()
        const remaining = Math.max(0, Math.floor((expiryTime - now) / 1000))
        setTimeLeft(remaining)
        loadEmails()
        if (polling) clearInterval(polling)
      } else {
        setHasEmailAccount(false)
        setIsLoading(false)
      }
    }

    // Initial check
    checkEmailAccount()
    // Poll for up to 2 seconds
    polling = setInterval(() => {
      attempts++;
      if (attempts > maxAttempts) {
        if (polling) clearInterval(polling)
        return;
      }
      checkEmailAccount()
    }, 200)

    return () => {
      if (polling) clearInterval(polling)
    }
  }, [currentPage, filterFolder])

  // Countdown timer effect
  useEffect(() => {
    const data = loadFiveMinEmailData();
    // Only run timer/cleanup if there is a valid account with a future expiry
    if (!data?.currentAccount || !data.currentAccount.expires_at) {
      return;
    }
    const expiryTime = new Date(data.currentAccount.expires_at).getTime();
    const now = new Date().getTime();
    if (timeLeft <= 0 && now >= expiryTime) {
      // Account expired, remove from localStorage but do not redirect
      clearFiveMinEmailData();
      toast.info("Account expired", {
        description: "Your 5-minute email account has expired. Please create a new one."
      })
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          const data = loadFiveMinEmailData();
          if (!data?.currentAccount || !data.currentAccount.expires_at) {
            // Account is missing from localStorage, do not redirect
            return 0;
          }
          const expiryTime = new Date(data.currentAccount.expires_at).getTime();
          const now = new Date().getTime();
          if (now >= expiryTime) {
            // Account expired, remove from localStorage but do not redirect
            clearFiveMinEmailData();
            toast.info("Account expired", {
              description: "Your 5-minute email account has expired. Please create a new one."
            })
            return 0;
          }
          return 0;
        }
        return prev - 1;
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [timeLeft])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const loadFullEmail = async (emailId: number) => {
    if (!emailAccountId) return

    try {
      setIsLoadingEmail(true)
      const response = await fetch(`/api/emails/${emailAccountId}/${emailId}`)
      const result = await response.json()

      if (result.success) {
        setFullEmail(result.data.message)
        setIsEmailModalOpen(true)
      } else {
        toast.error("Failed to load email", {
          description: result.error || "Could not fetch email details"
        })
      }
    } catch (error) {
      console.error('Error loading full email:', error)
      toast.error("Error", {
        description: "Failed to load email details. Please try again."
      })
    } finally {
      setIsLoadingEmail(false)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60)

    if (diffInHours < 24) {
      return date.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true 
      })
    } else if (diffInHours < 168) { // 7 days
      return date.toLocaleDateString('en-US', { weekday: 'short' })
    } else {
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric' 
      })
    }
  }

  const getSenderName = (email: Email) => {
    const from = email.mail_headers.from[0]
    return from.personal || from.mailbox || from.mail
  }

  const getSenderEmail = (email: Email) => {
    return email.mail_headers.from[0].mail
  }

  const handleEmailClick = async (email: Email) => {
    await loadFullEmail(email.id)
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  const handleRefresh = () => {
    // Show refresh toast and store its ID
    const refreshToastId = toast.info("Refreshing inbox...", {
      description: "Fetching latest emails.",
      duration: Infinity // Keep it open until we dismiss it
    })
    
    // Load emails and dismiss toast when done
    loadEmails().finally(() => {
      // Dismiss the refresh toast
      toast.dismiss(refreshToastId)
      
      // Show success toast briefly
      toast.success("Inbox refreshed", {
        description: "Latest emails loaded successfully.",
        duration: 2000
      })
    })
  }

  const handleDeleteEmail = async (emailId: number) => {
    try {
      const response = await fetch(`/api/emails/${emailAccountId}/${emailId}/delete`, {
        method: 'DELETE'
      })
      const result = await response.json()

      if (result.success) {
        setEmails(emails.filter(email => email.id !== emailId))
        setIsEmailModalOpen(false)
        setFullEmail(null)
        toast.success("Email deleted", {
          description: "Email has been deleted successfully."
        })
      } else {
        toast.error("Delete failed", {
          description: result.error || "Could not delete email"
        })
      }
    } catch (error) {
      toast.error("Error", {
        description: "Failed to delete email. Please try again."
      })
    }
  }

  const copyEmailId = () => {
    if (emailAccountId) {
      navigator.clipboard.writeText(emailAccountId)
      toast.success("Account ID copied!", {
        description: "Email account ID has been copied to your clipboard."
      })
    }
  }

  const copyEmailAddress = () => {
    if (currentEmail) {
      navigator.clipboard.writeText(currentEmail)
      toast.success("Email copied!", {
        description: "Email address has been copied to your clipboard."
      })
    }
  }

  const refreshEmailAccount = () => {
    const data = loadFiveMinEmailData()
    if (data?.currentAccount) {
      setHasEmailAccount(true)
      // Update the local state with fresh data
      const freshEmailData = loadFiveMinEmailData()
      if (freshEmailData?.currentAccount) {
        // Force re-render with fresh data
        setHasEmailAccount(true)
        
        // Recalculate time left
        const now = new Date().getTime()
        const expiryTime = new Date(freshEmailData.currentAccount.expires_at!).getTime()
        const remaining = Math.max(0, Math.floor((expiryTime - now) / 1000))
        setTimeLeft(remaining)
        
        loadEmails()
        toast.success("Account refreshed", {
          description: "Email account data has been refreshed."
        })
      }
    } else {
      setHasEmailAccount(false)
      toast.error("No account found", {
        description: "Please create an email account first."
      })
    }
  }

  const filteredEmails = emails.filter(email => 
    email.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
    getSenderName(email).toLowerCase().includes(searchTerm.toLowerCase()) ||
    getSenderEmail(email).toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (!hasEmailAccount) {
    return (
      <div className="container max-w-4xl mx-auto py-8">
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <Mail className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                <h2 className="text-xl font-semibold mb-2">No Email Account</h2>
                <p className="text-muted-foreground mb-4">
                  You need to create a 5-minute email account to access your inbox.
                </p>
                <Link href={`/${locale}/5-minutes-temporary-email`}>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Create 5-Minute Email Account
                  </Button>
                </Link>
              </div>
            </div>
          </CardHeader>
        </Card>
      </div>
    )
  }

  return (
    <div className="container max-w-4xl mx-auto py-8">
      {/* Email Account Header - Always show if account exists */}
      {hasEmailAccount && (
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Mail className="h-5 w-5 text-primary" />
                  <div>
                    <h2 className="text-lg font-semibold">5-Minute Email Account</h2>
                    <p className="text-sm text-muted-foreground">{currentEmail}</p>
                  </div>
                </div>
                <Separator orientation="vertical" className="h-8" />
                <div className="flex items-center gap-2">
                  <Timer className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Time left:</span>
                  <Badge variant={timeLeft < 60 ? "destructive" : "secondary"}>
                    {formatTime(timeLeft)}
                  </Badge>
                </div>
                {/* WebSocket Connection Status */}
                <div className="flex items-center gap-2">
                  {!wsConnectionStatus.isEnabled ? (
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <WifiOff className="h-4 w-4" />
                      <span className="text-xs">No WS</span>
                    </div>
                  ) : wsConnectionStatus.isConnected ? (
                    <div className="flex items-center gap-1 text-green-600">
                      <Wifi className="h-4 w-4" />
                      <span className="text-xs">Live</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1 text-yellow-600">
                      <WifiOff className="h-4 w-4" />
                      <span className="text-xs">Connecting...</span>
                    </div>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button onClick={copyEmailAddress} size="sm" variant="outline">
                  <Copy className="h-4 w-4 mr-2" />
                </Button>
              </div>
            </div>
          </CardHeader>
        </Card>
      )}

      {/* Email List */}
      {hasEmailAccount && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Inbox className="h-5 w-5" />
                <CardTitle>5-Minute Inbox</CardTitle>
                <Badge variant="secondary">
                  {pagination?.totalItems || 0} emails
                </Badge>
                {/* WebSocket Status Badge */}
                {wsConnectionStatus.isEnabled && (
                  <Badge variant={wsConnectionStatus.isConnected ? "default" : "secondary"} className="text-xs">
                    {wsConnectionStatus.isConnected ? "Live" : "Connecting"}
                  </Badge>
                )}
              </div>
              <Button onClick={handleRefresh} size="sm" variant="outline">
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>
            
            {/* Search and Filter */}
            <div className="flex gap-2 mt-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search emails..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-input rounded-md bg-background text-sm"
                />
              </div>
              <Button size="sm" variant="outline">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          
          <CardContent className="p-0">
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <RefreshCw className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : filteredEmails.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                <Mail className="h-12 w-12 mb-4" />
                <p className="text-lg font-medium">No emails found</p>
                <p className="text-sm">Your inbox is empty</p>
              </div>
            ) : (
              <div className="divide-y">
                {filteredEmails.map((email) => (
                  <div
                    key={email.id}
                    className="p-4 hover:bg-muted/50 cursor-pointer transition-colors"
                    onClick={() => handleEmailClick(email)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium truncate">
                            {getSenderName(email)}
                          </span>
                          {email.is_seen === "0" && (
                            <Badge variant="default" className="h-2 w-2 p-0 rounded-full" />
                          )}
                          {email.have_attachments && (
                            <Paperclip className="h-4 w-4 text-muted-foreground" />
                          )}
                        </div>
                        <p className="text-sm font-medium truncate">
                          {email.subject || "(No subject)"}
                        </p>
                        <p className="text-sm text-muted-foreground truncate">
                          {email.body || "No preview available"}
                        </p>
                      </div>
                      <div className="flex flex-col items-end gap-1 ml-4">
                        <span className="text-xs text-muted-foreground">
                          {formatDate(email.date)}
                        </span>
                        <Badge variant="outline" className="text-xs">
                          {email.folder}
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div className="mt-4">
          <div className="flex items-center justify-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            
            <div className="flex items-center gap-1">
              {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((page) => (
                <Button
                  key={page}
                  variant={currentPage === page ? "default" : "outline"}
                  size="sm"
                  onClick={() => handlePageChange(page)}
                  className="w-8 h-8 p-0"
                >
                  {page}
                </Button>
              ))}
            </div>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={!pagination.hasNextPage}
            >
              Next
            </Button>
          </div>
        </div>
      )}

      {/* Reusable Email Detail Modal */}
      <EmailDetailModal
        isOpen={isEmailModalOpen}
        onClose={() => {
          setIsEmailModalOpen(false)
          setFullEmail(null)
        }}
        email={fullEmail}
        isLoading={isLoadingEmail}
        onDelete={handleDeleteEmail}
        emailAccountId={emailAccountId}
      />
    </div>
  )
} 