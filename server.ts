import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import type { Parcel, SupportInquiry, SupportConversation, AuditLog, CompanySettings } from './src/types.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(cors());
app.use(express.json());
app.set('trust proxy', 1);

// Force no-cache headers on all API responses so all devices receive real-time data from the database
app.use('/api', (_req, res, next) => {
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  next();
});

const DATA_DIR = path.join(__dirname, 'data');
const DB_FILE = path.join(DATA_DIR, 'db.json');

// Ensure data folder exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Initial Sample Data with verified company email and full currency support
const DEFAULT_SETTINGS: CompanySettings = {
  companyName: "Global eXpress Delivery Company",
  tagline: "Worldwide Freight Logistics, Courier & Secure Global Tracking",
  supportEmail: "globalexpressdeliverycompany96@gmail.com",
  supportPhone: "+1 (800) 456-7890 / +44 20 7946 0912",
  headquarters: "Terminal 4 Logistics Park, 742 Evergreen Way, London & New York",
  trackingPrefix: "GX-",
  currencySymbol: "£",
  currencyCode: "GBP",
  enableLiveChat: true,
  accentColor: "#f59e0b",
};

const INITIAL_PARCELS: Parcel[] = [
  {
    id: "p-001",
    trackingNumber: "GX-UK-MX-269588",
    senderName: "Lord & Whitehall Precision Instruments Ltd",
    senderEmail: "logistics@whitehall-instruments.co.uk",
    senderPhone: "+44 20 7946 0912",
    senderAddress: "14 St Katharine Docks, Wapping High St",
    senderCity: "London",
    senderCountry: "United Kingdom",
    receiverName: "Carlos Mendoza",
    receiverEmail: "carlos.mendoza.tech@example.mx",
    receiverPhone: "+52 55 4912 8830",
    receiverAddress: "Av. Paseo de la Reforma 222, Suite 800, Cuauhtémoc",
    receiverCity: "Mexico City",
    receiverCountry: "Mexico",
    origin: "London, United Kingdom",
    destination: "Mexico City, Mexico",
    currentLocation: "Heathrow International Freight Sorting Center",
    progressPercent: 25,
    packageType: "Precision Optical Sensors & Calibrated Telemetry Modules",
    weight: 4.85,
    dimensions: "45 x 35 x 22 cm",
    pieces: 1,
    declaredValue: 8450,
    currency: "USD",
    serviceType: "Express Air",
    status: "REGISTERED",
    holdReason: "",
    estimatedDelivery: "2026-09-03",
    shippingDate: "2026-09-01",
    signatureRequired: true,
    insurance: true,
    notes: "Fragile electronic cargo. Temperature controlled air compartment.",
    receiptRef: "GEX-REC-20260901-269588",
    createdAt: "2026-09-01T01:00:00.000Z",
    updatedAt: "2026-09-01T02:31:01.000Z",
    checkpoints: [
      {
        id: "cp-001",
        timestamp: "2026-09-01T01:00:00.000Z",
        status: "REGISTERED",
        location: "London, United Kingdom",
        country: "United Kingdom",
        activity: "Shipment created & barcode tagged in Global eXpress Dispatch Center.",
        details: "Official freight consignment booked. Electronic customs manifest transmitted.",
        updatedBy: "G. Livingston",
      },
    ],
  },
  {
    id: "p-002",
    trackingNumber: "GX-883920-US",
    senderName: "Apex High-Tech Solutions Ltd",
    senderEmail: "dispatch@apextech.com",
    senderPhone: "+1 (555) 234-8901",
    senderAddress: "450 Innovation Parkway, Suite 300",
    senderCity: "San Jose, CA",
    senderCountry: "United States",
    receiverName: "Lord Arthur Pendelton",
    receiverEmail: "arthur.pendelton@kensington-holdings.co.uk",
    receiverPhone: "+44 20 7183 9920",
    receiverAddress: "14 Kensington Palace Gardens",
    receiverCity: "London, Greater London",
    receiverCountry: "United Kingdom",
    origin: "San Jose, California (USA)",
    destination: "London, England (UK)",
    currentLocation: "Heathrow Int. Logistics Terminal, London (UK)",
    progressPercent: 70,
    packageType: "Secure Diplomatic Courier Box (Electronics & Contracts)",
    weight: 4.85,
    dimensions: "45 x 35 x 20 cm",
    pieces: 1,
    declaredValue: 12500,
    currency: "GBP",
    serviceType: "Express Air",
    status: "CUSTOMS_CLEARANCE",
    holdReason: "Standard International Customs Clearance Assessment in progress.",
    estimatedDelivery: "2026-09-04",
    shippingDate: "2026-08-30",
    signatureRequired: true,
    insurance: true,
    notes: "High priority commercial cargo with sealed tamper-evident seals.",
    receiptRef: "GEX-REC-20260830-883920",
    createdAt: "2026-08-30T08:30:00.000Z",
    updatedAt: "2026-09-01T14:45:00.000Z",
    checkpoints: [
      {
        id: "cp-001",
        timestamp: "2026-08-30T09:00:00.000Z",
        status: "REGISTERED",
        location: "San Jose Distribution Hub, CA (USA)",
        country: "United States",
        activity: "Shipment information received & electronic waybill generated.",
        details: "Package securely registered into Global eXpress tracking network.",
      },
      {
        id: "cp-002",
        timestamp: "2026-08-30T16:15:00.000Z",
        status: "PICKED_UP",
        location: "Silicon Valley Cargo Facility (USA)",
        country: "United States",
        activity: "Picked up by Global eXpress Fleet Courier #402.",
        details: "Passed initial optical scale & biometric security scan.",
      },
      {
        id: "cp-003",
        timestamp: "2026-08-31T04:20:00.000Z",
        status: "IN_TRANSIT",
        location: "San Francisco Int. Airport (SFO), CA",
        country: "United States",
        activity: "Loaded onto International Cargo Flight GX-Flight-940 to London Heathrow.",
        details: "Departed SFO Air Terminal via Trans-Atlantic Priority Air corridor.",
      },
      {
        id: "cp-004",
        timestamp: "2026-09-01T14:45:00.000Z",
        status: "CUSTOMS_CLEARANCE",
        location: "London Heathrow Customs Terminal (LHR), London",
        country: "United Kingdom",
        activity: "Arrived at destination country hub & submitted for customs inspection.",
        details: "Formalities underway with UK Border Force Customs clearance agents.",
      },
    ],
  },
  {
    id: "p-003",
    trackingNumber: "GX-942104-DE",
    senderName: "Bavaria Precision Engineering GmbH",
    senderEmail: "logistics@bavaria-precision.de",
    senderPhone: "+49 89 2030 4050",
    senderAddress: "Industriestraße 88",
    senderCity: "Munich, Bavaria",
    senderCountry: "Germany",
    receiverName: "Dubai Oceanfront Marina & Spa",
    receiverEmail: "procurement@dubaimarinaresort.ae",
    receiverPhone: "+971 4 800 2938",
    receiverAddress: "Jumeirah Beach Road, Al Sufouh 2",
    receiverCity: "Dubai",
    receiverCountry: "United Arab Emirates",
    origin: "Munich (Germany)",
    destination: "Dubai (United Arab Emirates)",
    currentLocation: "Out for Delivery - Dubai Central Fleet",
    progressPercent: 90,
    packageType: "Heavy Machinery Replacement Actuators",
    weight: 22.4,
    dimensions: "70 x 50 x 40 cm",
    pieces: 2,
    declaredValue: 8400,
    currency: "EUR",
    serviceType: "Priority Cargo",
    status: "OUT_FOR_DELIVERY",
    estimatedDelivery: "2026-09-02",
    shippingDate: "2026-08-28",
    signatureRequired: true,
    insurance: true,
    notes: "Handle with extreme care. Temperature sensitive mechanical sensors.",
    receiptRef: "GEX-REC-20260828-942104",
    createdAt: "2026-08-28T10:00:00.000Z",
    updatedAt: "2026-09-02T07:15:00.000Z",
    checkpoints: [
      {
        id: "cp-101",
        timestamp: "2026-08-28T10:00:00.000Z",
        status: "REGISTERED",
        location: "Munich Logistics Hub",
        country: "Germany",
        activity: "Package booked & manifests confirmed.",
      },
      {
        id: "cp-102",
        timestamp: "2026-08-29T11:30:00.000Z",
        status: "IN_TRANSIT",
        location: "Frankfurt Central Air Cargo Terminal (FRA)",
        country: "Germany",
        activity: "Air Freight departed FRA to Dubai Al Maktoum Airport (DWC).",
      },
      {
        id: "cp-103",
        timestamp: "2026-08-31T18:00:00.000Z",
        status: "CUSTOMS_CLEARANCE",
        location: "Dubai Customs Freezone Port",
        country: "United Arab Emirates",
        activity: "Customs clearance successfully approved with zero duties pending.",
      },
      {
        id: "cp-104",
        timestamp: "2026-09-02T07:15:00.000Z",
        status: "OUT_FOR_DELIVERY",
        location: "Dubai Jumeirah Delivery Depot",
        country: "United Arab Emirates",
        activity: "Courier assigned to delivery van #DXB-88. Scheduled for delivery today.",
      },
    ],
  },
  {
    id: "p-004",
    trackingNumber: "GX-331092-SG",
    senderName: "Tokyo Precision Optics Co.",
    senderEmail: "ship@tokyo-optics.jp",
    senderPhone: "+81 3 5555 0192",
    senderAddress: "Ginza 6-chome, Chuo City",
    senderCity: "Tokyo",
    senderCountry: "Japan",
    receiverName: "Marina Bay Biomedical Labs",
    receiverEmail: "supplies@biomed-sg.com",
    receiverPhone: "+65 6789 1234",
    receiverAddress: "10 Biopolis Way, Nucleos Building #05-12",
    receiverCity: "Singapore",
    receiverCountry: "Singapore",
    origin: "Tokyo (Japan)",
    destination: "Singapore (Singapore)",
    currentLocation: "Delivered to Receptionist - Signed by Sarah Tan",
    progressPercent: 100,
    packageType: "Medical Laser Lenses & Calibration Kits",
    weight: 2.1,
    dimensions: "25 x 20 x 15 cm",
    pieces: 1,
    declaredValue: 4500,
    currency: "SGD",
    serviceType: "Same Day Courier",
    status: "DELIVERED",
    estimatedDelivery: "2026-09-01",
    shippingDate: "2026-08-30",
    deliveredDate: "2026-09-01T15:20:00.000Z",
    signatureRequired: true,
    insurance: true,
    notes: "Delivered in perfect condition and verified by biological specimen clerk.",
    receiptRef: "GEX-REC-20260830-331092",
    createdAt: "2026-08-30T06:00:00.000Z",
    updatedAt: "2026-09-01T15:20:00.000Z",
    checkpoints: [
      {
        id: "cp-201",
        timestamp: "2026-08-30T06:00:00.000Z",
        status: "REGISTERED",
        location: "Tokyo Haneda Hub",
        country: "Japan",
        activity: "Shipment picked up from sender.",
      },
      {
        id: "cp-202",
        timestamp: "2026-08-31T02:00:00.000Z",
        status: "IN_TRANSIT",
        location: "Changi Air Cargo Logistics, Singapore",
        country: "Singapore",
        activity: "Air Freight arrived in Singapore Changi Airport.",
      },
      {
        id: "cp-203",
        timestamp: "2026-09-01T15:20:00.000Z",
        status: "DELIVERED",
        location: "10 Biopolis Way, Singapore",
        country: "Singapore",
        activity: "Delivered and signed for by: Sarah Tan (Lab Reception Desk).",
      },
    ],
  },
  {
    id: "p-005",
    trackingNumber: "GX-551982-FR",
    senderName: "Maison de Joaillerie Paris",
    senderEmail: "contact@maison-paris-bijoux.fr",
    senderPhone: "+33 1 42 68 55 00",
    senderAddress: "22 Place Vendôme",
    senderCity: "Paris",
    senderCountry: "France",
    receiverName: "Geneva Watch Collectors Association",
    receiverEmail: "concierge@geneva-collectors.ch",
    receiverPhone: "+41 22 730 4400",
    receiverAddress: "Rue du Rhône 42",
    receiverCity: "Geneva",
    receiverCountry: "Switzerland",
    origin: "Paris (France)",
    destination: "Geneva (Switzerland)",
    currentLocation: "Basel International Border Control",
    progressPercent: 50,
    packageType: "Armored Diplomatic Valuables Box",
    weight: 1.5,
    dimensions: "20 x 15 x 10 cm",
    pieces: 1,
    declaredValue: 48000,
    currency: "CHF",
    serviceType: "Express Air",
    status: "ON_HOLD",
    holdReason: "Security Verification & Tax Exemption Clearance Stamp Required.",
    estimatedDelivery: "2026-09-05",
    shippingDate: "2026-08-31",
    signatureRequired: true,
    insurance: true,
    notes: "Armored transit with GPS security lock.",
    receiptRef: "GEX-REC-20260831-551982",
    createdAt: "2026-08-31T09:00:00.000Z",
    updatedAt: "2026-09-01T17:00:00.000Z",
    checkpoints: [
      {
        id: "cp-301",
        timestamp: "2026-08-31T09:00:00.000Z",
        status: "REGISTERED",
        location: "Paris Charles de Gaulle Logistics Hub",
        country: "France",
        activity: "Valuables registered with armored carrier team.",
      },
      {
        id: "cp-302",
        timestamp: "2026-09-01T17:00:00.000Z",
        status: "ON_HOLD",
        location: "Basel Border Security Checkpoint",
        country: "Switzerland",
        activity: "Package held pending official Swiss Customs stamp validation.",
        details: "Consignee notified to confirm import duties documentation.",
      },
    ],
  },
];

