import { getSessionUser } from "@/lib/auth"
import { checkOrgAccess } from "@/lib/auth-utils"
import { updateOutlineSchema } from "@/lib/validation"
import {
  unauthorizedResponse,
  badRequestResponse,
  forbiddenResponse,
  notFoundResponse,
  successResponse,
  handleApiError,
} from "@/lib/api-response"
import { db } from "@/db"
import { outline } from "@/db/schema/schema"
import { and, eq } from "drizzle-orm"

// GET /api/outlines/[id]?orgId=...
export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getSessionUser(request)
    if (!user) {
      return unauthorizedResponse()
    }

    const { searchParams } = new URL(request.url)
    const orgId = searchParams.get("orgId")

    if (!orgId || orgId === "undefined" || orgId === "null") {
      return badRequestResponse("orgId is required", "MISSING_ORG_ID")
    }

    const { id } = await params

    const access = await checkOrgAccess(user.id, orgId)
    if (!access.hasAccess) {
      return forbiddenResponse("You do not have access to this organization")
    }

    const [found] = await db
      .select()
      .from(outline)
      .where(and(eq(outline.id, id), eq(outline.organizationId, orgId)))
      .limit(1)

    if (!found) {
      return notFoundResponse("Outline")
    }

    return successResponse({ outline: found })
  } catch (error) {
    return handleApiError(error)
  }
}

// PATCH /api/outlines/[id]
export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getSessionUser(request)
    if (!user) {
      return unauthorizedResponse()
    }

    const { id } = await params
    const body = await request.json()
    const data = updateOutlineSchema.parse(body)

    const [existingOutline] = await db
      .select({ organizationId: outline.organizationId })
      .from(outline)
      .where(eq(outline.id, id))
      .limit(1)

    if (!existingOutline) {
      return notFoundResponse("Outline")
    }

    if (data.orgId !== existingOutline.organizationId) {
      return badRequestResponse("Organization ID mismatch", "ORG_ID_MISMATCH")
    }

    const access = await checkOrgAccess(user.id, data.orgId)
    if (!access.hasAccess) {
      return forbiddenResponse("You do not have access to this organization")
    }

    if (!access.isOwner) {
      return forbiddenResponse("Only organization owners can update outlines")
    }

    const updateData: {
      header?: string
      sectionType?: string
      status?: string
      target?: number
      limit?: number
      reviewer?: string
    } = {}

    if (data.header !== undefined) updateData.header = data.header
    if (data.sectionType !== undefined) updateData.sectionType = data.sectionType
    if (data.status !== undefined) updateData.status = data.status
    if (data.target !== undefined) updateData.target = data.target
    if (data.limit !== undefined) updateData.limit = data.limit
    if (data.reviewer !== undefined) updateData.reviewer = data.reviewer

    if (Object.keys(updateData).length === 0) {
      return badRequestResponse("No fields to update", "NO_UPDATE_FIELDS")
    }

    const [updated] = await db
      .update(outline)
      .set(updateData)
      .where(eq(outline.id, id))
      .returning()

    if (!updated) throw new Error("Failed to update outline")

    return successResponse({ outline: updated }, "Outline updated successfully")
  } catch (error) {
    return handleApiError(error)
  }
}

// DELETE /api/outlines/[id]
export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getSessionUser(request)
    if (!user) {
      return unauthorizedResponse()
    }

    const { searchParams } = new URL(request.url)
    const orgId = searchParams.get("orgId")

    if (!orgId) {
      return badRequestResponse("orgId is required", "MISSING_ORG_ID")
    }

    const { id } = await params

    const [existingOutline] = await db
      .select({ organizationId: outline.organizationId })
      .from(outline)
      .where(eq(outline.id, id))
      .limit(1)

    if (!existingOutline) {
      return notFoundResponse("Outline")
    }

    if (orgId !== existingOutline.organizationId) {
      return badRequestResponse("Organization ID mismatch", "ORG_ID_MISMATCH")
    }

    const access = await checkOrgAccess(user.id, orgId)
    if (!access.hasAccess) {
      return forbiddenResponse("You do not have access to this organization")
    }

    if (!access.isOwner) {
      return forbiddenResponse("Only organization owners can delete outlines")
    }

    await db.delete(outline).where(eq(outline.id, id))

    return successResponse(undefined, "Outline deleted successfully")
  } catch (error) {
    return handleApiError(error)
  }
}