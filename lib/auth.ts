import  {betterAuth} from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/db"; // your drizzle instance
import { organization } from "better-auth/plugins";
import { getOrganizationInvitationTemplate } from "./email-templates"
import { hash, compare } from "bcryptjs"
import { nextCookies } from "better-auth/next-js";
import { headers } from "next/headers";
import type { NextRequest } from "next/server"
import { sendEmail } from "./email";

export const auth = betterAuth({
    database: drizzleAdapter(db, {
        provider: "pg", // or "mysql", "sqlite"
    }),
    emailAndPassword: {
      enabled: true,
      // Configure password hasher to use bcryptjs
      password: {
        hash: async (password: string) => {
          return await hash(password, 10)
        },
        verify: async ({ password, hash: storedHash }: { password: string; hash: string }) => {
          try {
            return await compare(password, storedHash)
          } catch (error) {
            console.error("Password verification error:", error)
            return false
          }
        },
      },
    },
    socialProviders: {
        google: {
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
            prompt: "select_account", // or "consent", "login", "none", "select_account+consent"
        }
    },
    plugins: [
        nextCookies(),
        organization({
            async sendInvitationEmail(data) {
              const to = data.email
              const organizationName = data.organization.name
              const invitationLink = `${process.env.BETTER_AUTH_URL || "http://localhost:3000"}/auth/invite/${data.invitation.id}`
      
              const subject = `You've been invited to join ${organizationName}`
              const text = `Hi,
      
      You have been invited to join the organization "${organizationName}".
      
      Click the link below to accept the invitation:
      ${invitationLink}
      
      If you did not expect this email, you can safely ignore it.
      
      Thanks.`
      
              try {
                await sendEmail({
                  to,
                  subject,
                  text,
                  html: getOrganizationInvitationTemplate(organizationName, invitationLink),
                })
              } catch (error) {
                console.error("Failed to send invitation email:", error)
                // Don't throw - let better-auth handle the error gracefully
              }
            },
          }) 
    ],
    /** if no database is provided, the user data will be stored in memory.
     * Make sure to provide a database to persist user data **/
    
  session: {
    expirationTime: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // Update age: 24 hours
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60, // 5 minutes
    },
  },
  callbacks: {
    async authorized(request: NextRequest) {
      const pathname = new URL(request.url).pathname

      // Public routes
      if (pathname.startsWith("/auth") || pathname.startsWith("/api/auth") || pathname === "/") {
        return true
      }

      // Protected routes - check for valid session
      const headersList = await headers()
      const cookieHeader = headersList.get("cookie")

      if (!cookieHeader) {
        console.log("No cookies header")
        return false
      }

      return true
    },
  },
});

export async function getSessionUser(request: Request) {
    const headersList = await headers()
    const cookieHeader = headersList.get("cookie")
  
    if (!cookieHeader) {
      return null
    }
  
    const sessionToken = cookieHeader
      .split("; ")
      .find((c) => c.startsWith("better-auth.session_token="))
      ?.split("=")[1]
  
    if (!sessionToken) {
      return null
    }
  
       const session = await auth.api.getSession({ headers: request.headers })
  
  
    return session?.user || null
  }
  export type Session = typeof auth.$Infer.Session
