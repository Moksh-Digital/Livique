# 🚀 Mailjet Setup Guide (3 Minutes)

## Why Mailjet?
- ✅ No SMTP port blocking issues (uses API)
- ✅ Free tier: 200 emails/day, 6,000 emails/month
- ✅ Easy signup and verification
- ✅ Production-ready with detailed analytics
- ✅ Better deliverability than Gmail SMTP

---

## Step 1: Create Mailjet Account (1 minute)

1. Go to https://app.mailjet.com/signup
2. Sign up with your email: `mokshdigitalco@gmail.com`
3. Choose **FREE plan** (200 emails/day)
4. Verify your email (check inbox)

---

## Step 2: Get API Credentials (1 minute)

1. After login, go directly to: https://app.mailjet.com/account/apikeys
   - Or: Dashboard → Account → API Keys (Master & Sub)
2. You'll see:
   - **API Key** (looks like: `abc123def456...`)
   - **Secret Key** (looks like: `xyz789uvw012...`)
3. Copy both keys

---

## Step 3: Verify Sender Email (1 minute)

1. Go to: https://app.mailjet.com/account/sender
   - Or: Account Settings → Sender Addresses
2. Click **Add a sender address**
3. Enter: `mokshdigitalco@gmail.com`
4. Click **Add**
5. Check your email inbox for verification link
6. Click the verification link

✅ **Done!** You can now send emails from `mokshdigitalco@gmail.com`

---

## Step 4: Update Environment Variables

### Local Development (.env)
```env
MAILJET_API_KEY=paste_your_api_key_here
MAILJET_SECRET_KEY=paste_your_secret_key_here
EMAIL_USER=mokshdigitalco@gmail.com
```

### Production Server (SSH)
```bash
ssh root@your_server_ip
cd ~/livique/backend
nano .env

# Add these lines:
MAILJET_API_KEY=paste_your_api_key_here
MAILJET_SECRET_KEY=paste_your_secret_key_here
EMAIL_USER=mokshdigitalco@gmail.com

# Save: Ctrl+X, then Y, then Enter
```

---

## Step 5: Deploy to Production

```bash
# Local - commit and push
git add .
git commit -m "Migrate to Mailjet email service"
git push

# Production - deploy
ssh root@your_server_ip
cd ~/livique/backend
git pull
npm install
pm2 restart livique-api --update-env
pm2 logs livique-api
```

**Look for:**
```
✅ Mailjet client initialized successfully
```

---

## Step 6: Test Email Sending

1. Go to your website: https://www.livique.co.in
2. Try signing up with a new email
3. You should receive OTP within seconds
4. Check Mailjet dashboard: https://app.mailjet.com/stats

**Success indicators:**
- Server logs: `✅ Email sent successfully via Mailjet`
- Email arrives in inbox (check spam folder too)
- Mailjet dashboard shows "Sent: 1"

---

## Troubleshooting

### Error: "Email service not configured"
**Solution:** Make sure both `MAILJET_API_KEY` and `MAILJET_SECRET_KEY` are in `.env`

### Error: 401 Unauthorized
**Solution:** 
- Check API keys are correct
- Make sure you copied the full keys without spaces

### Error: "Sender email not verified"
**Solution:** 
- Complete Step 3 above
- Check spam folder for verification email
- Try re-sending verification email

### Still not receiving emails?
1. Check Mailjet Activity: https://app.mailjet.com/stats
2. Look for bounces or blocks
3. Check spam/junk folder
4. Verify sender email is validated (green checkmark)

---

## Mailjet Dashboard Features

- **Statistics**: Real-time email delivery stats
- **Activity**: See all sent emails with status
- **Contacts**: Manage email lists (optional)
- **Templates**: Create reusable email templates (optional)

---

## Production Best Practices

1. **Monitor email stats** regularly in Mailjet dashboard
2. **Handle bounces** - remove invalid email addresses
3. **Keep API keys secure** - never commit to git
4. **Add domain authentication** for better deliverability (optional but recommended)
5. **Rate limiting**: Mailjet allows 200 emails/day on free plan

---

## Domain Authentication (Optional - Recommended for Production)

For better email deliverability and to send from `@livique.co.in`:

1. Go to: https://app.mailjet.com/account/sender
2. Click **Domains** tab
3. Click **Add domain**
4. Enter: `livique.co.in`
5. Follow DNS setup instructions
6. Add provided DNS records to your domain
7. Verify domain

Once verified, you can send from:
- `noreply@livique.co.in`
- `support@livique.co.in`
- `orders@livique.co.in`

---

## Cost & Limits

### Free Plan (Current)
- 200 emails per day
- 6,000 emails per month
- Perfect for startups

### Essential ($15/month if you need more)
- 15,000 emails per month
- No daily limit
- Email support

### Premium ($25/month)
- 15,000 emails per month
- Priority support
- Sub-account management

---

## Support & Documentation

- Mailjet Docs: https://dev.mailjet.com/
- API Reference: https://dev.mailjet.com/email/reference/
- Support: https://www.mailjet.com/support/
- Status Page: https://status.mailjet.com/

---

## Quick Reference

**Get API Keys:** https://app.mailjet.com/account/apikeys
**Verify Sender:** https://app.mailjet.com/account/sender
**View Stats:** https://app.mailjet.com/stats
**Email Activity:** https://app.mailjet.com/stats/activity

---

## ✅ Setup Checklist

- [ ] Create Mailjet account
- [ ] Get API Key and Secret Key
- [ ] Verify sender email
- [ ] Add credentials to local `.env`
- [ ] Test locally
- [ ] Add credentials to production `.env`
- [ ] Deploy to production
- [ ] Test signup/login OTP
- [ ] Check Mailjet dashboard

**Total Time:** 3-5 minutes
**Cost:** FREE (200 emails/day)
