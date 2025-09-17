// Email service for managing temporary email accounts
import { generateHumanLikeEmail, generateProfessionalEmail, generateCasualEmail } from './name-generator'

export interface Domain {
  id: number
  name: string
  accounts: number
  total_emails: string
  memory: string
}

export interface EmailAccount {
  id: string
  email: string
  password: string
  created_at: string
  domain_id: string
  expires_at?: string // For 5-minute accounts
  is_5min?: boolean // Flag to identify 5-minute accounts
}

export interface SiteEmailData {
  domains: Domain[]
  currentAccount: EmailAccount | null
  lastUpdated: string
}

export interface FiveMinEmailData {
  domains: Domain[]
  currentAccount: EmailAccount | null
  lastUpdated: string
}

// Generate a unique site key based on the current domain
export function getSiteKey(): string {
  if (typeof window === 'undefined') return 'tempmail-default'
  
  const hostname = window.location.hostname
  
  // Create a unique key based on hostname only (not pathname)
  // This ensures the same key is used across all pages of the site
  const siteKey = `tempmail-${hostname}`.replace(/[^a-zA-Z0-9-]/g, '-')
  return siteKey
}

// Generate a unique site key for 5-minute emails
export function getFiveMinSiteKey(): string {
  if (typeof window === 'undefined') return 'tempmail-5min-default'
  
  const hostname = window.location.hostname
  
  // Create a unique key for 5-minute emails
  const siteKey = `tempmail-5min-${hostname}`.replace(/[^a-zA-Z0-9-]/g, '-')
  return siteKey
}

// Generate a strong password
export function generateStrongPassword(): string {
  const lowercase = 'abcdefghijklmnopqrstuvwxyz'
  const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  const numbers = '0123456789'
  const symbols = '!@#$%^&*()_+-=[]{}|;:,.<>?'
  
  let password = ''
  
  // Ensure at least one character from each category
  password += lowercase[Math.floor(Math.random() * lowercase.length)]
  password += uppercase[Math.floor(Math.random() * uppercase.length)]
  password += numbers[Math.floor(Math.random() * numbers.length)]
  password += symbols[Math.floor(Math.random() * symbols.length)]
  
  // Fill the rest with random characters
  const allChars = lowercase + uppercase + numbers + symbols
  for (let i = 4; i < 12; i++) {
    password += allChars[Math.floor(Math.random() * allChars.length)]
  }
  
  // Shuffle the password
  return password.split('').sort(() => Math.random() - 0.5).join('')
}

// Load domains from API
export async function loadDomains(): Promise<Domain[]> {
  try {
    const response = await fetch('/api/domains/site-domains')
    const result = await response.json()
    
    if (result.success) {
      return result.data.domains || result.data // Handle both formats
    } else {
      console.warn('Failed to load domains from API, using fallback domains:', result.error)
      // Return fallback domains when API fails
      return [
        { id: 1, name: 'sendbun.com', accounts: 0, total_emails: '0', memory: '0' },
        { id: 2, name: 'mailbun.cc', accounts: 0, total_emails: '0', memory: '0' },
        { id: 3, name: 'tempmail.org', accounts: 0, total_emails: '0', memory: '0' }
      ]
    }
  } catch (error) {
    console.error('Error loading domains:', error)
    console.warn('Using fallback domains due to API error')
    // Return fallback domains when API is completely unavailable
    return [
      { id: 1, name: 'sendbun.com', accounts: 0, total_emails: '0', memory: '0' },
      { id: 2, name: 'mailbun.cc', accounts: 0, total_emails: '0', memory: '0' },
      { id: 3, name: 'tempmail.org', accounts: 0, total_emails: '0', memory: '0' }
    ]
  }
}

