import { io, Socket } from "socket.io-client"

// WebSocket Client Class
export class EmailNotificationClient {
    private socket: Socket | null = null
    private isConnected: boolean = false
    private reconnectAttempts: number = 0
    private maxReconnectAttempts: number = 5
    private reconnectDelay: number = 1000
    private userId: string | null = null
    private userEmail: string | null = null
    private notificationCallbacks: Array<(notification: any) => void> = []
    private serverUrl: string
    private isEnabled: boolean = true

    constructor(serverUrl: string) {
        this.serverUrl = serverUrl
        // Only initialize if we have a valid server URL and it's not a REST API
        if (serverUrl && 
            serverUrl !== 'undefined' && 
            serverUrl !== 'null') {
            this.init()
        } else {
            this.isEnabled = false
        }
    }

    private init() {
        if (!this.isEnabled) return
        
        try {
            this.connect()
            this.setupEventListeners()
        } catch (error) {
            this.isEnabled = false
        }
    }

    private connect() {
        console.log('Connecting to WebSocket server:', this.serverUrl)
        if (!this.isEnabled) return
        
        try {
            console.log('Connecting to WebSocket server:', this.serverUrl)
            this.socket = io(this.serverUrl, {
                transports: ['websocket', 'polling'],
                timeout: 20000,
                reconnection: true,
                reconnectionAttempts: this.maxReconnectAttempts,
                reconnectionDelay: this.reconnectDelay,
                // Add error handling options
                forceNew: true,
                autoConnect: true
            })

            // Wrap the emit method to log all outgoing messages
            if (this.socket) {
                const originalEmit = this.socket.emit.bind(this.socket)
                this.socket.emit = (event: string, ...args: any[]) => {
                    return originalEmit(event, ...args)
                }
            }

            this.setupSocketEvents()
        } catch (error) {
            this.isEnabled = false
            // Don't schedule reconnect if initial connection fails
        }
    }

    private setupSocketEvents() {
        if (!this.socket || !this.isEnabled) return

        this.socket.on('connect', () => {
            this.isConnected = true
            this.reconnectAttempts = 0
            this.reconnectDelay = 1000
            
            // Authenticate if we have user info
            if (this.userId) {
                this.authenticate(this.userId)
            }
        })

        this.socket.on('disconnect', (reason) => {
            this.isConnected = false
            
            // Don't attempt to reconnect for certain disconnect reasons
            if (reason === 'io server disconnect' || reason === 'io client disconnect') {
                this.isEnabled = false
            }
        })

        this.socket.on('connect_error', (error: any) => {
            this.isConnected = false
            
            // Don't show error if server is not available
            if (error.message && error.message.includes('websocket')) {
                this.isEnabled = false
            }
            
            // Limit reconnection attempts
            if (this.reconnectAttempts >= this.maxReconnectAttempts) {
                this.isEnabled = false
                console.log('Max reconnection attempts reached, disabling WebSocket')
            }
        })

        this.socket.on('authenticated', (data: any) => {
            if (this.userEmail) {
                this.joinEmailRoom(this.userEmail)
            }
        })

        this.socket.on('new_email_notification', (notification: any) => {
            this.handleNewEmailNotification(notification)
        })

        this.socket.on('pong', () => {
            // Connection is healthy
        })

        // Log all other events for debugging
        this.socket.onAny((eventName, ...args) => {
            if (!['connect', 'disconnect', 'connect_error', 'authenticated', 'new_email_notification', 'pong'].includes(eventName)) {
                // Silent - no logging
            }
        })
    }

    private setupEventListeners() {
        if (!this.isEnabled) return
        
        // Handle page visibility changes
        document.addEventListener('visibilitychange', () => {
            if (document.visibilityState === 'visible' && this.isConnected) {
                // Page became visible, check connection health
                this.ping()
            }
        })

        // Handle beforeunload
        window.addEventListener('beforeunload', () => {
            if (this.socket) {
                this.socket.disconnect()
            }
        })
    }

    authenticate(userId: string, token?: string) {
        if (!this.isEnabled || !this.isConnected || !this.socket) {
            return
        }

        const authData = { userId, token }
        
        this.userId = userId
        this.socket.emit('authenticate', authData)
    }

    joinEmailRoom(email: string) {
        if (!this.isEnabled || !this.isConnected || !this.socket) {
            return
        }

        this.userEmail = email
        this.socket.emit('join_email_room', email)
    }

    onNewEmail(callback: (notification: any) => void) {
        // Check if this callback is already registered to prevent duplicates
        const isAlreadyRegistered = this.notificationCallbacks.some(
            existingCallback => existingCallback === callback
        )
        
        if (!isAlreadyRegistered) {
            this.notificationCallbacks.push(callback)
        }
    }

    // Method to clear all notification callbacks
    clearNotificationCallbacks() {
        this.notificationCallbacks = []
    }

    // Method to remove a specific callback
    removeNotificationCallback(callback: (notification: any) => void) {
        this.notificationCallbacks = this.notificationCallbacks.filter(
            existingCallback => existingCallback !== callback
        )
    }

    private handleNewEmailNotification(notification: any) {
        // Call all registered callbacks
        this.notificationCallbacks.forEach((callback, index) => {
            try {
                callback(notification)
            } catch (error) {
                console.error('Error in notification callback:', error)
            }
        })

        // Show browser notification if permission is granted
        this.showBrowserNotification(notification)
    }

    private showBrowserNotification(notification: any) {
        if (!('Notification' in window)) {
            return
        }

        if (Notification.permission === 'granted') {
            const notificationTitle = `New Email: ${notification.subject || 'New Message'}`
            const notificationBody = `From: ${notification.from || 'Unknown sender'}`
            
            const browserNotification = new Notification(notificationTitle, {
                body: notificationBody,
                icon: '/favicon.ico',
                badge: '/favicon.ico',
                tag: notification.uid || notification.id,
                requireInteraction: false,
                silent: false
            })

            // Handle notification click
            browserNotification.onclick = () => {
                window.focus()
                browserNotification.close()
            }

            // Auto close after 5 seconds
            setTimeout(() => {
                browserNotification.close()
            }, 5000)
        } else if (Notification.permission !== 'denied') {
            Notification.requestPermission().then(permission => {
                if (permission === 'granted') {
                    this.showBrowserNotification(notification)
                }
            })
        }
    }

    ping() {
        if (this.isEnabled && this.isConnected && this.socket) {
            this.socket.emit('ping')
        }
    }

    private scheduleReconnect() {
        if (!this.isEnabled) return
        
        if (this.reconnectAttempts < this.maxReconnectAttempts) {
            this.reconnectAttempts++
            this.reconnectDelay = Math.min(this.reconnectDelay * 2, 30000) // Max 30 seconds
            
            setTimeout(() => {
                this.connect()
            }, this.reconnectDelay)
        } else {
            this.isEnabled = false
        }
    }

    disconnect() {
        if (this.socket) {
            this.socket.disconnect()
        }
        this.isConnected = false
        this.isEnabled = false
    }

    getConnectionStatus() {
        const status = {
            isConnected: this.isConnected,
            isEnabled: this.isEnabled,
            reconnectAttempts: this.reconnectAttempts,
            userId: this.userId,
            userEmail: this.userEmail
        }
        return status
    }

    // Method to check if WebSocket is available
    isWebSocketAvailable() {
        return this.isEnabled && this.isConnected
    }

    private isRestApiUrl(url: string): boolean {
        // Check if URL contains the Sendbun API domain
        return url.toLowerCase().includes('uapi.sendbun.com')
    }
} 