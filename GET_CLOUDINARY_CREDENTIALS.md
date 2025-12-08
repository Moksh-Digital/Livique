# 🚀 QUICK START - Get Your Cloudinary Credentials

## Step 1: Sign Up for Cloudinary (2 minutes)

1. Open your browser and go to: **https://cloudinary.com/users/register_free**

2. Fill in the form:
   - Email address
   - Password
   - Choose "I'm a developer" or "Other"
   - Click "Sign Up"

3. Check your email and verify your account

## Step 2: Get Your Credentials (1 minute)

1. After logging in, you'll see the **Dashboard**

2. Look for the **Product Environment Credentials** section at the top

3. You'll see three important values:
   ```
   Cloud name: xxxxxxxx
   API Key: 123456789012345
   API Secret: xxxxxxxxxxxxxxxxxxxxxxxx (click eye icon to reveal)
   ```

## Step 3: Add Credentials to Your Project (1 minute)

1. Open the file: `backend/.env`

2. Find these lines:
   ```env
   CLOUDINARY_CLOUD_NAME=your_cloud_name_here
   CLOUDINARY_API_KEY=your_api_key_here
   CLOUDINARY_API_SECRET=your_api_secret_here
   ```

3. Replace with your actual values:
   ```env
   CLOUDINARY_CLOUD_NAME=your_actual_cloud_name
   CLOUDINARY_API_KEY=123456789012345
   CLOUDINARY_API_SECRET=your_actual_secret_key
   ```

## Step 4: Restart Backend (30 seconds)

In your terminal:

```bash
cd backend
npm run dev
```

## Step 5: Test It! (1 minute)

1. Open your browser: `http://localhost:5173/admin`
2. Login with admin credentials
3. Click "Add Product"
4. Upload an image
5. You should see "Uploading image..." then "Image uploaded successfully!"

## ✅ That's It!

Your images are now being uploaded to Cloudinary instead of being stored as large base64 strings in your database.

### Benefits:
- ✅ Faster website loading
- ✅ Smaller database size
- ✅ Automatic image optimization
- ✅ CDN delivery (fast worldwide)
- ✅ Professional image management
- ✅ 25GB free storage

---

## 🆘 Need Help?

### Can't find Cloudinary credentials?
- Make sure you're logged into https://cloudinary.com/console
- The credentials are at the top of the Dashboard page
- Click the eye icon next to API Secret to reveal it

### Backend won't start?
- Make sure you saved the `.env` file
- Check that you copied the credentials correctly (no extra spaces)
- Try: `cd backend && npm install` then `npm run dev`

### Images not uploading?
- Check backend terminal for errors
- Make sure file size is under 5MB
- Only image files are allowed (jpg, png, gif, webp, etc.)

---

**Questions?** Check `backend/CLOUDINARY_SETUP.md` for detailed documentation.
