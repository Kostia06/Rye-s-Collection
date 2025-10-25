# My Precious Collection

A beautiful, animated collection showcase website where one admin can add and manage items while everyone else can view them. Perfect for displaying Hirono collections, plushies, figures, or any other collectibles!

## Features

- **Admin-Only Editing**: Only one authenticated user can add, edit, and delete items
- **Public Viewing**: Everyone can view the collection without authentication
- **Beautiful Animations**: Smooth, cute animations powered by Framer Motion
- **Fully Responsive**: Works perfectly on desktop, tablet, and mobile devices
- **Image Upload**: Upload and display images for each collection item
- **Modern UI**: Gradient backgrounds, rounded corners, and delightful hover effects
- **Real-time Updates**: Items sync with Supabase database

## Tech Stack

- **Next.js 16** - React framework with App Router
- **React 19** - Latest React features
- **Tailwind CSS 4** - Utility-first CSS framework
- **Framer Motion** - Animation library
- **Supabase** - Backend, authentication, database, and storage
- **Lucide React** - Beautiful icon library

## Getting Started

### 1. Prerequisites

- Node.js 18+ installed
- A Supabase account (free tier works great!)

### 2. Set Up Supabase

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Wait for your project to be provisioned

#### Create Database Tables

Go to the SQL Editor in your Supabase dashboard and run this SQL:

```sql
-- Create collections table
CREATE TABLE collections (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  category TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Enable Row Level Security
ALTER TABLE collections ENABLE ROW LEVEL SECURITY;

-- Allow everyone to read collections
CREATE POLICY "Anyone can view collections"
  ON collections FOR SELECT
  TO public
  USING (true);

-- Allow authenticated users to insert/update/delete
CREATE POLICY "Authenticated users can insert collections"
  ON collections FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update collections"
  ON collections FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can delete collections"
  ON collections FOR DELETE
  TO authenticated
  USING (true);
```

#### Create Storage Bucket

In your Supabase dashboard:
1. Go to **Storage**
2. Click **New bucket**
3. Name it `collection-images`
4. Make it **Public**
5. Create the bucket

Then run this SQL to set up storage policies:

```sql
-- Storage policies
CREATE POLICY "Anyone can view images"
  ON storage.objects FOR SELECT
  TO public
  USING (bucket_id = 'collection-images');

CREATE POLICY "Authenticated users can upload images"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'collection-images');

CREATE POLICY "Authenticated users can delete images"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'collection-images');
```

#### Create Admin User

1. Go to **Authentication** > **Users**
2. Click **Add user** > **Create new user**
3. Enter your email and password
4. Save this email - you'll need it for login

### 3. Configure Environment Variables

Update `.env.local` with your Supabase credentials:

```bash
# Get these from your Supabase project settings > API
NEXT_PUBLIC_SUPABASE_URL=your_project_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here

# The email you created in Supabase
NEXT_PUBLIC_ADMIN_EMAIL=your_admin_email@example.com
```

### 4. Install Dependencies

```bash
npm install
```

### 5. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see your collection!

## Usage

### Public View
- Visit the homepage to see all collection items
- Beautiful animations and responsive grid layout
- Click the "Admin Access" link at the bottom to go to admin login

### Admin Functions
1. **Login**: Go to `/admin` or click "Admin Access" on homepage
2. **Add Item**: Click "Add New Item" button
   - Upload an image
   - Enter title (required)
   - Add category (e.g., "Hirono", "Plushies", "Figures")
   - Write a description
3. **Edit Item**: Click the edit icon on any item in the "Manage Items" section
4. **Delete Item**: Click the trash icon (confirms before deleting)
5. **Logout**: Click "Sign Out" when done

## Customization

### Change Colors
Edit the gradient colors in `src/app/page.js` and component files:
- `from-pink-50 via-purple-50 to-blue-50` - Background gradient
- `from-purple-600 to-pink-600` - Text gradients
- `from-purple-500 to-pink-500` - Button gradients

### Change Title
Edit the title in multiple places:
1. `src/app/layout.js` - Page metadata
2. `src/app/page.js` - Main heading

### Add More Categories
The category field is free-form text. You can:
- Use any category names you want
- Later, you could add a dropdown with predefined categories in `AdminPanel.js`

## Deployment

### Deploy to Vercel (Recommended)

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Import your repository
4. Add environment variables in Vercel project settings
5. Deploy!

### Important: Configure Supabase URL

After deployment, add your Vercel URL to Supabase:
1. Go to Authentication > URL Configuration
2. Add your Vercel URL to Site URL and Redirect URLs

## Troubleshooting

### Images not uploading
- Check that the `collection-images` bucket exists in Supabase Storage
- Verify storage policies are set correctly
- Make sure the bucket is set to public

### Can't login
- Verify your admin user exists in Supabase Authentication
- Check that email/password are correct
- Look at browser console for error messages

### Items not showing
- Check Supabase table policies are set correctly
- Verify your Supabase URL and anon key are correct in `.env.local`
- Look at browser console for errors

## License

MIT - Feel free to customize and use for your own collections!

## Credits

Built with love using Next.js, Supabase, and Framer Motion.
