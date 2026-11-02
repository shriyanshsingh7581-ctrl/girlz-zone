# Girlz Zone — Ambernath Beauty & Fashion Store

Mobile-first E-Commerce Web Application & Live Store Admin Dashboard (`PIN: 7777`) built with React 19, TypeScript, Tailwind CSS v4, and Vite.

---

## Vercel Deployment Guide (Vercel par kaise deploy karein)

Is project mein **`vercel.json`**, **`.vercelignore`**, aur **`.npmrc`** files pehle se configured hain. Aap niche diye gaye 2 aasan tariko se Vercel par deploy kar sakte hain:

### Option 1: GitHub se Direct Deploy (Recommended)
1. Is project ko apne **GitHub** repository par push ya export karein.
2. [vercel.com](https://vercel.com) par login karein aur **"Add New..." -> "Project"** par click karein.
3. Apna GitHub repository (`girlz-zone-ambernath`) import karein.
4. Vercel apne aap `vercel.json` se settings detect kar lega:
   - **Framework Preset:** `Vite`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
   - **Install Command:** `npm install --legacy-peer-deps`
5. **"Deploy"** button par click karein — 1 minute ke andar aapka live URL ready ho jayega!

### Option 2: Vercel CLI se Direct Deploy
Agar aapke system mein Node.js installed hai, to project folder mein terminal open karke ye command run karein:

```bash
npx vercel --prod
```

---

## Key App Credentials & Demo Details
- **Storefront Mode Switcher:** Top bar se **Customer E-Commerce Store View** aur **Store Admin Dashboard** toggle karein.
- **Store Admin PIN:** `7777`
- **Coupon Codes:** `GIRLZ10` (10% OFF), `BRIDAL15` (15% OFF), `AMBERNATH20` (20% OFF)
- **WhatsApp Direct Order Number:** `+91 93246 54685`
