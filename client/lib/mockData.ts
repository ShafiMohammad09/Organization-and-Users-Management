export interface User { id: number; name: string; role: 'admin' | 'coordinator'; }

export interface Organization {
  id: number;
  name: string;
  slug: string;
  avatar: string;
  pendingRequests: number;
  status: 'active' | 'blocked' | 'inactive';
  email: string;
  phone: string;
  website: string;
  users: User[];
}

const orgNames = [
  'Aurora Labs',
  'Nimbus Co',
  'Vertex Solutions',
  'Heliotrope Systems',
  'Meridian Works',
  'Cobalt Collective',
  'Pioneer Labs',
  'Atlas Dynamics',
];

const personNames = [
  'Dave Richards',
  'Abhishek Hari',
  'Nishta Gupta',
  'Taylor Jones',
  'Sana Khan',
  'Liam Smith',
  'Olivia Brown',
  'Noah Williams',
  'Ava Johnson',
  'Ethan Martinez',
];

function randInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function pick<T>(arr: T[]) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function makeUsers(count: number, startId = 1) {
  const users: User[] = [];
  for (let i = 0; i < count; i++) {
    users.push({
      id: startId + i,
      name: pick(personNames) + (Math.random() > 0.8 ? ` ${randInt(1,99)}` : ''),
      role: Math.random() > 0.6 ? 'admin' : 'coordinator',
    });
  }
  return users;
}

export const organizations: Organization[] = orgNames.map((n, i) => {
  const slug = n.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  const users = makeUsers(randInt(2, 6), i * 10 + 1);
  return {
    id: i + 1,
    name: n,
    slug,
    avatar: `https://api.dicebear.com/6.x/identicon/svg?seed=${encodeURIComponent(n)}`,
    pendingRequests: randInt(0, 120),
    status: ['active', 'blocked', 'inactive'][randInt(0, 2)] as 'active' | 'blocked' | 'inactive',
    email: `${slug}@example.com`,
    phone: `+91 ${randInt(7000000000, 9999999999)}`,
    website: `${slug}.com`,
    users,
  };
});

export function getOrganizationById(id: number) {
  return organizations.find((o) => o.id === id) || null;
}
