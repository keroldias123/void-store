import { randomBytes } from "crypto"
import { sendEmail } from "@/lib/email"
import { getEmailVerificationTemplate } from "@/lib/email-templates"
import { validateEmailFormat, canReceiveEmails, getEmailErrorMessage } from "@/lib/email-validation"
import {
  unauthorizedResponse,
  badRequestResponse,
  notFoundResponse,
  successResponse,
  handleApiError,
} from "@/lib/api-response"
import { getSessionUser } from "@/lib/auth"
import { db } from "@/db"
import { user, verification } from "@/db/schema/schema"
import { eq } from "drizzle-orm"

export async function POST(request: Request) {
  try {
    const sessionUser = await getSessionUser(request)
    if (!sessionUser) {
      return unauthorizedResponse()
    }

    // Check if already verified
    const dbUser = await db.query.user.findFirst({
      where: (fields, { eq }) => eq(fields.id, sessionUser.id),
    })

    if (!dbUser) {
      return notFoundResponse("User")
    }

    // Validate email format before sending
    const emailValidation = validateEmailFormat(dbUser.email)
    if (!emailValidation.valid) {
      return badRequestResponse(
        `Your email address "${dbUser.email}" is not valid. ${getEmailErrorMessage(emailValidation)}`,
        emailValidation.errorCode
      )
    }

    // Check if email can receive emails
    const emailReceivable = canReceiveEmails(dbUser.email)
    if (!emailReceivable.valid) {
      return badRequestResponse(
        `Your email address "${dbUser.email}" cannot receive emails. ${getEmailErrorMessage(emailReceivable)}`,
        emailReceivable.errorCode
      )
    }

    if (dbUser.emailVerified) {
      return badRequestResponse("Email is already verified", "ALREADY_VERIFIED")
    }

    // Generate verification token
    const verificationToken = randomBytes(32).toString("hex")
    const expiresAt = new Date()
    expiresAt.setHours(expiresAt.getHours() + 7) // Token expires in 7 hours

    // Store verification token
    await db
      .insert(verification)
      .values({
        identifier: "email-verification",
        value: verificationToken,
        userId: sessionUser.id,
        expiresAt,
      })
      .onConflictDoUpdate({
        target: [verification.identifier, verification.value],
        set: { userId: sessionUser.id, expiresAt },
      })

    // Send email
        const verificationLink = `${process.env.BETTER_AUTH_URL || "http://localhost:3000"}/auth/verify-email?token=${verificationToken}`

        const subject = "Verify Your Email Address"
        const text = `Hi,

Please verify your email address by clicking the link below:

${verificationLink}

This link will expire in 7 hours.

If you didn't create an account, please ignore this email.

Thanks.`

        try {
          await sendEmail({
            to: dbUser.email,
            subject,
            text,
            html: getEmailVerificationTemplate(verificationLink, "7 hours"),
          })
      
      return successResponse(undefined, "Verification email sent")
    } catch (emailError: any) {
      console.error("❌ Failed to send verification email to:", dbUser.email, {
        error: emailError.message,
        code: emailError.code,
      })
      
      // Check error type and provide specific message
      let errorMessage = "Failed to send verification email"
      let errorCode = "EMAIL_SEND_FAILED"
      let userMessage = "We were unable to send the verification email. Please verify your email address is correct and try again."

      // Check if it's an invalid email error (from validation)
      if (emailError.message?.includes("Invalid email address") || emailError.message?.includes("Email cannot receive")) {
        errorMessage = "Email is not valid"
        errorCode = "INVALID_EMAIL"
        userMessage = `Your email address "${dbUser.email}" is not valid. ${emailError.message.replace("Invalid email address: ", "").replace("Email cannot receive messages: ", "")} I cannot send email to this address.`
      } else if (emailError.message?.includes("authentication") || emailError.code === "EAUTH") {
        errorMessage = "Email service authentication failed. Please contact support."
        errorCode = "SMTP_AUTH_ERROR"
        userMessage = "Email service configuration error. Please contact support."
      } else if (emailError.message?.includes("timeout") || emailError.message?.includes("connection") || emailError.code === "ETIMEDOUT" || emailError.code === "ECONNECTION") {
        errorMessage = "Unable to connect to email server. Please try again later."
        errorCode = "SMTP_CONNECTION_ERROR"
        userMessage = "Unable to connect to email server. Please try again in a few minutes."
      } else if (emailError.message?.includes("invalid") || emailError.message?.includes("not valid") || emailError.code === "EENVELOPE") {
        errorMessage = "Your email address is invalid and cannot receive emails."
        errorCode = "INVALID_EMAIL_DELIVERY"
        userMessage = `Your email address "${dbUser.email}" appears to be invalid or cannot receive emails. Please update your email address.`
      }

      return handleApiError(
        new Error(userMessage) as Error & { code?: string; errorCode?: string }
      )
    }
  } catch (error) {
    return handleApiError(error)
  }
}