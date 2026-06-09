# Admin Panel Setup Guide

## Quick Start

### 1. Set Admin Email(s)

Edit your `.env` or `.env.local` file and add:

```env
ADMIN_EMAILS=your-email@example.com
```

For multiple admins:
```env
ADMIN_EMAILS=admin1@example.com,admin2@example.com,manager@example.com
```

### 2. Start the Application

```bash
npm run dev
```

### 3. Access Admin Panel

1. Navigate to `http://localhost:3000/admin`
2. Log in with your admin email account
3. You'll see the admin dashboard

## What's Included

### Complete Admin System

✅ **Product Management**
- Create, read, update, delete products
- Manage images (multiple per product)
- Add technical specifications
- Set features and color options
- Control stock status and visibility
- Price and delivery management

✅ **Order Management**
- View all customer orders
- Filter by status (Pending, Processing, Shipped, Delivered, Cancelled)
- Update order status
- Track shipments with tracking numbers
- Add internal notes
- View customer and shipping information

✅ **User Management**
- Search and view all customers
- View user profile information
- See all addresses on file
- View complete order history
- Change user roles
- Delete user accounts

✅ **Blog Management**
- Create and publish blog posts
- Add cover images
- Manage multi-paragraph content
- Draft and publish workflows
- View all posts with filters
- Edit and delete posts

✅ **Dashboard**
- Key metrics (products, orders, users, posts)
- Total revenue summary
- Recent orders feed
- Quick access to all features

## File Structure Created

```
Admin Routes:
├── /admin                          Dashboard
├── /admin/products                 Product list
├── /admin/products/new             Create product
├── /admin/products/[id]            Edit product
├── /admin/orders                   Order list
├── /admin/orders/[id]              Order details & management
├── /admin/users                    User list
├── /admin/users/[id]               User details
├── /admin/blog                     Blog list
├── /admin/blog/new                 Create blog post
├── /admin/blog/[id]                Edit blog post
└── /admin/settings                 Settings

API Endpoints:
├── /api/admin/products             [GET, POST]
├── /api/admin/products/[id]        [GET, PUT, DELETE]
├── /api/admin/orders               [GET]
├── /api/admin/orders/[id]          [GET, PUT]
├── /api/admin/users                [GET]
├── /api/admin/users/[id]           [GET, PUT, DELETE]
├── /api/admin/blog                 [GET, POST]
└── /api/admin/blog/[id]            [GET, PUT, DELETE]

Components:
├── components/admin/admin-sidebar.tsx
├── components/admin/product-form.tsx
└── components/admin/blog-form.tsx
```

## Features Breakdown

### Dashboard
- 📊 Statistics cards (total products, orders, users, blog posts)
- 💰 Total revenue calculation
- 📋 Recent 5 orders preview with status

### Product Management
- ➕ Create new products with full details
- 🖼️ Multiple images per product
- 🔧 Technical specifications (key-value pairs)
- 🏷️ Features and color options
- 📦 Stock status tracking (In Stock, Low Stock, Out of Stock, Pre-order)
- ⭐ Featured product toggle
- 👁️ Visibility toggle (hidden from catalog)
- 💷 Price management in GBP
- 📅 Delivery days configuration
- ✏️ Edit and delete products
- 🔍 View all products including hidden

### Order Management
- 📨 Pagination support (10 orders per page)
- 🔍 Filter by status
- 🕐 Sort by most recent
- 👥 Customer information display
- 💳 Order totals and itemization
- 📦 Update order status
- 🚚 Add/update tracking numbers
- 📝 Internal notes for staff
- 🏠 Shipping address display

### User Management
- 🔍 Search by email or name
- 📄 Pagination (10 users per page)
- 👤 User profile information
- 🏠 View all saved addresses
- 📦 Complete order history
- 👮 Role assignment (User/Admin)
- 🗑️ Delete user accounts (with confirmation)

### Blog Management
- ✍️ Create blog posts with title, excerpt, author
- 🖼️ Cover image management
- 📝 Multi-paragraph content editing
- 🗂️ Draft and publish status
- 🔍 Filter by publication status
- 📄 Pagination support
- ✏️ Edit existing posts
- 🗑️ Delete posts (with confirmation)

