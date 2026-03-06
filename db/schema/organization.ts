import { pgTable, text, timestamp, uniqueIndex, uuid } from "drizzle-orm/pg-core";
import { member } from "./member";
import { invitation } from "./invitation";
import { relations } from "drizzle-orm";

export const organization = pgTable(
    "organization",
    {
      id: uuid("id").primaryKey().defaultRandom(),
      name: text("name").notNull(),
      slug: text("slug").notNull().unique(),
      ownerId: text("owner_id"),
      nif:text("nif"),
      phone: text("phone"),
      createdAt: timestamp("created_at").notNull(),
      metadata: text("metadata"),
    },
    (table) => [uniqueIndex("organization_slug_uidx").on(table.slug)],
  );

  export const organizationRelations = relations(organization, ({ many }) => ({
    members: many(member),
    invitations: many(invitation),
  }));