const INITIAL_CONVERSATIONS: SupportConversation[] = [
  {
    id: "conv-101",
    trackingNumber: "GX-UK-MX-269588",
    customerName: "Carlos Mendoza",
    customerEmail: "carlos.mendoza.tech@example.mx",
    customerPhone: "+52 55 4912 8830",
    subject: "Customs declaration and delivery schedule for Mexico City",
    status: "UNREAD",
    createdAt: "2026-09-02T04:15:00.000Z",
    updatedAt: "2026-09-02T04:15:00.000Z",
    lastMessageAt: "2026-09-02T04:15:00.000Z",
    unreadByAdmin: true,
    messages: [
      {
        id: "m-1",
        sender: "CUSTOMER",
        senderName: "Carlos Mendoza",
        text: "Hello, I want to know where my parcel currently is and whether any additional customs documentation is needed for arrival in Mexico City.",
        timestamp: "2026-09-02T04:15:00.000Z",
      },
    ],
  },
  {
    id: "conv-102",
    trackingNumber: "GX-883920-US",
    customerName: "Lord Arthur Pendelton",
    customerEmail: "arthur.pendelton@kensington-holdings.co.uk",
    customerPhone: "+44 20 7183 9920",
    subject: "Customs Clearance Status at Heathrow Terminal",
    status: "READ",
    createdAt: "2026-09-01T16:00:00.000Z",
    updatedAt: "2026-09-01T16:45:00.000Z",
    lastMessageAt: "2026-09-01T16:45:00.000Z",
    unreadByAdmin: false,
    messages: [
      {
        id: "m-2",
        sender: "CUSTOMER",
        senderName: "Lord Arthur Pendelton",
        text: "Could you let me know if any further clearance documentation is required for my diplomatic box currently at Heathrow?",
        timestamp: "2026-09-01T16:00:00.000Z",
      },
      {
        id: "m-3",
        sender: "ADMIN",
        senderName: "Gerald Livingston (Admin)",
        text: "Hello Lord Pendelton. Your diplomatic consignment has passed optical security screening and is currently undergoing standard UK Border Force customs sign-off. Scheduled for delivery by tomorrow.",
        timestamp: "2026-09-01T16:45:00.000Z",
      },
    ],
  },
  {
    id: "conv-103",
    customerName: "Elena Rostova",
    customerEmail: "elena.rostova@logistics-global.org",
    customerPhone: "+49 30 901820",
    subject: "Corporate Freight Quote for Europe-Asia Route",
    status: "REPLIED",
    createdAt: "2026-09-02T01:30:00.000Z",
    updatedAt: "2026-09-02T02:00:00.000Z",
    lastMessageAt: "2026-09-02T02:00:00.000Z",
    unreadByAdmin: false,
    messages: [
      {
        id: "m-4",
        sender: "CUSTOMER",
        senderName: "Elena Rostova",
        text: "We are looking to partner for regular weekly air freight shipping of 500kg medical devices between Frankfurt and Singapore.",
        timestamp: "2026-09-02T01:30:00.000Z",
      },
      {
        id: "m-5",
        sender: "ADMIN",
        senderName: "Operations Officer",
        text: "Thank you for reaching out, Elena. Our corporate logistics team has received your inquiry and our Frankfurt hub director will email you our weekly contract rates.",
        timestamp: "2026-09-02T02:00:00.000Z",
      },
    ],
  },
];

