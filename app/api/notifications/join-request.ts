import { getSessionUser } from "@/lib/auth"
import { joinRequestSchema } from "@/lib/validation"
import { sendEmail } from "@/lib/email"
import { getJoinRequestAcceptedTemplate, getJoinRequestRejectedTemplate } from "@/lib/email-templates"
import {
  unauthorizedResponse,
  badRequestResponse,
  forbiddenResponse,
  notFoundResponse,
  successResponse,
  handleApiError,
} from "@/lib/api-response"
import { db } from "@/db"
import { member, notification, organization, user } from "@/db/schema/schema"
import { eq } from "drizzle-orm"

// POST /api/notifications/join-request - Accept or reject join request
export async function POST(request: Request) {
  try {
    const sessionUser = await getSessionUser(request)
    if (!sessionUser) {
      return unauthorizedResponse()
    }

    const body = await request.json()
    const data = joinRequestSchema.parse(body)

    // Get the notification
    const notificationRow = await db.query.notification.findFirst({
      where: (fields, { eq }) => eq(fields.id, data.notificationId),
    })

    if (!notificationRow) {
      return notFoundResponse("Notification")
    }

    // Verify the notification belongs to the user (owner)
    if (notificationRow.userId !== sessionUser.id) {
      return forbiddenResponse("You do not have permission to modify this notification")
    }

    // Verify it's a join request
    if (notificationRow.type !== "join_request") {
      return badRequestResponse("Invalid notification type", "INVALID_NOTIFICATION_TYPE")
    }

    // Check if already processed (read)
    if (notificationRow.read) {
      return badRequestResponse("This join request has already been processed", "ALREADY_PROCESSED")
    }

    // Parse metadata
    let metadata: {
      organizationId?: string
      requestingUserId?: string
      requestingUserName?: string
      organizationName?: string
      expiresAt?: string
    }
    try {
      metadata = JSON.parse(notificationRow.metadata || "{}")
    } catch {
      return badRequestResponse("Invalid notification metadata", "INVALID_METADATA")
    }

    const { organizationId, requestingUserId, requestingUserName, organizationName, expiresAt } = metadata

    if (!organizationId || !requestingUserId) {
      return badRequestResponse("Invalid notification metadata", "INVALID_METADATA")
    }

    // Check expiration
    if (expiresAt) {
      const expirationDate = new Date(expiresAt)
      if (new Date() > expirationDate) {
        await db
          .update(notification)
          .set({ read: true })
          .where(eq(notification.id, data.notificationId))
        return badRequestResponse(
          `This join request has expired. It was valid until ${expirationDate.toLocaleDateString()}.`,
          "JOIN_REQUEST_EXPIRED"
        )
      }
    }

    // Verify user is the owner of the organization
    const org = await db.query.organization.findFirst({
      where: (fields, { eq }) => eq(fields.id, organizationId),
    })

    if (!org) {
      return notFoundResponse("Organization")
    }

    if (org.ownerId !== sessionUser.id) {
      return forbiddenResponse("Only organization owner can accept/reject requests")
    }

    if (data.action === "accept") {
      // Check if user is already a member
      const existingMember = await db.query.member.findFirst({
        where: (fields, { eq, and }) =>
          and(
            eq(fields.organizationId, organizationId),
            eq(fields.userId, requestingUserId)
          ),
      })

      if (existingMember) {
        await db
          .update(notification)
          .set({ read: true })
          .where(eq(notification.id, data.notificationId))
        return successResponse(
          { alreadyMember: true },
          "User is already a member of this organization"
        )
      }

      // Add user as member
      await db.insert(member).values({
        organizationId,
        userId: requestingUserId,
        role: "member",
        createdAt: new Date(),
      })

      // Create notification for the requesting user
      await db.insert(notification).values({
        type: "join_accepted",
        title: "Join Request Accepted",
        message: `Your request to join "${organizationName}" has been accepted!`,
        userId: requestingUserId,
        metadata: JSON.stringify({
          organizationId,
          organizationName,
        }),
      })

      // Send email notification
      try {
        const requestingUser = await db.query.user.findFirst({
          where: (fields, { eq }) => eq(fields.id, requestingUserId),
          columns: { email: true },
        })
        if (requestingUser) {
          try {
            await sendEmail({
              to: requestingUser.email,
              subject: "Join Request Accepted",
              text: `Your request to join "${organizationName}" has been accepted!`,
              html: getJoinRequestAcceptedTemplate(organizationName ?? org.name),
            })
          } catch (emailError: any) {
            if (emailError.message?.includes("Invalid email") || emailError.message?.includes("cannot receive")) {
              console.warn(`⚠️ Cannot send acceptance email to invalid email: ${requestingUser.email} - ${emailError.message}`)
            } else {
              console.error(`Failed to send acceptance email:`, emailError.message)
            }
          }
        }
      } catch (emailError: any) {
        console.error("Failed to send acceptance email:", emailError)
        if (emailError.message?.includes("invalid") || emailError.message?.includes("not valid")) {
          console.warn(`User email ${requestingUserId} is invalid and cannot receive emails`)
        }
      }

      await db
        .update(notification)
        .set({ read: true })
        .where(eq(notification.id, data.notificationId))

      return successResponse(undefined, "Join request accepted")
    } else {
      // Reject the request
      await db.insert(notification).values({
        type: "join_rejected",
        title: "Join Request Rejected",
        message: `Your request to join "${organizationName}" has been rejected.`,
        userId: requestingUserId,
        metadata: JSON.stringify({
          organizationId,
          organizationName,
        }),
      })

      try {
        const requestingUser = await db.query.user.findFirst({
          where: (fields, { eq }) => eq(fields.id, requestingUserId),
          columns: { email: true },
        })
        if (requestingUser) {
          try {
            await sendEmail({
              to: requestingUser.email,
              subject: "Join Request Update",
              text: `Your request to join "${organizationName}" has been rejected.`,
              html: getJoinRequestRejectedTemplate(organizationName ?? org.name),
            })
          } catch (emailError: any) {
            if (emailError.message?.includes("Invalid email") || emailError.message?.includes("cannot receive")) {
              console.warn(`⚠️ Cannot send rejection email to invalid email: ${requestingUser.email} - ${emailError.message}`)
            } else {
              console.error(`Failed to send rejection email:`, emailError.message)
            }
          }
        }
      } catch (emailError: any) {
        console.error("Failed to send rejection email:", emailError)
        if (emailError.message?.includes("invalid") || emailError.message?.includes("not valid")) {
          console.warn(`User email ${requestingUserId} is invalid and cannot receive emails`)
        }
      }

      await db
        .update(notification)
        .set({ read: true })
        .where(eq(notification.id, data.notificationId))

      return successResponse(undefined, "Join request rejected")
    }
  } catch (error) {
    return handleApiError(error)
  }
}
