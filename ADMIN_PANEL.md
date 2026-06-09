# Admin Panel Documentation

## Overview

A comprehensive admin dashboard has been created to manage all aspects of your UniBay Custom PC e-commerce platform. The admin panel provides complete control over products, orders, users, and blog content.

## Access & Authentication

### Setting Admin Users

To grant admin access to users, add their emails to the `ADMIN_EMAILS` environment variable in your `.env` file:

```env
ADMIN_EMAILS=admin@example.com,manager@example.com
```

Multiple emails should be comma-separated. Admin users can:
- Access `/admin` dashboard
- Manage all products, orders, users, and blog posts
- The system automatically sets the `admin` role in the database for these users

### Role-Based Access

- **Admin**: Full access to all admin features
- **User**: Regular customer account with no admin access

## Dashboard Structure

The admin panel is organized with a sidebar navigation containing:

1. **Dashboard** - Overview with key metrics
2. **Products** - Manage product catalog
3. **Orders** - Manage customer orders
4. **Users** - Manage customer accounts
5. **Blog** - Manage blog posts
6. **Settings** - Admin configuration

## Features

### Dashboard

- **Overview Cards**:
  - Total Products count
  - Total Orders count
  - Total Users count
  - Blog Posts count
  - Total Revenue

- **Recent Orders**:
  - Last 5 orders with customer info
  - Order status and amount
  - Quick access to order details

### Product Management

#### List View (`/admin/products`)
- View all products (including hidden ones)
- Filter and search functionality
- Edit or delete products
- Quick status indicators (featured, stock status)
- Create new products button

#### Create/Edit Product (`/admin/products/new` | `/admin/products/[id]`)

**Basic Information:**
- Product name (required)
- Category: Laptop, Desktop, Accessory (required)
- Base price in GBP (required)
- Tagline
- Short description
- Long description

**Images Management:**
- Add multiple product images via URL
- Visual preview of all images
- Remove individual images
- Supports standard image formats (JPG, PNG, etc.)

**Technical Specifications:**
- Add multiple key-value specs (CPU, RAM, GPU, etc.)
- Display specs in a key-value format
- Easy add/remove interface

**Features & Colors:**
- Add multiple features (Fast charging, USB-C, etc.)
- Add available color options
- Manage lists with add/remove buttons

**Status & Display:**
- Stock Status: In Stock, Low Stock, Out of Stock, Pre-order
- Delivery Days (default: 5)
- Featured Product toggle (appears in featured section)
- Hidden toggle (hide from public catalog)

### Order Management

#### List View (`/admin/orders`)
- View all orders with pagination
- Filter by status: All, Pending, Processing, Shipped, Delivered, Cancelled
- Sort by creation date (newest first)
- Quick view of customer email, order date, total, and status
- Color-coded status badges

#### Order Details (`/admin/orders/[id]`)

**Customer Information:**
- Customer name, email, phone
- Order creation date

**Order Summary:**
- Total items in order
- Total amount (in GBP)
- Itemized list with quantities and prices

**Update Order Status:**
- Change status: Pending → Processing → Shipped → Delivered or Cancelled
- Add/update tracking number
- Internal notes for order handling
- Save changes with validation

**Shipping Address:**
- Display full shipping address information
- Name, phone, address lines, city, state, postcode, country

### User Management

#### List View (`/admin/users`)
- Search users by email or name
- Pagination support
- View user role (Admin or User)
- Account creation date
- View full details or delete users
- Color-coded role badges

#### User Details (`/admin/users/[id]`)

**Account Information:**
- Email address (read-only)
- Full name
- Phone number
- Role assignment (User/Admin)
- Account timestamps (created/updated)
- Save changes button

**Addresses:**
- View all saved addresses
- Display address label, name, phone, address lines
- Show default address indicator
- Edit/delete address capability (future enhancement)

**Orders:**
- View all user orders in table format
- Order ID, date, item count, total, status
- Link to order details for management
- Complete order history

### Blog Management

#### List View (`/admin/blog`)
- View all blog posts
- Filter: All Posts, Published, Draft
- Pagination support
- Quick view of title, author, date, and publication status
- Create new post button
- Edit or delete posts

#### Create/Edit Blog Post (`/admin/blog/new` | `/admin/blog/[id]`)

**Post Information:**
- Title (required)
- Excerpt/summary
- Author name
- Publish toggle (Draft/Published)

**Cover Image:**
- Add cover image via URL
- Visual preview
- Remove image button

**Content:**
- Add multiple paragraphs to body
- Rich text composition
- Manage paragraphs (add, remove, reorder)
- Full WYSIWYG experience
- Support for longer-form content

### Settings (`/admin/settings`)

- Store general information
- Admin email configuration reference
- Support documentation
- Future expandable for more settings

## API Endpoints

All admin endpoints require authentication and admin role. Base URL: `/api/admin/`

### Products

```
GET    /products              - List all products
POST   /products              - Create product
GET    /products/[id]         - Get product details
PUT    /products/[id]         - Update product
DELETE /products/[id]         - Delete product
```