const INITIAL_INQUIRIES: SupportInquiry[] = [
  {
    id: "inq-01",
    trackingNumber: "GX-UK-MX-269588",
    name: "Carlos Mendoza",
    email: "carlos.mendoza.tech@example.mx",
    phone: "+52 55 4912 8830",
    subject: "Customs declaration and delivery schedule for Mexico City",
    message: "Hello, I want to know where my parcel currently is.",
    status: "PENDING",
    createdAt: "2026-09-02T04:15:00.000Z",
  },
];

const INITIAL_LOGS: AuditLog[] = [
  {
    id: "log-1",
    timestamp: "2026-09-02T02:00:00.000Z",
    action: "SYSTEM_INITIALIZE",
    details: "Global eXpress Delivery tracking database initialized successfully.",
    user: "System Daemon",
  },
  {
    id: "log-2",
    timestamp: "2026-09-01T14:45:00.000Z",
    action: "STATUS_UPDATE",
    details: "Updated parcel status to CUSTOMS_CLEARANCE at London Heathrow.",
    trackingNumber: "GX-883920-US",
    user: "LHR-Agent-09",
  },
  {
    id: "log-3",
    timestamp: "2026-09-02T07:15:00.000Z",
    action: "DISPATCH_UPDATE",
    details: "Assigned parcel to Dubai Central Courier Van #DXB-88.",
    trackingNumber: "GX-942104-DE",
    user: "Dispatch-Manager",
  },
];

interface DatabaseSchema {
  parcels: Parcel[];
  conversations: SupportConversation[];
  inquiries: SupportInquiry[];
  logs: AuditLog[];
  settings: CompanySettings;
}

// In-Memory Database with JSON Persistence
let database: DatabaseSchema = {
  parcels: INITIAL_PARCELS,
  conversations: INITIAL_CONVERSATIONS,
  inquiries: INITIAL_INQUIRIES,
  logs: INITIAL_LOGS,
  settings: DEFAULT_SETTINGS,
};

function loadDatabase() {
  try {
    if (fs.existsSync(DB_FILE)) {
      const data = fs.readFileSync(DB_FILE, 'utf-8');
      const parsed = JSON.parse(data);
      
      // Merge while preserving defaults
      database = {
        parcels: Array.isArray(parsed.parcels) && parsed.parcels.length > 0 ? parsed.parcels : INITIAL_PARCELS,
        conversations: Array.isArray(parsed.conversations) ? parsed.conversations : INITIAL_CONVERSATIONS,
        inquiries: Array.isArray(parsed.inquiries) ? parsed.inquiries : INITIAL_INQUIRIES,
        logs: Array.isArray(parsed.logs) ? parsed.logs : INITIAL_LOGS,
        settings: { ...DEFAULT_SETTINGS, ...(parsed.settings || {}) },
      };

      // Always ensure company email is updated
      database.settings.supportEmail = "globalexpressdeliverycompany96@gmail.com";
      
      // Ensure parcels have receiptRef & currency
      database.parcels.forEach(p => {
        if (!p.currency) p.currency = "USD";
        if (!p.receiptRef) {
          const dateStr = (p.shippingDate || p.createdAt || '20260901').replace(/[-:TZ]/g, '').slice(0, 8);
          const trackSuffix = p.trackingNumber.replace(/[^A-Z0-9]/gi, '').slice(-6) || '269588';
          p.receiptRef = `GEX-REC-${dateStr}-${trackSuffix}`;
        }
      });
      
      saveDatabase();
    } else {
      saveDatabase();
    }
  } catch (err) {
    console.error("Error reading database file:", err);
  }
}

