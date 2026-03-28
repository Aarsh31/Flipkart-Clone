const { prisma } = require("../src/lib/prisma");
const { env } = require("../src/config/env");
const bcrypt = require("bcryptjs");

const categories = [
  { name: "Laptops", slug: "laptops", description: "Work, gaming, and student laptops" },
  { name: "Mobiles", slug: "mobiles", description: "Smartphones from top brands" },
  { name: "Fashion", slug: "fashion", description: "Casual and festive fashion picks" },
  { name: "Appliances", slug: "appliances", description: "Home appliances and daily-use electronics" },
  { name: "Accessories", slug: "accessories", description: "Smart gadgets and lifestyle accessories" },
];

const products = [
  {
    name: "Motorola Motobook 60 Pro OLED Laptop",
    slug: "motorola-motobook-60-pro-oled-laptop",
    brand: "Motorola",
    categorySlug: "laptops",
    shortDescription: "Intel Core Ultra 5, 16 GB RAM, 1 TB SSD, OLED display",
    description: "A premium thin-and-light laptop with OLED display, all-day battery life, and productivity-ready internals for students and professionals.",
    specifications: { processor: "Intel Core Ultra 5", ram: "16 GB", storage: "1 TB SSD", display: "14-inch 2.8K OLED", warranty: "1 Year" },
    price: 66990,
    originalPrice: 110490,
    discountPercent: 39,
    stock: 12,
    rating: 4.4,
    reviewCount: 437,
    thumbnail: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=900&q=80",
    images: [
      "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1517336714739-489689fd1ca8?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1517430816045-df4b7de11d1d?auto=format&fit=crop&w=900&q=80",
    ],
  },
  {
    name: "ASUS Vivobook Go Ryzen 5 Laptop",
    slug: "asus-vivobook-go-ryzen-5-laptop",
    brand: "ASUS",
    categorySlug: "laptops",
    shortDescription: "Ryzen 5, 8 GB RAM, 512 GB SSD, 15.6-inch display",
    description: "Reliable everyday laptop with SSD storage, crisp display, and lightweight design tailored for multitasking.",
    specifications: { processor: "AMD Ryzen 5 7520U", ram: "8 GB", storage: "512 GB SSD", display: "15.6-inch Full HD", warranty: "1 Year" },
    price: 38990,
    originalPrice: 50990,
    discountPercent: 23,
    stock: 18,
    rating: 4.3,
    reviewCount: 1526,
    thumbnail: "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?auto=format&fit=crop&w=900&q=80",
    images: [
      "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1511385348-a52b4a160dc2?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=900&q=80",
    ],
  },
  {
    name: "Apple iPhone 15 Plus",
    slug: "apple-iphone-15-plus",
    brand: "Apple",
    categorySlug: "mobiles",
    shortDescription: "128 GB storage, A16 Bionic, Super Retina XDR display",
    description: "Flagship Apple smartphone with premium cameras, powerful chipset, and excellent battery life.",
    specifications: { storage: "128 GB", display: "6.7-inch Super Retina XDR", camera: "48 MP + 12 MP", battery: "All-day battery life", warranty: "1 Year" },
    price: 73999,
    originalPrice: 79900,
    discountPercent: 7,
    stock: 10,
    rating: 4.7,
    reviewCount: 1218,
    thumbnail: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=900&q=80",
    images: [
      "https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1556656793-08538906a9f8?auto=format&fit=crop&w=900&q=80",
    ],
  },
  {
    name: "Samsung Galaxy S24",
    slug: "samsung-galaxy-s24",
    brand: "Samsung",
    categorySlug: "mobiles",
    shortDescription: "Galaxy AI, AMOLED display, pro-grade cameras",
    description: "A compact premium Android phone with bright display, fast performance, and smart productivity features.",
    specifications: { storage: "256 GB", display: "6.2-inch AMOLED", camera: "50 MP triple camera", battery: "4000 mAh", warranty: "1 Year" },
    price: 62999,
    originalPrice: 74999,
    discountPercent: 16,
    stock: 14,
    rating: 4.5,
    reviewCount: 842,
    thumbnail: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=900&q=80",
    images: [
      "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1580910051074-3eb694886505?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=900&q=80",
    ],
  },
  {
    name: "Printed Summer Kurti",
    slug: "printed-summer-kurti",
    brand: "Ethnic Aura",
    categorySlug: "fashion",
    shortDescription: "Comfort-fit printed kurti for everyday wear",
    description: "Soft fabric kurti with light summer print, suitable for daily office or casual outings.",
    specifications: { fabric: "Cotton Blend", fit: "Regular", sleeve: "3/4 Sleeve", washCare: "Machine Wash" },
    price: 599,
    originalPrice: 1499,
    discountPercent: 60,
    stock: 42,
    rating: 4.1,
    reviewCount: 188,
    thumbnail: "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=900&q=80",
    images: [
      "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=900&q=80",
    ],
  },
  {
    name: "Men's Slim Fit Casual Shirt",
    slug: "mens-slim-fit-casual-shirt",
    brand: "Urban Mode",
    categorySlug: "fashion",
    shortDescription: "Classic slim fit shirt with soft-touch fabric",
    description: "Versatile casual shirt with modern fit and breathable fabric for office and weekend wear.",
    specifications: { fabric: "Cotton", fit: "Slim Fit", sleeve: "Full Sleeve", pattern: "Solid" },
    price: 899,
    originalPrice: 1899,
    discountPercent: 52,
    stock: 35,
    rating: 4.0,
    reviewCount: 264,
    thumbnail: "https://images.unsplash.com/photo-1603252109303-2751441dd157?auto=format&fit=crop&w=900&q=80",
    images: [
      "https://images.unsplash.com/photo-1603252109303-2751441dd157?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=900&q=80",
    ],
  },
  {
    name: "Samsung 1.5 Ton Smart AC",
    slug: "samsung-1-5-ton-smart-ac",
    brand: "Samsung",
    categorySlug: "appliances",
    shortDescription: "AI-enabled inverter split AC with fast cooling",
    description: "Energy-efficient smart AC featuring fast cooling mode, inverter compressor, and app-enabled controls.",
    specifications: { capacity: "1.5 Ton", type: "Split AC", compressor: "Inverter", rating: "3 Star", warranty: "1 Year Product, 10 Years Compressor" },
    price: 32990,
    originalPrice: 48999,
    discountPercent: 32,
    stock: 9,
    rating: 4.2,
    reviewCount: 96,
    thumbnail: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=900&q=80",
    images: [
      "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=900&q=80",
    ],
  },
  {
    name: "LG 260 L Double Door Refrigerator",
    slug: "lg-260l-double-door-refrigerator",
    brand: "LG",
    categorySlug: "appliances",
    shortDescription: "Frost-free refrigerator with smart inverter compressor",
    description: "A family-sized double door refrigerator with reliable cooling, energy efficiency, and practical shelf layout.",
    specifications: { capacity: "260 L", type: "Double Door", cooling: "Frost Free", energyRating: "3 Star", warranty: "1 Year Product, 10 Years Compressor" },
    price: 24990,
    originalPrice: 32990,
    discountPercent: 24,
    stock: 11,
    rating: 4.3,
    reviewCount: 208,
    thumbnail: "https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?auto=format&fit=crop&w=900&q=80",
    images: [
      "https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1586208958839-06c17cacdf08?auto=format&fit=crop&w=900&q=80",
    ],
  },
  {
    name: "Portable Bluetooth Neckband",
    slug: "portable-bluetooth-neckband",
    brand: "Noise",
    categorySlug: "accessories",
    shortDescription: "Wireless neckband with deep bass and fast charging",
    description: "A lightweight neckband with up to 30-hour playback, magnetic earbuds, and punchy bass output.",
    specifications: { battery: "30 Hours", charging: "USB-C Fast Charge", controls: "In-line Controls", warranty: "1 Year" },
    price: 1299,
    originalPrice: 2499,
    discountPercent: 48,
    stock: 50,
    rating: 4.1,
    reviewCount: 912,
    thumbnail: "https://images.unsplash.com/photo-1577174881658-0f30ed549adc?auto=format&fit=crop&w=900&q=80",
    images: [
      "https://images.unsplash.com/photo-1577174881658-0f30ed549adc?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&w=900&q=80",
    ],
  },
  {
    name: "boAt Airdopes True Wireless Earbuds",
    slug: "boat-airdopes-true-wireless-earbuds",
    brand: "boAt",
    categorySlug: "accessories",
    shortDescription: "Compact TWS earbuds with fast charge and deep bass",
    description: "Pocket-friendly wireless earbuds with clear calling, long battery backup, and bass-heavy tuning.",
    specifications: { battery: "28 Hours", charging: "USB-C", resistance: "IPX4", warranty: "1 Year" },
    price: 1499,
    originalPrice: 3990,
    discountPercent: 62,
    stock: 61,
    rating: 4.0,
    reviewCount: 1533,
    thumbnail: "https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?auto=format&fit=crop&w=900&q=80",
    images: [
      "https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1588423771073-b8903fbb85b5?auto=format&fit=crop&w=900&q=80",
    ],
  },
  {
    name: "Smart Fitness Watch",
    slug: "smart-fitness-watch",
    brand: "Fire-Boltt",
    categorySlug: "accessories",
    shortDescription: "AMOLED smartwatch with activity tracking and calling",
    description: "Stylish smartwatch with health tracking, Bluetooth calling, and a bright AMOLED screen.",
    specifications: { display: "1.78-inch AMOLED", battery: "7 Days", features: "Calling, SpO2, Sleep Tracking", warranty: "1 Year" },
    price: 2499,
    originalPrice: 6999,
    discountPercent: 64,
    stock: 27,
    rating: 4.0,
    reviewCount: 673,
    thumbnail: "https://images.unsplash.com/photo-1544117519-31a4b719223d?auto=format&fit=crop&w=900&q=80",
    images: [
      "https://images.unsplash.com/photo-1544117519-31a4b719223d?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1510017803434-a899398421b3?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=900&q=80",
    ],
  },
  {
    name: "HP Victus Gaming Laptop",
    slug: "hp-victus-gaming-laptop",
    brand: "HP",
    categorySlug: "laptops",
    shortDescription: "Intel Core i5, RTX graphics, 16 GB RAM, 512 GB SSD",
    description: "A performance-focused gaming laptop with smooth display, dedicated graphics, and solid thermals for work and play.",
    specifications: { processor: "Intel Core i5 14th Gen", ram: "16 GB", storage: "512 GB SSD", display: "15.6-inch Full HD 144 Hz", warranty: "1 Year" },
    price: 89990,
    originalPrice: 105442,
    discountPercent: 14,
    stock: 7,
    rating: 4.3,
    reviewCount: 445,
    thumbnail: "https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?auto=format&fit=crop&w=900&q=80",
    images: [
      "https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?auto=format&fit=crop&w=900&q=80",
    ],
  },
  {
    name: "Nothing Phone (2a)",
    slug: "nothing-phone-2a",
    brand: "Nothing",
    categorySlug: "mobiles",
    shortDescription: "Distinctive design, AMOLED display, dual camera setup",
    description: "A clean Android phone with unique design language, smooth performance, and balanced everyday camera quality.",
    specifications: { storage: "256 GB", display: "6.7-inch AMOLED", camera: "50 MP dual camera", battery: "5000 mAh", warranty: "1 Year" },
    price: 34999,
    originalPrice: 39999,
    discountPercent: 12,
    stock: 16,
    rating: 4.4,
    reviewCount: 521,
    thumbnail: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&w=900&q=80",
    images: [
      "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1567581935884-3349723552ca?auto=format&fit=crop&w=900&q=80",
    ],
  },
  {
    name: "Women Festive Saree",
    slug: "women-festive-saree",
    brand: "Style Weave",
    categorySlug: "fashion",
    shortDescription: "Festive saree with elegant print and matching blouse piece",
    description: "An occasion-ready saree with lightweight drape, rich color, and classic styling for festive wear.",
    specifications: { fabric: "Georgette", blousePiece: "Included", pattern: "Printed", washCare: "Dry Clean" },
    price: 1299,
    originalPrice: 2999,
    discountPercent: 56,
    stock: 29,
    rating: 4.2,
    reviewCount: 354,
    thumbnail: "https://images.unsplash.com/photo-1610189020371-49614d9927f4?auto=format&fit=crop&w=900&q=80",
    images: [
      "https://images.unsplash.com/photo-1610189020371-49614d9927f4?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=900&q=80",
    ],
  },
  {
    name: "Realme Narzo Budget Smartphone",
    slug: "realme-narzo-budget-smartphone",
    brand: "realme",
    categorySlug: "mobiles",
    shortDescription: "Value smartphone with large battery and smooth display",
    description: "Affordable smartphone for day-to-day use featuring dependable battery life and a fluid display experience.",
    specifications: { storage: "128 GB", display: "6.72-inch Full HD+", camera: "50 MP AI Camera", battery: "5000 mAh", warranty: "1 Year" },
    price: 13999,
    originalPrice: 16999,
    discountPercent: 17,
    stock: 21,
    rating: 4.1,
    reviewCount: 978,
    thumbnail: "https://images.unsplash.com/photo-1585060544812-6b45742d762f?auto=format&fit=crop&w=900&q=80",
    images: [
      "https://images.unsplash.com/photo-1585060544812-6b45742d762f?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1567581935884-3349723552ca?auto=format&fit=crop&w=900&q=80",
    ],
  },
];

