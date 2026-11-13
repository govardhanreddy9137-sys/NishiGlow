# 🌟 NISHIGLOWSTUDIO – Complete Online Creative Digital Studio

> **Tagline:** Your Ideas, Our Creativity – Delivered Online!  
> **Business Model:** 100% Online Services across India  
> **Official Email:** [nishiglowstudio@gmail.com](https://mail.google.com/mail/?view=cm&fs=1&to=nishiglowstudio%40gmail.com)  
> **Instagram:** [@nishiglowstudio](https://www.instagram.com/nishiglowstudio)  

---

## 🚀 Overview of Built Features

### 1. 5 Main Pages + Legal Policies
- **Page 1: Home (`HomePage.jsx`)**
  - Premium Hero Section with glowing gradient typography: *"Turn Your Creative Ideas Into Reality!"*
  - Brand identity, tagline, 100% online status, and creative studio overview.
  - Interactive cards for all 6 core services with starter prices.
  - Featured portfolio showcase with sample placeholders.
  - "Why Choose Us" section (Rapid Turnaround, Transparent Pricing, 100% Online Convenience).
  - Customer enquiry CTA with direct Gmail and Instagram contact options.
  - Comprehensive FAQs accordion.

- **Page 2: About Us (`AboutPage.jsx`)**
  - Studio introduction, creative mission, and future vision.
  - Core principles (Pure Creative Quality, Customer-Centric Care, Integrity & Confidentiality).
  - Customer testimonials section using sample placeholders ready for original feedback.

- **Page 3: Our Services & Pricing (`ServicesPage.jsx`)**
  - Interactive tabs showcasing all 6 services with high-resolution sample placeholders.
  - Detailed service breakdowns and key capabilities.
  - Complete, transparent pricing tables for all services matching your price list:
    1. **AI Promotional Video**: ₹1000 (no fixed duration).
    2. **Video Editing**: Basic Reel (₹149), 30–60 Sec (₹249), 1–3 Min (₹499), 5 Min (₹799).
    3. **Poster Designing**: Simple (₹99), Creative (₹149), Business (₹199), Premium (₹299).
    4. **Logo Designing**: Basic (₹199), Creative (₹349), Premium (₹599), Brand Package (₹999).
    5. **YouTube Thumbnail Designing**: Basic (₹79), Creative (₹129), Premium (₹199), 5 Thumbnails Package (₹499).
    6. **Business Card Designing**: Basic (₹149), Creative (₹249), Premium (₹399), Front & Back (₹499).
  - Individual inquiry buttons and Gmail compose links prefilled with service details.

- **Page 4: Portfolio (`PortfolioPage.jsx`)**
  - Filterable creative gallery with categories: *AI Videos*, *Video Editing*, *Posters*, *Logos*, *YouTube Thumbnails*, and *Business Cards*.
  - Includes the new NISHIGLOWSTUDIO services and price-list posters; poster artwork is shown in full, and current prices remain on the Services page.
  - Full modal preview lightbox with a direct order-by-email option.
  - Built with clean placeholder graphics that you can easily swap with your original video files or image renders.

- **Page 5: Contact Us (`ContactPage.jsx`)**
  - Official Gmail (nishiglowstudio@gmail.com) and Instagram (@nishiglowstudio).
  - Functional Enquiry Form with customer name, email, service selection dropdown, and message fields.
  - Submission feedback with a Gmail draft containing the enquiry details.

- **Legal Pages (`LegalPages.jsx`)**
  - Privacy Policy and Terms & Conditions tailored for an online digital creative agency.

---

### 2. Contact & Strict Policy Adherence
- ✅ **Floating Instagram Button** on every page linking to `https://www.instagram.com/nishiglowstudio`.
- ✅ **Gmail Contact Links** open a compose window addressed to `nishiglowstudio@gmail.com`.
- ❌ **No physical business location, address, or Google Maps** (Strictly 100% online).
- ❌ **No phone call button** (All communication handled via Gmail and Instagram).
- ✅ **Instagram ID displayed** as `@nishiglowstudio`.
- ❌ **No fake reviews, awards, or fake pricing**.

---

### 3. Customer Email and Password Sign-In
- New customers verify their email with a six-digit code, then create and confirm a password of at least 12 characters.
- During account setup, customers may optionally choose a service they are interested in; admins can view or update this on the Registered Customers page.
- Returning customers sign in with their email and password. They only need another email code to reset their password.
- Existing OTP-only accounts must use **Create account / Forgot password** once to verify their email and set an initial password.
- Passwords are stored in MongoDB as salted scrypt hashes, never as plain text. Sessions use an HTTP-only cookie.
- Verification codes expire after 10 minutes, are stored as hashes, have a five-attempt limit, and are protected by request rate limits.

#### Required setup
1. Enable 2-Step Verification on the studio Google account. In Google Account → Security → App passwords, create an app password for the website. Google shows it once; use it as `GMAIL_PASS` (not the Gmail login password).
2. Set `GMAIL_USER` to the studio Gmail address and `GMAIL_PASS` to the generated 16-character app password in `.env`.
3. Generate a session key locally with `node -e "console.log(require('crypto').randomBytes(48).toString('base64url'))"` and set it as `SESSION_SECRET`. Do not share it.
4. Keep the existing MongoDB Atlas connection in `MONGODB_URI`. Set `APP_ORIGIN` to your local site and, for production, your HTTPS website origin. Set `ADMIN_EMAILS` to the comma-separated studio accounts that should have admin access; `nishita@gmail.com` is included in the example configuration.
5. Run `npm run server` and `npm run dev` in separate terminals. Check `http://localhost:5000/api/health`; email OTP and database should both report configured/connected.
6. For production, put these settings in the hosting provider's secret configuration, use HTTPS, then run `npm run build` and `npm start` with `NODE_ENV=production`.

---

### 5. Studio Admin Portal & Revenue Control
- The admin email is listed in the server-side `ADMIN_EMAIL` setting. In a private terminal, run `npm run admin:set-password` to create a salted scrypt hash in `.env`; enter a strong password of at least 12 characters twice. Then restart `npm run server`.
- Sign in directly with the admin email and the password set by that command. Admin login does not require the customer OTP flow. Do not use passwords shared in chat.
- **Admin Capabilities**:
  1. **Registered Customers**: View verified customer accounts, their optional service interest, registration date, and last sign-in. Update a customer's display name or interest, or delete their account.
  2. **Revenue & Orders**: Customer order/revenue records are stored centrally in MongoDB, not only in the browser. Add an order, change its status, or delete it. Completed and pending totals are calculated from the recorded order statuses.
  3. **Revenue accuracy**: Orders entered by an admin are studio records; they are not automatically confirmed with a bank, UPI, Gmail, or Instagram. Only enter real transactions.
  4. **Poster & Portfolio Management**: Add new posters or creative designs with custom image paths, title, tags, and client categories; or delete any item with one click.
  5. **Official Posters Integrated**: The 3 studio posters (`nishi-studio-main-poster.jpg`, `nishi-project-ppts-poster.jpg`, `nishi-creative-services-poster.jpg`) are embedded directly into the **Posters** portfolio gallery and home showcase.

---

### 6. Running the Development Server
To launch the website locally:
```bash
npm run server
```
In a second terminal:
```bash
npm run dev
```
Open `http://localhost:5173` in your browser.
