# Admin Dashboard Documentation

## Overview

A fully-featured admin dashboard for managing your portfolio content with Supabase authentication and Row Level Security.

---

## Access

### Admin URL
Navigate to `/admin` to access the dashboard.

### Login
- Use your Supabase Auth credentials (email/password)
- If not authenticated, you'll be redirected to `/admin/login`
- After successful login, you'll be taken to the dashboard

---

## Features

### 1. Dashboard (`/admin`)
- Overview statistics:
  - Total projects, skills, testimonials, blog posts
  - Profile views and chatbot conversations
  - Pending items requiring attention
- Quick action buttons for common tasks

### 2. Projects Management (`/admin/projects`)
- **List View**: Table showing all projects with status, category, and published state
- **Create**: Add new projects with:
  - Title, description, long description
  - Technologies (comma-separated)
  - Demo URL, GitHub URL, Image URL
  - Category: web, desktop, mobile, academic, other
  - Status: planning, in-progress, completed, archived
  - Featured and Published toggles
- **Edit**: Modify existing projects
- **Delete**: Remove with confirmation dialog

### 3. Skills Management (`/admin/skills`)
- **List View**: All skills with proficiency bar and category
- **Create**: Add new skills with:
  - Name, description
  - Proficiency (0-100%, slider input)
  - Category: programming, web, database, tools, soft, other
  - Icon (emoji)
  - Tags (comma-separated)
  - Featured and Published toggles
- **Edit**: Update skill details
- **Delete**: Remove with confirmation

### 4. Experience Management (`/admin/experience`)
- **List View**: Work history entries with dates
- **Create**: Add experience with:
  - Company, position, location
  - Start/end dates
  - Currently working toggle
  - Description
  - Responsibilities (comma-separated)
  - Technologies (comma-separated)
  - Employment type: full-time, part-time, contract, internship, freelance
  - Published toggle
- **Edit**: Update details
- **Delete**: Remove with confirmation

### 5. Blog Posts (`/admin/blog`)
- **List View**: All posts with view counts and published status
- **Publish/Draft Toggle**: One-click to publish/unpublish
- **Create**: Add new posts with:
  - Title, excerpt, full content
  - Cover image URL
  - Category and tags
  - Comments enabled toggle
  - Featured and Published toggles
- **Edit**: Full content editor
- **Delete**: Remove with confirmation
- Read time auto-calculated from content

### 6. Testimonials (`/admin/testimonials`)
- **Approval Workflow**:
  - Pending testimonials highlighted in yellow
  - Approved testimonials shown in green
  - Approve/Reject buttons for pending items
- **List View**: Shows all testimonials with:
  - Client info and photo
  - Star rating
  - Featured status
- **Filter Tabs**: View all, pending, or approved
- **Expandable**: Click to reveal full testimonial text
- **Delete**: Remove with confirmation

---

## Navigation

### Sidebar
- Collapsible sidebar navigation
- Links to all sections
- Shows current admin email
- Sign out button
- Responsive: Hamburger menu on mobile

### Collapsible Mode
- Click chevron to collapse/expand sidebar
- Icons-only mode when collapsed
- Saves screen space for editing

---

## Authentication

### Supabase Auth
- Email/password authentication
- Session persistence
- Protected routes (redirects if not authenticated)
- Automatic session refresh

### Creating an Admin Account
1. Go to your Supabase dashboard
2. Navigate to Authentication > Users
3. Create a new user with email/password
4. Use those credentials to log in to `/admin/login`

---

## Security

### Row Level Security (RLS)
All database tables have RLS enabled:
- **Public read**: Published content visible to everyone
- **Authenticated write**: Only logged-in users can create/update/delete
- **Approval workflow**: Testimonials require approval before public display

### Protected Routes
- All `/admin/*` routes protected by auth guard
- Automatic redirect to login if not authenticated
- Returns to intended page after login

---

## Type Safety

All operations use TypeScript types:
- `ProjectDB`, `SkillDB`, `ExperienceDB`, etc. for database records
- `ProjectInput`, `SkillInput`, etc. for create/update operations
- Full autocomplete and type checking

---

## UI/UX Features

### Responsive Design
- Mobile-friendly sidebar
- Touch-friendly interactions
- Responsive tables with horizontal scroll

### Dark Mode
- Follows portfolio theme
- Automatic dark mode support

### Animations
- Smooth transitions
- Hover effects
- Loading states

### Feedback
- Confirmation dialogs for destructive actions
- Loading spinners during operations
- Status badges (published/draft, approved/pending)

---

## Database Tables

| Table | Purpose | RLS |
|-------|---------|-----|
| projects | Portfolio projects | ✓ |
| skills | Technical skills | ✓ |
| experience | Work history | ✓ |
| testimonials | Client reviews | ✓ |
| blog_posts | Blog articles | ✓ |
| blog_comments | Post comments | ✓ |
| profile_views | Analytics | ✓ |
| chatbot_logs | Bot conversations | ✓ |
| contact_messages | Contact form | ✓ |
| site_config | Site settings | ✓ |

---

## File Structure

```
src/
├── contexts/
│   ├── AuthContext.tsx      # Auth provider & hooks
│   └── ThemeContext.tsx     # Theme provider
├── pages/admin/
│   ├── AdminLayout.tsx      # Dashboard shell
│   ├── LoginPage.tsx        # Auth form
│   ├── DashboardPage.tsx    # Overview stats
│   ├── ProjectsPage.tsx     # Projects CRUD
│   ├── SkillsPage.tsx       # Skills CRUD
│   ├── ExperiencePage.tsx   # Experience CRUD
│   ├── BlogPage.tsx         # Blog CRUD
│   └── TestimonialsPage.tsx # Review/approve
├── components/admin/
│   └── ProtectedRoute.tsx   # Auth guard
├── services/
│   ├── projectsService.ts
│   ├── skillsService.ts
│   ├── experienceService.ts
│   ├── blogService.ts
│   ├── testimonialsService.ts
│   ├── analyticsService.ts
│   └── configService.ts
└── types/
    └── index.ts             # All TypeScript types
```

---

## Quick Start

1. **Access Admin**: Navigate to `/admin`
2. **Login**: Use your Supabase credentials
3. **Manage Content**: Use sidebar to navigate sections
4. **Create Items**: Click "Add" buttons in each section
5. **Edit**: Click pencil icon on any item
6. **Delete**: Click trash icon (with confirmation)
7. **Toggle Published**: For projects, skills, experience, blog posts
8. **Approve Testimonials**: Click Approve button

---

## Tips

- **Bulk Status Change**: Use the publish/draft toggle for quick changes
- **Testimonials**: Review pending items regularly
- **Experience**: Mark current positions with the "Currently working" toggle
- **Blog**: Draft posts won't appear on live site until published
- **Skills**: Use the proficiency slider to show expertise levels

---

## Troubleshooting

### Can't log in?
- Check Supabase credentials
- Verify user exists in Supabase Auth
- Check email confirmation status

### Data not showing?
- Verify RLS policies are correct
- Check published status
- Refresh the page

### Changes not saving?
- Check browser console for errors
- Verify Supabase connection
- Check database permissions

---

**Status**: Fully functional admin dashboard ✓

**Build**: Production ready ✓

**Security**: RLS enabled on all tables ✓

**Access**: `/admin` route ✓
