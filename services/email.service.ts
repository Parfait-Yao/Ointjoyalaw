import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendEmail({
  to,
  subject,
  html,
  attachments,
}: {
  to: string
  subject: string
  html: string
  attachments?: { filename: string; content: Buffer }[]
}) {
  if (!process.env.RESEND_API_KEY) {
    console.log("Mock Email Sent to", to, "Subject:", subject)
    return { id: "mock-id" }
  }

  return await resend.emails.send({
    from: "Ointjoyalaw Ministries <contact@ointjoyalaw.com>",
    to,
    subject,
    html,
    attachments,
  })
}
