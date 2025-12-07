# 🚀 Quick SendGrid Setup (5 Minutes)

## Get Your API Key Now:

### 1. Sign Up (2 minutes)
👉 **Go to**: https://signup.sendgrid.com/
- Use email: `mokshdigitalco@gmail.com` (or any email)
- Choose **FREE plan** (100 emails/day)
- Verify your email

### 2. Create API Key (1 minute)
👉 **Direct link**: https://app.sendgrid.com/settings/api_keys
- Click **Create API Key**
- Name: `Livique-Production`
- Permission: **Full Access**
- Copy the key (starts with `SG.xxxxx`)

### 3. Verify Sender (2 minutes)
👉 **Direct link**: https://app.sendgrid.com/settings/sender_auth/senders
- Click **Create New Sender**
- From Email: `mokshdigitalco@gmail.com`
- From Name: `Livique`
- Fill in address details
- **Verify email** (check inbox)

### 4. Update .env File
Replace `your_sendgrid_api_key_here` with your actual key:

**Local (.env):**
```env
SENDGRID_API_KEY=SG.paste_your_actual_key_here
```

**Production Server (SSH):**
```bash
ssh root@your_server_ip
cd ~/livique/backend
nano .env
# Add: SENDGRID_API_KEY=SG.paste_your_actual_key_here
# Save: Ctrl+X, Y, Enter
```

### 5. Deploy
```bash
# Local
git add .
git commit -m "Add SendGrid email service"
git push

# Production
ssh root@your_server_ip
cd ~/livique/backend
git pull
npm install
pm2 restart livique-api --update-env
pm2 logs livique-api
```

### 6. Test
- Sign up on your website
- Check logs for: `✅ Email sent successfully via SendGrid`
- Check email inbox (and spam folder)

---

## ✅ Success Indicators:
- Local: `✅ SendGrid initialized successfully`
- Production: Same message in PM2 logs
- User receives OTP email within seconds

## ❌ Troubleshooting:
- **"The from email does not match a verified Sender Identity"**
  → Complete step 3 above (verify sender)
  
- **401 Unauthorized**
  → Check API key is correct and starts with `SG.`
  
- **Still no emails?**
  → Check SendGrid Activity: https://app.sendgrid.com/email_activity

---

**Total Time**: 5-10 minutes
**Cost**: FREE (100 emails/day)
