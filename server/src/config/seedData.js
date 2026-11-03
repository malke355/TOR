export const initialUsers = [
  {
    id: "usr-01",
    name: "Ato Gemechu Bekele",
    email: "admin@investoromia.gov.et",
    password: "admin123", // Will be hashed or checked
    role: "Administrator",
    department: "Executive Bureau Directorate"
  },
  {
    id: "usr-02",
    name: "Chaltu Tolasa",
    email: "editor@investoromia.gov.et",
    password: "editor123",
    role: "Editor",
    department: "Trade & Investment Promotion"
  }
];

export const initialOpportunities = [
  {
    id: "opp-01",
    title: "Batu Agro-Industrial Processing Hub & Cold Chain Park",
    sector: "Agro-Processing",
    location: "Batu (Ziway), East Shewa Zone",
    investmentType: "Joint Venture / Public-Private Partnership (PPP)",
    requiredCapital: "1.85 Billion ETB",
    landAvailable: "45 Hectares allocated with utility access",
    status: "Published",
    imageUrl: "https://images.unsplash.com/photo-1595246140625-573b715d11dc?auto=format&fit=crop&w=1200&q=80",
    summary: "Large-scale integrated horticulture, floriculture processing, and cold-storage logistics facility near Lake Ziway export corridor.",
    description: "The Batu Agro-Processing Hub is positioned directly on the Ethio-Djibouti expressway corridor. It provides integrated washing, packaging, cold storage, and export logistics for high-value fruits, vegetables, and floriculture products.",
    incentives: [
      "100% exemption from customs duties on capital goods",
      "Up to 6 years income tax holiday",
      "Subsidized lease rates in designated agro-industrial cluster",
      "Streamlined customs clearance via Mojo Dry Port corridor"
    ],
    contactPerson: "Directorate of Agribusiness Investment, Phone: +251 11 551 2233",
    featured: true,
    createdAt: new Date().toISOString()
  },
  {
    id: "opp-02",
    title: "Dukem Eco-Industrial Garment & Technical Textile Park",
    sector: "Manufacturing & Textiles",
    location: "Dukem, Special Zone Surrounding Finfine",
    investmentType: "100% Foreign Direct Investment (FDI) or JV",
    requiredCapital: "3.10 Billion ETB",
    landAvailable: "60 Hectares industrial grade land ready",
    status: "Published",
    imageUrl: "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&w=1200&q=80",
    summary: "Export-oriented garment and spinning plant utilizing regional cotton production, with zero-liquid discharge water treatment.",
    description: "Situated in the industrial heartland of Dukem, minutes away from the Addis Ababa-Djibouti railway depot. The project is pre-cleared with electrical substation connectivity and industrial waste treatment infrastructure.",
    incentives: [
      "Duty-free import of specialized textile machinery",
      "Access to preferential export tariffs under regional trade agreements",
      "Dedicated one-stop licensing and work permit assistance"
    ],
    contactPerson: "Directorate of Industrial Promotion, Phone: +251 11 552 4455",
    featured: true,
    createdAt: new Date().toISOString()
  },
  {
    id: "opp-03",
    title: "Jimma Specialty Coffee Value-Addition & Roasting Cluster",
    sector: "Agriculture & Agro-Processing",
    location: "Jimma Zone & Limmu Kossa",
    investmentType: "Private / Cooperative Partnership",
    requiredCapital: "1.05 Billion ETB",
    landAvailable: "20 Hectares with water and power connections",
    status: "Published",
    imageUrl: "https://images.unsplash.com/photo-1447933601403-0c6688de566e?auto=format&fit=crop&w=1200&q=80",
    summary: "Modern wet-processing, grading, roasting, and eco-packaging cluster directly sourcing from heirloom Arabica coffee cooperatives.",
    description: "Jimma is globally acclaimed as the birthplace of Arabica coffee. This opportunity provides land and cooperative linkages for private roasters and extract processors aiming at high-margin direct specialty exports to EU, North America, and Middle East markets.",
    incentives: [
      "Guaranteed raw bean supply contracts through regional cooperative unions",
      "Full duty-free capital equipment import",
      "Foreign exchange retention incentive account for coffee exporters"
    ],
    contactPerson: "Oromia Coffee & Spices Export Desk, Phone: +251 11 553 7788",
    featured: true,
    createdAt: new Date().toISOString()
  },
  {
    id: "opp-04",
    title: "Adama Solar Power Component Manufacturing & Assembly",
    sector: "Renewable Energy & Technology",
    location: "Adama Free Trade & Industrial Zone",
    investmentType: "Joint Venture",
    requiredCapital: "2.25 Billion ETB",
    landAvailable: "15 Hectares within Adama Special Economic Zone",
    status: "Published",
    imageUrl: "https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&w=1200&q=80",
    summary: "Photovoltaic panel assembly, inverter manufacturing, and rural off-grid solar equipment plant serving East Africa.",
    description: "With Oromia's rapid electrification push and huge solar irradiance, this manufacturing plant will produce solar home systems, commercial solar modules, and smart agricultural pumps.",
    incentives: [
      "Tax holiday for tech manufacturing up to 7 years",
      "Strategic national priority supplier status",
      "Free Trade Zone tax perks on exported components"
    ],
    contactPerson: "Energy & Infrastructure Directorate, Phone: +251 11 554 9900",
    featured: false,
    createdAt: new Date().toISOString()
  },
  {
    id: "opp-05",
    title: "Borena Modern Livestock Abattoir & Meat Processing Facility",
    sector: "Livestock & Meat",
    location: "Yabello, Borena Zone",
    investmentType: "Private Commercial Investment",
    requiredCapital: "1.50 Billion ETB",
    landAvailable: "50 Hectares with quarantine facilities nearby",
    status: "Published",
    imageUrl: "https://images.unsplash.com/photo-1500595046743-cd271d694d30?auto=format&fit=crop&w=1200&q=80",
    summary: "Halal-certified meat processing, cold chain, and byproduct extraction plant for high-volume exports to the Gulf states.",
    description: "Borena holds one of Africa's largest and most organic pastoral cattle and goat populations. The project connects directly with the newly completed Hawassa-Moyale international highway.",
    incentives: [
      "Customs fast-track for refrigerated transport fleets",
      "Exclusive quarantine station partnership",
      "Zero export tax"
    ],
    contactPerson: "Livestock Development Directorate, Phone: +251 11 556 1122",
    featured: false,
    createdAt: new Date().toISOString()
  }
];

