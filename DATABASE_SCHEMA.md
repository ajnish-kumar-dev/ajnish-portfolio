# Database Schema Documentation

## Overview

This portfolio application uses a comprehensive Supabase PostgreSQL database with Row Level Security (RLS) for secure data management.

---

## Database Tables

### 1. **Projects** (`projects`)

Manages portfolio projects and case studies.

**Columns:**
- `id` (uuid) - Primary key
- `title` (text) - Project title
- `slug` (text) - URL-friendly identifier (unique)
- `description` (text) - Short description
- `long_description` (text) - Detailed description
- `technologies` (text[]) - Array of technologies used
- `demo_url` (text) - Live demo link
- `github_url` (text) - Repository link
- `image_url` (text) - Project image/thumbnail
- `status` (text) - 'planning' | 'in-progress' | 'completed' | 'archived'
- `featured` (boolean) - Whether to feature on homepage
- `category` (text) - 'web' | 'desktop' | 'mobile' | 'academic' | 'other'
- `sort_order` (integer) - Custom sorting
- `published` (boolean) - Visibility flag
- `created_at`, `updated_at`, `published_at` (timestamptz)

**RLS Policies:**
- Public can view published projects
- Authenticated users can manage all projects

**Indexes:**
- `status`, `featured`, `category`, `sort_order`, `published`

---

### 2. **Skills** (`skills`)

Manages technical skills and proficiencies.

**Columns:**
- `id` (uuid) - Primary key
- `name` (text) - Skill name
- `slug` (text) - URL-friendly identifier (unique)
- `icon` (text) - Emoji or icon identifier
- `description` (text) - Skill description
- `proficiency` (integer) - Skill level 0-100
- `category` (text) - 'programming' | 'web' | 'database' | 'tools' | 'soft' | 'other'
- `subcategory` (text) - Optional subcategory
- `tags` (text[]) - Tags for filtering
- `sort_order` (integer) - Custom sorting
- `featured` (boolean) - Whether to feature
- `published` (boolean) - Visibility flag
- `created_at`, `updated_at` (timestamptz)

**RLS Policies:**
- Public can view published skills
- Authenticated users can manage all skills

**Indexes:**
- `category`, `featured`, `proficiency`, `sort_order`

---

### 3. **Testimonials** (`testimonials`)

Manages client testimonials and reviews.

**Columns:**
- `id` (uuid) - Primary key
- `client_name` (text) - Client's name
- `client_role` (text) - Client's role/title
- `client_company` (text) - Client's company
- `client_photo_url` (text) - Client photo URL
- `testimonials` (text) - Testimonial content
- `rating` (integer) - Rating 1-5
- `project_id` (uuid) - Optional link to project
- `approved` (boolean) - Admin approved flag
- `featured` (boolean) - Whether to feature
- `sort_order` (integer) - Custom sorting
- `created_at`, `updated_at`, `approved_at` (timestamptz)

**RLS Policies:**
- Public can view approved testimonials
- Anyone can submit testimonials (pending approval)
- Authenticated users can manage all testimonials

**Indexes:**
- `approved`, `featured`, `rating`, `sort_order`

---

### 4. **Profile Views** (`profile_views`)

Analytics tracking for visitor sessions.

**Columns:**
- `id` (uuid) - Primary key
- `visitor_id` (text) - Anonymous visitor identifier
- `ip_address` (text) - Visitor IP
- `user_agent` (text) - Browser user agent
- `referrer` (text) - Referring URL
- `country`, `city` (text) - Geographic location
- `device_type`, `browser`, `os` (text) - Device info
- `session_duration_seconds` (integer) - Time on site
- `pages_visited` (text[]) - Array of pages viewed
- `created_at` (timestamptz)

**RLS Policies:**
- Only authenticated users can view analytics
- Anyone can insert profile views (tracking)

**Indexes:**
- `created_at`, `country`, `device_type`

---

### 5. **Chatbot Logs** (`chatbot_logs`)

Tracks chatbot conversations.

**Columns:**
- `id` (uuid) - Primary key
- `session_id` (text) - Conversation session
- `visitor_id` (text) - Visitor identifier
- `user_message` (text) - User's message
- `bot_response` (text) - Bot's response
- `intent_detected` (text) - Identified intent
- `confidence_score` (float) - AI confidence
- `response_time_ms` (integer) - Response time
- `success` (boolean) - Whether successful
- `error_message` (text) - Error if failed
- `metadata` (jsonb) - Additional data
- `created_at` (timestamptz)

**RLS Policies:**
- Only authenticated users can view logs
- Anyone can insert logs

**Indexes:**
- `session_id`, `created_at`, `intent_detected`

---

### 6. **Blog Posts** (`blog_posts`)

Manages blog articles.

