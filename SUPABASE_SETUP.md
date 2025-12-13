# Supabase Database Integration

## Overview
Your portfolio site is now fully connected to Supabase for contact message storage and management.

## What Was Set Up

### 1. Database Table: `contact_messages`
**Purpose:** Stores all contact form submissions from visitors

**Columns:**
- `id` (UUID) - Unique message identifier
- `name` (Text) - Visitor's name
- `email` (Text) - Visitor's email address
- `subject` (Text) - Message subject
- `message` (Text) - Message content
- `status` (Text) - Message status: 'new', 'read', 'replied'
- `created_at` (Timestamp) - When message was sent
- `read_at` (Timestamp) - When admin read the message
- `updated_at` (Timestamp) - Last update time

**Indexes for Performance:**
- `status` - For filtering messages by status
- `created_at` - For sorting by date
- `email` - For searching messages

### 2. Row Level Security (RLS)
**Public Policy:** Anyone can submit contact messages (unauthenticated)
**Admin Policy:** Only authenticated users can view, update, and delete messages

### 3. Edge Function: `contact-message`
**Endpoint:** `{SUPABASE_URL}/functions/v1/contact-message`
**Method:** POST
**Authentication:** Bearer token (uses anon key)

**Request Body:**
```json
{
  "name": "Visitor Name",
  "email": "visitor@example.com",
  "subject": "Inquiry Subject",
  "message": "Message content"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Message sent successfully! I'll get back to you soon.",
  "id": "uuid-of-message"
}
```

**Validations:**
- All fields required
- Valid email format
- Field length limits respected

## How It Works

1. **User submits the contact form** on the portfolio site
2. **Contact component validates** the form data
3. **Edge function receives** the form submission
4. **Function validates** email format and required fields
5. **Message stored** in `contact_messages` table
6. **User receives** success confirmation via toast notification
7. **Message stored** with status "new" for admin review

## Admin Access

To view messages submitted through your contact form:

1. Go to Supabase Dashboard
2. Navigate to `contact_messages` table
3. View all submissions with their status
4. Update status to 'read' or 'replied' as needed
5. Can filter by date, email, or status

## Environment Variables

Already configured in your `.env` file:
- `VITE_SUPABASE_URL` - Your Supabase project URL
- `VITE_SUPABASE_ANON_KEY` - Public anon key for client-side requests

## Security Features

✓ Row Level Security (RLS) enabled
✓ Public users can only INSERT (submit) messages
✓ Only authenticated users can view/modify messages
✓ Email validation on both client and server
✓ All fields properly sanitized
✓ No secrets exposed to client
✓ Service role key only used server-side (edge function)

## Testing

To test the integration:

1. Navigate to the "Let's Connect & Collaborate" section
2. Fill out the contact form with valid data
3. Click "Send Message"
4. Should see success toast notification
5. Check Supabase dashboard to verify message was stored

## Next Steps (Optional)

You could further enhance this by:
- Adding email notifications to admin email
- Creating a message management dashboard
- Adding spam detection/filtering
- Setting up automated responses
- Adding file upload capability
- Implementing message templates

## Support

For issues or questions about the setup:
- Check Supabase Dashboard logs
- Verify `.env` variables are correct
- Ensure edge function is ACTIVE status
- Check browser console for error messages
