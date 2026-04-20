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

  console.log(`EmailService: Sending email to ${to} with subject "${subject}"`)
  return await resend.emails.send({
    from: `Joy Alawey Ministries <${process.env.Email_RESEND || "contact@ointjoyalaw.com"}>`,
    to,
    subject,
    html,
    attachments,
  })
}
