
export const CURRENT_VERSION = '3.0.2';
export const VERSION_CHECK_URL = 'https://raw.githubusercontent.com/freevoiceofficialstudio/desktopapp/main/version.json';
export const VOICES_URL = 'https://raw.githubusercontent.com/freevoiceofficialstudio/desktopapp/main/voices.json';

// Universal Firebase Config (Works across Web, Desktop, Mobile)
export const FIREBASE_CONFIG = {
  apiKey: "AIzaSy_Placeholder_Replace_When_Ready", 
  authDomain: "free-voice-app.firebaseapp.com",
  projectId: "free-voice-app",
  storageBucket: "free-voice-app.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:12345:web:abcde"
};

export const STRIPE_PUBLISHABLE_KEY = 'pk_live_51SiQgqA2oDcEdWbbUQTm3MnLL0Yw4vxXEwwEuR8ClSUtPg2Gg7hhChFezr7KtVKCPTmncXXLyAyBEEtd4xi06mmw00EyJO5Jao';

export const STRIPE_LINKS = {
  WEEKLY: 'https://buy.stripe.com/fZufZg2zKe3zcyAep6gjC04',
  MONTHLY: 'https://buy.stripe.com/8x2fZg7U47Fb56894MgjC05',
  YEARLY: 'https://buy.stripe.com/cNi14ma2cbVr2Y080IgjC06'
};

export const CONTACT_EMAIL = 'jobsofficial786@gmail.com';

export const FALLBACK_VOICES: any[] = [
  { "id": "1", "name": "Standard Male", "category": "Free", "avatar": "👨‍💼", "description": "Neutral professional male voice.", "size": "12MB" },
  { "id": "2", "name": "Standard Female", "category": "Free", "avatar": "👩‍💼", "description": "Neutral professional female voice.", "size": "14MB" },
  { "id": "3", "name": "Anime Girl", "category": "Free", "avatar": "👧", "description": "High-pitched Kawaii energy.", "size": "18MB" },
  { "id": "4", "name": "Robot Scout", "category": "Free", "avatar": "🤖", "description": "Pure metallic digital modulation.", "size": "8MB" },
  { "id": "5", "name": "Radio Host", "category": "Free", "avatar": "🎙️", "description": "Classic FM radio compression.", "size": "15MB" },
  { "id": "101", "name": "Ghostface", "category": "Premium", "avatar": "🔪", "description": "Scream movie style killer voice.", "size": "25MB" },
  { "id": "103", "name": "Dark Knight", "category": "Premium", "avatar": "🦇", "description": "Gravelly, intimidating vigilante.", "size": "28MB" },
  { "id": "501", "name": "Elon Musk", "category": "Ultra", "avatar": "🚀", "description": "The visionary tech billionaire.", "size": "45MB" },
  { "id": "502", "name": "Donald Trump", "category": "Ultra", "avatar": "🏛️", "description": "Bold presidential high-energy.", "size": "48MB" },
  { "id": "503", "name": "Morgan Freeman", "category": "Ultra", "avatar": "🌟", "description": "God-tier calm and authoritative.", "size": "52MB" }
];
