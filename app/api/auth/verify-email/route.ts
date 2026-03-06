import { verifyEmailSchema } from "@/lib/validation"
import { badRequestResponse, successResponse, handleApiError } from "@/lib/api-response"
import { db } from "@/db"
import { user, verification } from "@/db/schema/schema"
import { eq } from "drizzle-orm"

export async function POST(request: Request) {
  try {
    const data = verifyEmailSchema.parse(await request.json())

    // Find verification token
    const tokenRecord = await db.query.verification.findFirst({
      where: (fields, { eq, and }) =>
        and(
          eq(fields.identifier, "email-verification"),
          eq(fields.value, data.token)
        ),
    })

    if (!tokenRecord) {
      return badRequestResponse("Invalid or expired verification token", "INVALID_TOKEN")
    }

    // Check if token is expired
    if (tokenRecord.expiresAt < new Date()) {
      await db.delete(verification).where(eq(verification.id, tokenRecord.id))
      return badRequestResponse(
        "Verification token has expired. Please request a new verification email.",
        "TOKEN_EXPIRED"
      )
    }

    // Update user email as verified
    await db
      .update(user)
      .set({ emailVerified: true })
      .where(eq(user.id, tokenRecord.userId))

    // Delete used token
    await db.delete(verification).where(eq(verification.id, tokenRecord.id))

    return successResponse(undefined, "Email verified successfully")
  } catch (error) {
    return handleApiError(error)
  }
}
