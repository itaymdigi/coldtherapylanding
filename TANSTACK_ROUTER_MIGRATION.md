# TanStack Router Migration Guide

## Migration Summary

Successfully migrated the Cold Therapy Landing Page from a single-page application to **TanStack Router** architecture.

## What Was Changed

### 1. **Dependencies Added**
- `@tanstack/react-router` - Core routing library
- `@tanstack/router-vite-plugin` - Vite plugin for route generation
- `@tanstack/router-devtools` - Development tools

### 2. **New Project Structure**

```
src/
├── components/
│   ├── AdminPanel.jsx          # Admin panel component
│   ├── Background.jsx          # Animated background
│   ├── Header.jsx              # Navigation header
│   ├── Layout.jsx              # Root layout wrapper
│   └── sections/
│       └── AboutSection.jsx    # About section (example)
├── contexts/
│   └── AppContext.jsx          # Global state management
├── data/
│   └── translations.js         # i18n translations
├── pages/
│   └── HomePage.jsx            # Main home page
├── routes/
│   ├── __root.jsx              # Root route
│   └── index.lazy.jsx          # Home route (lazy loaded)
├── main.jsx                    # Updated with RouterProvider
└── App.backup.jsx              # Original App.jsx backup
```

### 3. **Key Files Created**

#### **AppContext.jsx**
- Centralized state management using React Context
- Manages all application state (language, admin, gallery, etc.)
- Provides hooks and functions to all components

#### **Layout.jsx**
- Root layout component wrapping all routes
- Includes Header, Background, AdminPanel, and Footer
- Uses `<Outlet />` for route content

#### **Header.jsx**
- Navigation component with desktop and mobile menus
- Language toggle, music controls
- Admin button and mobile CTA

#### **HomePage.jsx**
- Complete home page with all sections:
  - Hero section
  - Benefits
  - Packages
  - Stats counter
  - Why Ice Bath
  - About Dan
  - Contact

#### **Routes**
- `__root.jsx` - Root route with AppProvider
- `index.lazy.jsx` - Lazy-loaded home route

### 4. **Configuration Updates**

#### **vite.config.js**
```javascript
import { TanStackRouterVite } from '@tanstack/router-vite-plugin'

export default defineConfig({
  plugins: [
    react(),
    TanStackRouterVite()  // Added
  ],
})
```

#### **main.jsx**
```javascript
import { RouterProvider, createRouter } from '@tanstack/react-router'
import { routeTree } from './routeTree.gen'

const router = createRouter({ routeTree })

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
```

## Benefits of This Migration

### 1. **Better Code Organization**
- Separated concerns into logical components
- Reusable context for state management
- Modular section components

### 2. **Type-Safe Routing**
- TanStack Router provides excellent TypeScript support
- Auto-generated route tree
- Type-safe navigation

### 3. **Performance**
- Lazy loading routes with `.lazy.jsx` files
- Code splitting out of the box
- Optimized bundle sizes

### 4. **Scalability**
- Easy to add new routes/pages
- Simple to create nested routes
- Better for multi-page applications

### 5. **Developer Experience**
- Built-in devtools
- File-based routing
- Hot module replacement

## How to Add New Routes

### 1. Create a new route file:
```javascript
// src/routes/about.lazy.jsx
import { createLazyFileRoute } from '@tanstack/react-router'
import AboutPage from '../pages/AboutPage'

export const Route = createLazyFileRoute('/about')({
  component: AboutPage,
})
```

### 2. Create the page component:
```javascript
// src/pages/AboutPage.jsx
import React from 'react'
import { useApp } from '../contexts/AppContext'

const AboutPage = () => {
  const { t } = useApp()
  return <div>{/* Your content */}</div>
}

export default AboutPage
```

### 3. The route will be automatically detected!

## Navigation

### Using Link Component
```javascript
import { Link } from '@tanstack/react-router'

<Link to="/about">About</Link>
```

### Programmatic Navigation
```javascript
import { useNavigate } from '@tanstack/react-router'

const navigate = useNavigate()
navigate({ to: '/about' })
```

## State Management

All global state is managed through `AppContext`:

```javascript
import { useApp } from '../contexts/AppContext'

const MyComponent = () => {
  const { 
    t,                    // Translations
    language,             // Current language
    setLanguage,          // Change language
    scrollToPackages,     // Scroll function
    // ... all other state
  } = useApp()
  
  return <div>{t.heroTitle}</div>
}
```

## Original App Backup

The original `App.jsx` has been backed up to `App.backup.jsx` for reference.

## Running the Application

```bash
# Development
npm run dev

# Build
npm run build

# Preview production build
npm run preview
```

## Next Steps

### Potential Enhancements:
1. **Add more routes** - Create separate pages for About, Gallery, Contact
2. **Nested routes** - Create admin routes under `/admin/*`
3. **Route guards** - Add authentication checks for admin routes
4. **SEO optimization** - Use TanStack Router's meta/title features
5. **Analytics** - Track page views with route changes
6. **Animations** - Add route transition animations

## Troubleshooting

### Route not found
- Ensure the route file is in `src/routes/`
- Check file naming convention (`.lazy.jsx` for lazy loading)
- Restart dev server to regenerate route tree

### State not persisting
- Check that components are wrapped in `<AppProvider>`
- Verify you're using `useApp()` hook correctly

### Build errors
- Run `npm run build` to check for TypeScript/build issues
- Ensure all imports are correct
- Check that `routeTree.gen.ts` is generated

## Resources

- [TanStack Router Docs](https://tanstack.com/router)
- [File-Based Routing](https://tanstack.com/router/latest/docs/framework/react/guide/file-based-routing)
- [Route Trees](https://tanstack.com/router/latest/docs/framework/react/guide/route-trees)

---

**Migration completed successfully!** 🎉

The application now uses TanStack Router with a modular, scalable architecture while maintaining all original functionality.
