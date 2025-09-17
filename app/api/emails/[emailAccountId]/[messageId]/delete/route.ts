import { NextRequest, NextResponse } from 'next/server'

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ emailAccountId: string; messageId: string }> }
) {
  try {
    const API_URL = process.env.API_URL
    const API_KEY = process.env.API_KEY

    if (!API_URL || !API_KEY) {
      return NextResponse.json(
        { error: 'API configuration missing' },
        { status: 500 }
      )
    }

    const { emailAccountId, messageId } = await params

    // Validate required parameters
    if (!emailAccountId || !messageId) {
      return NextResponse.json(
        { error: 'emailAccountId and messageId are required' },
        { status: 400 }
      )
    }

    const response = await fetch(`${API_URL}site/message/${emailAccountId}/${messageId}`, {
      method: 'DELETE',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `bearer ${API_KEY}`
      }
    })

    if (!response.ok) {
      const errorData = await response.text()
      console.error('Sendbun API error:', response.status, errorData)
      
      if (response.status === 404) {
        return NextResponse.json(
          { error: 'Email not found' },
          { status: 404 }
        )
      }
      
      return NextResponse.json(
        { error: 'Failed to delete email', details: errorData },
        { status: response.status }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Email deleted successfully'
    })

  } catch (error) {
    console.error('Error deleting email:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 