**Columns:**
- `id` (uuid) - Primary key
- `title` (text) - Article title
- `slug` (text) - URL-friendly identifier (unique)
- `excerpt` (text) - Short preview
- `content` (text) - Full article content
- `cover_image_url` (text) - Cover image
- `author` (text) - Author name
- `category` (text) - Article category
- `tags` (text[]) - Array of tags
- `read_time_minutes` (integer) - Estimated read time
- `views_count`, `likes_count` (integer) - Engagement metrics
- `comments_enabled` (boolean) - Allow comments
- `featured` (boolean) - Feature on homepage
- `published` (boolean) - Visibility flag
- `published_at` (timestamptz) - Publication date
- `created_at`, `updated_at` (timestamptz)

**RLS Policies:**
- Public can view published posts
- Authenticated users can manage all posts

**Indexes:**
- `slug`, `category`, `published`, `published_at`, `featured`, `views_count`

---

### 7. **Blog Comments** (`blog_comments`)

Manages blog post comments.

**Columns:**
- `id` (uuid) - Primary key
- `post_id` (uuid) - Reference to blog post
- `parent_id` (uuid) - For nested comments
- `author_name`, `author_email`, `author_url` (text) - Author info
- `content` (text) - Comment text
- `approved` (boolean) - Moderation flag
- `ip_address`, `user_agent` (text) - Tracking info
- `created_at`, `updated_at` (timestamptz)

**RLS Policies:**
- Public can view approved comments
- Anyone can submit comments (pending approval)
- Authenticated users can manage all comments

**Indexes:**
- `post_id`, `parent_id`, `approved`

---

### 8. **Site Configuration** (`site_config`)

Dynamic site configuration settings.

**Columns:**
- `id` (uuid) - Primary key
- `key` (text) - Configuration key (unique)
- `value` (jsonb) - Configuration value
- `description` (text) - What this config is for
- `updated_at` (timestamptz)
- `updated_by` (text)

**RLS Policies:**
- Public can view config
- Authenticated users can manage config

---

### 9. **Contact Messages** (`contact_messages`)

Manages contact form submissions (existing).

**Columns:**
- `id` (uuid) - Primary key
- `name`, `email`, `subject`, `message` (text) - Contact info
- `status` (text) - 'new' | 'read' | 'replied'
- `created_at`, `read_at`, `updated_at` (timestamptz)

---

## Database Functions & Triggers

### `update_updated_at_column()`

Automatically updates the `updated_at` timestamp on any table update.

**Tables with trigger:**
- projects
- skills
- testimonials
- blog_posts
- blog_comments
- site_config

---

## Service Layer

### Available Services

#### `projectsService`
- CRUD operations for projects
- Filter by status, category, featured
- Featured projects query
- Slug-based queries

#### `skillsService`
- CRUD operations for skills
- Filter by category, featured
- Skills grouped by category
- Proficiency-based sorting

#### `testimonialsService`
- CRUD operations for testimonials
- Approval workflow
- Featured testimonials
- Pending testimonials query

#### `blogService`
- CRUD for blog posts and comments
- Posts with filtering
- Comments with threading
- Views and likes tracking
- Categories and tags

#### `analyticsService`
- Track profile views
- Track chatbot conversations
- Get analytics statistics
- Dashboard stats aggregation

#### `configService`
- Get/set site configuration
- Type-safe configuration values
- Default config keys

#### `contactService`
- Contact form submissions
- Message management
- Status updates

---

## Security (Row Level Security)

All tables have RLS enabled with appropriate policies:

- **Public Read**: Most content tables allow public read for published content
- **Authenticated Management**: Only logged-in users can create, update, delete
- **Public Write (Limited)**: Tables like testimonials and comments allow public inserts (pending approval)
- **Analytics**: Only authenticated users can view analytics data

---

## Indexes

Strategic indexes for performance:

- **Filtering**: status, category, published flags
- **Sorting**: created_at, sort_order, proficiency
- **Search**: slug, email
- **Relationships**: foreign keys

---

## Best Practices

1. **Always use RLS**: Never bypass Row Level Security
2. **Use services**: Don't query directly from components
3. **Handle errors**: Always catch and handle Supabase errors
4. **Type safety**: Use TypeScript types from `types/index.ts`
5. **Pagination**: Use `limit` and `offset` for large datasets
6. **Filtering**: Use indexes columns for WHERE clauses

---

## Migration History

1. `20251119174038_create_contact_messages_table.sql` - Contact messages
2. `20260606163403_create_portfolio_tables.sql` - Full portfolio schema

---

## Development Commands

```bash
# Apply migrations (via MCP tool)
mcp__supabase__apply_migration

# List migrations
mcp__supabase__list_migrations

# Execute SQL
mcp__supabase__execute_sql

# List tables
mcp__supabase__list_tables
```

---

## TypeScript Types

All database types are defined in `src/types/index.ts`:

- Database types (with `DB` suffix)
- Input types (for creation/updates)
- Analytics/statistics types
- Dashboard stats aggregation

---

## Seed Data Example

The `portfolio.ts` file contains initial static data that can be migrated to the database using the services created.

---

**Status:** Database schema complete ✓

**Tables Created:** 9 tables with full RLS and indexes

**Services Created:** 7 service files for all database operations
