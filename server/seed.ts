import { db } from "./db.js";
import { organizations, users } from "../shared/schema.js";

const orgNames = [
  'Aurora Labs',
  'Nimbus Co',
  'Vertex Solutions',
  'Heliotrope Systems',
  'Meridian Works',
  'Cobalt Collective',
  'Pioneer Labs',
];

const personNames = [
  'Dave Richards',
  'Abhishek Hari',
  'Nishta Gupta',
  'Taylor Jones',
  'Sana Khan',
  'Liam Smith',
];

function randInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

async function seed() {
  console.log("Seeding database...");

  for (const name of orgNames) {
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    
    const [org] = await db.insert(organizations).values({
      name,
      slug,
      email: `${slug}@example.com`,
      phone: `+91 ${randInt(7000000000, 9999999999)}`,
      website: `${slug}.com`,
      avatar: `https://api.dicebear.com/6.x/identicon/svg?seed=${encodeURIComponent(name)}`,
      status: ['active', 'blocked', 'inactive'][randInt(0, 2)] as 'active' | 'blocked' | 'inactive',
      pendingRequests: randInt(0, 120),
    }).returning();

    // Add 2-4 users for each organization
    const userCount = randInt(2, 4);
    for (let i = 0; i < userCount; i++) {
      await db.insert(users).values({
        name: personNames[randInt(0, personNames.length - 1)],
        role: Math.random() > 0.6 ? 'admin' : 'coordinator',
        organizationId: org.id,
      });
    }
  }

  console.log("Database seeded successfully!");
  process.exit(0);
}

seed().catch((error) => {
  console.error("Error seeding database:", error);
  process.exit(1);
});