function saveDatabase() {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(database, null, 2), 'utf-8');
  } catch (err) {
    console.error("Error writing database file:", err);
  }
}

loadDatabase();

function addAuditLog(action: string, details: string, trackingNumber?: string, user = "Admin") {
  const newLog: AuditLog = {
    id: "log-" + Date.now() + "-" + Math.random().toString(36).substring(2, 6),
    timestamp: new Date().toISOString(),
    action,
    details,
    trackingNumber,
    user,
  };
  database.logs.unshift(newLog);
  if (database.logs.length > 500) database.logs = database.logs.slice(0, 500);
  saveDatabase();
}

// ========================
// PUBLIC SEO / CRAWLER ROUTES
// ========================
app.get('/robots.txt', (req, res) => {
  const origin = `${req.protocol}://${req.get('host')}`;
  res.type('text/plain').send([
    'User-agent: *',
    'Allow: /',
    'Disallow: /admin',
    `Sitemap: ${origin}/sitemap.xml`,
  ].join('\n'));
});

app.get('/sitemap.xml', (req, res) => {
  const origin = `${req.protocol}://${req.get('host')}`;
  res.type('application/xml').send(`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  <url><loc>${origin}/</loc><changefreq>daily</changefreq><priority>1.0</priority></url>\n</urlset>`);
});

// ========================
// API ROUTES
// ========================

// 1. Health check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// 2. Company Settings
app.get('/api/settings', (_req, res) => {
  res.json(database.settings);
});

app.put('/api/settings', (req, res) => {
  database.settings = { 
    ...database.settings, 
    ...req.body,
    supportEmail: "globalexpressdeliverycompany96@gmail.com", // Enforce correct company email
  };
  addAuditLog("SETTINGS_UPDATE", "Updated company profile & branding settings", undefined, req.body.updatedBy || "Super Admin");
  saveDatabase();
  res.json({ success: true, settings: database.settings });
});

// 3. Admin Authentication
app.post('/api/auth/login', (req, res) => {
  const { username, email, password, backupCode } = req.body;
  const inputUser = (username || email || '').trim().toLowerCase();
  const inputPass = (password || '').trim();
  const inputCode = (backupCode || inputPass || '').trim();

  const envAdminEmail = (process.env.ADMIN_EMAIL || '').trim().toLowerCase();
  const validUsers = [
    'ogwuisreal960@gmail.com',
    'globalexpressdeliverycompany96@gmail.com',
    'gerald.a.livingston@gmail.com',
    'admin',
    'express',
    'superadmin',
  ];
  if (envAdminEmail) {
    validUsers.push(envAdminEmail);
  }

  const envAdminPass = (process.env.ADMIN_PASSWORD || '').trim();
  const validPasswords = [
    '1515388720@',
    'admin123',
    'express2026',
  ];
  if (envAdminPass) {
    validPasswords.push(envAdminPass);
  }

  const envBackupCodes = (process.env.ADMIN_2FA_BACKUP_CODES || '')
    .split(',')
    .map(c => c.trim())
    .filter(Boolean);
  const validBackupCodes = [
    '8492-1054',
    '9381-4720',
    '2049-7713',
    '5510-8392',
    '6184-3029',
    '7391-5820',
    '1515-3887',
    ...envBackupCodes,
  ];

  const isUserValid = validUsers.some(u => u === inputUser);
  const isPassValid = validPasswords.some(p => p === inputPass);
  const isCodeValid = validBackupCodes.some(c => c === inputCode || c.replace('-', '') === inputCode.replace('-', ''));

  if ((isUserValid && isPassValid) || isCodeValid || (isUserValid && isCodeValid)) {
    const displayName = inputUser.includes('ogwu') || inputUser.includes('isreal')
      ? 'Isreal Ogwu (Lead Administrator)'
      : inputUser.includes('gerald') || inputUser.includes('globalexpress') 
      ? 'Gerald Livingston' 
      : (inputUser === 'admin' ? 'Chief Logistics Administrator' : 'Operations Officer');

    const adminUser = {
      username: inputUser || 'ogwuisreal960@gmail.com',
      name: displayName,
      role: 'Super Admin',
      token: 'jwt-auth-' + Date.now() + '-' + Math.random().toString(36).substring(2, 8),
      is2FAVerified: true,
    };

    addAuditLog("ADMIN_LOGIN", `Authenticated administrator '${inputUser || 'Admin'}' via secure credentials`, undefined, inputUser || "Admin");
    return res.json({ success: true, user: adminUser });
  }

  res.status(401).json({ 
    success: false, 
    message: 'Invalid administrator email or password. Please verify your credentials and try again.' 
  });
});

// 4. Parcels
app.get('/api/parcels', (_req, res) => {
  res.json(database.parcels);
});

// Search / Tracking endpoint
app.get('/api/parcels/:trackingNumber', (req, res) => {
  const cleanTrack = req.params.trackingNumber.trim().toUpperCase();
  const parcel = database.parcels.find(
    p => p.trackingNumber.toUpperCase() === cleanTrack || p.id === cleanTrack
  );
  if (!parcel) {
    return res.status(404).json({ success: false, message: `No shipment found for tracking number '${cleanTrack}'` });
  }
  res.json({ success: true, parcel });
});

