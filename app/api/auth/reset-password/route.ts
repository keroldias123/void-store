import { resetPasswordSchema } from "@/lib/validation"
import { account, user, verification } from "@/db/schema/schema"
import { hash } from "bcryptjs"
import { badRequestResponse, successResponse, handleApiError } from "@/lib/api-response"
import { db } from "@/db"
import { eq } from "drizzle-orm"

export async function POST(request: Request) {
  try {
    const data = resetPasswordSchema.parse(await request.json())

    // Find verification token
    const tokenRecord = await db.query.verification.findFirst({
      where: (fields, { eq, and }) =>
        and(
          eq(fields.identifier, "password-reset"),
          eq(fields.value, data.token)
        ),
    })

    if (!tokenRecord) {
      return badRequestResponse("Invalid or expired reset token", "INVALID_TOKEN")
    }

    // Check if token is expired
    if (tokenRecord.expiresAt < new Date()) {
      await db.delete(verification).where(eq(verification.id, tokenRecord.id))
      return badRequestResponse(
        "Reset token has expired. Please request a new password reset.",
        "TOKEN_EXPIRED"
      )
    }

    // Hash new password using bcryptjs (matching better-auth configuration)
    const hashedPassword = await hash(data.password, 10)

    // Find the user's account (better-auth stores password in Account table, not User table)
    const accountRow = await db.query.account.findFirst({
      where: (fields, { eq, and }) =>
        and(
          eq(fields.userId, tokenRecord.userId),
          eq(fields.providerId, "credential")
        ),
    })

    if (!accountRow) {
      return badRequestResponse(
        "Account not found. Please contact support.",
        "ACCOUNT_NOT_FOUND"
      )
    }

    // Update password in Account table (this is what better-auth uses for authentication)
    await db
      .update(account)
      .set({ password: hashedPassword })
      .where(eq(account.id, accountRow.id))

    // Also update User.password for consistency
    await db
      .update(user)
      .set({ password: hashedPassword })
      .where(eq(user.id, tokenRecord.userId))

    // Delete used token
    await db.delete(verification).where(eq(verification.id, tokenRecord.id))

    return successResponse(undefined, "Password reset successfully")
  } catch (error) {
    return handleApiError(error)
  }
}
