# Cloudinary Setup Guide for Livique

This guide will help you set up Cloudinary for image uploads in the Livique e-commerce application.

## What is Cloudinary?

Cloudinary is a cloud-based image and video management service. It provides:
- **Image Storage**: Store unlimited images in the cloud
- **Image Optimization**: Automatic format conversion, quality optimization
- **Image Transformation**: Resize, crop, and transform images on-the-fly
- **CDN Delivery**: Fast content delivery worldwide

## Setup Steps

### 1. Create a Cloudinary Account

1. Go to [cloudinary.com](https://cloudinary.com)
2. Click "Sign Up for Free"
3. Complete the registration process
4. Verify your email address

### 2. Get Your Cloudinary Credentials

After logging in to your Cloudinary dashboard:

1. Go to the **Dashboard** (home page)
2. You'll see your account details in the "Account Details" section:
   - **Cloud Name**: This is your unique identifier
   - **API Key**: Your public key
   - **API Secret**: Your private key (click "Reveal" to see it)

### 3. Add Credentials to Your Backend

Open `backend/.env` file and update the Cloudinary variables:

```env
CLOUDINARY_CLOUD_NAME=your_cloud_name_here
CLOUDINARY_API_KEY=your_api_key_here
CLOUDINARY_API_SECRET=your_api_secret_here
```

**Important**: Replace the placeholder values with your actual credentials from the Cloudinary dashboard.

### 4. Restart Your Backend Server

After updating the `.env` file, restart your backend server:

```bash
cd backend
npm run dev
```

## How It Works

### Image Upload Flow

1. **Admin selects an image** in the Admin panel
2. **Frontend sends the image** to the backend API endpoint: `POST /api/upload/upload`
3. **Backend uploads to Cloudinary** using the Cloudinary SDK
4. **Cloudinary returns a URL** (e.g., `https://res.cloudinary.com/your-cloud/image/upload/v1234567890/livique-products/abc123.jpg`)
5. **URL is stored in MongoDB** as part of the product data
6. **Frontend displays the image** using the Cloudinary URL

### Image Features

- **Automatic Optimization**: Images are automatically compressed for faster loading
- **Responsive Images**: Cloudinary can serve different sizes based on device
- **Format Conversion**: Automatically serves WebP on supported browsers
- **Transformations**: Images are limited to 1000x1000px to save bandwidth

## File Structure

```
backend/
├── config/
│   └── cloudinary.js          # Cloudinary configuration
├── routes/
│   └── uploadRoutes.js        # Upload API endpoints
├── .env                        # Environment variables (add your credentials here)
└── server.js                   # Includes upload routes
```

## API Endpoints

### Upload Single Image
```
POST /api/upload/upload
Content-Type: multipart/form-data
Body: image (file)

Response:
{
  "success": true,
  "url": "https://res.cloudinary.com/...",
  "public_id": "livique-products/abc123"
}
```

### Upload Multiple Images
```
POST /api/upload/upload-multiple
Content-Type: multipart/form-data
Body: images[] (multiple files)

Response:
{
  "success": true,
  "images": [
    { "url": "https://...", "public_id": "..." },
    { "url": "https://...", "public_id": "..." }
  ]
}
```

### Delete Image
```
DELETE /api/upload/delete/:publicId
Response:
{
  "success": true,
  "result": { ... }
}
```

## Testing

### Test Image Upload

1. Start your backend server: `cd backend && npm run dev`
2. Open the Admin panel: `http://localhost:5173/admin`
3. Login with admin credentials
4. Try adding a new product with images
5. Check your Cloudinary dashboard to see the uploaded images in the `livique-products` folder

## Troubleshooting

### Images Not Uploading

1. **Check Backend Logs**: Look for error messages in the terminal
2. **Verify Credentials**: Make sure your Cloudinary credentials in `.env` are correct
3. **Check File Size**: Images must be under 5MB
4. **Check File Type**: Only image files are allowed (jpg, png, gif, webp, etc.)

### Images Not Displaying

1. **Check Image URL**: Make sure the URL starts with `https://res.cloudinary.com/`
2. **Check Browser Console**: Look for CORS or network errors
3. **Verify Cloudinary Account**: Make sure your account is active

## Free Tier Limits

Cloudinary's free tier includes:
- **25 GB Storage**
- **25 GB Monthly Bandwidth**
- **25,000 Transformations/month**

This is more than enough for a small to medium-sized e-commerce site.

## Production Considerations

### For Deployment

1. **Add Cloudinary credentials** to your production environment variables
2. **Update CORS settings** in Cloudinary dashboard if needed
3. **Set up a CDN** for even faster delivery (Cloudinary includes this)
4. **Enable automatic backup** in Cloudinary settings

### Security

- **Never commit `.env`** file to Git (already in `.gitignore`)
- **Keep API Secret private** - only store in backend
- **Use signed uploads** for production (optional advanced feature)

## Additional Features (Optional)

### Image Transformations

You can transform images on-the-fly by modifying the URL:

```javascript
// Original
https://res.cloudinary.com/demo/image/upload/sample.jpg

// Resize to 300x300
https://res.cloudinary.com/demo/image/upload/w_300,h_300,c_fill/sample.jpg

// Convert to WebP
https://res.cloudinary.com/demo/image/upload/f_auto/sample.jpg
```

### Upload Presets

Create upload presets in Cloudinary dashboard for consistent image processing rules.

## Support

- **Cloudinary Documentation**: https://cloudinary.com/documentation
- **Cloudinary Support**: https://support.cloudinary.com
- **Stack Overflow**: Tag your questions with `cloudinary`

---

✅ **Setup Complete!** Your Livique application is now using Cloudinary for image storage and delivery.
