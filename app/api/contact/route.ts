import { NextResponse } from 'next/server'
import { Resend } from 'resend'

export async function POST(req: Request) {
  try {
    const apiKey = process.env.RESEND_API_KEY
    if (!apiKey) {
      console.error('RESEND_API_KEY not configured')
      return NextResponse.json({ error: 'Email service not configured.' }, { status: 500 })
    }

    const resend = new Resend(apiKey)
    const { name, email, topic, message } = await req.json()

    if (!name || !email || !topic || !message) {
      return NextResponse.json({ error: 'All fields are required.' }, { status: 400 })
    }

    const { error } = await resend.emails.send({
      from: 'Aura Contact <contact@theaura.life>',
      to: ['hello@theaura.life', 'poon.wen.ang@gmail.com'],
      replyTo: email,
      subject: `${topic} — ${name}`,
      text: [
        `Name: ${name}`,
        `Email: ${email}`,
        `Topic: ${topic}`,
        '',
        message,
      ].join('\n'),
    })

    if (error) {
      console.error('Resend error:', error)
      return NextResponse.json({ error: 'Failed to send. Please try again.' }, { status: 500 })
    }

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('Contact API error:', err)
    return NextResponse.json({ error: 'Something went wrong.' }, { status: 500 })
  }
}