export const initialTradeProducts = [
  {
    id: "prod-01",
    name: "Single-Origin Specialty Arabica Coffee",
    category: "Agriculture & Beverage",
    originZones: "Jimma, Yirgacheffe/Gedeo border, Guji, Hararghe, Limmu",
    exportSpecs: "Grade 1 & Grade 2 Washed/Natural, Specialty Cup Score 85+, 60kg Jute bags with GrainPro liners.",
    description: "Oromia accounts for over 65% of Ethiopia's total coffee production. Renowned globally for complex flavor profiles ranging from fruity jasmine floral notes to deep chocolate wine undertones.",
    seasonality: "Harvest: October - January | Peak Shipping: February - August",
    imageUrl: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "prod-02",
    name: "Sesame Seeds & Niger Seed (Nug)",
    category: "Oilseeds & Pulses",
    originZones: "East Wollega, West Wollega, Ilu Aba Bor",
    exportSpecs: "Purity 99% min, Admixture 1% max, Moisture 6% max, Oil content 50% min.",
    description: "High oil content and sweet aroma make Oromia sesame seeds the preferred choice for tahini, confectionery, and gourmet oil extraction worldwide.",
    seasonality: "Harvest: November - January | Peak Shipping: Year-round",
    imageUrl: "https://images.unsplash.com/photo-1508746829417-e6f548d8d6ed?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "prod-03",
    name: "Organic Red Kidney Beans & Chickpeas",
    category: "Pulses & Legumes",
    originZones: "East Shewa, Arsi, West Shewa",
    exportSpecs: "Machine-cleaned, Moisture 12% max, Damaged/Split 2% max, 25kg/50kg PP bags.",
    description: "High protein pulses grown organically in volcanic soils of the Rift Valley, heavily demanded in Indian, European, and Middle Eastern markets.",
    seasonality: "Harvest: September - December",
    imageUrl: "https://images.unsplash.com/photo-1551462147-37885acc36f1?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "prod-04",
    name: "Cut Flowers (Roses, Hypericum, Gypsophila)",
    category: "Floriculture & Horticulture",
    originZones: "Bishoftu, Batu, Holota, Sebeta",
    exportSpecs: "Stem length 40cm-80cm, Temperature-controlled air cargo from Bole International Airport.",
    description: "Oromia's temperate highlands and abundant lake water provide an ideal year-round climate for premium long-stem cut roses exported daily to Amsterdam and worldwide.",
    seasonality: "Year-Round continuous harvest",
    imageUrl: "https://images.unsplash.com/photo-1561181286-d3fee7d55364?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "prod-05",
    name: "Halal Chilled Mutton and Beef",
    category: "Livestock & Meat",
    originZones: "Borena, Guji, Bale, East Hararghe",
    exportSpecs: "Halal certified, chilled carcasses (8-14kg sheep/goat), strictly vaccinated herd traceability.",
    description: "Pastoral, grass-fed organic livestock processed in modern international-standard abattoirs with daily air cargo routes to Riyadh, Dubai, and Doha.",
    seasonality: "Year-round with peak Eid demand",
    imageUrl: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80"
  }
];

