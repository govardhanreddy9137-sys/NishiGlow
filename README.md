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

### 3. Customer and Admin Sign-In
- New customers create an account with an email address, phone number, and password. No email or phone verification is performed.
- Returning customers sign in with their email, phone number, and password.
- The only admin email is `nishiglowstudio@gmail.com`; the admin signs in with that email and the password hash configured on the server.
- Passwords are stored as salted scrypt hashes. Sessions use an HTTP-only cookie.

#### Required setup
1. Run `npm run admin:set-password` in a private terminal to create a fresh admin password hash in `.env`. Use a new password of at least 12 characters; do not reuse passwords shared in chat.
2. Generate a session key locally with `node --input-type=module -e "import { randomBytes } from 'node:crypto'; console.log(randomBytes(48).toString('base64url'))"` and set it as `SESSION_SECRET`. Do not share it.
3. Keep the MongoDB Atlas connection in `MONGODB_URI`. Set `APP_ORIGIN` to your local site and, for production, your HTTPS website origin.
4. Run `npm run dev`. Check `http://localhost:5000/api/health`; authentication and database should both report configured/connected.
5. For production, put these settings in the hosting provider's secret configuration and use HTTPS. For continuous online availability on Cloud Run, follow the steps below.

### Deploying to Cloud Run

Cloud Run serves the built site and Express API in one container. The deployment below keeps one instance ready with `--min 1` for continuous availability; this can incur ongoing charges and requires a Google Cloud billing account. Without a minimum instance, Cloud Run scales to zero while idle, so requests can have a cold start.

1. Create a Google Cloud project, enable billing and the Cloud Run and Cloud Build APIs, and install/authenticate the Google Cloud CLI.
2. In Secret Manager, create secrets named `MONGODB_URI`, `SESSION_SECRET`, and `ADMIN_PASSWORD_HASH`. Grant the Cloud Run service identity permission to access these secrets; never commit `.env`.
3. From the repository root, deploy the project source with Cloud Buildpacks (no `Dockerfile` is required) and map the secrets:
   ```bash
   gcloud run deploy nishiglow --source . --region asia-south1 --allow-unauthenticated --min 1 --set-secrets=MONGODB_URI=MONGODB_URI:latest,SESSION_SECRET=SESSION_SECRET:latest,ADMIN_PASSWORD_HASH=ADMIN_PASSWORD_HASH:latest
   ```
4. After the first deployment, set `APP_ORIGIN` to the service's HTTPS URL in **Edit and deploy new revision → Variables & Secrets**, then deploy a new revision. For a custom domain, use that exact HTTPS origin instead.
5. Configure MongoDB Atlas network access for the Cloud Run service, then verify `https://your-service-url/api/health`. Do not set `PORT`; Cloud Run provides it.

The repository's `.gitignore` excludes local `.env` files. Store production credentials only in Cloud Run variables/secrets.

### Deploying to Vercel

Vercel serves the built website and runs the Express API as serverless functions; it does not keep a Node process running continuously. The free Hobby plan is restricted to personal or non-commercial use, so it is not appropriate for this business website. If eligible, import this repository into Vercel and use the included `vercel.json` settings (`npm run build`, output directory `dist`).

Add these environment variables in the Vercel project settings for Production:

- `MONGODB_URI`
- `SESSION_SECRET` (at least 32 characters)
- `APP_ORIGIN` (the exact HTTPS production site origin, such as `https://your-domain.com`)
- `ADMIN_PASSWORD_HASH` (create locally with `npm run admin:set-password`)

Leave `VITE_API_BASE_URL` unset so the website calls its API on the same Vercel domain. Redeploy after adding or changing environment variables. Verify `/api/health` reports authentication and database as configured/connected.

---

### 5. Studio Admin Portal & Revenue Control
- Sign in to the admin portal with `nishiglowstudio@gmail.com` and the admin password configured by `npm run admin:set-password`. Customer email addresses do not receive admin access.
- **Admin Capabilities**:
  1. **Registered Customers**: View verified customer accounts, their optional service interest, registration date, and last sign-in. Update a customer's display name or interest, or delete their account.
  2. **Revenue & Orders**: Customer order/revenue records are stored centrally in MongoDB, not only in the browser. Add an order, change its status, or delete it. Completed and pending totals are calculated from the recorded order statuses.
  3. **Revenue accuracy**: Orders entered by an admin are studio records; they are not automatically confirmed with a bank, UPI, Gmail, or Instagram. Only enter real transactions.
  4. **Poster & Portfolio Management**: Add new posters or creative designs with custom image paths, title, tags, and client categories; or delete any item with one click.
  5. **Official Posters Integrated**: The 3 studio posters (`nishi-studio-main-poster.jpg`, `nishi-project-ppts-poster.jpg`, `nishi-creative-services-poster.jpg`) are embedded directly into the **Posters** portfolio gallery and home showcase.

---

### 6. Running the Development Server
To launch the website and API together, run:
```bash
npm run dev
```
This starts the API on port `5000` and the Vite website on port `5173`. Open `http://localhost:5173` in your browser. To run only the API, use `npm run server`.

To start the local development server automatically when you sign in to Windows, run this once from PowerShell in the project folder:
```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\install-autostart.ps1
```
This creates a Scheduled Task for your Windows account and starts the server immediately. The local site is available only while your PC is on and awake; it is not an online host.

For continuous online availability, deploy to a host that keeps at least one instance running. The Cloud Run deployment above uses `--min 1`; this can incur ongoing charges. Do not use the scale-to-zero configuration when uninterrupted availability is required.
