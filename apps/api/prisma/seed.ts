import { PrismaClient, OrderStatus } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting Prisma seeding...');

  // 1. Seed Admin User (credentials required via env — never use defaults)
  const adminEmail = process.env.ADMIN_EMAIL;
  const plainPassword = process.env.ADMIN_PASSWORD;
  if (!adminEmail || !plainPassword) {
    throw new Error('ADMIN_EMAIL and ADMIN_PASSWORD environment variables are required to seed.');
  }
  const hashedPassword = await bcrypt.hash(plainPassword, 10);

  const admin = await prisma.admin.upsert({
    where: { email: adminEmail },
    update: {
      password: hashedPassword,
      name: 'Admin HQ',
    },
    create: {
      email: adminEmail,
      password: hashedPassword,
      name: 'Admin HQ',
      role: 'super_admin',
    },
  });
  console.log(`✅ Seeded Admin: ${admin.email}`);

  // 2. Seed Products
  const productsData = [
    {
      name: 'Classic Berry Parfait',
      price: '₦6,500',
      priceNum: 6500,
      badge: 'Vegan',
      img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAEcgAmhNxee4J5JmiIzLMbuozvsvmb1MeoYfhv-GOdcDl_9Lymog4D1W0kKKDJ6l4YfdSQxWbbh9GhVKoSEyLqpUJA_CxsKxT7U1j1zN47GNX1Tn0xzKhdKUKBIJ2Wzr1y6EQqfaEuqsVcQkw627AS5p6oOk9jp6UYKNfRRtmQrs48bm88S2TFI9o8c7EWhUO-pSAihdCbXOrexB9NAxIJ25QyMTFaUj5DfDlSxm1tN13CkPboW_1gpTglUx69-XuEWT4bhO9hm6fx',
      category: 'Best Sellers',
      description: 'A vibrant mix of seasonal berries, honey-roasted granola, and creamy yogurt.',
    },
    {
      name: 'Mango Fura Blend',
      price: '₦5,000',
      priceNum: 5000,
      badge: 'New',
      img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB0a4eid6WDN49ASDqGfsVsqpGRV2dTmITzT23BJT6NZ28NOS4WakCcyEoNEXir0NvFc0xsgjMG94SykJaJfWmp_jYoIaccquO0ZsqU6B3V-MZS1_C4CA_YMGw1sYxVTCJBriJUMz0jcT7PeYL_n-BvZrMkBvfDGM8bjaTqbstqFoyQm4J2-oZ3z_Oj3eWQuvBJUNM7vMlNpapllqxy-amMSI6c7HAe2tRtm-ArRH1oQ90rIkzGXdvl3rCaVpVDxxzn2sv-hH0jK2ju',
      category: 'Classics',
      description: 'Traditional millet fura blended with rich unsweetened yogurt.',
    },
    {
      name: 'Vanilla Bean Dream',
      price: '₦7,000',
      priceNum: 7000,
      badge: null,
      img: null,
      category: 'Seasonal',
      description: 'Vanilla bean infused Greek yogurt with toasted almonds.',
    },
  ];

  await prisma.product.deleteMany({});
  const createdProducts: Awaited<ReturnType<typeof prisma.product.create>>[] = [];
  for (const prod of productsData) {
    const created = await prisma.product.create({ data: prod });
    createdProducts.push(created);
  }
  console.log(`✅ Seeded ${productsData.length} Products`);

  // 3. Seed Orders
  const ordersData = [
    {
      orderNumber: '#ORD-8901',
      customerName: 'Adaeze Nwosu',
      initials: 'AN',
      date: 'Oct 24, 2023',
      total: '₦124,500',
      totalAmount: 124500,
      status: OrderStatus.Processing,
    },
    {
      orderNumber: '#ORD-8900',
      customerName: 'Tunde Bakare',
      initials: 'TB',
      date: 'Oct 24, 2023',
      total: '₦45,000',
      totalAmount: 45000,
      status: OrderStatus.Pending,
    },
    {
      orderNumber: '#ORD-8899',
      customerName: 'Funmi Adeyemi',
      initials: 'FA',
      date: 'Oct 23, 2023',
      total: '₦210,000',
      totalAmount: 210000,
      status: OrderStatus.Completed,
    },
    {
      orderNumber: '#ORD-8898',
      customerName: 'Chidi Okafor',
      initials: 'CO',
      date: 'Oct 23, 2023',
      total: '₦89,990',
      totalAmount: 89990,
      status: OrderStatus.Cancelled,
    },
    {
      orderNumber: '#ORD-8897',
      customerName: 'Kemi Adebayo',
      initials: 'KA',
      date: 'Oct 22, 2023',
      total: '₦1,500,000',
      totalAmount: 1500000,
      status: OrderStatus.Shipped,
    },
  ];

  await prisma.order.deleteMany({});
  for (const ord of ordersData) {
    await prisma.order.create({ data: ord });
  }
  console.log(`✅ Seeded ${ordersData.length} Orders`);

  // 4. Seed Homepage Content (linked to products with images)
  const berryProduct = createdProducts[0];
  const furaProduct = createdProducts[1];
  const vanillaProduct = createdProducts[2];

  await prisma.featuredProduct.deleteMany({});
  await prisma.featuredProduct.createMany({
    data: [
      {
        productId: berryProduct.id,
        title: 'Classic Berry Parfait',
        price: berryProduct.price,
        desc: berryProduct.description ?? '',
        badge: 'Best Seller',
        img: berryProduct.img,
        sortOrder: 1,
      },
      {
        productId: furaProduct.id,
        title: 'Mango Fura Blend',
        price: furaProduct.price,
        desc: furaProduct.description ?? '',
        badge: 'New',
        img: furaProduct.img,
        sortOrder: 2,
      },
      {
        productId: vanillaProduct.id,
        title: 'Vanilla Bean Dream',
        price: vanillaProduct.price,
        desc: vanillaProduct.description ?? '',
        badge: 'Seasonal',
        img: vanillaProduct.img,
        sortOrder: 3,
      },
    ],
  });

  await prisma.classicProduct.deleteMany({});
  await prisma.classicProduct.createMany({
    data: [
      {
        productId: furaProduct.id,
        title: 'Mango Fura Blend',
        price: furaProduct.price,
        desc: furaProduct.description ?? '',
        img: furaProduct.img,
        sortOrder: 1,
      },
      {
        productId: berryProduct.id,
        title: 'Classic Berry Parfait',
        price: berryProduct.price,
        desc: berryProduct.description ?? '',
        img: berryProduct.img,
        sortOrder: 2,
      },
    ],
  });

  await prisma.testimonial.deleteMany({});
  await prisma.testimonial.createMany({
    data: [
      {
        name: 'Chioma A.',
        text: 'The Berry Blast is my go-to breakfast. Fresh, filling, and absolutely delicious!',
        rating: 5,
      },
      {
        name: 'Emeka O.',
        text: 'We ordered catering for our wedding and it was a huge hit. Guests are still asking about the parfaits!',
        rating: 5,
      },
      {
        name: 'Aisha B.',
        text: 'Finally, a healthy snack that actually tastes amazing. My kids love the Tropical Delight.',
        rating: 5,
      },
    ],
  });

  await prisma.statHighlight.deleteMany({});
  await prisma.statHighlight.createMany({
    data: [
      { label: 'Happy Customers', value: '5,000+', sortOrder: 1 },
      { label: 'Average Rating', value: '4.9★', sortOrder: 2 },
      { label: 'Natural Ingredients', value: '100%', sortOrder: 3 },
    ],
  });
  console.log('✅ Seeded Homepage Content');

  // 5. Seed Store Settings
  await prisma.storeSettings.upsert({
    where: { id: 'default' },
    update: {},
    create: {
      id: 'default',
      storeOpen: true,
      operatingHours: '08:00 AM - 09:00 PM',
      deliveryZones: 'Lagos Island, Lekki, Victoria Island, Ikeja',
      pushNotifications: true,
      emailDigest: false,
    },
  });
  // 6. Seed Stock Alerts
  await prisma.stockAlert.deleteMany({});
  await prisma.stockAlert.createMany({
    data: [
      {
        dot: 'bg-error',
        title: 'Strawberries',
        desc: "Low inventory (2 trays remaining). Reorder required for tomorrow's shift.",
        action: 'Reorder Now',
      },
      {
        dot: 'bg-[#FBC02D]',
        title: 'Granola (House Blend)',
        desc: 'Refill needed in front display. Back stock is sufficient.',
      },
      {
        dot: 'bg-[#FBC02D]',
        title: 'Medium Cups',
        desc: 'Stock running low (approx 50 left). Expected delivery tomorrow.',
      },
    ],
  });
  console.log('✅ Seeded Stock Alerts');

  // 7. Seed Gallery
  await prisma.galleryItem.deleteMany({});
  await prisma.galleryItem.createMany({
    data: [
      {
        title: 'The Grand Buffet',
        category: 'Weddings',
        desc: 'A stunning display for 200 guests.',
        img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC3jZr8qwLhq4mA2sIAoVxXwbjLGQ4w56eXqy-7negTDPW3pbJjnkXBxCAdP6YHW7IaH1QZ6ycRvbCfxDPZ6d1wx_XAH9XkeXy0gehkhBZbOWdwIQ6ntI3V6JbgCQh2-tCW0NRUzA12GB1xEw0dUCYneap_XM-gCAUW5LeP0PxaQbuwjz5XWxYUwUxMAZB6tPB3jqFaAy31E_GtX3Llt4Nd4xJDQq-GNAqvkYoWGoLr0qfPuISZcZGEqq3lzEQ3M_1iLEwukBOcsSCG',
        aspect: 'aspect-[4/5]',
        sortOrder: 1,
      },
      {
        title: 'Tropical Sunrise',
        category: 'New Arrivals',
        desc: 'Mango base with mixed berries.',
        img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBr8tM66zQDdoP_b39JXDarrEY-Adz_fPiUVfAkFjg7ejtMZzELcMdu53_FljZXzi2378H7cdWzPnTymeH5vioTS3hmuXEM14hHV5nDrrNoRlPTicjRDoAxjOfC6OUO20P5umpLay_yYlIfx72etnHf1MXyoJLHk_zpwvTVpEvgLGN6U8Css5OY0_VQL_JNP5ckZ_G4flZrPv8h0ue3Q_J8PX_VpnxN5g_X4XCE9C0McG91EwcsKyF_yWpmlwd6OecvYx-XmmAJnkmB',
        aspect: 'aspect-square',
        sortOrder: 2,
      },
      {
        title: 'Raspberry Elegance',
        category: 'Birthdays',
        desc: 'Perfect individual servings.',
        img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuByWXcHVqlOr874m2YTSCu0F_qCT9lupmmDzqNYfJlquCsniXtwqm7filY3wnK_lu7AZxMQHCU7e9EkWk0C2yox0TTT4sotX7VriGTPfxjlwINRXUGEZPYBmWj2v3a-ixnrl4IdNfxl4WfNeYt0IzxE5xgp4ugVthQSbaKaoZEdAKuXgoNJx0R4v_8wucl1wCae5iiZ-YSVlg861IFPVUbyb_6dKY4w_39M72UltofUn6YnTJNYt3TntBzqtdv2gsCOiALSN2NRLZJj',
        aspect: 'aspect-square',
        sortOrder: 3,
      },
      {
        title: 'Fresh Ingredients',
        category: 'Behind the Scenes',
        desc: 'Only the best for our clients.',
        img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuABgg-bmjwLAp78FHJ7KYWE6ENuUyhj8bY6nQHnQKO3X80EZFKwqBcksi0BjUlNRhOzVP5UJUUba6JHqLtg5PSBL6_-wVU-ZQ0jYmOvJGbYCiJ-tFUOjTMEeSMpTL5HxhwpQI7CNKecW9zhysPHpyacyb3PW_s9B485rCPodSZ20_puVfDJRW7VKLlt_YGXzdG5-_8q8Ych13w5qZN670qgglm9L01DnNvHSn0nu2ZFEadQMUY77LYtjXMcpU1gdFKKBCyBgZ8UvNU2',
        aspect: 'aspect-[4/5]',
        sortOrder: 4,
      },
      {
        title: 'Morning Fuel',
        category: 'Corporate',
        desc: 'Energizing your team.',
        img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB-6NjUFJmpqk9xtd_gckx8g3rZNNLj7vAmJPVe2Pa0ZqIHINiZ9X0cNsT_9OoKAq0dSPeFMa3kCuHcJFuMjFyj8IG_7rBEnJ5wnznoeIsfptq0F3pztjtdZhHC8dhVvZcUsPEdt_1kCR8JpoC4pm891pxIicfL2_F39JMoPWVNqIZ5z5YSfyjGwDJVRn5yNSPvucAt1CYnX7QySEIJ5JXfjAr0qbGsUvf7jkAJS_dEIFJSWGKHlrkUBKzPJr-SOfvJm4bu-gKrc30b',
        aspect: 'aspect-square',
        sortOrder: 5,
      },
    ],
  });
  console.log('✅ Seeded Gallery');

  console.log('🎉 Prisma seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