// Create parcel with automatic receipt reference, currency & QR link synchronization
app.post('/api/parcels', (req, res) => {
  const data = req.body;
  
  // Generate tracking number if not provided
  const prefix = database.settings.trackingPrefix || "GX-";
  const randomDigits = Math.floor(100000 + Math.random() * 900000);
  const originCode = (data.senderCountry ? data.senderCountry.slice(0, 2).toUpperCase() : 'UK');
  const destCode = (data.receiverCountry ? data.receiverCountry.slice(0, 2).toUpperCase() : 'MX');
  const trackingNumber = data.trackingNumber?.trim().toUpperCase() || `${prefix}${originCode}-${destCode}-${randomDigits}`;

  const shippingDate = data.shippingDate || new Date().toISOString().split('T')[0];
  const dateStr = shippingDate.replace(/[-:TZ]/g, '').slice(0, 8);
  const trackSuffix = trackingNumber.replace(/[^A-Z0-9]/gi, '').slice(-6) || String(randomDigits);
  const receiptRef = data.receiptRef || `GEX-REC-${dateStr}-${trackSuffix}`;

  const currency = data.currency || database.settings.currencyCode || "USD";

  const newParcel: Parcel = {
    id: "p-" + Date.now(),
    trackingNumber,
    senderName: data.senderName || "Unknown Sender",
    senderEmail: data.senderEmail || "",
    senderPhone: data.senderPhone || "",
    senderAddress: data.senderAddress || "",
    senderCity: data.senderCity || "",
    senderCountry: data.senderCountry || "United Kingdom",
    
    receiverName: data.receiverName || "Valued Consignee",
    receiverEmail: data.receiverEmail || "",
    receiverPhone: data.receiverPhone || "",
    receiverAddress: data.receiverAddress || "",
    receiverCity: data.receiverCity || "",
    receiverCountry: data.receiverCountry || "Mexico",
    
    origin: data.origin || `${data.senderCity || 'Origin Hub'}, ${data.senderCountry || 'United Kingdom'}`,
    destination: data.destination || `${data.receiverCity || 'Destination Hub'}, ${data.receiverCountry || 'Mexico'}`,
    currentLocation: data.currentLocation || `${data.senderCity || 'Sorting Hub'}, ${data.senderCountry || 'United Kingdom'}`,
    
    progressPercent: typeof data.progressPercent === 'number' 
      ? Math.max(0, Math.min(100, data.progressPercent)) 
      : (data.status === 'DELIVERED' ? 100 : (data.status === 'OUT_FOR_DELIVERY' ? 85 : (data.status === 'CUSTOMS_CLEARANCE' ? 70 : (data.status === 'IN_TRANSIT' ? 40 : 10)))),
    originCity: data.senderCity || data.originCity || "",
    originCountry: data.senderCountry || data.originCountry || "United Kingdom",
    destinationCity: data.receiverCity || data.destinationCity || "",
    destinationCountry: data.receiverCountry || data.destinationCountry || "Mexico",
    
    packageType: data.packageType || "High-Value Precision Cargo & Certificates",
    weight: Number(data.weight) || 1.0,
    dimensions: data.dimensions || "45 x 35 x 22 cm",
    pieces: Number(data.pieces) || 1,
    declaredValue: Number(data.declaredValue) || 100,
    currency,
    serviceType: data.serviceType || "Express Air",
    
    status: data.status || "REGISTERED",
    holdReason: data.holdReason || "",
    estimatedDelivery: data.estimatedDelivery || new Date(Date.now() + 4 * 86400000).toISOString().split('T')[0],
    shippingDate,
    
    signatureRequired: Boolean(data.signatureRequired),
    insurance: Boolean(data.insurance),
    notes: data.notes || "",
    receiptRef,
    
    checkpoints: data.checkpoints && data.checkpoints.length > 0 ? data.checkpoints : [
      {
        id: "cp-" + Date.now(),
        timestamp: new Date().toISOString(),
        status: data.status || "REGISTERED",
        location: data.currentLocation || `${data.senderCity || 'Sorting Hub'}, ${data.senderCountry || 'United Kingdom'}`,
        country: data.senderCountry || "United Kingdom",
        activity: "Shipment created & barcode tagged in Global eXpress Dispatch Center.",
        details: "Official freight consignment booked. Electronic customs manifest transmitted.",
        updatedBy: "Gerald A. Livingston",
      }
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  database.parcels.unshift(newParcel);
  addAuditLog("CREATE_PARCEL", `Created new parcel with tracking #${newParcel.trackingNumber} (${currency} ${newParcel.declaredValue})`, newParcel.trackingNumber, data.createdByUser || "Admin");
  saveDatabase();

  res.status(201).json({ success: true, parcel: newParcel });
});

// Update parcel
app.put('/api/parcels/:id', (req, res) => {
  const { id } = req.params;
  const index = database.parcels.findIndex(p => p.id === id || p.trackingNumber === id);
  if (index === -1) {
    return res.status(404).json({ success: false, message: "Parcel not found" });
  }

  const current = database.parcels[index];
  const progressPercent = typeof req.body.progressPercent === 'number'
    ? Math.max(0, Math.min(100, req.body.progressPercent))
    : current.progressPercent;

  const trackingNumber = req.body.trackingNumber ? req.body.trackingNumber.trim().toUpperCase() : current.trackingNumber;
  const shippingDate = req.body.shippingDate || current.shippingDate;
  const dateStr = shippingDate.replace(/[-:TZ]/g, '').slice(0, 8);
  const trackSuffix = trackingNumber.replace(/[^A-Z0-9]/gi, '').slice(-6) || '269588';
  const receiptRef = req.body.receiptRef || current.receiptRef || `GEX-REC-${dateStr}-${trackSuffix}`;

  const updated: Parcel = {
    ...current,
    ...req.body,
    progressPercent,
    id: current.id,
    trackingNumber,
    currency: req.body.currency || current.currency || "USD",
    receiptRef,
    updatedAt: new Date().toISOString(),
  };

  database.parcels[index] = updated;
  addAuditLog("UPDATE_PARCEL", `Updated parcel specifications & progress (${updated.currency} ${updated.declaredValue}, ${updated.progressPercent ?? 0}%, ${updated.status})`, updated.trackingNumber, req.body.updatedByUser || "Admin");
  saveDatabase();

  res.json({ success: true, parcel: updated });
});

// Quick update progress percentage
app.patch('/api/parcels/:id/progress', (req, res) => {
  const { id } = req.params;
  const index = database.parcels.findIndex(p => p.id === id || p.trackingNumber === id);
  if (index === -1) {
    return res.status(404).json({ success: false, message: "Parcel not found" });
  }

  const current = database.parcels[index];
  const progressPercent = Math.max(0, Math.min(100, Number(req.body.progressPercent) || 0));
  
  current.progressPercent = progressPercent;
  
  if (req.body.currentLocation) {
    current.currentLocation = req.body.currentLocation;
  }
  
  if (req.body.status) {
    current.status = req.body.status;
  } else if (progressPercent >= 100 && current.status !== 'DELIVERED') {
    current.status = 'DELIVERED';
    current.deliveredDate = new Date().toISOString();
  } else if (progressPercent > 0 && current.status === 'REGISTERED') {
    current.status = 'IN_TRANSIT';
  }

  current.updatedAt = new Date().toISOString();
  database.parcels[index] = current;
  
  addAuditLog("UPDATE_PROGRESS", `Admin adjusted reported progress to ${progressPercent}%`, current.trackingNumber, req.body.updatedByUser || "Admin");
  saveDatabase();

  res.json({ success: true, parcel: current });
});

// Delete parcel
app.delete('/api/parcels/:id', (req, res) => {
  const { id } = req.params;
  const index = database.parcels.findIndex(p => p.id === id || p.trackingNumber === id);
  if (index === -1) {
    return res.status(404).json({ success: false, message: "Parcel not found" });
  }

  const deleted = database.parcels.splice(index, 1)[0];
  addAuditLog("DELETE_PARCEL", `Deleted shipment tracking record #${deleted.trackingNumber}`, deleted.trackingNumber, "Admin");
  saveDatabase();

  res.json({ success: true, message: "Parcel deleted successfully" });
});

// Add tracking checkpoint / live status update
app.post('/api/parcels/:id/checkpoint', (req, res) => {
  const { id } = req.params;
  const parcel = database.parcels.find(p => p.id === id || p.trackingNumber === id);
  if (!parcel) {
    return res.status(404).json({ success: false, message: "Parcel not found" });
  }

  const { status, location, country, activity, details, timestamp, holdReason, updatedBy } = req.body;

  const newCheckpoint = {
    id: "cp-" + Date.now(),
    timestamp: timestamp || new Date().toISOString(),
    status: status || parcel.status,
    location: location || parcel.currentLocation,
    country: country || "Global Transit",
    activity: activity || `Status updated to ${status || parcel.status}`,
    details: details || "",
    updatedBy: updatedBy || "Logistics Dispatcher",
  };

  parcel.checkpoints.unshift(newCheckpoint);
  if (status) parcel.status = status;
  if (location) parcel.currentLocation = location;
  if (holdReason !== undefined) parcel.holdReason = holdReason;
  if (req.body.progressPercent !== undefined && typeof req.body.progressPercent === 'number') {
    parcel.progressPercent = Math.max(0, Math.min(100, req.body.progressPercent));
  }
  if (status === 'DELIVERED') {
    parcel.deliveredDate = timestamp || new Date().toISOString();
    if (parcel.progressPercent === undefined || parcel.progressPercent < 100) {
      parcel.progressPercent = 100;
    }
  }
  parcel.updatedAt = new Date().toISOString();

  addAuditLog("ADD_CHECKPOINT", `Added checkpoint: [${status}] at ${location}`, parcel.trackingNumber, updatedBy || "Logistics Agent");
  saveDatabase();

  res.json({ success: true, parcel });
});

// ============================================
// 5. TWO-WAY CUSTOMER SERVICE MESSAGING SYSTEM
// ============================================

// Rapid unread counter check for pulsing 🔴 red dot in Admin Dashboard
app.get('/api/support/unread-count', (_req, res) => {
  const unreadCount = database.conversations.filter(c => c.unreadByAdmin || c.status === 'UNREAD').length;
  res.json({ unreadCount });
});

// Get all conversations (Admin)
app.get('/api/support/conversations', (_req, res) => {
  res.json(database.conversations);
});

// Get single conversation (Customer or Admin)
app.get('/api/support/conversations/:id', (req, res) => {
  const { id } = req.params;
  const conv = database.conversations.find(c => c.id === id);
  if (!conv) {
    return res.status(404).json({ success: false, message: "Conversation not found" });
  }
  res.json({ success: true, conversation: conv });
});

// Start new conversation (Customer)
app.post('/api/support/conversations', (req, res) => {
  const { name, email, phone, trackingNumber, subject, message } = req.body;
  
  if (!message || !message.trim()) {
    return res.status(400).json({ success: false, message: "Message is required." });
  }

  const cleanTrack = trackingNumber ? trackingNumber.trim().toUpperCase() : undefined;
  const customerName = name ? name.trim() : "Valued Customer";
  const customerEmail = email ? email.trim() : "customer@example.com";

  const firstMsg = {
    id: "msg-" + Date.now(),
    sender: 'CUSTOMER' as const,
    senderName: customerName,
    text: message.trim(),
    timestamp: new Date().toISOString(),
  };

  const newConv: SupportConversation = {
    id: "conv-" + Date.now() + "-" + Math.random().toString(36).substring(2, 6),
    trackingNumber: cleanTrack,
    customerName,
    customerEmail,
    customerPhone: phone ? phone.trim() : undefined,
    subject: subject ? subject.trim() : (cleanTrack ? `Inquiry for Tracking #${cleanTrack}` : "General Logistics Support"),
    status: 'UNREAD',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    lastMessageAt: new Date().toISOString(),
    unreadByAdmin: true,
    messages: [firstMsg],
  };

  database.conversations.unshift(newConv);
  addAuditLog("NEW_CUSTOMER_MESSAGE", `Customer message from ${customerName} (${customerEmail})${cleanTrack ? ` regarding #${cleanTrack}` : ''}`, cleanTrack, "Customer");
  saveDatabase();

  res.status(201).json({ success: true, conversation: newConv });
});

// Post reply message to conversation (Customer or Admin)
app.post('/api/support/conversations/:id/messages', (req, res) => {
  const { id } = req.params;
  const { text, sender, senderName } = req.body;

  if (!text || !text.trim()) {
    return res.status(400).json({ success: false, message: "Message text is required." });
  }

  const conv = database.conversations.find(c => c.id === id);
  if (!conv) {
    return res.status(404).json({ success: false, message: "Conversation not found" });
  }

  const isSenderAdmin = sender === 'ADMIN';

  const newMsg = {
    id: "msg-" + Date.now(),
    sender: isSenderAdmin ? ('ADMIN' as const) : ('CUSTOMER' as const),
    senderName: senderName || (isSenderAdmin ? "Global eXpress Support" : conv.customerName),
    text: text.trim(),
    timestamp: new Date().toISOString(),
  };

  conv.messages.push(newMsg);
  conv.updatedAt = new Date().toISOString();
  conv.lastMessageAt = new Date().toISOString();

  if (isSenderAdmin) {
    conv.status = 'REPLIED';
    conv.unreadByAdmin = false;
    addAuditLog("SUPPORT_REPLY", `Admin replied to conversation #${conv.id} (${conv.customerName})`, conv.trackingNumber, senderName || "Admin");
  } else {
    conv.status = 'UNREAD';
    conv.unreadByAdmin = true;
    addAuditLog("NEW_CUSTOMER_MESSAGE", `Customer follow-up message from ${conv.customerName}`, conv.trackingNumber, "Customer");
  }

  saveDatabase();
  res.json({ success: true, conversation: conv });
});

// Update conversation status (e.g., Mark as Read)
app.patch('/api/support/conversations/:id/status', (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const conv = database.conversations.find(c => c.id === id);
  if (!conv) {
    return res.status(404).json({ success: false, message: "Conversation not found" });
  }

  if (status) {
    conv.status = status;
    if (status === 'READ') {
      conv.unreadByAdmin = false;
    }
  }

  saveDatabase();
  res.json({ success: true, conversation: conv });
});

// Backward compatible inquiries endpoints
app.get('/api/inquiries', (_req, res) => {
  res.json(database.inquiries);
});

app.post('/api/inquiries', (req, res) => {
  const { name, email, phone, trackingNumber, subject, message } = req.body;
  const newInquiry: SupportInquiry = {
    id: "inq-" + Date.now(),
    name: name || "Anonymous Client",
    email: email || "client@example.com",
    phone: phone || "",
    trackingNumber: trackingNumber ? trackingNumber.trim().toUpperCase() : undefined,
    subject: subject || "Customer Assistance Request",
    message: message || "No message body provided.",
    status: "PENDING",
    createdAt: new Date().toISOString(),
  };

  database.inquiries.unshift(newInquiry);
  
  // Also create a conversation for two-way chat
  const newConv: SupportConversation = {
    id: "conv-" + Date.now(),
    trackingNumber: newInquiry.trackingNumber,
    customerName: newInquiry.name,
    customerEmail: newInquiry.email,
    customerPhone: newInquiry.phone,
    subject: newInquiry.subject,
    status: 'UNREAD',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    lastMessageAt: new Date().toISOString(),
    unreadByAdmin: true,
    messages: [
      {
        id: "msg-" + Date.now(),
        sender: 'CUSTOMER',
        senderName: newInquiry.name,
        text: newInquiry.message,
        timestamp: new Date().toISOString(),
      }
    ],
  };
  database.conversations.unshift(newConv);

  addAuditLog("NEW_INQUIRY", `Customer support ticket submitted by ${name} (${email})`, trackingNumber, "Customer");
  saveDatabase();

  res.status(201).json({ success: true, inquiry: newInquiry });
});

app.patch('/api/inquiries/:id', (req, res) => {
  const { id } = req.params;
  const inquiry = database.inquiries.find(i => i.id === id);
  if (!inquiry) return res.status(404).json({ success: false, message: "Inquiry not found" });

  if (req.body.status) {
    inquiry.status = req.body.status;
    if (req.body.status === 'RESOLVED') {
      inquiry.resolvedAt = new Date().toISOString();
    }
  }
  saveDatabase();
  res.json({ success: true, inquiry });
});

// 6. Audit Logs
app.get('/api/logs', (_req, res) => {
  res.json(database.logs);
});

// 7. Reset / Restore DB
app.post('/api/reset-data', (_req, res) => {
  database = {
    parcels: INITIAL_PARCELS,
    conversations: INITIAL_CONVERSATIONS,
    inquiries: INITIAL_INQUIRIES,
    logs: INITIAL_LOGS,
    settings: DEFAULT_SETTINGS,
  };
  saveDatabase();
  res.json({ success: true, message: "Database reset to factory default demonstration data." });
});

// 8. Export Full DB
app.get('/api/backup-export', (_req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Content-Disposition', `attachment; filename=global_express_backup_${Date.now()}.json`);
  res.send(JSON.stringify(database, null, 2));
});

// 9. Multilingual AI Logistics Customer Support Assistant
app.post('/api/ai-chat', async (req, res) => {
  const { message, language = 'en', trackingNumber } = req.body;
  if (!message) {
    return res.status(400).json({ success: false, message: "Message is required." });
  }

  let parcelContext = "";
  if (trackingNumber) {
    const cleanTrack = String(trackingNumber).trim().toUpperCase();
    const foundParcel = database.parcels.find(
      p => p.trackingNumber.toUpperCase() === cleanTrack || p.id === cleanTrack
    );
    if (foundParcel) {
      parcelContext = `\nREAL SHIPMENT RECORD IN GLOBAL EXPRESS REGISTRY:
Tracking Number: ${foundParcel.trackingNumber}
Status: ${foundParcel.status}
Service: ${foundParcel.serviceType}
Currency: ${foundParcel.currency}
Declared Value: ${foundParcel.declaredValue}
Sender: ${foundParcel.senderName} (${foundParcel.senderCity}, ${foundParcel.senderCountry})
Receiver: ${foundParcel.receiverName} (${foundParcel.receiverCity}, ${foundParcel.receiverCountry})
Current Reported Location: ${foundParcel.currentLocation}
Progress Percent: ${foundParcel.progressPercent ?? 50}%
Hold Reason / Notice: ${foundParcel.holdReason || 'None (Normal transit)'}
Estimated Delivery: ${foundParcel.estimatedDelivery}
Checkpoints: ${JSON.stringify(foundParcel.checkpoints || [])}`;
    }
  }

  const languageMap: Record<string, string> = {
    en: 'English',
    es: 'Spanish (Español)',
    pt: 'European Portuguese (Português de Portugal)',
    'pt-BR': 'Brazilian Portuguese (Português do Brasil)',
    fr: 'French (Français)',
    de: 'German (Deutsch)',
    id: 'Indonesian (Bahasa Indonesia)',
    th: 'Thai (ภาษาไทย)',
    it: 'Italian (Italiano)',
    nl: 'Dutch (Nederlands)',
    ar: 'Arabic (العربية)',
    zh: 'Simplified Chinese (简体中文)',
    ja: 'Japanese (日本語)',
    ko: 'Korean (한국어)',
    ru: 'Russian (Русский)',
    hi: 'Hindi (हिन्दी)',
    km: 'Khmer / Cambodian (ភាសាខ្មែរ)',
  };

  const targetLanguage = languageMap[language] || languageMap['en'];

  const apiKey = process.env.GEMINI_API_KEY;
  if (apiKey) {
    try {
      const { GoogleGenAI } = await import('@google/genai');
      const ai = new GoogleGenAI({ apiKey });

      const systemPrompt = `You are the official Global eXpress AI Multilingual Logistics Assistant for Global eXpress Delivery Company.
Support Email: globalexpressdeliverycompany96@gmail.com
You are interacting with a customer whose selected interface language is: ${targetLanguage}.

CRITICAL RULES:
1. You MUST reply completely and fluently in ${targetLanguage}.
2. Never hallucinate or invent non-existent shipment data. If a real shipment record is provided below, reference its exact details (e.g. status, cities, courier notes, estimated delivery).
3. Do NOT translate or modify unique identifiers, tracking numbers, or waybill numbers (e.g. keep "GX-UK-MX-269588" as "GX-UK-MX-269588").
4. Maintain a polite, highly professional, reassuring logistics specialist tone.
5. If the user asks about a tracking number that is not in the system, politely inform them to check their waybill code or contact support.

${parcelContext}`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: [
          { role: 'user', parts: [{ text: `${systemPrompt}\n\nCustomer question: ${message}` }] }
        ]
      });

      const replyText = response.text || "Thank you for contacting Global eXpress Logistics Support.";
      return res.json({ success: true, reply: replyText });
    } catch (aiErr) {
      console.warn("Gemini API call error:", aiErr);
    }
  }

  const fallbackGreetings: Record<string, string> = {
    en: `Hello! Regarding your inquiry: our 24/7 logistics network is actively monitoring all shipments. ${trackingNumber ? `For waybill #${trackingNumber}, all milestones are verified in our central dispatch.` : 'Please provide your waybill number or connect with our clearance team.'}`,
    es: `¡Hola! Con respecto a su consulta: nuestra red logística 24/7 supervisa activamente todas las expediciones. ${trackingNumber ? `Para la guía #${trackingNumber}, todos los puntos de control están verificados en nuestro centro de despacho.` : 'Por favor proporcione su número de guía o contacte con nuestro equipo de aduanas.'}`,
    pt: `Olá! Relativamente ao seu pedido: a nossa rede de logística 24/7 está a monitorizar ativamente todas as encomendas. ${trackingNumber ? `Para a carta de porte #${trackingNumber}, todos os marcos estão verificados no nosso centro de expedição.` : 'Por favor forneça o seu número de rastreio ou contacte a nossa equipa alfandegária.'}`,
    'pt-BR': `Olá! Em relação à sua dúvida: nossa rede logística 24/7 está monitorando ativamente todas as remessas. ${trackingNumber ? `Para o rastreamento #${trackingNumber}, todas as etapas estão verificadas na central de despacho.` : 'Por favor, informe seu código de rastreamento ou fale com a nossa equipe de suporte.'}`,
    fr: `Bonjour ! Concernant votre demande : notre réseau logistique 24/7 surveille activement toutes les expéditions. ${trackingNumber ? `Pour le bordereau #${trackingNumber}, toutes les étapes sont vérifiées dans notre centre de dispatching.` : 'Veuillez renseigner votre numéro de lettre de voiture ou contacter nos agents douaniers.'}`,
    de: `Guten Tag! Bezüglich Ihrer Anfrage: Unser 24/7-Logistiknetzwerk überwacht alle Sendungen aktiv. ${trackingNumber ? `Für den Frachtbrief #${trackingNumber} sind alle Meilensteine verifiziert.` : 'Bitte geben Sie Ihre Frachtbriefnummer an oder kontaktieren Sie unser Support-Team.'}`,
    it: `Salve! Riguardo alla sua richiesta: la nostra rete logistica 24/7 monitora attivamente tutte le spedizioni. ${trackingNumber ? `Per la lettera di vettura #${trackingNumber}, tutti i punti di controllo sono verificati nel nostro centro di smistamento.` : 'La preghiamo di inserire il codice di tracciamento o di contattare i nostri operatori.'}`,
    nl: `Hallo! Met betrekking tot uw vraag: ons 24/7 logistieke netwerk volgt alle zendingen actief. ${trackingNumber ? `Voor vrachtbrief #${trackingNumber} zijn alle controlepunten geverifieerd.` : 'Voer uw trackingnummer in of neem contact op met onze douanebeambten.'}`,
    ar: `مرحباً بك! بخصوص استفسارك: تعمل شبكتنا اللوجستية على مدار الساعة لرصد كافة الشحنات بدقة. ${trackingNumber ? `بالنسبة للبوليصة رقم #${trackingNumber}، تم التحقق من جميع مراحل التتبع رسمياً.` : 'يرجى تزويدنا برقم التتبع أو التواصل مع فريق التخليص الجمركي.'}`,
    zh: `您好！关于您的咨询：Global eXpress 24/7全球物流网络正在实时监控所有在途货物。${trackingNumber ? `针对运单 #${trackingNumber}，所有航段信息均已在中央调度库中核实。` : '请提供您的航空运单号或联系我们的清关专员协助办理。'}`,
    ja: `こんにちは！お問い合わせいただきありがとうございます。弊社の24時間365日ロジスティクスネットワークが全てのお荷物を厳重に監視しております。${trackingNumber ? `運送状番号 #${trackingNumber} の進捗状況は中央管制センターにて正常に確認されています。` : '追跡番号をご入力いただくか、通关窓口までお問い合わせください。'}`,
    ko: `안녕하세요! 문의해 주셔서 감사합니다. Global eXpress 24/7 물류 관제 센터에서 모든 화물을 실시간으로 모니터링하고 있습니다. ${trackingNumber ? `운송장번호 #${trackingNumber}의 모든 경유 기록은 중앙 시스템에서 안전하게 검증되었습니다.` : '운송장 번호를 입력하시거나 통관 지원팀으로 문의해 주시기 바랍니다.'}`,
    ru: `Здравствуйте! По вашему запросу: наша круглосуточная логистическая сеть 24/7 активно отслеживает все отправления. ${trackingNumber ? `По накладной #${trackingNumber} все контрольные точки подтверждены в центральной диспетчерской.` : 'Пожалуйста, укажите номер накладной или свяжитесь с таможенным офицером.'}`,
    hi: `नमस्ते! आपकी पूछताछ के संबंध में: हमारा 24/7 लॉजिस्टिक्स नेटवर्क सभी शिपमेंट की सक्रिय निगरानी कर रहा है। ${trackingNumber ? `वे-बिल #${trackingNumber} के लिए सभी पड़ावों का सत्यापन किया जा चुका है।` : 'कृपया अपना ट्रैकिंग नंबर दर्ज करें या कस्टम्स सहायता टीम से संपर्क करें।'}`,
    km: `សួស្តី! ទាក់ទងនឹងការសាកសួររបស់អ្នក: បណ្តាញភស្តុភារ 24/7 របស់យើងកំពុងតាមដានយ៉ាងសកម្មនូវរាល់ទំនិញទាំងអស់។ ${trackingNumber ? `សម្រាប់ប័ណ្ណដឹកជញ្ជូន #${trackingNumber} រាល់ដំណាក់កាលត្រូវបានផ្ទៀងផ្ទាត់នៅក្នុងប្រព័ន្ធ។` : 'សូមផ្តល់លេខតាមដានរបស់អ្នក ឬទាក់ទងមកកាន់ផ្នែកគយរបស់យើង។'}`,
    id: `Halo! Mengenai pertanyaan Anda: jaringan logistik 24/7 kami aktif memantau seluruh pengiriman. ${trackingNumber ? `Untuk resi #${trackingNumber}, seluruh tahapan telah diverifikasi di pusat pengiriman.` : 'Silakan masukkan nomor resi Anda atau hubungi petugas kami.'}`,
    th: `สวัสดีครับ/ค่ะ! เกี่ยวกับข้อซักถามของคุณ: เครือข่ายโลจิสติกส์ตลอด 24 ชั่วโมงของเรากำลังติดตามพัสดุทั้งหมดอย่างใกล้ชิด ${trackingNumber ? `สำหรับใบตราส่งสินค้าเลขที่ #${trackingNumber} ทุกขั้นตอนได้รับการตรวจสอบเรียบร้อยแล้ว` : 'โปรดระบุหมายเลขพัสดุของคุณหรือติดต่อเจ้าหน้าที่ฝ่ายบริการลูกค้า'}`,
  };

  res.json({
    success: true,
    reply: fallbackGreetings[language] || fallbackGreetings['en']
  });
});

// Serve frontend in production or through Vite in development
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    try {
      const { createServer: createViteServer } = await import('vite');
      const vite = await createViteServer({
        server: { middlewareMode: true },
        appType: 'spa',
      });
      app.use(vite.middlewares);
    } catch (e) {
      console.warn("Vite middleware load fallback:", e);
      app.use(express.static(path.join(__dirname, 'dist')));
      app.get('*', (_req, res) => {
        res.sendFile(path.join(__dirname, 'dist', 'index.html'));
      });
    }
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Global eXpress Delivery Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
