import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const API_URL = process.env.API_URL
    const API_KEY = process.env.API_KEY

    if (!API_URL || !API_KEY) {
      return NextResponse.json(
        { error: 'API configuration missing' },
        { status: 500 }
      )
    }

    // Parse the request body
    const body = await request.json()
    const { email, password } = body

    // Validate required fields
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      )
    }

    // Validate password strength (minimum 8 characters)
    if (password.length < 8) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters long' },
        { status: 400 }
      )
    }

    const response = await fetch(`${API_URL}site/account/create`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `bearer ${API_KEY}`
      },
      body: JSON.stringify({
        email,
        password
      })
    })

    if (!response.ok) {
      const errorData = await response.text()
      console.error('Sendbun API error:', response.status, errorData)
      
      // Handle specific error cases
      if (response.status === 409) {
        return NextResponse.json(
          { error: 'Email account already exists' },
          { status: 409 }
        )
      }
      
      return NextResponse.json(
        { error: 'Failed to create email account', details: errorData },
        { status: response.status }
      )
    }

    const data = await response.json()
    
    // Handle the actual API response structure
    if (data.status === true) {
      return NextResponse.json({
        success: true,
        message: data.message || 'Email account created successfully',
        data: {
          id: data.id,
          email: data.email,
          status: data.status
        }
      })
    } else {
      return NextResponse.json(
        { error: data.message || 'Failed to create email account' },
        { status: 400 }
      )
    }

  } catch (error) {
    console.error('Error creating email account:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 