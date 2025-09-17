"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogClose
} from "@/components/ui/dialog"
import { 
  User, 
  Mail, 
  Calendar, 
  FileText,
  Trash2,
  RefreshCw
} from "lucide-react"
import { toast } from "sonner"
import {useTranslations, useLocale} from 'next-intl'

interface EmailAddress {
  full: string
  host: string
  mail: string
  mailbox: string
  personal: string
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

interface EmailDetailModalProps {
  isOpen: boolean
  onClose: () => void
  email: FullEmail | null
  isLoading: boolean
  onDelete: (emailId: number) => Promise<void>
  emailAccountId: string | undefined
}

export function EmailDetailModal({
  isOpen,
  onClose,
  email,
  isLoading,
  onDelete,
  emailAccountId
}: EmailDetailModalProps) {
  const [isDeleting, setIsDeleting] = useState(false)
  const t = useTranslations()
  const locale = useLocale()

  const handleDelete = async () => {
    if (!email || !emailAccountId) return

    try {
      setIsDeleting(true)
      await onDelete(email.id)
      onClose()
    } catch (error) {
      toast.error(t('common.error'), {
        description: t('inbox.deleteFailedDescription')
      })
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent 
        className="max-w-4xl max-h-[90vh] flex flex-col dialog-content"
        showCloseButton={false}
      >
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <FileText className="h-5 w-5 text-primary" />
              <div>
                <DialogTitle className="text-lg">
                  {email?.subject || "(No subject)"}
                </DialogTitle>
                <DialogDescription>
                  {email?._from?.[0]?.personal || email?._from?.[0]?.mail || email?.from}
                </DialogDescription>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                onClick={handleDelete}
                size="icon"
                variant="destructive"
                disabled={isDeleting || !email}
                className="h-8 w-8"
              >
                {isDeleting ? (
                  <RefreshCw className="h-4 w-4 animate-spin" />
                ) : (
                  <Trash2 className="h-4 w-4" />
                )}
                <span className="sr-only">{t('inbox.deleteFailed')}</span>
              </Button>
              <DialogClose asChild>
                <Button type="button" variant="secondary">
                  {t('common.close')}
                </Button>
              </DialogClose>
            </div>
          </div>
        </DialogHeader>

        {/* Email Metadata */}
        <div className="p-6 border-b bg-muted/30">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">{t('emailModal.from')}</span>
                <span>{email?._from?.[0]?.personal || email?._from?.[0]?.mail || email?.from}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">{t('emailModal.to')}</span>
                <span>{email?.to}</span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">{t('emailModal.date')}</span>
                <span>{email?.date ? new Date(email.date).toLocaleString(locale as string) : ''}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-medium">{t('emailModal.status')}</span>
                <Badge variant={email?.is_seen === "1" ? "secondary" : "default"}>
                  {email?.is_seen === "1" ? t('emailModal.read') : t('emailModal.unread')}
                </Badge>
              </div>
            </div>
          </div>
        </div>

        {/* Email Body */}
        <div className="flex-1 overflow-y-auto p-6">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <RefreshCw className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <div className="prose prose-sm max-w-none email-modal-content">
              {email?.html ? (
                <div 
                  dangerouslySetInnerHTML={{ __html: email.html }}
                  className="email-content"
                />
              ) : (
                <div className="whitespace-pre-wrap font-mono text-sm">
                  {email?.body || t('emailModal.noContent')}
                </div>
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
} 