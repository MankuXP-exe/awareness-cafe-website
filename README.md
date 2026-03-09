# 🚀 The Awareness Cafe - Deployment & Setup Guide

Welcome to the documentation for The Awareness Cafe website. This guide covers local development, environment setup, and deployment to Vercel.

## 📁 Project Structure

```
c:\Users\Mcman\Downloads\Cafe\app\
├── public/                 # Static files
│   └── images/             # Gallery and menu images
│       └── menu/           # AI-generated food images
├── src/
│   ├── app/                # Next.js App Router (Pages & API)
│   │   ├── admin/          # Admin Dashboard pages
│   │   ├── api/            # Serverless API routes (contact, menu)
│   │   ├── layout.js       # Root layout & SEO meta
│   │   └── page.js         # Main Homepage
│   ├── components/         # Reusable UI Components
│   │   ├── Hero.jsx        # Landing section
│   │   ├── Menu.jsx        # Menu with filtering
│   │   ├── Gallery.jsx     # Masonry image gallery
│   │   ├── Contact.jsx     # Contact form with validation
│   │   └── ...
│   ├── lib/                # Utilities
│   │   ├── auth.js         # JWT Authentication logic
│   │   ├── data.js         # Static fallback data
│   │   └── mongodb.js      # Database connection
│   └── models/             # Mongoose Schemas (Contact, MenuItem)
├── .env.example            # Template for environment variables
├── next.config.mjs         # Build and security configuration
└── tailwind.config.js      # Styling config
```

---

## 💻 Local Development Setup

1. **Navigate to the app directory:**
   ```bash
   cd "c:\Users\Mcman\Downloads\Cafe\app"
   ```

2. **Install dependencies** (if not already installed):
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   - Copy `.env.example` to a new file named `.env.local`:
     ```bash
     cp .env.example .env.local
     ```
   - Open `.env.local` and add your **MongoDB Atlas connection string**. 
   - (Optional) Change the default admin credentials and JWT secret.

4. **Start the development server:**
   ```bash
   npm run dev
   ```

5. **Open in browser:**
   - Website: http://localhost:3000
   - Admin Panel: http://localhost:3000/admin/login

---

## 🛡️ Admin Dashboard Instructions

The admin dashboard is protected by JWT authentication.

1. Go to **http://localhost:3000/admin/login**
2. Use the credentials configured in your `.env.local` file. Default values if not changed:
   - **Username:** `admin`
   - **Password:** `YourSecurePassword123!`
3. Once logged in, you can:
   - View contact form submissions.
   - Manage the digital menu (Add/Delete items).

---

## ☁️ Deployment to Vercel

The project is already optimized and configured for seamless deployment to Vercel.

1. **Push to GitHub**
   Initialize a git repository and push your code to GitHub.
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/yourusername/awareness-cafe.git
   git push -u origin main
   ```

2. **Connect to Vercel**
   - Go to [vercel.com](https://vercel.com/) and create an account.
   - Click **Add New Project** and select your GitHub repository.
   - Vercel will automatically detect the Next.js framework.

3. **Configure Environment Variables in Vercel**
   Before clicking "Deploy", open the **Environment Variables** section and add the following keys exactly as they appear in your `.env.local` file:
   - `MONGODB_URI`
   - `ADMIN_USER`
   - `ADMIN_PASSWORD`
   - `JWT_SECRET`
   - `NEXT_PUBLIC_SITE_URL`

4. **Deploy**
   - Click **Deploy**. Vercel will build the project and assign a live URL.
   - Any future `git push` to your main branch will automatically trigger a new deployment.