### Orders

```
GET    /orders                - List orders (with pagination, filter by status)
GET    /orders/[id]           - Get order details
PUT    /orders/[id]           - Update order (status, tracking, notes)
```

### Users

```
GET    /users                 - List users (with pagination, search)
GET    /users/[id]            - Get user details with addresses and orders
PUT    /users/[id]            - Update user (name, phone, role)
DELETE /users/[id]            - Delete user
```

### Blog

```
GET    /blog                  - List blog posts (with pagination, filter)
POST   /blog                  - Create blog post
GET    /blog/[id]             - Get blog post details
PUT    /blog/[id]             - Update blog post
DELETE /blog/[id]             - Delete blog post
```

## File Structure

```
app/admin/
├── layout.tsx                          # Admin layout with sidebar
├── page.tsx                            # Dashboard
├── products/
│   ├── page.tsx                        # Product list
│   ├── new/
│   │   └── page.tsx                    # Create product
│   └── [id]/
│       └── page.tsx                    # Edit product
├── orders/
│   ├── page.tsx                        # Order list
│   └── [id]/
│       └── page.tsx                    # Order details & update
├── users/
│   ├── page.tsx                        # User list
│   └── [id]/
│       └── page.tsx                    # User details
├── blog/
│   ├── page.tsx                        # Blog list
│   ├── new/
│   │   └── page.tsx                    # Create blog post
│   └── [id]/
│       └── page.tsx                    # Edit blog post
└── settings/
    └── page.tsx                        # Admin settings

components/admin/
├── admin-sidebar.tsx                   # Sidebar navigation
├── product-form.tsx                    # Product creation/editing
└── blog-form.tsx                       # Blog post creation/editing

app/api/admin/
├── products/
│   ├── route.ts                        # List & create products
│   └── [id]/route.ts                   # Get, update, delete product
├── orders/
│   ├── route.ts                        # List orders
│   └── [id]/route.ts                   # Get & update order
├── users/
│   ├── route.ts                        # List users
│   └── [id]/route.ts                   # Get, update, delete user
└── blog/
    ├── route.ts                        # List & create blog posts
    └── [id]/route.ts                   # Get, update, delete blog post
```

## Usage Examples

### Accessing the Admin Panel

1. Go to `http://localhost:3000/admin`
2. You'll be redirected to login if not authenticated
3. Log in with an admin account (email in ADMIN_EMAILS)
4. You'll see the dashboard

### Creating a Product

1. Click "Products" in sidebar
2. Click "Add Product" button
3. Fill in product details:
   - Name, category, price (required)
   - Add images via URL
   - Add technical specs (CPU, RAM, etc.)
   - Add features and colors
   - Set stock status and delivery days
4. Click "Create Product"

### Managing an Order

1. Click "Orders" in sidebar
2. Filter by status if needed
3. Click the eye icon or order row to view details
4. Update status dropdown
5. Add tracking number if shipped
6. Add internal notes
7. Click "Save Changes"

### Creating a Blog Post

1. Click "Blog" in sidebar
2. Click "New Post" button
3. Fill in post information:
   - Title (required)
   - Excerpt
   - Author name
   - Select "Publish Post" to make live
4. Add cover image URL
5. Add content paragraphs
6. Click "Create Post"

## Security Notes

- All admin endpoints require authentication via NextAuth
- Admin role is checked via both DB role and ADMIN_EMAILS env variable
- ADMIN_EMAILS acts as a self-healing mechanism
- Sensitive operations (delete, update) require confirmation
- All data validation happens server-side
- Images are stored via URL (no server-side uploads in current version)

## Future Enhancements

Potential additions to the admin panel:

1. **Bulk Operations**
   - Bulk product import/export
   - Bulk order status updates
   - Batch user management

2. **Advanced Features**
   - Product categories management
   - Inventory tracking
   - Analytics and reporting
   - Email notifications for orders
   - Customer communication tools

3. **Content Management**
   - Page builder for static content
   - SEO management
   - Meta tags editor
   - Sitemap management

4. **Advanced Settings**
   - Email templates
   - Payment configuration
   - Shipping settings
   - Tax configuration

5. **Media Management**
   - Image upload/resize
   - Gallery management
   - Asset optimization

## Troubleshooting

### Admin Access Denied

- Check that email is in `ADMIN_EMAILS` environment variable
- Verify `.env` file has been updated
- Restart the development server
- Clear browser cache and login again

### Products Not Showing

- Check that products have `hidden: false`
- Verify the category is correct
- Check that price and name are filled in

### Images Not Displaying

- Verify image URLs are publicly accessible
- Check CORS settings if using external image sources
- Ensure image format is supported (JPG, PNG, WebP, etc.)

### Order Status Update Not Saving

- Check browser console for errors
- Verify order ID is correct
- Ensure you have admin role
- Try refreshing the page

## Support

For issues or questions about the admin panel:

1. Check logs in browser console
2. Review API responses in Network tab
3. Verify authentication and permissions
4. Check that all environment variables are set correctly
