# SendGrid Setup Guide for Livique

## Why SendGrid?
- ✅ No SMTP port blocking issues
- ✅ Free tier: 100 emails/day (enough for testing and small-scale production)
- ✅ Reliable delivery with high deliverability rates
- ✅ Production-ready with detailed analytics

## Step 1: Create SendGrid Account

1. Go to https://signup.sendgrid.com/
2. Sign up with your email (use `mokshdigitalco@gmail.com` or any email)
3. Choose the **Free Plan** (100 emails/day forever)
4. Complete email verification

## Step 2: Create API Key

1. Log in to SendGrid dashboard: https://app.sendgrid.com/
2. Go to **Settings** → **API Keys** (left sidebar)
   - Or direct link: https://app.sendgrid.com/settings/api_keys
3. Click **Create API Key**
4. Configure:
   - **API Key Name**: `Livique Production`
   - **API Key Permissions**: Select **Full Access** (or at minimum **Mail Send**)
5. Click **Create & View**
6. **IMPORTANT**: Copy the API key immediately (starts with `SG.`)
   - You won't be able to see it again!
   - It looks like: `SG.xxxxxxxxxxxxxxxxxxx.yyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyy`

## Step 3: Verify Sender Identity

SendGrid requires sender verification to prevent spam:

### Option A: Single Sender Verification (Easiest - Recommended for getting started)
1. Go to **Settings** → **Sender Authentication** → **Single Sender Verification**
   - Or: https://app.sendgrid.com/settings/sender_auth/senders
2. Click **Create New Sender**
3. Fill in the form:
   - **From Name**: `Livique`
   - **From Email Address**: `mokshdigitalco@gmail.com` (or your preferred email)
   - **Reply To**: Same as above
   - **Company Address**: Your business address
   - **City, State, Zip, Country**: Your location
4. Click **Create**
5. **Verify the email**: Check your inbox and click the verification link
6. Once verified, you can send emails from this address

### Option B: Domain Authentication (Better for production - Recommended)
1. Go to **Settings** → **Sender Authentication** → **Domain Authentication**
   - Or: https://app.sendgrid.com/settings/sender_auth/domain/create
2. Select **DNS Provider**: "Other Host (Not Listed)"
3. Enter your domain: `livique.co.in`
4. Click **Next**
5. SendGrid will provide DNS records (CNAME records)
6. Add these DNS records to your domain registrar:
   - Log in to your domain provider (GoDaddy, Namecheap, etc.)
   - Go to DNS settings for `livique.co.in`
   - Add all the CNAME records provided by SendGrid
7. Wait for DNS propagation (can take 24-48 hours, usually faster)
8. Return to SendGrid and click **Verify**
9. Once verified, you can send from any email @livique.co.in (e.g., `noreply@livique.co.in`, `support@livique.co.in`)

## Step 4: Update Environment Variables

### Local Development (.env)
```env
SENDGRID_API_KEY=SG.your_actual_api_key_here
EMAIL_USER=mokshdigitalco@gmail.com
```

### Production Server (SSH)
```bash
# Connect to your server
ssh root@your_server_ip

# Edit the .env file
cd ~/livique/backend
nano .env

# Add this line:
SENDGRID_API_KEY=SG.your_actual_api_key_here

# Save: Ctrl+X, then Y, then Enter
```

## Step 5: Deploy and Test

### Local Testing
```bash
# In backend directory
npm install
node server.js

# You should see:
# ✅ SendGrid initialized successfully
```

### Production Deployment
```bash
git add .
git commit -m "Migrate to SendGrid email service"
git push

# On production server
ssh root@your_server_ip
cd ~/livique/backend
git pull
npm install
pm2 restart livique-api --update-env
pm2 logs livique-api

# Check for:
# ✅ SendGrid initialized successfully
# Then test by signing up on your website
```

## Step 6: Test Email Sending

Try signing up on your website. You should see in logs:
```
📤 Attempting to send email via SendGrid to: user@example.com
✅ Email sent successfully via SendGrid
   - Status Code: 202
   - Message ID: xxxxx
```

## Troubleshooting

### Error: "The from email does not match a verified Sender Identity"
**Solution**: Complete Step 3 above (Sender Verification)

### Error: 401 Unauthorized
**Solution**: Check if API key is correct and has Mail Send permissions

### Still not receiving emails?
1. Check SendGrid Activity Feed: https://app.sendgrid.com/email_activity
2. Check spam folder
3. Verify sender email is authenticated

## SendGrid Dashboard Features

- **Email Activity**: Track all sent emails in real-time
- **Statistics**: See delivery rates, opens, clicks (if enabled)
- **Suppressions**: Manage bounces, unsubscribes
- **Templates**: Create reusable email templates (optional)

## Cost Considerations

- **Free Tier**: 100 emails/day (36,500/year) - Perfect for small apps
- **Essentials**: $19.95/month for 50,000 emails/month
- **Pro**: $89.95/month for 100,000 emails/month

For most startups, the free tier is sufficient. You can upgrade when needed.

## Production Best Practices

1. **Use domain authentication** instead of single sender (better deliverability)
2. **Monitor email activity** in SendGrid dashboard
3. **Handle bounces and unsubscribes** properly
4. **Keep your API key secure** (never commit to git)
5. **Set up IP whitelisting** in SendGrid for added security (optional)

## Need Help?

- SendGrid Docs: https://docs.sendgrid.com/
- SendGrid Support: https://support.sendgrid.com/
- API Documentation: https://docs.sendgrid.com/api-reference/mail-send/mail-send

---

**Quick Start Checklist:**
- [ ] Create SendGrid account
- [ ] Create API key
- [ ] Verify sender email
- [ ] Add SENDGRID_API_KEY to .env
- [ ] Deploy code
- [ ] Test signup/login OTP
- [ ] Check SendGrid activity feed

**Estimated Setup Time**: 15-30 minutes
