# B2B Organization Management System

A modern, full-stack web application for managing B2B organizations and their users. Built with React, TypeScript, Express, and PostgreSQL (Supabase).

## 🌟 Features

### Core Functionality
- **Organization Management**: Create, view, update, and delete B2B organizations
- **User Management**: Manage users within organizations with role-based access (Admin/Coordinator)
- **Advanced Search**: Quick search functionality with real-time filtering
- **Status Management**: Track organization status (Active, Blocked, Inactive)
- **Pending Requests**: Monitor and track pending requests per organization

### Recent Enhancements 
1. **Delete Functionality**: 
   - Delete organizations from the organizations list
   - Delete users from organization details page
   - Confirmation dialog for all delete operations

2. **Custom Confirmation Dialog**: 
   - Reusable confirmation component with danger mode
   - Icon indicators for dangerous actions
   - Consistent UX across delete operations

3. **Notification System**: 
   - Toast notifications for all CRUD operations
   - Success, error, and info message types
   - User-friendly feedback for actions

4. **Updated Logo**: 
   - Professional branding in the header
   - Responsive image display

5. **Improved Search UI**: 
   - Dropdown search panel with overlay
   - Real-time search results preview
   - Quick navigation to organizations
   - Clear and escape key support

## 🛠️ Technology Stack

### Frontend
- **React 18** - UI library
- **TypeScript** - Type safety
- **React Router v6** - Client-side routing
- **TanStack Query** - Server state management
- **Tailwind CSS** - Utility-first CSS framework
- **Radix UI** - Accessible component primitives
- **Lucide React** - Icon library
- **Sonner** - Toast notifications
- **React Hook Form** - Form handling
- **Zod** - Schema validation

### Backend
- **Express 5** - Node.js web framework
- **TypeScript** - Type safety
- **Drizzle ORM** - Type-safe SQL query builder
- **PostgreSQL (Supabase)** - Database
- **CORS** - Cross-origin resource sharing

### Development Tools
- **Vite** - Build tool and dev server
- **SWC** - Fast TypeScript/JavaScript compiler
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **Drizzle Kit** - Database migrations

## 📁 Project Structure

```
├── client/                  # Frontend application
│   ├── components/          # Reusable React components
│   │   ├── ui/              # UI primitives (Radix UI)
│   │   ├── ConfirmDialog.tsx    # Custom confirmation dialog
│   │   ├── Header.tsx       # Application header
│   │   ├── Layout.tsx       # Page layout wrapper
│   │   ├── Navigation.tsx   # Navigation component
│   │   ├── Breadcrumb.tsx   # Breadcrumb navigation
│   │   ├── StatusBadge.tsx  # Organization status badge
│   │   └── RoleBadge.tsx    # User role badge
│   ├── hooks/               # Custom React hooks
│   │   ├── use-toast.ts     # Toast notification hook
│   │   ├── use-mobile.tsx   # Mobile detection hook
│   │   └── use-notifications.ts  # Notification messages hook
│   ├── lib/                 # Utility libraries
│   │   ├── api.ts           # API client functions
│   │   ├── utils.ts         # Helper utilities
│   │   └── mockData.ts      # Mock data for development
│   ├── pages/               # Page components
│   │   ├── Organizations.tsx          # Organizations list
│   │   ├── OrganizationDetails.tsx    # Organization details
│   │   ├── Profile.tsx      # User profile
│   │   ├── Notifications.tsx # Notifications page
│   │   ├── Support.tsx      # Support page
│   │   └── NotFound.tsx     # 404 page
│   ├── App.tsx              # Root application component
│   └── global.css           # Global styles
├── server/                  # Backend application
│   ├── index.ts             # Express server setup
│   ├── db.ts                # Database connection
│   ├── seed.ts              # Database seeding
│   └── node-build.ts        # Production build entry
├── shared/                  # Shared types and schemas
│   ├── schema.ts            # Drizzle database schema
│   └── api.ts               # Shared API types
├── vite.config.ts           # Vite configuration
├── vite.config.server.ts    # Server build configuration
├── tailwind.config.ts       # Tailwind CSS configuration
├── drizzle.config.ts        # Drizzle ORM configuration
└── tsconfig.json            # TypeScript configuration
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ (or compatible version)
- npm or pnpm
- Supabase account (for PostgreSQL database)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd <project-directory>
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   Create a `.env` file in the root directory:
   ```env
   DATABASE_URL=postgresql://postgres.[PROJECT_ID]:[PASSWORD]@aws-1-ap-south-1.pooler.supabase.com:6543/postgres
   ```

4. **Push database schema**
   ```bash
   npm run db:push
   ```
   If you encounter data loss warnings, use:
   ```bash
   npm run db:push -- --force
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```
   The application will be available at `http://localhost:5000`

## 🗄️ Database Setup

### Supabase PostgreSQL

This project uses **Supabase** as the PostgreSQL database provider. The database schema is managed using **Drizzle ORM**.

#### Schema Overview

**Organizations Table**
- `id` (serial, primary key)
- `name` (text, required)
- `slug` (text, unique, required)
- `avatar` (text, nullable)
- `email` (text, required)
- `phone` (text, nullable)
- `website` (text, nullable)
- `status` (enum: active, blocked, inactive)
- `pending_requests` (integer, default: 0)
- `created_at` (timestamp, auto-generated)
- `updated_at` (timestamp, auto-generated)

**Users Table**
- `id` (serial, primary key)
- `name` (text, required)
- `role` (enum: admin, coordinator)
- `organization_id` (integer, foreign key to organizations)
- `created_at` (timestamp, auto-generated)
- `updated_at` (timestamp, auto-generated)