export const initialServices = [
  {
    id: "srv-01",
    title: "New Investment Permit Issuance",
    category: "Investment Licensing",
    description: "Full registration and permit issuance for domestic, joint venture, and foreign commercial investors.",
    eligibility: "Any domestic entrepreneur or foreign enterprise with verified minimum capital threshold.",
    requirements: "Valid passport/ID, draft business plan, notarized articles of association, tax identification number (TIN).",
    procedure: "1. Submit online inquiry/application -> 2. Document verification by Investment Desk -> 3. Permit approval within 48 hours.",
    processingTime: "2 - 3 Working Days",
    fees: "According to Regional Revenue Directive",
    responsibleOffice: "Directorate of Investment Facilitation & Licensing",
    isOnline: true,
    portalUrl: "https://www.ebca.gov.et"
  },
  {
    id: "srv-02",
    title: "Industrial & Agricultural Land Allocation Facilitation",
    category: "Land & Infrastructure",
    description: "Identification and facilitation of state-backed leased land for manufacturing, agriculture, and tourism.",
    eligibility: "Approved investment permit holders with submitted feasible project proposal.",
    requirements: "Approved Investment Permit, Detailed Environmental & Feasibility Study, Land Bank requisition form.",
    procedure: "1. Joint site inspection with Bureau engineers -> 2. Land Bank committee evaluation -> 3. Lease agreement signing.",
    processingTime: "10 - 15 Working Days",
    fees: "Regulated regional lease rates based on tier",
    responsibleOffice: "Land Bank & Spatial Infrastructure Directorate",
    isOnline: false,
    portalUrl: ""
  },
  {
    id: "srv-03",
    title: "Duty-Free Capital Goods Exemption Endorsement",
    category: "Fiscal Incentives",
    description: "Endorsement letters issued to the Ethiopian Customs Commission for 100% duty-free machinery and capital goods import.",
    eligibility: "Investors in manufacturing, agriculture, mining, or priority commercial services.",
    requirements: "Bill of Lading, Proforma invoices of machinery, valid investment license, approved capital asset schedule.",
    procedure: "1. Upload machinery invoices -> 2. Technical inspection -> 3. Electronic endorsement dispatched to Customs.",
    processingTime: "3 Working Days",
    fees: "Free of charge (Government incentive)",
    responsibleOffice: "Incentives & Monitoring Directorate",
    isOnline: true,
    portalUrl: "https://www.customs.gov.et"
  },
  {
    id: "srv-04",
    title: "Export Trade Business License & Renewal",
    category: "Trade Regulation",
    description: "Commercial registration, export license issuance, and annual renewal for trading businesses operating in Oromia.",
    eligibility: "Registered sole proprietors, PLC companies, and agricultural cooperative unions.",
    requirements: "Renewed commercial registration, warehouse inspection certificate, tax clearance from Oromia Revenue Authority.",
    procedure: "1. Apply via Business Portal -> 2. Verification of tax clearance -> 3. Digital license issuance.",
    processingTime: "1 Working Day",
    fees: "Standard administrative service tariff",
    responsibleOffice: "Trade Registration & Licensing Directorate",
    isOnline: true,
    portalUrl: "https://etrade.gov.et"
  },
  {
    id: "srv-05",
    title: "Buyer-Seller Market Linkage & B2B Facilitation",
    category: "Market Support",
    description: "Direct matchmaking between regional producers (coffee, grain, livestock) and international buyers/importers.",
    eligibility: "Certified regional producers and accredited international procurement representatives.",
    requirements: "Product specification sheet, volume capacity certification, trade credentials.",
    procedure: "1. Register interest at Trade Desk -> 2. Matchmaking session arranged -> 3. Sample dispatch facilitation.",
    processingTime: "5 Working Days",
    fees: "Free institutional public service",
    responsibleOffice: "Trade Promotion & Market Development Directorate",
    isOnline: false,
    portalUrl: ""
  }
];

