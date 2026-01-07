import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'

export async function POST(request: NextRequest) {
    try {
        const { userId, email, customAttributes } = await request.json()

        // Chatbase secret key from environment
        const secret = process.env.CHATBASE_IDENTITY_SECRET || '2p2y32oj403t4xvu7vrgwqnsmgvyvayz'

        // Create JWT token for Chatbase identity
        const token = jwt.sign(
            {
                user_id: userId,
                email: email,
                ...customAttributes
            },
            secret,
            { expiresIn: '1h' }
        )

        return NextResponse.json({ token })
    } catch (error: any) {
        console.error('Chatbase auth error:', error)
        return NextResponse.json(
            { error: 'Failed to generate token' },
            { status: 500 }
        )
    }
}