### Settings
- ⚙️ Configuration reference
- 📧 Admin email setup guide
- 💡 Feature documentation

## Database Schema

The admin panel works with the existing Prisma schema:

```prisma
User (admin role support)
├── id, email, name, role
├── phone, dateOfBirth, gender
└── Relations: addresses, orders, sessions

Product
├── id, name, slug, category, subcategory
├── description, longDescription, basePrice
├── images[], specs{}, features[], colors[]
├── stock, deliveryDays
├── featured, hidden
└── technicalSections, whatsInTheBox, warranty

Order
├── id, userId, total, status
├── shippingAddress, trackingNumber, notes
└── items[] (OrderItem)

User Addresses
├── id, userId, label, fullName, phone
├── line1, line2, city, state, postcode, country
└── isDefault

BlogPost
├── id, slug, title, excerpt, coverImage
├── body[], author, published, date
```

## Security

- ✅ Requires NextAuth authentication
- ✅ Admin role validation on all endpoints
- ✅ ADMIN_EMAILS environment variable for access control
- ✅ Server-side data validation
- ✅ Delete confirmations to prevent accidents
- ✅ Role-based access control

## Common Tasks

### Add a New Admin User

1. Add email to `.env` `ADMIN_EMAILS` variable
2. Restart the dev server
3. User logs in - role is automatically set to 'admin'

### Create a Product

1. Go to `/admin/products`
2. Click "Add Product"
3. Fill required fields (name, category, price)
4. Add images via URL
5. Add specs, features, colors as needed
6. Set stock status and visibility
7. Click "Create Product"

### Manage an Order

1. Go to `/admin/orders`
2. Click eye icon on order or filter by status
3. View customer and order details
4. Update status (Pending → Processing → Shipped → Delivered)
5. Add tracking number when shipped
6. Add notes for team reference
7. Click "Save Changes"

### Create a Blog Post

1. Go to `/admin/blog`
2. Click "New Post"
3. Add title, author, excerpt
4. Add cover image URL
5. Add content paragraphs
6. Click "Publish Post" checkbox to make live
7. Click "Create Post"

## Troubleshooting

### "Unauthorized" when accessing /admin

**Solution:**
- Check your email is in `ADMIN_EMAILS` in `.env`
- Make sure you're logged in with that email
- Restart the development server
- Clear browser cookies and log in again

### Images not showing in products

**Solution:**
- Verify the image URL is publicly accessible
- Test the URL in a browser directly
- Check that the URL is complete (starts with http:// or https://)
- Ensure image format is supported (JPG, PNG, WebP)

### Changes not saving

**Solution:**
- Check browser console for error messages
- Check Network tab to see API response
- Verify all required fields are filled
- Try refreshing the page
- Check server logs for backend errors

### Sidebar not showing

**Solution:**
- Ensure you're in `/admin` route (not a sub-route)
- Clear browser cache
- Check that AdminSidebar component is imported in layout

## Next Steps

1. **Set up admin email** in `.env`
2. **Log in** to test access
3. **Create some products** to see the system in action
4. **Test order management** by creating test orders
5. **Create blog posts** to populate your blog
6. **Customize settings** as needed

## Development Notes

- Built with Next.js 16, TypeScript, Tailwind CSS
- Uses Radix UI for component library
- React Hook Form for form management
- Prisma ORM for database
- NextAuth for authentication
- Responsive design (works on mobile/tablet)

## Limitations & Future Enhancements

Current limitations:
- Image upload is URL-based (no server-side uploads)
- No drag-and-drop reordering
- No bulk operations
- No analytics/reporting

Future enhancements could include:
- AWS S3 or similar for image uploads
- Drag-and-drop product reordering
- Bulk product import/export
- Advanced analytics dashboard
- Email templates management
- Advanced inventory tracking

## Support

For detailed documentation, see: `ADMIN_PANEL.md`

For issues:
1. Check logs in browser DevTools → Console
2. Check Network tab for API errors
3. Verify authentication status
4. Ensure environment variables are set
5. Restart the development server