export const initialNews = [
  {
    id: "news-01",
    title: "Oromia Trade and Investment Bureau Formally Established Following Strategic Restructuring",
    category: "Institutional",
    summary: "The newly consolidated Bureau combines trade and investment mandates to accelerate industrialization, export diversification, and one-stop business facilitation across Oromia.",
    content: "Under the regional government's institutional modernization agenda, the former Oromia Investment and Industry Bureau and the Oromia Trade Bureau have merged into a unified powerhouse. The new Bureau provides investors and traders with single-window service delivery, eliminating red tape and ensuring rapid project execution.",
    imageUrl: "https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&w=1200&q=80",
    publishedAt: "2026-10-28",
    status: "Published"
  },
  {
    id: "news-02",
    title: "Bureau Signs 8.2 Billion ETB Investment Agreements for Modern Agro-Processing Clusters",
    category: "Investment",
    summary: "New private-public partnerships signed for modern dairy, avocado oil extraction, and honey processing facilities in Arsi and Jimma zones.",
    content: "During the quarterly regional economic forum held in Finfine, Bureau leadership signed agreements with five prominent international and domestic consortiums. The projects will create over 4,200 direct employment opportunities and anchor regional smallholder contract farming.",
    imageUrl: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=1200&q=80",
    publishedAt: "2026-10-15",
    status: "Published"
  },
  {
    id: "news-03",
    title: "Record Coffee Export Volumes Reported for First Quarter of 2026/27 Fiscal Year",
    category: "Trade",
    summary: "Oromia specialty coffee shipments reached historic highs, with European and Asian specialty roasters acquiring over 48,000 metric tons of Arabica beans.",
    content: "The Trade Promotion Directorate announced that streamlined transport protocols on the Ethio-Djibouti rail line and direct cooperative sales contributed to a 22% year-on-year increase in coffee export receipts.",
    imageUrl: "https://images.unsplash.com/photo-1447933601403-0c6688de566e?auto=format&fit=crop&w=1200&q=80",
    publishedAt: "2026-10-02",
    status: "Published"
  }
];

export const initialDocuments = [
  {
    id: "doc-01",
    title: "Oromia Comprehensive Investment Guide & Incentive Compendium 2026",
    category: "Investment Guide",
    fileType: "PDF",
    fileSize: "4.8 MB",
    refNumber: "OTIB/GUIDE/2026/01",
    publishedDate: "2026-10-01",
    downloadUrl: "#"
  },
  {
    id: "doc-02",
    title: "Regional Directive on Industrial Land Lease Rates & Incentives",
    category: "Directives & Laws",
    fileType: "PDF",
    fileSize: "2.1 MB",
    refNumber: "DIR-REG-144/2026",
    publishedDate: "2026-09-15",
    downloadUrl: "#"
  },
  {
    id: "doc-03",
    title: "Export Licensing Guidelines and Quality Verification Manual",
    category: "Trade Procedures",
    fileType: "PDF",
    fileSize: "3.4 MB",
    refNumber: "OTIB/TRD/MAN-03",
    publishedDate: "2026-08-20",
    downloadUrl: "#"
  },
  {
    id: "doc-04",
    title: "Investment Permit Application Form (Form OTIB-INV-01)",
    category: "Application Forms",
    fileType: "PDF",
    fileSize: "850 KB",
    refNumber: "FORM-INV-01",
    publishedDate: "2026-10-10",
    downloadUrl: "#"
  },
  {
    id: "doc-05",
    title: "Duty-Free Capital Goods Requisition & Clearance Form",
    category: "Application Forms",
    fileType: "PDF",
    fileSize: "720 KB",
    refNumber: "FORM-DUTY-02",
    publishedDate: "2026-10-10",
    downloadUrl: "#"
  }
];

export const initialMessages = [
  {
    id: "msg-01",
    name: "Dr. Marcus Vance",
    email: "m.vance@agro-agri.de",
    phone: "+49 170 334 9821",
    organization: "Bavaria Agro Export GmbH",
    subject: "Inquiry on Batu Agro-Processing Hub Lease Terms",
    message: "Greetings Bureau team. We represent a consortium of organic juice packagers looking to secure 5 hectares of land in the Batu cluster with cold storage access. We would like to request an official consultation with the investment desk.",
    status: "New",
    createdAt: new Date(Date.now() - 3600000 * 4).toISOString()
  },
  {
    id: "msg-02",
    name: "Sintayehu Kebede",
    email: "sintayehu@orocoffee.com",
    phone: "+251 911 234 567",
    organization: "Oromia Specialty Roasters Union",
    subject: "Application for B2B European Trade Fair Participation",
    message: "We would like to register our union delegates for the upcoming European Specialty Coffee Association trade mission sponsored by the Bureau.",
    status: "Read",
    createdAt: new Date(Date.now() - 3600000 * 28).toISOString()
  }
];
