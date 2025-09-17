import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const API_URL = process.env.API_URL
    const API_KEY = process.env.API_KEY

    if (!API_URL || !API_KEY) {
      return NextResponse.json(
        { error: 'API configuration missing' },
        { status: 500 }
      )
    }

    // Get query parameters
    const { searchParams } = new URL(request.url)
    const emailAccountId = searchParams.get('emailAccountId')
    const folder = searchParams.get('folder') || 'inbox,spam' // Default to inbox and spam
    const page = searchParams.get('page') || '1'

    // Validate required parameters
    if (!emailAccountId) {
      return NextResponse.json(
        { error: 'emailAccountId is required' },
        { status: 400 }
      )
    }

    // Build URL with pagination
    const url = new URL(`${API_URL}site/messages/${emailAccountId}`)
    url.searchParams.set('folder', folder)
    url.searchParams.set('page', page)
    url.searchParams.set('limit', '10') // Set page size

    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `bearer ${API_KEY}`
      }
    })

    if (!response.ok) {
      const errorData = await response.text()
      console.error('Sendbun API error:', response.status, errorData)
      return NextResponse.json(
        { error: 'Failed to fetch emails', details: errorData },
        { status: response.status }
      )
    }

    const data = await response.json()
    
    // Handle the actual API response structure
    if (data.status === true) {
      return NextResponse.json({
        success: true,
        data: data // This will be the complete response with pagination
      })
    } else {
      return NextResponse.json(
        { error: 'Failed to fetch emails' },
        { status: 400 }
      )
    }

  } catch (error) {
    console.error('Error fetching emails:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 