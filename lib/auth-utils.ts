import { db } from "@/db/index";

/**
 * Authorization Utilities
 * 
 * Centralized authorization logic to prevent code duplication
 * and ensure consistent security checks across all API routes.
 */

export interface OrgAccessResult {
  hasAccess: boolean
  isOwner: boolean
  member?: {
    id: string
    role: string
    organizationId: string
    userId: string
  }
  organization?: {
    id: string
    name: string
    ownerId: string | null
  }
}

/**
 * Check if user has access to an organization
 * Returns access information including owner status
 */
export async function checkOrgAccess(
  userId: string,
  orgId: string
): Promise<OrgAccessResult> {
  // Validate inputs
  if (!userId || !orgId) {
    return {
      hasAccess: false,
      isOwner: false,
    }
  }

  // Check organization membership
  const member = await db.query.member.findFirst({
    where: (fields, { eq, and }) => and(eq(fields.organizationId, orgId), eq(fields.userId, userId)),
    columns: { id: true, role: true, organizationId: true, userId: true },
  })

  if (!member) {
    return {
      hasAccess: false,
      isOwner: false,
    }
  }

  // Get organization to check ownership
  const organization = await db.query.organization.findFirst({
    where: (fields, { eq }) => eq(fields.id, orgId),
    columns: { id: true, name: true, ownerId: true },
  })

  if (!organization) {
    return {
      hasAccess: false,
      isOwner: false,
    }
  }

  const isOwner = organization.ownerId === userId

  return {
    hasAccess: true,
    isOwner,
    member: {
      id: member.id,
      role: member.role,
      organizationId: member.organizationId,
      userId: member.userId,
    },
    organization,
  }
}

/**
 * Check if user is the owner of an organization
 * More efficient than checkOrgAccess when you only need owner status
 */
export async function checkOrgOwner(
  userId: string,
  orgId: string
): Promise<boolean> {
  if (!userId || !orgId) {
    return false
  }

  const organization = await db.query.organization.findFirst({
    where: (fields, { eq }) => eq(fields.id, orgId),
    columns: { ownerId: true },
  })

  return organization ? organization.ownerId === userId : false
}

/**
 * Verify user has membership in organization
 * Returns member record if exists, null otherwise
 */
export async function verifyOrgMembership(
  userId: string,
  orgId: string
): Promise<{ id: string; role: string; organizationId: string; userId: string } | null> {
  if (!userId || !orgId) {
    return null
  }

  const memberRow = await db.query.member.findFirst({
    where: (m, { eq, and }) => and(eq(m.organizationId, orgId), eq(m.userId, userId)),
    columns: { id: true, role: true, organizationId: true, userId: true },
  })

  return memberRow
    ? {
        id: memberRow.id,
        role: memberRow.role,
        organizationId: memberRow.organizationId,
        userId: memberRow.userId,
      }
    : null
}