async function main() {
  await prisma.cartItem.deleteMany();
  await prisma.shippingAddress.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.productImage.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.cart.deleteMany();
  await prisma.user.deleteMany();

  const categoryMap = new Map();

  for (const category of categories) {
    const created = await prisma.category.create({ data: category });
    categoryMap.set(category.slug, created.id);
  }

  const user = await prisma.user.create({
    data: {
      name: "Demo Shopper",
      email: env.defaultUserEmail,
      passwordHash: await bcrypt.hash("Demo@123", 10),
      cart: { create: {} },
    },
  });

  for (const product of products) {
    await prisma.product.create({
      data: {
        name: product.name,
        slug: product.slug,
        brand: product.brand,
        shortDescription: product.shortDescription,
        description: product.description,
        specifications: product.specifications,
        price: product.price,
        originalPrice: product.originalPrice,
        discountPercent: product.discountPercent,
        stock: product.stock,
        rating: product.rating,
        reviewCount: product.reviewCount,
        thumbnail: product.thumbnail,
        categoryId: categoryMap.get(product.categorySlug),
        images: {
          create: product.images.map((url, index) => ({
            url,
            sortOrder: index,
            alt: product.name,
          })),
        },
      },
    });
  }

  console.log(`Seeded demo data for ${user.email}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
