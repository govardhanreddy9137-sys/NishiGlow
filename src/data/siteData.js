export const BRAND = {
  name: "NISHIGLOWSTUDIO",
  tagline: "Your Ideas, Our Creativity – Delivered Online!",
  email: "nishiglowstudio@gmail.com",
  adminEmail: "nishiglowstudio@gmail.com",
  instagramHandle: "nishiglowstudio",
  instagramUrl: "https://www.instagram.com/nishiglowstudio",
  businessModel: "100% Online Services",
  targetAudience: "Individuals, students, YouTubers, creators, startups and businesses across India.",
  serviceCoverage: "All Across India"
};

export const createEmailLink = (subject, body) =>
  `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(BRAND.email)}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

export const INITIAL_SERVICES = [
  {
    id: "ai-videos",
    title: "AI Advertisement Videos",
    shortDesc: "AI-generated promotional videos, product advertisements and high-converting creative video content.",
    icon: "Sparkles",
    badge: "Trending & High ROI",
    details: "Supercharge your business with hyper-realistic AI video creation. From futuristic 3D product showcases and realistic AI avatar presenters to cinematic marketing commercials, we bring your vision to life in minutes with broadcast-level quality.",
    highlights: [
      "Ultra HD 1080p / 4K resolution",
      "Realistic AI voiceover & background scores",
      "Dynamic transitions & custom subtitles",
      "Fast online turnaround time"
    ],
    pricing: [
      { service: "AI Promotional Video", price: 1000, label: "Custom creative for your brand" }
    ],
    samplePlaceholder: "/images/nishi-studio-main-poster.jpg",
    sampleVideo: "/videos/video_1_nishi.mp4",
    portfolioCount: 18
  },
  {
    id: "video-editing",
    title: "Video Editing",
    shortDesc: "Professional reels, shorts, promotional videos and social media video editing with engaging pacing.",
    icon: "Video",
    badge: "Most Popular",
    details: "Captivate your audience with high-retention video editing! We specialize in viral Instagram Reels, YouTube Shorts, podcast highlights, and commercial brand promos packed with kinetic typography, sound design, color grading, and seamless cuts.",
    highlights: [
      "Viral hook pacing & sound effects",
      "Color grading & audio enhancement",
      "Custom animated titles & motion graphics",
      "Vertical (9:16) & Horizontal (16:9) formats"
    ],
    pricing: [
      { service: "Basic Reel", price: 149, label: "Quick Clip / Aesthetic Cut" },
      { service: "30–60 Sec Editing", price: 249, label: "Engaging Reel with Captions" },
      { service: "1–3 Min Video", price: 499, label: "YouTube / LinkedIn Video" },
      { service: "5 Min Video", price: 799, label: "Full YouTube Showcase" }
    ],
    samplePlaceholder: "/images/nishi-creative-services-poster.jpg",
    sampleVideo: "/videos/video2_nishi.mp4",
    portfolioCount: 24
  },
  {
    id: "poster-designing",
    title: "Poster Designing",
    shortDesc: "Business posters, promotional posters, birthday posters, event posters and social media designs.",
    icon: "Palette",
    badge: "Creative Impact",
    details: "Stand out with visually arresting digital posters designed for high digital reach and crisp printability. Featuring authentic studio original posters for digital creators, college projects, and promotional campaigns.",
    highlights: [
      "High resolution (300 DPI print-ready & RGB digital)",
      "Vibrant neon, minimalist or corporate aesthetics",
      "Social media ready aspect ratios",
      "Typography-driven visual hierarchy"
    ],
    pricing: [
      { service: "Simple Poster", price: 99, label: "Clean Announcement / Greetings" },
      { service: "Creative Poster", price: 149, label: "Social Media Campaign Art" },
      { service: "Business Poster", price: 199, label: "Product / Corporate Banner" },
      { service: "Premium Poster", price: 299, label: "Luxury / Mega Event Poster" }
    ],
    samplePlaceholder: "/images/nishi-creative-services-poster.jpg",
    portfolioCount: 32
  },
  {
    id: "logo-designing",
    title: "Logo Designing",
    shortDesc: "Unique, creative and professional brand logos that embody your distinct identity and values.",
    icon: "ShieldCheck",
    badge: "Brand Identity",
    details: "Your logo is the cornerstone of your brand identity. We craft bespoke vector logos tailored to your niche—ranging from luxury golden crowns & emblems to modern illustrated mascots and multi-category studio logos.",
    highlights: [
      "100% original & unique custom concept",
      "Vector source files & transparent PNGs",
      "Monochrome & full color variations",
      "Ready for website, YouTube, apparel & print"
    ],
    pricing: [
      { service: "Basic Logo", price: 199, label: "Clean Typography & Icon" },
      { service: "Creative Logo", price: 349, label: "Custom Illustrated Icon" },
      { service: "Premium Logo", price: 599, label: "Multi-concept Modern Brand Identity" },
      { service: "Brand Logo Package", price: 999, label: "Complete Identity Suite + Mockups" }
    ],
    samplePlaceholder: "/images/nishi-glow-studio-gold-logo.jpg",
    portfolioCount: 20
  },
  {
    id: "youtube-thumbnails",
    title: "YouTube Thumbnail Designing",
    shortDesc: "Attractive, high-quality and engaging YouTube thumbnails engineered for maximum Click-Through Rate (CTR).",
    icon: "Tv",
    badge: "CTR Boosters",
    details: "Turn impressions into clicks! A thumbnail determines whether viewers click your video or scroll past. We construct high-contrast, emotive, and click-worthy thumbnails with glowing outlines, bold typography, and visual curiosity hooks.",
    highlights: [
      "Custom cutouts, glow highlights & color pop",
      "Tested for mobile & desktop feed clarity",
      "High CTR psychology and composition",
      "Standard 1920x1080 Full HD resolution"
    ],
    pricing: [
      { service: "Basic Thumbnail", price: 79, label: "Clean Screenshot + Bold Text" },
      { service: "Creative Thumbnail", price: 129, label: "Glow Effects + High Contrast" },
      { service: "Premium Thumbnail", price: 199, label: "3D Elements + Expressive Cutout" },
      { service: "5 Thumbnails Package", price: 499, label: "Creator Bundle (Save ₹500)" }
    ],
    samplePlaceholder: "/images/nishi-jio-canva-thumbnail.jpg",
    portfolioCount: 40
  },
  {
    id: "business-cards",
    title: "Business Card Designing",
    shortDesc: "Modern and professional digital business card designs that leave an indelible executive impression.",
    icon: "CreditCard",
    badge: "Executive Polish",
    details: "Present your brand with sophistication. We create modern digital and print-ready business cards featuring clean geometric lines, luxury dark theme aesthetics, QR code integration for direct Instagram/website links, and crisp typography.",
    highlights: [
      "Modern QR code integration for instant contact saving",
      "Standard 3.5\" x 2\" with bleed margins",
      "Double-sided luxury layouts",
      "High-res PDF + Web sharing image formats"
    ],
    pricing: [
      { service: "Basic Design", price: 149, label: "Single Sided Clean Minimalist" },
      { service: "Creative Design", price: 249, label: "Custom Styled Single Sided" },
      { service: "Premium Design", price: 399, label: "Double Sided Modern Luxury" },
      { service: "Front & Back Design", price: 499, label: "Complete Print-Ready + QR Code" }
    ],
    samplePlaceholder: "/images/business-card-nishiglow-front-back.jpg",
    portfolioCount: 16
  }
];

export const SERVICES = INITIAL_SERVICES;

export const INITIAL_PORTFOLIO_ITEMS = [
  // 1. BRAND LOGOS (User's authentic uploaded logos)
  {
    id: "logo-1",
    title: "Nishi Glow Studio – Luxury Gold & Pink Crown Emblem Logo",
    category: "Logos",
    badge: "Original Studio Logo",
    desc: "Exquisite luxury emblem logo featuring gold glitter calligraphy, sparkling crown, film strip, camera icon, and fountain pen.",
    image: "/images/nishi-glow-studio-gold-logo.jpg",
    clientType: "Official Studio Identity",
    deliveryTime: "Vector Master Ready",
    isOriginal: true,
    views: 920
  },
  {
    id: "logo-2",
    title: "Nishi Creative Studio – Modern Circular Brandmark",
    category: "Logos",
    badge: "Original Studio Logo",
    desc: "Sleek circular logo featuring gradient purple-pink typography, golden crown, clapperboard, camera, and four core service badges.",
    image: "/images/nishi-creative-studio-modern-logo.jpg",
    clientType: "Official Studio Identity",
    deliveryTime: "Vector Master Ready",
    isOriginal: true,
    views: 860
  },
  {
    id: "logo-3",
    title: "Little Magic Stories – Kids & Channel Mascot Logo",
    category: "Logos",
    badge: "Original Studio Logo",
    desc: "Magical 3D fairytale animated mascot logo with storybook, castle, cute animated animals, and playful kid-friendly typography.",
    image: "/images/little-magic-stories-mascot-logo.jpg",
    clientType: "YouTube Channel / Brand",
    deliveryTime: "Vector Master Ready",
    isOriginal: true,
    views: 950
  },

  // 2. YOUTUBE THUMBNAILS
  {
    id: "thumb-1",
    title: "Jio SIM Good News & Canva Pro Access Thumbnail",
    category: "YouTube Thumbnails",
    badge: "Studio Original Thumbnail",
    desc: "Viral high-CTR YouTube thumbnail in Telugu/English highlighting Canva Pro access, vibrant neon glow and 3D device mockups.",
    image: "/images/nishi-jio-canva-thumbnail.jpg",
    clientType: "Tech & Creator Channel",
    deliveryTime: "4–6 Hours",
    isOriginal: true,
    views: 680
  },
  {
    id: "thumb-2",
    title: "Nishi Glow Studio Music & Melodies Special Song Thumbnail",
    category: "YouTube Thumbnails",
    badge: "Studio Original Thumbnail",
    desc: "Stunning musical and emotional cover thumbnail with glowing gold microphone, sparkling neon notes and photo frame collage.",
    image: "/images/nishi-music-song-thumbnail.jpg",
    clientType: "Music & Creator Channel",
    deliveryTime: "4–6 Hours",
    isOriginal: true,
    views: 740
  },
  {
    id: "thumb-3",
    title: "NISHI Creative Studio – Complete Services Agency Thumbnail",
    category: "YouTube Thumbnails",
    badge: "Studio Original Thumbnail",
    desc: "Eye-catching multi-service promo thumbnail showcasing AI Video, Logo Design, Business Cards, and Thumbnails.",
    image: "/images/nishi-creative-studio-thumbnail.jpg",
    clientType: "Official Studio Showcase",
    deliveryTime: "4–6 Hours",
    isOriginal: true,
    views: 890
  },

  // 3. POSTERS
  {
    id: "post-1",
    title: "NISHI Creative Studio – Official Agency Showcase",
    category: "Posters",
    badge: "Original Studio Poster",
    desc: "Signature studio campaign poster featuring AI Video, Creative Logo, Business Card, and YouTube Thumbnail services.",
    image: "/images/nishi-studio-main-poster.jpg",
    clientType: "Official Studio Original",
    deliveryTime: "Instant / Live",
    isOriginal: true,
    views: 420
  },
  {
    id: "post-2",
    title: "Creative Services – Turn Your Ideas Into Stunning Creations",
    category: "Posters",
    badge: "Original Studio Poster",
    desc: "Complete creative suite poster showcasing Graphic Designing, AI Image/Video, Thumbnails, Occasions & Instagram Posts.",
    image: "/images/nishi-creative-services-poster.jpg",
    clientType: "Official Studio Original",
    deliveryTime: "Instant / Live",
    isOriginal: true,
    views: 380
  },
  {
    id: "post-3",
    title: "Final Year Project PPTs – Academic Presentation Poster",
    category: "Posters",
    badge: "Original Studio Poster",
    desc: "Creative presentation poster for AI & ML, Data Science, Web Tech, and Embedded Systems project viva presentations.",
    image: "/images/nishi-project-ppts-poster.jpg",
    clientType: "Engineering & College Students",
    deliveryTime: "Instant / Live",
    isOriginal: true,
    views: 510
  },
  {
    id: "post-4",
    title: "NISHIGLOWSTUDIO – Creative Services Poster",
    category: "Posters",
    badge: "Official Studio Poster",
    desc: "Promotional poster showcasing AI video creation, creative designing, branding, and digital services.",
    image: "/images/nishiglow-services-poster.png",
    clientType: "Official Studio Original",
    deliveryTime: "Instant / Live",
    isOriginal: true,
    views: 0
  },
  {
    id: "post-5",
    title: "NISHIGLOWSTUDIO – Creative Services Price List Poster",
    category: "Posters",
    badge: "Official Studio Poster",
    desc: "Studio price-list poster artwork. For current website service prices, see the Services page.",
    image: "/images/nishiglow-price-list-poster.png",
    clientType: "Official Studio Original",
    deliveryTime: "Instant / Live",
    isOriginal: true,
    views: 0
  },

  // 4. AI VIDEOS & VIDEO EDITING (User's authentic uploaded original studio videos)
  {
    id: "vid-1",
    title: "NISHI Creative Studio – Official AI Promo Video 01",
    category: "AI Videos",
    badge: "Official Studio Video",
    desc: "Dynamic high-definition AI promotional commercial created by NISHIGLOWSTUDIO for creative branding.",
    image: "/images/nishi-studio-main-poster.jpg",
    videoUrl: "/videos/video_1_nishi.mp4",
    clientType: "Studio Original Showcase",
    deliveryTime: "24 Hours",
    isOriginal: true,
    views: 1850
  },
  {
    id: "vid-2",
    title: "NISHI Creative Studio – High-Retention Reel & Video 02",
    category: "Video Editing",
    badge: "Official Studio Video",
    desc: "Engaging social media reel and promotional video edit featuring kinetic pacing, sound design, and viral effects.",
    image: "/images/nishi-creative-services-poster.jpg",
    videoUrl: "/videos/video2_nishi.mp4",
    clientType: "Social Media Reel Edit",
    deliveryTime: "12 Hours",
    isOriginal: true,
    views: 1620
  },
  {
    id: "vid-3",
    title: "NISHI Creative Studio – Commercial Motion Showcase 03",
    category: "AI Videos",
    badge: "Official Studio Video",
    desc: "Creative video showcasing motion graphics, transitions, and modern digital storytelling by NISHIGLOWSTUDIO.",
    image: "/images/nishi-project-ppts-poster.jpg",
    videoUrl: "/videos/video_3_nishi.mp4",
    clientType: "Brand Showcase",
    deliveryTime: "24 Hours",
    isOriginal: true,
    views: 1410
  },
  // 5. BUSINESS CARDS (User's authentic uploaded luxury business cards)
  {
    id: "card-1",
    title: "NISHIGLOWSTUDIO – Front & Back Luxury Neon QR Visiting Card",
    category: "Business Cards",
    badge: "Official Studio Card",
    desc: "Signature dual-sided executive visiting card featuring 3D glowing 'N' monogram, service icons, contact details, and instant Instagram & email connect.",
    image: "/images/business-card-nishiglow-front-back.jpg",
    clientType: "Official Studio Card",
    deliveryTime: "Print Ready + Digital PDF",
    isOriginal: true,
    views: 1100
  },
  {
    id: "card-2",
    title: "Ideas That Inspire – Luxury Gold Foil & Glowing Bulb Card",
    category: "Business Cards",
    badge: "Luxury Executive",
    desc: "Matte black executive business card with embossed illuminated gold lightbulb, custom CEO typography, and minimalist alignment.",
    image: "/images/business-card-bulb-luxury.jpg",
    clientType: "Executive & Founder",
    deliveryTime: "12 Hours",
    isOriginal: true,
    views: 950
  },
  {
    id: "card-3",
    title: "Dream Big Grow Together – Carved Wooden Textured Card",
    category: "Business Cards",
    badge: "Artisanal Wood Texture",
    desc: "Earthy natural walnut wood grain card with precision 3D tree engraving, swing motif, and tactile engraved typography.",
    image: "/images/business-card-wood-engraved.jpg",
    clientType: "Creative & Architecture",
    deliveryTime: "12 Hours",
    isOriginal: true,
    views: 890
  }
];

export const TESTIMONIALS = [
  {
    id: 1,
    name: "Placeholder Client 01",
    role: "YouTube Content Creator (50K+ Subs)",
    service: "YouTube Thumbnails & Editing",
    quote: "Sample review placeholder: The turn-around time was lightning fast, and our video CTR shot up noticeably with the custom glow thumbnails. Can easily replace this with your client feedback!"
  },
  {
    id: 2,
    name: "Placeholder Client 02",
    role: "Founder, Early-stage D2C Brand",
    service: "AI Advertisement Videos",
    quote: "Sample review placeholder: We launched our festive campaign using the 30-sec AI commercial. It looks like it was created by an agency with a massive budget! Highly recommended."
  },
  {
    id: 3,
    name: "Placeholder Client 03",
    role: "Digital Marketing Specialist",
    service: "Posters & Brand Identity",
    quote: "Sample review placeholder: 100% online convenience. From ordering on Instagram DM to receiving print-ready posters in under a day, the workflow was frictionless."
  }
];

export const FAQS = [
  {
    q: "How does the 100% online service ordering work?",
    a: "It's simple and hassle-free! You browse our services, choose your preferred package or custom requirements, and click 'Order via Instagram DM' or submit an enquiry. We discuss your creative vision directly on Instagram (@nishiglowstudio) or Gmail, you provide any references or details, and we deliver your finalized high-resolution assets digitally."
  },
  {
    q: "Do you have any physical offices or do you accept visits?",
    a: "No, NISHIGLOWSTUDIO operates 100% digitally online. This allows us to deliver high-tier agency quality at beginner-friendly, affordable pricing to clients in every state and city across India without unnecessary overheads."
  },
  {
    q: "How do I make the payment?",
    a: "We accept all major secure online payment methods including UPI (Google Pay, PhonePe, Paytm), Net Banking, and instant bank transfers once we finalize your project brief via Instagram DM or Email."
  },
  {
    q: "Can I request revisions if I need changes?",
    a: "Yes! We work collaboratively with you to ensure your satisfaction. Minor revisions in text, color schemes, audio, and pacing are handled promptly."
  },
  {
    q: "How will I receive the final files?",
    a: "We deliver all final high-definition designs, vector files, and 1080p/4K videos via Google Drive links or directly through high-quality uncompressed email downloads."
  }
];
