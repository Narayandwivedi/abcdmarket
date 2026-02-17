const mockProducts = [
  // Graphics Cards
  {
    seoTitle: "NVIDIA GeForce RTX 3050 8GB GDDR6 Gaming Graphics Card",
    description: "Budget-friendly gaming graphics card with ray tracing and DLSS support. Perfect for 1080p gaming with excellent performance in popular titles.",
    category: "pc-parts",
    subCategory: "graphics-card",
    brand: "NVIDIA",
    model: "RTX 3050",
    sku: "GPU-RTX3050-8GB",
    price: 24999,
    originalPrice: 29999,
    stockQuantity: 50,
    images: [
      "https://images.unsplash.com/photo-1587202372634-32705e3bf49c?w=800&q=80",
      "https://images.unsplash.com/photo-1591488320449-011701bb6704?w=800&q=80"
    ],
    specifications: new Map([
      ["Memory", "8GB GDDR6"],
      ["Memory Interface", "128-bit"],
      ["Base Clock", "1552 MHz"],
      ["Boost Clock", "1777 MHz"],
      ["CUDA Cores", "2560"],
      ["TDP", "130W"],
      ["Outputs", "HDMI 2.1, DisplayPort 1.4a"]
    ]),
    features: [
      "Ray Tracing Technology",
      "NVIDIA DLSS",
      "PCIe 4.0 Support",
      "NVIDIA Reflex Low Latency",
      "Game Ready Drivers"
    ],
    warranty: 3,
    serviceOptions: {
      freeDelivery: true,
      replacementDays: 7,
      cashOnDelivery: true,
      warrantyService: true,
      freeInstallation: false
    }
  },
  {
    seoTitle: "AMD Radeon RX 6700 XT 12GB GDDR6 High Performance Gaming Graphics Card",
    description: "Powerful AMD graphics card for 1440p gaming with stunning visuals and AMD FidelityFX technology.",
    category: "pc-parts",
    subCategory: "graphics-card",
    brand: "AMD",
    model: "RX 6700 XT",
    sku: "GPU-RX6700XT-12GB",
    price: 39999,
    originalPrice: 49999,
    stockQuantity: 30,
    images: [
      "https://images.unsplash.com/photo-1591488320449-011701bb6704?w=800&q=80"
    ],
    specifications: new Map([
      ["Memory", "12GB GDDR6"],
      ["Memory Interface", "192-bit"],
      ["Game Clock", "2424 MHz"],
      ["Boost Clock", "2581 MHz"],
      ["Stream Processors", "2560"],
      ["TDP", "230W"],
      ["Outputs", "HDMI 2.1, DisplayPort 1.4"]
    ]),
    features: [
      "AMD RDNA 2 Architecture",
      "Ray Tracing Support",
      "AMD FidelityFX Super Resolution",
      "AMD Infinity Cache",
      "Smart Access Memory"
    ],
    warranty: 2,
    serviceOptions: {
      freeDelivery: true,
      replacementDays: 7,
      cashOnDelivery: true,
      warrantyService: true,
      freeInstallation: false
    }
  },

  // CPUs / Processors
  {
    seoTitle: "Intel Core i5-12400F 12th Gen 6-Core Desktop Processor (2.5GHz Base, 4.4GHz Turbo)",
    description: "Excellent mid-range processor for gaming and productivity with 6 cores and 12 threads. Great price-to-performance ratio.",
    category: "pc-parts",
    subCategory: "processors",
    brand: "Intel",
    model: "Core i5-12400F",
    sku: "CPU-I5-12400F",
    price: 13999,
    originalPrice: 16999,
    stockQuantity: 100,
    images: [
      "https://images.unsplash.com/photo-1555617981-dac3880eac6e?w=800&q=80"
    ],
    specifications: new Map([
      ["Cores", "6"],
      ["Threads", "12"],
      ["Base Clock", "2.5 GHz"],
      ["Max Turbo Clock", "4.4 GHz"],
      ["Cache", "18MB Intel Smart Cache"],
      ["TDP", "65W"],
      ["Socket", "LGA 1700"],
      ["Integrated Graphics", "No"]
    ]),
    features: [
      "12th Gen Alder Lake Architecture",
      "DDR4 and DDR5 Support",
      "PCIe 5.0 and 4.0 Support",
      "Intel Thread Director",
      "Unlocked for Overclocking"
    ],
    warranty: 3,
    serviceOptions: {
      freeDelivery: true,
      replacementDays: 7,
      cashOnDelivery: true,
      warrantyService: true,
      freeInstallation: false
    }
  },
  {
    seoTitle: "AMD Ryzen 5 5600X 6-Core 12-Thread Desktop Processor (3.7GHz Base, 4.6GHz Boost)",
    description: "Popular AMD Ryzen processor delivering exceptional gaming and multitasking performance with Zen 3 architecture.",
    category: "pc-parts",
    subCategory: "processors",
    brand: "AMD",
    model: "Ryzen 5 5600X",
    sku: "CPU-R5-5600X",
    price: 15999,
    originalPrice: 19999,
    stockQuantity: 75,
    images: [
      "https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=800&q=80"
    ],
    specifications: new Map([
      ["Cores", "6"],
      ["Threads", "12"],
      ["Base Clock", "3.7 GHz"],
      ["Max Boost Clock", "4.6 GHz"],
      ["Cache", "35MB (L2+L3)"],
      ["TDP", "65W"],
      ["Socket", "AM4"],
      ["Integrated Graphics", "No"]
    ]),
    features: [
      "AMD Zen 3 Architecture",
      "PCIe 4.0 Support",
      "Wraith Stealth Cooler Included",
      "Precision Boost 2",
      "AMD StoreMI Technology"
    ],
    warranty: 3,
    serviceOptions: {
      freeDelivery: true,
      replacementDays: 7,
      cashOnDelivery: true,
      warrantyService: true,
      freeInstallation: false
    }
  },
  {
    seoTitle: "Intel Core i9-13900K 13th Gen 24-Core Desktop Processor (3.0GHz Base, 5.8GHz Turbo)",
    description: "Flagship Intel processor with 24 cores (8P+16E) for extreme gaming and content creation performance.",
    category: "pc-parts",
    subCategory: "processors",
    brand: "Intel",
    model: "Core i9-13900K",
    sku: "CPU-I9-13900K",
    price: 54999,
    originalPrice: 64999,
    stockQuantity: 25,
    images: [
      "https://images.unsplash.com/photo-1555617981-dac3880eac6e?w=800&q=80"
    ],
    specifications: new Map([
      ["Cores", "24 (8P+16E)"],
      ["Threads", "32"],
      ["P-Core Base Clock", "3.0 GHz"],
      ["P-Core Max Turbo", "5.8 GHz"],
      ["E-Core Base Clock", "2.2 GHz"],
      ["Cache", "36MB Intel Smart Cache"],
      ["TDP", "125W (Base) / 253W (Turbo)"],
      ["Socket", "LGA 1700"]
    ]),
    features: [
      "Raptor Lake Architecture",
      "DDR5 Support",
      "PCIe 5.0 Support",
      "Intel Thermal Velocity Boost",
      "Unlocked Multiplier"
    ],
    warranty: 3,
    serviceOptions: {
      freeDelivery: true,
      replacementDays: 10,
      cashOnDelivery: true,
      warrantyService: true,
      freeInstallation: false
    }
  },

  // Motherboards
  {
    seoTitle: "ASUS TUF Gaming B550-PLUS ATX Motherboard (AMD AM4 Socket, PCIe 4.0, WiFi)",
    description: "Durable and affordable gaming motherboard with robust power delivery and comprehensive cooling for AMD Ryzen processors.",
    category: "pc-parts",
    subCategory: "motherboards",
    brand: "ASUS",
    model: "TUF Gaming B550-PLUS",
    sku: "MB-ASUS-B550-PLUS",
    price: 12999,
    originalPrice: 15999,
    stockQuantity: 40,
    images: [
      "https://images.unsplash.com/photo-1591488320449-011701bb6704?w=800&q=80"
    ],
    specifications: new Map([
      ["Socket", "AMD AM4"],
      ["Chipset", "AMD B550"],
      ["Form Factor", "ATX"],
      ["Memory Support", "DDR4 up to 5100MHz (OC), 4 x DIMM, Max 128GB"],
      ["Expansion Slots", "1 x PCIe 4.0 x16, 1 x PCIe 3.0 x16, 3 x PCIe 3.0 x1"],
      ["Storage", "2 x M.2, 6 x SATA 6Gb/s"],
      ["Networking", "Realtek 2.5Gb Ethernet"],
      ["Audio", "Realtek ALC S1200A 8-Channel HD Audio"]
    ]),
    features: [
      "PCIe 4.0 Support",
      "Military-Grade Components",
      "Comprehensive Cooling",
      "Aura Sync RGB Lighting",
      "USB 3.2 Gen 2 Type-C"
    ],
    warranty: 3,
    serviceOptions: {
      freeDelivery: true,
      replacementDays: 7,
      cashOnDelivery: true,
      warrantyService: true,
      freeInstallation: false
    }
  },
  {
    seoTitle: "MSI MAG B660 TOMAHAWK WiFi DDR4 Gaming Motherboard (Intel LGA 1700, PCIe 4.0)",
    description: "Feature-rich motherboard for 12th Gen Intel processors with premium connectivity and excellent VRM design.",
    category: "pc-parts",
    subCategory: "motherboards",
    brand: "MSI",
    model: "MAG B660 TOMAHAWK WiFi",
    sku: "MB-MSI-B660-TH",
    price: 17999,
    originalPrice: 21999,
    stockQuantity: 35,
    images: [
      "https://images.unsplash.com/photo-1587202372634-32705e3bf49c?w=800&q=80"
    ],
    specifications: new Map([
      ["Socket", "Intel LGA 1700"],
      ["Chipset", "Intel B660"],
      ["Form Factor", "ATX"],
      ["Memory Support", "DDR4 up to 5333MHz (OC), 4 x DIMM, Max 128GB"],
      ["Expansion Slots", "1 x PCIe 4.0 x16, 2 x PCIe 3.0 x16, 2 x PCIe 3.0 x1"],
      ["Storage", "4 x M.2, 6 x SATA 6Gb/s"],
      ["Networking", "WiFi 6E, 2.5Gb LAN"],
      ["Audio", "Realtek ALC4080 Audio Codec"]
    ]),
    features: [
      "WiFi 6E Built-in",
      "Lightning Gen 4 M.2",
      "Core Boost Technology",
      "Extended Heatsink Design",
      "Mystic Light RGB"
    ],
    warranty: 3,
    serviceOptions: {
      freeDelivery: true,
      replacementDays: 7,
      cashOnDelivery: true,
      warrantyService: true,
      freeInstallation: false
    }
  },

  // RAM / Memory
  {
    seoTitle: "Corsair Vengeance LPX 16GB (2x8GB) DDR4 3200MHz Desktop RAM",
    description: "High-performance DDR4 memory designed for overclocking with low-profile heat spreader for wide compatibility.",
    category: "pc-parts",
    subCategory: "memory",
    brand: "Corsair",
    model: "Vengeance LPX",
    sku: "RAM-CORS-16GB-3200",
    price: 4999,
    originalPrice: 6499,
    stockQuantity: 150,
    images: [
      "https://images.unsplash.com/photo-1541140532154-b024d705b90a?w=800&q=80"
    ],
    specifications: new Map([
      ["Capacity", "16GB (2 x 8GB)"],
      ["Speed", "3200MHz"],
      ["Type", "DDR4"],
      ["CAS Latency", "16"],
      ["Voltage", "1.35V"],
      ["Form Factor", "DIMM"],
      ["Heat Spreader", "Aluminum"]
    ]),
    features: [
      "XMP 2.0 Support",
      "Low-Profile Design",
      "High-Performance PCB",
      "Tested for Compatibility",
      "Lifetime Warranty"
    ],
    warranty: 10,
    serviceOptions: {
      freeDelivery: true,
      replacementDays: 10,
      cashOnDelivery: true,
      warrantyService: true,
      freeInstallation: false
    }
  },
  {
    seoTitle: "G.Skill Trident Z RGB 32GB (2x16GB) DDR4 3600MHz Desktop RAM with RGB Lighting",
    description: "Premium RGB memory modules with exceptional performance and stunning lighting effects for gaming builds.",
    category: "pc-parts",
    subCategory: "memory",
    brand: "G.Skill",
    model: "Trident Z RGB",
    sku: "RAM-GSKL-32GB-3600",
    price: 11999,
    originalPrice: 14999,
    stockQuantity: 80,
    images: [
      "https://images.unsplash.com/photo-1562976540-1502c2145186?w=800&q=80"
    ],
    specifications: new Map([
      ["Capacity", "32GB (2 x 16GB)"],
      ["Speed", "3600MHz"],
      ["Type", "DDR4"],
      ["CAS Latency", "18"],
      ["Voltage", "1.35V"],
      ["Form Factor", "DIMM"],
      ["RGB", "Yes - Full RGB Lighting"]
    ]),
    features: [
      "Customizable RGB Lighting",
      "Intel XMP 2.0 Support",
      "Hand-Sorted ICs",
      "Optimized PCB Design",
      "Limited Lifetime Warranty"
    ],
    warranty: 10,
    serviceOptions: {
      freeDelivery: true,
      replacementDays: 10,
      cashOnDelivery: true,
      warrantyService: true,
      freeInstallation: false
    }
  },

  // Storage / SSDs
  {
    seoTitle: "Samsung 980 PRO 1TB NVMe M.2 SSD (PCIe Gen 4.0, 7000MB/s Read)",
    description: "Lightning-fast PCIe 4.0 NVMe SSD with exceptional performance for gaming, content creation, and heavy workloads.",
    category: "pc-parts",
    subCategory: "storage",
    brand: "Samsung",
    model: "980 PRO",
    sku: "SSD-SAM-980PRO-1TB",
    price: 9999,
    originalPrice: 12999,
    stockQuantity: 120,
    images: [
      "https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=800&q=80"
    ],
    specifications: new Map([
      ["Capacity", "1TB"],
      ["Interface", "PCIe Gen 4.0 x4, NVMe 1.3c"],
      ["Form Factor", "M.2 2280"],
      ["Sequential Read", "7000 MB/s"],
      ["Sequential Write", "5000 MB/s"],
      ["Random Read", "1,000K IOPS"],
      ["Random Write", "1,000K IOPS"],
      ["TBW", "600 TB"]
    ]),
    features: [
      "PCIe 4.0 Speed",
      "Samsung Magician Software",
      "Dynamic Thermal Guard",
      "AES 256-bit Encryption",
      "5-Year Limited Warranty"
    ],
    warranty: 5,
    serviceOptions: {
      freeDelivery: true,
      replacementDays: 10,
      cashOnDelivery: true,
      warrantyService: true,
      freeInstallation: false
    }
  },
  {
    seoTitle: "WD Blue SN570 500GB NVMe M.2 Internal SSD (PCIe Gen 3.0, 3500MB/s)",
    description: "Reliable and affordable NVMe SSD for everyday computing with solid performance and WD reliability.",
    category: "pc-parts",
    subCategory: "storage",
    brand: "Western Digital",
    model: "Blue SN570",
    sku: "SSD-WD-SN570-500GB",
    price: 3499,
    originalPrice: 4499,
    stockQuantity: 200,
    images: [
      "https://images.unsplash.com/photo-1531492746076-161ca9bcad58?w=800&q=80"
    ],
    specifications: new Map([
      ["Capacity", "500GB"],
      ["Interface", "PCIe Gen 3.0 x4, NVMe"],
      ["Form Factor", "M.2 2280"],
      ["Sequential Read", "3500 MB/s"],
      ["Sequential Write", "2300 MB/s"],
      ["Random Read", "240K IOPS"],
      ["Random Write", "470K IOPS"],
      ["TBW", "300 TB"]
    ]),
    features: [
      "WD Dashboard Software",
      "Low Power Consumption",
      "Shock Resistant",
      "No Moving Parts",
      "5-Year Limited Warranty"
    ],
    warranty: 5,
    serviceOptions: {
      freeDelivery: true,
      replacementDays: 10,
      cashOnDelivery: true,
      warrantyService: true,
      freeInstallation: false
    }
  },

  // Monitors
  {
    seoTitle: "LG UltraGear 24GN600 24-inch Full HD 144Hz Gaming Monitor (IPS, 1ms, FreeSync)",
    description: "Fast and responsive gaming monitor with vibrant IPS panel and 144Hz refresh rate for smooth gameplay.",
    category: "pc-parts",
    subCategory: "monitors",
    brand: "LG",
    model: "UltraGear 24GN600",
    sku: "MON-LG-24GN600",
    price: 13999,
    originalPrice: 17999,
    stockQuantity: 45,
    images: [
      "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800&q=80"
    ],
    specifications: new Map([
      ["Screen Size", "24 inches"],
      ["Resolution", "1920 x 1080 (Full HD)"],
      ["Panel Type", "IPS"],
      ["Refresh Rate", "144Hz"],
      ["Response Time", "1ms (MBR)"],
      ["Brightness", "300 cd/m²"],
      ["Contrast Ratio", "1000:1"],
      ["Connectivity", "HDMI, DisplayPort"]
    ]),
    features: [
      "AMD FreeSync Premium",
      "HDR10 Support",
      "Black Stabilizer",
      "Dynamic Action Sync",
      "3-Side Virtually Borderless"
    ],
    warranty: 3,
    serviceOptions: {
      freeDelivery: true,
      replacementDays: 7,
      cashOnDelivery: true,
      warrantyService: true,
      freeInstallation: false
    }
  },
  {
    seoTitle: "ASUS TUF Gaming VG27AQ 27-inch WQHD 165Hz Gaming Monitor (IPS, G-SYNC Compatible)",
    description: "Immersive 1440p gaming monitor with high refresh rate and excellent color accuracy for competitive gaming.",
    category: "pc-parts",
    subCategory: "monitors",
    brand: "ASUS",
    model: "TUF VG27AQ",
    sku: "MON-ASUS-VG27AQ",
    price: 26999,
    originalPrice: 32999,
    stockQuantity: 30,
    images: [
      "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=800&q=80"
    ],
    specifications: new Map([
      ["Screen Size", "27 inches"],
      ["Resolution", "2560 x 1440 (WQHD)"],
      ["Panel Type", "IPS"],
      ["Refresh Rate", "165Hz"],
      ["Response Time", "1ms (MPRT)"],
      ["Brightness", "350 cd/m²"],
      ["Contrast Ratio", "1000:1"],
      ["Connectivity", "HDMI 2.0, DisplayPort 1.2"]
    ]),
    features: [
      "G-SYNC Compatible",
      "HDR10 Support",
      "ELMB Technology",
      "Shadow Boost",
      "Ergonomic Stand"
    ],
    warranty: 3,
    serviceOptions: {
      freeDelivery: true,
      replacementDays: 7,
      cashOnDelivery: true,
      warrantyService: true,
      freeInstallation: false
    }
  }
];

module.exports = mockProducts;
