# Quick Reference Guide

## Supabase Database Setup

### What's Working Now
- Contact form submissions automatically saved to Supabase
- Direct database integration (no edge functions needed)
- Proper security with Row Level Security
- Type-safe operations with TypeScript

### Key Files

**Supabase Client:**
```typescript
// src/lib/supabase.ts
import { supabase } from '../../lib/supabase';
```

**Contact Service:**
```typescript
// src/services/contactService.ts
import { contactService } from '../../services/contactService';
```

## Common Operations

### Submit a Contact Message
```typescript
const { data, error } = await supabase
  .from('contact_messages')
  .insert([{
    name: 'John Doe',
    email: 'john@example.com',
    subject: 'Inquiry',
    message: 'Hello...',
    status: 'new'
  }])
  .select();
```

### Get All Messages (with pagination)
```typescript
const { messages, total } = await contactService.getMessages(50, 0);
// 50 = limit, 0 = offset
```

### Filter Messages by Status
```typescript
const { messages } = await contactService.getMessages(50, 0, 'new');
// Shows only new messages
```

### Get Message Statistics
```typescript
const stats = await contactService.getStats();
// Returns: { total, new, read, replied }
```

### Update Message Status
```typescript
await contactService.updateMessageStatus(messageId, 'read');
// Changes status and auto-updates read_at timestamp
```

### Delete a Message
```typescript
await contactService.deleteMessage(messageId);
```

## Database Queries

### View Messages in Supabase Dashboard
1. Go to Supabase Dashboard
2. Select your project
3. Go to "SQL Editor" or "Table Editor"
4. Select "contact_messages" table
5. View all submissions

### Filter by Status
```sql
SELECT * FROM contact_messages WHERE status = 'new' ORDER BY created_at DESC;
```

### Get Statistics
```sql
SELECT 
  COUNT(*) as total,
  SUM(CASE WHEN status = 'new' THEN 1 ELSE 0 END) as new,
  SUM(CASE WHEN status = 'read' THEN 1 ELSE 0 END) as read,
  SUM(CASE WHEN status = 'replied' THEN 1 ELSE 0 END) as replied
FROM contact_messages;
```

## Error Handling

### Check for Errors
```typescript
try {
  const { data, error } = await supabase
    .from('contact_messages')
    .insert([...])
    .select();
  
  if (error) {
    console.error('Error:', error.message);
  }
} catch (err) {
  console.error('Exception:', err);
}
```

## Environment Variables

Your `.env` file contains:
```
VITE_SUPABASE_URL=https://tjnddlrntsschsywvwap.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGc...
```

These are loaded automatically - no manual setup needed.

## Building & Deploying

```bash
# Build for production
npm run build

# Preview production build
npm run preview

# Check for type errors
npx tsc --noEmit
```

## Troubleshooting

| Issue | Solution |
|-------|----------|
| "Missing Supabase env vars" | Check `.env` file has both URL and ANON_KEY |
| Messages not saving | Check browser console for error; verify RLS policies |
| Can't fetch messages | Only authenticated users can read (needs auth setup) |
| Build fails | Run `npm install` and `npm run build` again |
| Slow submissions | Check Supabase quota and network connection |

## Next Steps

1. **Create Admin Dashboard** - View all messages
2. **Add Email Notifications** - Alert on new messages
3. **Implement Search** - Full-text search capability
4. **Export to CSV** - Download messages
5. **Setup Webhooks** - Send to external services
6. **Add Auto-response** - Welcome email to visitors

## Support

- Supabase Docs: https://supabase.com/docs
- JavaScript Client: https://supabase.com/docs/reference/javascript
- RLS Guide: https://supabase.com/docs/guides/auth/row-level-security

---

Your Supabase integration is production-ready!
