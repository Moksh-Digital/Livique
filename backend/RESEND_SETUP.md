# 🚀 Resend Email Setup (2 Minutes)

## Why Switch to Resend?
- ✅ Super easy setup (no verification needed)
- ✅ Works instantly
- ✅ Free tier: 100 emails/day
- ✅ Best-in-class deliverability
- ✅ Perfect for startups

---

## Step 1: Create Resend Account (1 minute)

1. Go to: https://resend.com/
2. Click **Sign up** (use any email, Gmail recommended)
3. Click **Create API Key**
4. Copy the key (starts with `re_`)

**That's it! No sender verification needed!**

---

## Step 2: Add API Key to .env

### Local:
```env
RESEND_API_KEY=re_paste_your_actual_key_here
```

### Production (SSH):
```bash
ssh root@your_server_ip
cd ~/livique/backend
nano .env

# Add this line:
RESEND_API_KEY=re_paste_your_actual_key_here

# Save: Ctrl+X, Y, Enter
```

---

## Step 3: Deploy

```bash
git add .
git commit -m "Switch from Mailjet to Resend email service"
git push

# Production
ssh root@your_server_ip
cd ~/livique/backend
git pull
npm install
pm2 restart livique-api --update-env
pm2 logs livique-api
```

Look for: `✅ Resend client initialized successfully`

---

## Step 4: Test

1. Go to: https://www.livique.co.in
2. Try signing up with a new email
3. You should receive OTP within seconds

You should see in logs:
```
📤 Attempting to send email via Resend to: user@example.com
✅ Email sent successfully via Resend
   - Message ID: xxxxx
```

---

## Why This Works Better

| Feature | Mailjet | Resend |
|---------|---------|--------|
| Setup Time | 10 mins | 2 mins |
| Sender Verification | Required | Not needed |
| API Keys | 2 keys | 1 key |
| Account Suspension | Common | Never |
| Deliverability | Good | Excellent |
| Support | Okay | Great |

---

## Resend Features

- **Dashboard**: https://resend.com/dashboard
- **API Docs**: https://resend.com/docs
- **Email Activity**: See all sent emails in real-time
- **Templates**: Create reusable email templates (optional)
- **Analytics**: Track opens and clicks (Pro plan)

---

## Cost & Limits

- **Free**: 100 emails/day forever
- **Pro**: $20/month for 100,000 emails/month + advanced features
- **Enterprise**: Custom pricing

---

## Troubleshooting

### Error: "Email service not configured"
→ Make sure `RESEND_API_KEY` is in `.env` and starts with `re_`

### API Key not working
→ Go to https://resend.com/api-keys and get a fresh key

### Email not received
→ Check spam folder, or check Resend dashboard for delivery status

---

## Quick Setup Checklist

- [ ] Sign up at https://resend.com/
- [ ] Create API key
- [ ] Copy key to `.env` (RESEND_API_KEY=re_...)
- [ ] Deploy to production
- [ ] Test signup/OTP
- [ ] Check dashboard for delivery

**Total Time**: 2-3 minutes
**Cost**: FREE (100 emails/day)
