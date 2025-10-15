# Convex Database Integration Guide

## Overview

Your Cold Therapy application is now integrated with **Convex** - a real-time database that replaces localStorage with cloud-based data persistence.

## What Changed

### ✅ **Replaced localStorage with Convex**
- Gallery images now stored in Convex database
- Schedule images persisted to cloud
- Dan's photo managed through Convex
- All data syncs in real-time across devices

### 📦 **Database Schema**

```typescript
// convex/schema.ts
{
  galleryImages: {
    url: string,
    order: number,
    altText?: string
  },
  
  scheduleImages: {
    url: string,
    title: string,
    description?: string,
    isActive: boolean
  },
  
  danPhoto: {
    url: string,
    isActive: boolean
  },
  
  bookings: {
    packageType: string,
    customerName: string,
    customerEmail: string,
    customerPhone: string,
    status: string,
    bookedAt: number
  }
}
```

## Convex Functions Created

### **Gallery Images** (`convex/galleryImages.ts`)
- `getGalleryImages` - Query all gallery images
- `addGalleryImage` - Add new image
- `updateGalleryImage` - Update existing image
- `deleteGalleryImage` - Remove image

### **Schedule Images** (`convex/scheduleImages.ts`)
- `getActiveScheduleImage` - Get current schedule
- `getAllScheduleImages` - Get all schedules
- `addScheduleImage` - Upload new schedule
- `updateScheduleImage` - Modify schedule
- `deleteScheduleImage` - Remove schedule

### **Dan's Photo** (`convex/danPhoto.ts`)
- `getActiveDanPhoto` - Get current photo
- `updateDanPhoto` - Update photo

### **Bookings** (`convex/bookings.ts`)
- `getAllBookings` - Get all bookings
- `getBookingsByStatus` - Filter by status
- `createBooking` - New booking
- `updateBookingStatus` - Change status
- `deleteBooking` - Remove booking

## How It Works

### **AppContext Integration**

```javascript
// Before (localStorage)
const [galleryImages, setGalleryImages] = useState([...]);
localStorage.setItem('galleryImages', JSON.stringify(images));

// After (Convex)
const convexGalleryImages = useQuery(api.galleryImages.getGalleryImages);
const addGalleryImage = useMutation(api.galleryImages.addGalleryImage);

// Data with fallback
const galleryImages = convexGalleryImages?.map(img => img.url) || defaultImages;
```

### **Image Upload Flow**

1. User uploads image in Admin Panel
2. Image converted to base64
3. Saved to Convex via mutation
4. UI automatically updates (real-time)
5. Data persists across sessions

## Using Convex in Your Components

### **Query Data**
```javascript
import { useQuery } from 'convex/react';
import { api } from '../convex/_generated/api';

function MyComponent() {
  const images = useQuery(api.galleryImages.getGalleryImages);
  
  return (
    <div>
      {images?.map(img => (
        <img key={img._id} src={img.url} alt={img.altText} />
      ))}
    </div>
  );
}
```

### **Mutate Data**
```javascript
import { useMutation } from 'convex/react';
import { api } from '../convex/_generated/api';

function MyComponent() {
  const addImage = useMutation(api.galleryImages.addGalleryImage);
  
  const handleAdd = async () => {
    await addImage({
      url: 'https://...',
      order: 0,
      altText: 'New image'
    });
  };
  
  return <button onClick={handleAdd}>Add Image</button>;
}
```

## Development Workflow

### **Start Development**
```bash
# Terminal 1: Start Convex backend
npx convex dev

# Terminal 2: Start Vite frontend
npm run dev
```

### **View Database**
- Open Convex Dashboard: https://dashboard.convex.dev
- View real-time data
- Test queries and mutations
- Monitor function logs

## Benefits

### 🚀 **Real-Time Sync**
- Changes appear instantly across all devices
- No manual refresh needed
- Automatic conflict resolution

### 💾 **Cloud Persistence**
- Data stored securely in the cloud
- No localStorage limitations
- Accessible from anywhere

### 🔒 **Type Safety**
- Full TypeScript support
- Auto-generated types
- Compile-time error checking

### 📊 **Built-in Dashboard**
- View and edit data visually
- Monitor function performance
- Debug queries in real-time

### ⚡ **Optimistic Updates**
- UI updates immediately
- Rollback on errors
- Better user experience

## Admin Panel Features

### **Upload Images**
1. Click Admin button (bottom right)
2. Login with password: `Coldislife`
3. Select section (Schedule, Gallery, Dan's Photo)
4. Upload image
5. Image automatically saved to Convex

### **Manage Gallery**
- Click on any gallery image to replace
- Images stored with order index
- Supports up to 7 gallery images

## Future Enhancements

### **Possible Additions**
1. **Booking System** - Already set up in schema
   - Create booking form component
   - Use `createBooking` mutation
   - Admin can view/manage bookings

2. **Contact Form** - Schema ready
   - Add contact form to Contact section
   - Store submissions in Convex
   - Email notifications

3. **Settings Management**
   - Store site settings in Convex
   - Dynamic configuration
   - No code changes needed

4. **Analytics**
   - Track page views
   - Monitor user interactions
   - Store in Convex tables

## Deployment

### **Environment Variables**
```bash
# .env.local (auto-generated by Convex)
VITE_CONVEX_URL=https://your-project.convex.cloud
```

### **Deploy to Production**
```bash
# Deploy Convex backend
npx convex deploy

# Deploy frontend (Vercel/Netlify)
npm run build
# Then deploy dist/ folder
```

## Troubleshooting

### **Convex not connecting?**
```bash
# Check Convex is running
npx convex dev

# Verify environment variable
echo $VITE_CONVEX_URL
```

### **Data not updating?**
- Check browser console for errors
- Verify Convex dashboard shows data
- Ensure mutations are awaited

### **Images not loading?**
- Base64 images can be large
- Consider using Convex file storage
- Or external CDN for production

## Resources

- [Convex Documentation](https://docs.convex.dev)
- [React Integration](https://docs.convex.dev/client/react)
- [Database Queries](https://docs.convex.dev/database/reading-data)
- [Mutations](https://docs.convex.dev/database/writing-data)

---

**Your app now has a powerful, real-time database!** 🎉

All image uploads through the Admin Panel are automatically saved to Convex and will persist across sessions and devices.
