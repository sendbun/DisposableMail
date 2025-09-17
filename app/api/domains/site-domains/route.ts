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

    const response = await fetch(`${API_URL}site/site-domains`, {
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
        { error: 'Failed to fetch domains', details: errorData },
        { status: response.status }
      )
    }

    const data = await response.json()
    
    // The API returns { domains: [...] } structure
    return NextResponse.json({
      success: true,
      data: data // This will be { domains: [...] }
    })

  } catch (error) {
    console.error('Error fetching site domains:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 