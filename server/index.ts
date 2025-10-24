import express, { Request, Response } from "express";
import cors from "cors";
import { db } from "./db.js";
import { organizations, users, type Organization, type InsertOrganization, type User, type InsertUser } from "../shared/schema.js";
import { eq, desc } from "drizzle-orm";

export function createServer() {
  const app = express();

  app.use(cors());
  app.use(express.json());

  // ORGANIZATION ENDPOINTS

  // GET all organizations
  app.get("/api/organizations", async (req: Request, res: Response) => {
    try {
      const allOrgs = await db.select().from(organizations).orderBy(desc(organizations.createdAt));
      res.json(allOrgs);
    } catch (error) {
      console.error("Error fetching organizations:", error);
      res.status(500).json({ error: "Failed to fetch organizations" });
    }
  });

  // GET organization by ID
  app.get("/api/organizations/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid organization ID" });
      }

      const [org] = await db.select().from(organizations).where(eq(organizations.id, id));
      
      if (!org) {
        return res.status(404).json({ error: "Organization not found" });
      }

      res.json(org);
    } catch (error) {
      console.error("Error fetching organization:", error);
      res.status(500).json({ error: "Failed to fetch organization" });
    }
  });

  // POST create organization
  app.post("/api/organizations", async (req: Request, res: Response) => {
    try {
      const { name, slug, email, phone, website, status, avatar } = req.body;

      if (!name || !slug || !email) {
        return res.status(400).json({ error: "Name, slug, and email are required" });
      }

      const newOrg: InsertOrganization = {
        name,
        slug,
        email,
        phone: phone || null,
        website: website || null,
        status: status || 'active',
        avatar: avatar || null,
        pendingRequests: 0,
      };

      const [created] = await db.insert(organizations).values(newOrg).returning();
      res.status(201).json(created);
    } catch (error: any) {
      console.error("Error creating organization:", error);
      if (error.code === '23505') { // Unique constraint violation
        return res.status(409).json({ error: "Organization with this slug already exists" });
      }
      res.status(500).json({ error: "Failed to create organization" });
    }
  });

  // PUT update organization
  app.put("/api/organizations/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid organization ID" });
      }

      const { name, slug, email, phone, website, status, avatar, pendingRequests } = req.body;

      const updateData: Partial<InsertOrganization> = {};
      if (name !== undefined) updateData.name = name;
      if (slug !== undefined) updateData.slug = slug;
      if (email !== undefined) updateData.email = email;
      if (phone !== undefined) updateData.phone = phone;
      if (website !== undefined) updateData.website = website;
      if (status !== undefined) updateData.status = status;
      if (avatar !== undefined) updateData.avatar = avatar;
      if (pendingRequests !== undefined) updateData.pendingRequests = pendingRequests;

      const [updated] = await db
        .update(organizations)
        .set({ ...updateData, updatedAt: new Date() })
        .where(eq(organizations.id, id))
        .returning();

      if (!updated) {
        return res.status(404).json({ error: "Organization not found" });
      }

      res.json(updated);
    } catch (error: any) {
      console.error("Error updating organization:", error);
      if (error.code === '23505') {
        return res.status(409).json({ error: "Organization with this slug already exists" });
      }
      res.status(500).json({ error: "Failed to update organization" });
    }
  });

  // DELETE organization
  app.delete("/api/organizations/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid organization ID" });
      }

      const [deleted] = await db
        .delete(organizations)
        .where(eq(organizations.id, id))
        .returning();

      if (!deleted) {
        return res.status(404).json({ error: "Organization not found" });
      }

      res.json({ message: "Organization deleted successfully", id });
    } catch (error) {
      console.error("Error deleting organization:", error);
      res.status(500).json({ error: "Failed to delete organization" });
    }
  });

  // USER ENDPOINTS

  // GET all users for an organization
  app.get("/api/organizations/:orgId/users", async (req: Request, res: Response) => {
    try {
      const orgId = parseInt(req.params.orgId);
      if (isNaN(orgId)) {
        return res.status(400).json({ error: "Invalid organization ID" });
      }

      const orgUsers = await db.select().from(users).where(eq(users.organizationId, orgId)).orderBy(desc(users.createdAt));
      res.json(orgUsers);
    } catch (error) {
      console.error("Error fetching users:", error);
      res.status(500).json({ error: "Failed to fetch users" });
    }
  });

  // POST create user for an organization
  app.post("/api/organizations/:orgId/users", async (req: Request, res: Response) => {
    try {
      const orgId = parseInt(req.params.orgId);
      if (isNaN(orgId)) {
        return res.status(400).json({ error: "Invalid organization ID" });
      }

      const { name, role } = req.body;

      if (!name) {
        return res.status(400).json({ error: "Name is required" });
      }

      // Verify organization exists
      const [org] = await db.select().from(organizations).where(eq(organizations.id, orgId));
      if (!org) {
        return res.status(404).json({ error: "Organization not found" });
      }

      const newUser: InsertUser = {
        name,
        role: role || 'coordinator',
        organizationId: orgId,
      };

      const [created] = await db.insert(users).values(newUser).returning();
      res.status(201).json(created);
    } catch (error) {
      console.error("Error creating user:", error);
      res.status(500).json({ error: "Failed to create user" });
    }
  });

  // PUT update user
  app.put("/api/users/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid user ID" });
      }

      const { name, role } = req.body;

      const updateData: Partial<InsertUser> = {};
      if (name !== undefined) updateData.name = name;
      if (role !== undefined) updateData.role = role;

      const [updated] = await db
        .update(users)
        .set({ ...updateData, updatedAt: new Date() })
        .where(eq(users.id, id))
        .returning();

      if (!updated) {
        return res.status(404).json({ error: "User not found" });
      }

      res.json(updated);
    } catch (error) {
      console.error("Error updating user:", error);
      res.status(500).json({ error: "Failed to update user" });
    }
  });

  // DELETE user
  app.delete("/api/users/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid user ID" });
      }

      const [deleted] = await db
        .delete(users)
        .where(eq(users.id, id))
        .returning();

      if (!deleted) {
        return res.status(404).json({ error: "User not found" });
      }

      res.json({ message: "User deleted successfully", id });
    } catch (error) {
      console.error("Error deleting user:", error);
      res.status(500).json({ error: "Failed to delete user" });
    }
  });

  return app;
}