// Create email account
export async function createEmailAccount(email: string, password: string, is5Min: boolean = false): Promise<EmailAccount> {
  try {
    const response = await fetch('/api/accounts/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
    })
    
    const result = await response.json()
    
    if (result.success) {
      // Handle the actual API response structure
      const apiData = result.data
      const now = new Date()
      const expiresAt = is5Min ? new Date(now.getTime() + 5 * 60 * 1000).toISOString() : undefined
      
      return {
        id: apiData.id?.toString() || Date.now().toString(),
        email: apiData.email || email,
        password,
        created_at: now.toISOString(),
        domain_id: apiData.domain_id || '',
        expires_at: expiresAt,
        is_5min: is5Min
      }
    } else {
      // If API fails, create a mock account for demo purposes
      console.warn('API failed, creating mock account:', result.error)
      const now = new Date()
      const expiresAt = is5Min ? new Date(now.getTime() + 5 * 60 * 1000).toISOString() : undefined
      
      return {
        id: Date.now().toString(),
        email: email,
        password,
        created_at: now.toISOString(),
        domain_id: 'mock',
        expires_at: expiresAt,
        is_5min: is5Min
      }
    }
  } catch (error) {
    console.error('Error creating email account:', error)
    // Create a mock account when API is completely unavailable
    console.warn('Creating mock account due to API error')
    const now = new Date()
    const expiresAt = is5Min ? new Date(now.getTime() + 5 * 60 * 1000).toISOString() : undefined
    
    return {
      id: Date.now().toString(),
      email: email,
      password,
      created_at: now.toISOString(),
      domain_id: 'mock',
      expires_at: expiresAt,
      is_5min: is5Min
    }
  }
}

// Delete email account
export async function deleteEmailAccount(accountId: string): Promise<boolean> {
  try {
    const response = await fetch(`/api/accounts/${accountId}`, {
      method: 'DELETE'
    })
    
    const result = await response.json()
    
    if (result.success) {
      return true
    } else {
      console.warn('Failed to delete account via API:', result.error)
      return true // Return true for mock accounts
    }
  } catch (error) {
    console.error('Error deleting email account:', error)
    return true // Return true for mock accounts
  }
}

// LocalStorage management for regular emails
export function saveEmailData(data: SiteEmailData): void {
  if (typeof window === 'undefined') return
  
  const siteKey = getSiteKey()
  localStorage.setItem(siteKey, JSON.stringify(data))
}

export function loadEmailData(): SiteEmailData | null {
  if (typeof window === 'undefined') return null
  
  const siteKey = getSiteKey()
  const data = localStorage.getItem(siteKey)
  
  if (data) {
    try {
      return JSON.parse(data)
    } catch (error) {
      console.error('Error parsing localStorage data:', error)
      return null
    }
  }
  
  return null
}

export function clearEmailData(): void {
  if (typeof window === 'undefined') return
  
  const siteKey = getSiteKey()
  localStorage.removeItem(siteKey)
}

// LocalStorage management for 5-minute emails (separate storage)
export function saveFiveMinEmailData(data: FiveMinEmailData): void {
  if (typeof window === 'undefined') return
  
  const siteKey = getFiveMinSiteKey()
  localStorage.setItem(siteKey, JSON.stringify(data))
}

export function loadFiveMinEmailData(): FiveMinEmailData | null {
  if (typeof window === 'undefined') return null
  
  const siteKey = getFiveMinSiteKey()
  const data = localStorage.getItem(siteKey)
  
  if (data) {
    try {
      return JSON.parse(data)
    } catch (error) {
      console.error('Error parsing 5-min localStorage data:', error)
      return null
    }
  }
  
  return null
}

export function clearFiveMinEmailData(): void {
  if (typeof window === 'undefined') return
  
  const siteKey = getFiveMinSiteKey()
  localStorage.removeItem(siteKey)
}

// Check if account is expired
export function isAccountExpired(account: EmailAccount): boolean {
  if (!account.expires_at) return false
  return new Date() > new Date(account.expires_at)
}

// Get time remaining for 5-minute account
export function getTimeRemaining(account: EmailAccount): number {
  if (!account.expires_at) return 0
  const now = new Date().getTime()
  const expiresAt = new Date(account.expires_at).getTime()
  return Math.max(0, Math.floor((expiresAt - now) / 1000))
}

