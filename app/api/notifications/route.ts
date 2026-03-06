import { getSessionUser } from "@/lib/auth"
import {
  unauthorizedResponse,
  badRequestResponse,
  forbiddenResponse,
  successResponse,
  handleApiError,
} from "@/lib/api-response"
import { db } from "@/db"
import { notification } from "@/db/schema/schema"
import { and, count, desc, eq } from "drizzle-orm"

// GET /api/notifications - Get all notifications for current user
export async function GET(request: Request) {
  try {
    const sessionUser = await getSessionUser(request)
    if (!sessionUser) {
      return unauthorizedResponse()
    }

    const notifications = await db
      .select()
      .from(notification)
      .where(eq(notification.userId, sessionUser.id))
      .orderBy(desc(notification.createdAt))
      .limit(50)

    const unreadResult = await db
      .select({ count: count() })
      .from(notification)
      .where(
        and(
          eq(notification.userId, sessionUser.id),
          eq(notification.read, false)
        )
      )

    const unreadCount = Number(unreadResult[0]?.count ?? 0)

    return successResponse({
      notifications,
      unreadCount,
    })
  } catch (error) {
    return handleApiError(error)
  }
}

// PATCH /api/notifications - Mark notification as read
export async function PATCH(request: Request) {
  try {
    const sessionUser = await getSessionUser(request)
    if (!sessionUser) {
      return unauthorizedResponse()
    }

    const body = await request.json()
    const { notificationId, markAllAsRead } = body

    if (markAllAsRead) {
      await db
        .update(notification)
        .set({ read: true })
        .where(
          and(
            eq(notification.userId, sessionUser.id),
            eq(notification.read, false)
          )
        )
      return successResponse(undefined, "All notifications marked as read")
    }

    if (!notificationId) {
      return badRequestResponse(
        "notificationId is required when markAllAsRead is false",
        "MISSING_NOTIFICATION_ID"
      )
    }

    const existingRow = await db.query.notification.findFirst({
      where: (fields, { eq }) => eq(fields.id, notificationId),
      columns: { userId: true },
    })

    if (!existingRow) {
      return badRequestResponse("Notification not found", "NOTIFICATION_NOT_FOUND")
    }

    if (existingRow.userId !== sessionUser.id) {
      return forbiddenResponse("You do not have permission to modify this notification")
    }

    const [updated] = await db
      .update(notification)
      .set({ read: true })
      .where(eq(notification.id, notificationId))
      .returning()

    return successResponse({ notification: updated }, "Notification marked as read")
  } catch (error) {
    return handleApiError(error)
  }
}
