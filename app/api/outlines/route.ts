import { getSessionUser } from "@/lib/auth"
import { checkOrgAccess } from "@/lib/auth-utils"
import { createOutlineSchema } from "@/lib/validation"
import {
  unauthorizedResponse,
  badRequestResponse,
  forbiddenResponse,
  successResponse,
  handleApiError,
} from "@/lib/api-response"
import { db } from "@/db"
import { outline } from "@/db/schema/schema"
import { desc, eq } from "drizzle-orm"

// GET /api/outlines?orgId=...
export async function GET(request: Request) {
  try {
    const sessionUser = await getSessionUser(request)
    if (!sessionUser) {
      return unauthorizedResponse()
    }

    const { searchParams } = new URL(request.url)
    const orgId = searchParams.get("orgId")

    if (!orgId || orgId === "undefined" || orgId === "null") {
      return badRequestResponse("orgId is required", "MISSING_ORG_ID")
    }

    const access = await checkOrgAccess(sessionUser.id, orgId)
    if (!access.hasAccess) {
      return forbiddenResponse("You do not have access to this organization")
    }

    const outlines = await db
      .select()
      .from(outline)
      .where(eq(outline.organizationId, orgId))
      .orderBy(desc(outline.createdAt))

    return successResponse({ outlines })
  } catch (error) {
    return handleApiError(error)
  }
}

// POST /api/outlines
export async function POST(request: Request) {
  try {
    const sessionUser = await getSessionUser(request)
    if (!sessionUser) {
      return unauthorizedResponse()
    }

    const body = await request.json()
    const data = createOutlineSchema.parse(body)

    const access = await checkOrgAccess(sessionUser.id, data.orgId)
    if (!access.hasAccess) {
      return forbiddenResponse("You do not have access to this organization")
    }

    if (!access.isOwner) {
      return forbiddenResponse("Only organization owners can create outlines")
    }

    const [created] = await db
      .insert(outline)
      .values({
        organizationId: data.orgId,
        header: data.header,
        sectionType: data.sectionType,
        status: data.status,
        target: data.target,
        limit: data.limit,
        reviewer: data.reviewer,
      })
      .returning()

    if (!created) throw new Error("Failed to create outline")

    return successResponse({ outline: created }, "Outline created successfully")
  } catch (error) {
    return handleApiError(error)
  }
}