// Main function to initialize regular email account
export async function initializeEmailAccount(): Promise<EmailAccount> {
  // Check if we already have an account for this site
  const existingData = loadEmailData()
  
  if (existingData?.currentAccount) {
    // Check if the account is still valid (less than 24 hours old)
    const accountAge = Date.now() - new Date(existingData.currentAccount.created_at).getTime()
    const maxAge = 24 * 60 * 60 * 1000 // 24 hours
    
    if (accountAge < maxAge) {
      return existingData.currentAccount
    }
  }
  
  // Load domains
  const domains = await loadDomains()
  
  if (domains.length === 0) {
    throw new Error('No domains available')
  }
  
  // Select a random domain
  const randomDomain = domains[Math.floor(Math.random() * domains.length)]
  
  // Generate email and password using the name generator
  const username = generateHumanLikeEmail()
  const email = `${username}@${randomDomain.name}`
  const password = generateStrongPassword()
  
  // Create the account
  const account = await createEmailAccount(email, password, false)
  
  // Save to localStorage
  const emailData: SiteEmailData = {
    domains,
    currentAccount: account,
    lastUpdated: new Date().toISOString()
  }
  
  saveEmailData(emailData)
  
  return account
}

// Initialize 5-minute email account (separate storage)
export async function initialize5MinEmailAccount(): Promise<EmailAccount> {
  // Check if we already have a valid 5-minute account
  const existingData = loadFiveMinEmailData()
  
  if (existingData?.currentAccount && !isAccountExpired(existingData.currentAccount)) {
    return existingData.currentAccount
  }
  
  // Load domains
  const domains = await loadDomains()
  
  if (domains.length === 0) {
    throw new Error('No domains available')
  }
  
  // Select a random domain
  const randomDomain = domains[Math.floor(Math.random() * domains.length)]
  
  // Generate email and password
  const username = generateHumanLikeEmail()
  const email = `${username}@${randomDomain.name}`
  const password = generateStrongPassword()
  
  // Create the 5-minute account
  const account = await createEmailAccount(email, password, true)
  
  // Save to separate localStorage
  const emailData: FiveMinEmailData = {
    domains,
    currentAccount: account,
    lastUpdated: new Date().toISOString()
  }
  
  saveFiveMinEmailData(emailData)
  
  return account
}

// Clean up expired accounts (both regular and 5-minute)
export async function cleanupExpiredAccounts(): Promise<void> {
  // Clean up regular accounts
  const regularData = loadEmailData()
  if (regularData?.currentAccount && isAccountExpired(regularData.currentAccount)) {
    await deleteEmailAccount(regularData.currentAccount.id)
    regularData.currentAccount = null
    saveEmailData(regularData)
  }
  
  // Clean up 5-minute accounts
  const fiveMinData = loadFiveMinEmailData()
  if (fiveMinData?.currentAccount && isAccountExpired(fiveMinData.currentAccount)) {
    await deleteEmailAccount(fiveMinData.currentAccount.id)
    fiveMinData.currentAccount = null
    saveFiveMinEmailData(fiveMinData)
  }
}

// Clean up only 5-minute expired accounts
export async function cleanupExpired5MinAccounts(): Promise<void> {
  const fiveMinData = loadFiveMinEmailData()
  if (fiveMinData?.currentAccount && isAccountExpired(fiveMinData.currentAccount)) {
    await deleteEmailAccount(fiveMinData.currentAccount.id)
    fiveMinData.currentAccount = null
    saveFiveMinEmailData(fiveMinData)
  }
}

// Additional email generation functions for different styles
export function generateProfessionalEmailAccount(domain: string): { email: string; password: string } {
  const username = generateProfessionalEmail()
  const email = `${username}@${domain}`
  const password = generateStrongPassword()
  
  return { email, password }
}

export function generateCasualEmailAccount(domain: string): { email: string; password: string } {
  const username = generateCasualEmail()
  const email = `${username}@${domain}`
  const password = generateStrongPassword()
  
  return { email, password }
} 