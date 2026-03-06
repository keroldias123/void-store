import { getSessionUser } from "@/lib/auth"
import { createOrgSchema, generateSlug } from "@/lib/validation"
import { unauthorizedResponse, badRequestResponse, successResponse, handleApiError } from "@/lib/api-response"
import { db } from "@/db"
import { member, organization } from "@/db/schema/schema"
import { eq } from "drizzle-orm"

// POST /api/org/create
export async function POST(request: Request) {
  try {
    const sessionUser = await getSessionUser(request)
    if (!sessionUser) {
      return unauthorizedResponse("You must be logged in to create an organization")
    }

    const body = await request.json()
    const data = createOrgSchema.parse(body)

    // Check if any organization with this name exists globally (unique org names across all users)
    const existingByName = await db.query.organization.findFirst({
      where: (fields, { eq }) => eq(fields.name, data.name),
    })

    if (existingByName) {
      return badRequestResponse(
        "An organization with this name already exists. Please choose a different name.",
        "DUPLICATE_ORG_NAME"
      )
    }

    // Generate base slug from name
    const baseSlug = generateSlug(data.name)

    if (!baseSlug) {
      return badRequestResponse("Unable to generate a valid organization slug from the provided name")
    }

    // Generate a unique slug by appending a suffix if needed
    let slug = baseSlug
    let attempts = 0
    const maxAttempts = 20

    while (attempts < maxAttempts) {
      const existingBySlug = await db
        .select()
        .from(organization)
        .where(eq(organization.slug, slug))

      if (existingBySlug.length === 0) {
        break
      }

      const timestamp = Date.now().toString(36).slice(-6)
      const randomSuffix = Math.random().toString(36).substring(2, 6)
      slug = `${baseSlug}-${timestamp}-${randomSuffix}`
      attempts++
    }

    if (attempts >= maxAttempts) {
      return badRequestResponse(
        "Unable to generate a unique organization slug. Please try again with a different name.",
        "SLUG_GENERATION_FAILED"
      )
    }

    const result = await db.transaction(async (tx) => {
      const [org] = await tx
        .insert(organization)
        .values({
          name: data.name,
          slug,
          ownerId: sessionUser.id,
          createdAt: new Date(),
        })
        .returning()

      if (!org) throw new Error("Failed to create organization")

      await tx.insert(member).values({
        organizationId: org.id,
        userId: sessionUser.id,
        role: "owner",
        createdAt: new Date(),
      })

      return org
    })

    return successResponse({ organization: result }, "Organization created successfully")
  } catch (error) {
    return handleApiError(error)
  }
}