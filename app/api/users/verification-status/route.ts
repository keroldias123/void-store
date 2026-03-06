import { getSessionUser } from "@/lib/auth"
import {
  unauthorizedResponse,
  notFoundResponse,
  successResponse,
  handleApiError,
} from "@/lib/api-response"
import { db } from "@/db"
import { user } from "@/db/schema/schema"
import { eq } from "drizzle-orm"

export async function GET(request: Request) {
  try {
    const sessionUser = await getSessionUser(request)
    if (!sessionUser) {
      return unauthorizedResponse()
    }

    const [dbUser] = await db
      .select({ emailVerified: user.emailVerified })
      .from(user)
      .where(eq(user.id, sessionUser.id))
      .limit(1)

    if (!dbUser) {
      return notFoundResponse("User")
    }

    return successResponse({ emailVerified: dbUser.emailVerified })
  } catch (error) {
    return handleApiError(error)
  }
}