#### Database Migrations

**Important**: Never manually write SQL migrations. Always use Drizzle Kit:

```bash
# Apply schema changes
npm run db:push

# Force push (if encountering issues)
npm run db:push -- --force

# Open Drizzle Studio (database GUI)
npm run db:studio
```

### Switching from Replit Database to Supabase

The project was migrated from Replit's built-in PostgreSQL (Neon) to Supabase:

1. **Previous Setup**: Replit Database (Neon-hosted PostgreSQL)
2. **Current Setup**: Supabase PostgreSQL
3. **Migration**: Schema pushed using `npm run db:push --force`
4. **Configuration**: `.env` file with Supabase `DATABASE_URL`

## 📜 Available Scripts

- `npm run dev` - Start development server (Vite + Express)
- `npm run build` - Build for production
- `npm run build:client` - Build client only
- `npm run build:server` - Build server only
- `npm start` - Start production server
- `npm test` - Run tests
- `npm run format.fix` - Format code with Prettier
- `npm run typecheck` - Type check with TypeScript
- `npm run db:push` - Push database schema changes
- `npm run db:studio` - Open Drizzle Studio

## 🎨 UI Components

### Custom Components
- **ConfirmDialog**: Reusable confirmation dialog with danger mode
- **StatusBadge**: Visual indicator for organization status
- **RoleBadge**: Visual indicator for user roles
- **Breadcrumb**: Navigation breadcrumb trail
- **Header**: Application header with logo and navigation

### Radix UI Components
The project uses Radix UI for accessible, unstyled components:
- Alert Dialog
- Dialog
- Dropdown Menu
- Popover
- Select
- Tabs
- Toast (via Sonner)
- And more...

## 🔧 Configuration

### Vite Configuration
- **Host**: `0.0.0.0` (accessible externally)
- **Port**: `5000`
- **Allowed Hosts**: Enabled (`allowedHosts: true`) for Replit environment
- **HMR**: Configured for port 443 (Replit requirement)
- **Build Output**: `dist/spa` for client, `dist/server` for server

### Tailwind CSS
- Custom color palette for branding
- Extended utilities for common patterns
- Typography plugin
- Animation plugin

## 🔒 Security & Best Practices

- **Environment Variables**: Sensitive data stored in `.env` (gitignored)
- **CORS**: Configured for cross-origin requests
- **Input Validation**: Zod schemas for form validation
- **SQL Injection Prevention**: Drizzle ORM parameterized queries
- **Delete Confirmation**: User confirmation required for destructive actions
- **Error Handling**: Comprehensive try-catch blocks with user feedback

## 📊 Data Flow

1. **User Action** → React Component
2. **Component** → API Client (`client/lib/api.ts`)
3. **API Client** → Express Backend (`server/index.ts`)
4. **Backend** → Drizzle ORM
5. **Drizzle ORM** → PostgreSQL (Supabase)
6. **Response** → Backend → Frontend → UI Update
7. **Notification** → Toast message displayed to user

## 🎯 Key Features Implementation

### Delete Functionality
- **Organizations**: Delete from organizations list with confirmation
- **Users**: Delete from organization details with confirmation
- **Confirmation Dialog**: Custom component with danger indicators
- **Cascade Delete**: Users automatically deleted when organization is deleted (database-level)

### Notification System
- **Toast Notifications**: Using Sonner library
- **Message Types**: Success, error, info
- **Custom Hooks**: `useNotifications()` for consistent messaging
- **Action Feedback**: Immediate user feedback for all operations

### Search Functionality
- **Real-time Filtering**: Instant results as you type
- **Multi-field Search**: Name, email, slug
- **Dropdown Results**: Preview with organization details
- **Keyboard Support**: Escape to close, clear button
- **Quick Navigation**: Click result to navigate

## 🚢 Deployment

### Production Build
```bash
npm run build
npm start
```

### Environment Variables (Production)
Ensure the following are set:
- `DATABASE_URL`: Supabase PostgreSQL connection string
- `NODE_ENV`: Set to `production`

## 🐛 Troubleshooting

### Common Issues

**Database Connection Errors**
- Verify `DATABASE_URL` in `.env`
- Check Supabase project is active
- Ensure database schema is pushed: `npm run db:push`

**Vite Host Errors**
- Fixed with `allowedHosts: true` in `vite.config.ts`
- Restart dev server after config changes

**TypeScript Errors**
- Run `npm run typecheck` to identify issues
- Ensure all dependencies are installed

## 📝 Recent Changes Log

### Database Migration (Latest)
- **From**: Replit Database (Neon)
- **To**: Supabase PostgreSQL
- **Schema**: Maintained (organizations + users tables)
- **Migration**: Successful using `npm run db:push --force`

### Feature Integration from idly_sambar
1. ✅ Delete buttons (organizations & users)
2. ✅ Custom confirmation dialog component
3. ✅ Notification system (toast messages)
4. ✅ Updated logo in header
5. ✅ Improved search UI with dropdown

### Bug Fixes
- ✅ Fixed Vite allowedHosts error
- ✅ Replaced native `confirm()` with custom ConfirmDialog
- ✅ Updated all toast notifications to use custom hook

## 📄 License

This project is proprietary and confidential.

## 👥 Contributors

- Development Team
- UI/UX Integration from idly_sambar repository

## 📞 Support

For issues or questions, please contact the development team or use the in-app support feature.

---

**Last Updated**: October 24, 2025
**Version**: 2.0.0 (Supabase Migration + Feature Integration)
