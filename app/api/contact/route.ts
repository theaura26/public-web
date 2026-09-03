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
      to: ['hello@theaura.life', 'poon@theaura.life', 'aman@theaura.life', 'arvind@theaura.life', 'erik@theaura.life'],
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
      /* The reason, not just the fact.
      
         "Failed to send. Please try again." is what a visitor should
         read, and it was also all anyone debugging it could see: the
         cause went to a console log in a serverless function, which is
         the one place nobody looks from outside. A form that has been
         failing is a form whose failures were invisible.
      
         The provider's own error name and a short message come back
         alongside it. Both describe our configuration — an unverified
         sending domain, a key restricted to one recipient — rather than
         anything a visitor typed, and neither is the key. */
      console.error('Resend error:', error)
      return NextResponse.json({
        error: 'Failed to send. Please try again.',
        reason: (error as { name?: string }).name ?? 'unknown',
        detail: String((error as { message?: string }).message ?? '').slice(0, 160),
      }, { status: 500 })
    }

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('Contact API error:', err)
    return NextResponse.json({
      error: 'Something went wrong.',
      reason: err instanceof Error ? err.name : 'unknown',
      detail: err instanceof Error ? err.message.slice(0, 160) : '',
    }, { status: 500 })
  }
}
