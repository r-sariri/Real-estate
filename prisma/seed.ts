import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { buildSearchText } from "../lib/search";

const prisma = new PrismaClient();

const ADMIN_EMAIL = process.env.SEED_ADMIN_EMAIL ?? "admin@zarrin.ir";
const ADMIN_PASSWORD = process.env.SEED_ADMIN_PASSWORD ?? "Zarrin@1404";
const DEMO_PASSWORD = process.env.SEED_DEMO_PASSWORD ?? "Zarrin@1404";

const spec = (overrides: Record<string, string> = {}) => ({
  material: "طلای ۱۸ عیار",
  stone: "بدون سنگ",
  size: "قابل تنظیم",
  warranty: "گارانتی اصالت و ضمانت بازگشت ۷ روزه",
  madeIn: "ایران — کارگاه زرّین",
  ...overrides,
});

type SeedProduct = {
  slug: string;
  name: string;
  category: string;
  purity?: number;
  weight: number;
  price?: Partial<{ making: number; profit: number; discount: number; manual: number }>;
  stock?: number;
  featured?: boolean;
  isNew?: boolean;
  popularity?: number;
  images: string[];
  short: string;
  description: string;
  specs?: Record<string, string>;
  variants?: { name: string; stock: number }[];
};

const products: SeedProduct[] = [
  {
    slug: "mah-tab-necklace",
    name: "گردنبند طلا «مهتاب»",
    category: "necklaces",
    weight: 4.2,
    featured: true,
    popularity: 96,
    images: ["/products/necklace-drop.jpg", "/products/necklace-drop-2.jpg"],
    short: "گردنبندی ظریف با آویز قطره‌ای، الهام‌گرفته از انعکاس ماه بر آب.",
    description:
      "گردنبند «مهتاب» با زنجیر باریک و آویز قطره‌ای، یکی از امضاهای کارگاه زرّین است. سطح آویز با دست صیقل خورده و انعکاس نور در آن به‌صورت طبیعی و نرم پخش می‌شود. مناسب استفاده روزمره و همچنین ست کردن با لباس‌های مجلسی.",
    specs: spec({ size: "زنجیر ۴۵ سانتی‌متر، قابل تنظیم" }),
  },
  {
    slug: "ghatre-pendant",
    name: "آویز طلا «قطره»",
    category: "necklaces",
    weight: 2.8,
    isNew: true,
    popularity: 78,
    images: ["/products/pendant-gold.jpg"],
    short: "آویز مینیمال با فرم قطره و نگین مرکزی درخشان.",
    description:
      "آویز «قطره» با خطوط ساده و نگین مرکزی، انتخابی مناسب برای کسانی که زیبایی را در سکوت و ظرافت می‌جویند. قاب نگین با دقت ۰.۱ میلی‌متر تنظیم شده تا نگین در جای خود ثابت بماند.",
    specs: spec({ stone: "نگین زیرکونیا", size: "۲.۲ × ۱.۴ سانتی‌متر" }),
  },
  {
    slug: "nasim-chain-necklace",
    name: "گردنبند زنجیری «نسیم»",
    category: "necklaces",
    weight: 6.5,
    popularity: 84,
    images: ["/products/chain-layered.jpg", "/products/chain-layered-2.jpg"],
    short: "زنجیر چندلایه با بافت دستی و آویز مدالیون.",
    description:
      "گردنبند «نسیم» از سه زنجیر با ضخامت‌های متفاوت ساخته شده که در کنار هم عمق و حرکت ایجاد می‌کنند. بافت زنجیر به‌صورت دستی جوش داده شده و در برابر کشش مقاوم است.",
    specs: spec({ size: "۴۲ سانتی‌متر" }),
  },
  {
    slug: "classic-gold-ring",
    name: "انگشتر طلا «کلاسیک»",
    category: "rings",
    weight: 3.4,
    featured: true,
    popularity: 91,
    images: ["/products/ring-classic.jpg"],
    short: "انگشتر ساده و همیشگی با رینگ صیقلی و فرم ارگونومیک.",
    description:
      "انگشتر «کلاسیک» با سطح صیقلی آینه‌ای و لبه‌های گرد، راحتی کامل در استفاده طولانی‌مدت را فراهم می‌کند. این مدل در سایزهای مختلف و با امکان حکاکی نام عرضه می‌شود.",
    specs: spec(),
    variants: [
      { name: "سایز ۵۰", stock: 3 },
      { name: "سایز ۵۲", stock: 5 },
      { name: "سایز ۵۴", stock: 4 },
      { name: "سایز ۵۶", stock: 0 },
    ],
  },
  {
    slug: "derakhshan-diamond-ring",
    name: "انگشتر الماس «درخشش»",
    category: "diamond",
    purity: 18,
    weight: 3.9,
    price: { making: 18, profit: 12 },
    featured: true,
    isNew: true,
    popularity: 99,
    images: ["/products/ring-diamond.jpg", "/products/ring-diamond-2.jpg"],
    short: "انگشتر سولیتر با نگین برلیان و رینگ سفید‌طلا.",
    description:
      "«درخشش» با نگین برلیان مرکزی و رینگ ظریف طراحی شده است. هر نگین با گواهی اصالت و مشخصات چهارگانه (رنگ، پاکی، تراش، قیراط) ارائه می‌شود. قاب نگین از نوع شش‌پایه است تا بیشترین بازتاب نور را داشته باشد.",
    specs: spec({ stone: "برلیان ۰.۲۵ قیراط", size: "سایز ۵۲ (قابل سفارش)" }),
    variants: [
      { name: "سایز ۵۲", stock: 2 },
      { name: "سایز ۵۴", stock: 1 },
    ],
  },
  {
    slug: "ashk-earrings",
    name: "گوشواره طلا «اشک»",
    category: "earrings",
    weight: 3.1,
    popularity: 88,
    images: ["/products/earrings-teardrop.jpg", "/products/earrings-teardrop-2.jpg"],
    short: "گوشواره آویز با فرم اشک و حرکت نرم.",
    description:
      "گوشواره «اشک» با وزنی متعادل طراحی شده تا هنگام حرکت، تاب نرم و دلنشینی داشته باشد. قفل گوشواره از نوع پیچی است و اطمینان کامل ایجاد می‌کند.",
    specs: spec({ size: "طول ۳.۵ سانتی‌متر" }),
  },
  {
    slug: "telesm-bracelet",
    name: "دستبند طلا «طلسم»",
    category: "bracelets",
    weight: 5.6,
    price: { discount: 8 },
    popularity: 82,
    images: ["/products/bracelet-charm.jpg", "/products/bracelet-charm-2.jpg"],
    short: "دستبند با آویز گرد و قفل مغناطیسی ایمن.",
    description:
      "دستبند «طلسم» با آویز گرد و بافت صیقلی، ترکیبی از سادگی و جزئیات است. قفل مغناطیسی دوتایی، باز و بسته کردن آسان و ایمنی بالا را همزمان فراهم می‌کند.",
    specs: spec({ size: "قابل تنظیم ۱۶ تا ۱۹ سانتی‌متر" }),
  },
  {
    slug: "mehr-bangle",
    name: "النگو طلا «مهر»",
    category: "bracelets",
    purity: 21,
    weight: 8.4,
    popularity: 75,
    images: ["/products/bangle-gold.jpg"],
    short: "النگوی توپر با عیار ۲۱ و سطح براق.",
    description:
      "النگوی «مهر» از طلای ۲۱ عیار و به‌صورت توپر ساخته شده است؛ انتخابی سنتی با پرداخت مدرن. سطح بیرونی با برس‌کاری ریز و سطح داخلی صیقلی است تا روی پوست راحت باشد.",
    specs: spec({ material: "طلای ۲۱ عیار", size: "قطر ۶ سانتی‌متر" }),
  },
  {
    slug: "negin-bridal-necklace",
    name: "گردنبند عروس «نگین»",
    category: "wedding",
    weight: 7.2,
    price: { making: 22, profit: 14 },
    featured: true,
    popularity: 93,
    images: ["/products/necklace-drop-2.jpg", "/products/chain-layered-2.jpg"],
    short: "گردنبند عروس با نگین‌های ریز و طراحی باشکوه.",
    description:
      "گردنبند «نگین» برای روزهای خاص طراحی شده است. نگین‌های ریز در امتداد زنجیر، درخششی ملایم و پیوسته ایجاد می‌کنند. این مدل با ست گوشواره و دستبند هم‌خانواده نیز عرضه می‌شود.",
    specs: spec({ stone: "نگین سفید", size: "۴۴ سانتی‌متر" }),
  },
  {
    slug: "khat-minimal-earrings",
    name: "گوشواره مینیمال «خط»",
    category: "minimalist",
    weight: 1.9,
    isNew: true,
    popularity: 71,
    images: ["/products/earrings-minimal.jpg", "/products/minimalist-2.jpg"],
    short: "گوشواره سبک با خطوط ساده برای استفاده روزمره.",
    description:
      "گوشواره «خط» سبک‌ترین مدل مجموعه است؛ مناسب استفاده تمام‌روز و ست کردن با هر استایل. فرم هندسی ساده آن، تمرکز را روی درخشش طلا می‌گذارد.",
    specs: spec({ size: "طول ۲ سانتی‌متر" }),
  },
  {
    slug: "hamahang-plain-ring",
    name: "انگشتر ساده «هم‌آهنگ»",
    category: "minimalist",
    weight: 2.2,
    stock: 0,
    popularity: 65,
    images: ["/products/ring-minimal.jpg"],
    short: "انگشتر باریک و سبک با پرداخت مات.",
    description:
      "«هم‌آهنگ» انگشتری باریک با پرداخت مات است که برای ست کردن چند انگشتر در یک دست ایده‌آل است. سطح مات آن اثر انگشت را کمتر نشان می‌دهد.",
    specs: spec(),
    variants: [
      { name: "سایز ۵۰", stock: 0 },
      { name: "سایز ۵۲", stock: 0 },
    ],
  },
  {
    slug: "setareh-diamond-bracelet",
    name: "دستبند الماس «ستاره»",
    category: "diamond",
    weight: 4.8,
    price: { making: 20, profit: 13 },
    popularity: 90,
    images: ["/products/bracelet-diamond.jpg", "/products/bracelet-charm-2.jpg"],
    short: "دستبند با نگین‌های الماس در امتداد بند.",
    description:
      "دستبند «ستاره» با نگین‌های الماس کوچک و چیدمان پیوسته، درخششی خطی و ظریف ایجاد می‌کند. قفل بند از نوع جعبه‌ای با ضامن ایمنی است.",
    specs: spec({ stone: "الماس تراش برلیان", size: "۱۷ سانتی‌متر" }),
  },
  {
    slug: "shabnam-diamond-pendant",
    name: "آویز الماس «شبنم»",
    category: "diamond",
    weight: 2.4,
    popularity: 80,
    images: ["/products/pendant-chain.jpg"],
    short: "آویز کوچک با نگین الماس و قاب طلا.",
    description:
      "آویز «شبنم» کوچک اما پرجزئیات است؛ نگین مرکزی در قابی از طلا نشسته و در نور کم هم می‌درخشد. زنجیر همراه آن جداگانه قابل انتخاب است.",
    specs: spec({ stone: "الماس ۰.۱ قیراط", size: "۱.۶ سانتی‌متر" }),
  },
  {
    slug: "shahzade-special-necklace",
    name: "گردنبند ویژه «شاهزاده»",
    category: "special",
    purity: 24,
    weight: 9.5,
    price: { making: 25, profit: 15 },
    featured: true,
    popularity: 97,
    images: ["/products/necklace-model.jpg", "/products/chain-layered.jpg"],
    short: "قطعه‌ای محدود از طلای ۲۴ عیار با طراحی اختصاصی.",
    description:
      "«شاهزاده» در تیراژ محدود و با طلای ۲۴ عیار ساخته می‌شود. هر قطعه شماره‌دار است و همراه با گواهی اصالت و جعبه چرمی اختصاصی ارسال می‌شود. طراحی این مدل در آرشیو کارگاه ثبت شده است.",
    specs: spec({ material: "طلای ۲۴ عیار", size: "۴۶ سانتی‌متر" }),
  },
  {
    slug: "peyvand-wedding-ring",
    name: "انگشتر عروس «پیوند»",
    category: "wedding",
    weight: 4.4,
    price: { making: 24, profit: 14 },
    isNew: true,
    popularity: 89,
    images: ["/products/ring-wedding.jpg", "/products/ring-wedding-2.jpg"],
    short: "حلقه عروس با نگین مرکزی و رینگ دوگانه.",
    description:
      "حلقه «پیوند» با رینگ دوگانه و نگین مرکزی، نمادی از دو مسیر است که به هم می‌رسند. امکان حکاکی تاریخ و نام روی سطح داخلی وجود دارد.",
    specs: spec({ stone: "برلیان ۰.۱۵ قیراط", size: "سایز ۵۲" }),
    variants: [
      { name: "سایز ۵۲", stock: 3 },
      { name: "سایز ۵۴", stock: 2 },
    ],
  },
];

const categories = [
  { slug: "necklaces", name: "گردنبند طلا", description: "گردنبند و آویز با طراحی‌های ظریف و کلاسیک.", image: "/products/necklace-drop.jpg", sortOrder: 1 },
  { slug: "rings", name: "انگشتر طلا", description: "از انگشترهای ساده روزمره تا حلقه‌های خاص.", image: "/products/ring-classic.jpg", sortOrder: 2 },
  { slug: "earrings", name: "گوشواره طلا", description: "گوشواره‌های سبک و مجلسی با قفل ایمن.", image: "/products/earrings-teardrop.jpg", sortOrder: 3 },
  { slug: "bracelets", name: "دستبند و النگو", description: "دستبند، النگو و زنجیرهای مچ.", image: "/products/bracelet-charm.jpg", sortOrder: 4 },
  { slug: "wedding", name: "جواهرات عروس", description: "ست‌های عروس و حلقه‌های پیوند.", image: "/products/ring-wedding.jpg", sortOrder: 5 },
  { slug: "minimalist", name: "مینیمال", description: "طراحی‌های ساده، سبک و همیشه‌همراه.", image: "/products/earrings-minimal.jpg", sortOrder: 6 },
  { slug: "diamond", name: "الماس", description: "نگین‌های الماس با گواهی اصالت.", image: "/products/ring-diamond.jpg", sortOrder: 7 },
  { slug: "special", name: "کالکشن ویژه", description: "قطعات محدود و سفارشی کارگاه زرّین.", image: "/products/chain-layered.jpg", sortOrder: 8 },
];

const collections = [
  { slug: "gold-necklaces", name: "گردنبندهای طلا", description: "خطوطی که گردن را قاب می‌گیرند.", image: "/products/necklace-drop.jpg", sortOrder: 1 },
  { slug: "gold-rings", name: "انگشترهای طلا", description: "حلقه‌هایی برای هر روز و هر مناسبت.", image: "/products/ring-classic.jpg", sortOrder: 2 },
  { slug: "gold-earrings", name: "گوشواره‌های طلا", description: "از مینیمال تا مجلسی.", image: "/products/earrings-teardrop.jpg", sortOrder: 3 },
  { slug: "gold-bracelets", name: "دستبندهای طلا", description: "جزئیاتی که در حرکت دیده می‌شوند.", image: "/products/bracelet-charm.jpg", sortOrder: 4 },
  { slug: "wedding", name: "جواهرات عروس", description: "برای روزی که به یاد می‌ماند.", image: "/products/ring-wedding.jpg", sortOrder: 5 },
  { slug: "minimalist", name: "مینیمالیست", description: "کمتر، اما دقیق‌تر.", image: "/products/pendant-gold.jpg", sortOrder: 6 },
  { slug: "diamond", name: "الماس", description: "درخشش ابدی.", image: "/products/ring-diamond.jpg", sortOrder: 7 },
  { slug: "special", name: "کالکشن ویژه", description: "قطعات محدود و شماره‌دار.", image: "/products/chain-layered.jpg", sortOrder: 8 },
];

const collectionProducts: Record<string, string[]> = {
  "gold-necklaces": ["mah-tab-necklace", "ghatre-pendant", "nasim-chain-necklace", "negin-bridal-necklace"],
  "gold-rings": ["classic-gold-ring", "derakhshan-diamond-ring", "hamahang-plain-ring", "peyvand-wedding-ring"],
  "gold-earrings": ["ashk-earrings", "khat-minimal-earrings"],
  "gold-bracelets": ["telesm-bracelet", "mehr-bangle", "setareh-diamond-bracelet"],
  wedding: ["negin-bridal-necklace", "peyvand-wedding-ring", "derakhshan-diamond-ring"],
  minimalist: ["khat-minimal-earrings", "hamahang-plain-ring", "ghatre-pendant"],
  diamond: ["derakhshan-diamond-ring", "setareh-diamond-bracelet", "shabnam-diamond-pendant"],
  special: ["shahzade-special-necklace", "nasim-chain-necklace"],
};

async function main() {
  const [adminHash, demoHash] = await Promise.all([
    bcrypt.hash(ADMIN_PASSWORD, 12),
    bcrypt.hash(DEMO_PASSWORD, 12),
  ]);

  await prisma.user.upsert({
    where: { email: ADMIN_EMAIL },
    create: { email: ADMIN_EMAIL, name: "مدیر زرّین", passwordHash: adminHash, role: "ADMIN", phone: "09120000000" },
    update: { role: "ADMIN" },
  });
  await prisma.user.upsert({
    where: { email: "customer@zarrin.ir" },
    create: { email: "customer@zarrin.ir", name: "سارا محمدی", passwordHash: demoHash, role: "CUSTOMER", phone: "09121112233" },
    update: {},
  });

  await prisma.pricingConfig.upsert({
    where: { id: "singleton" },
    create: {
      id: "singleton",
      autoCalculate: true,
      defaultMakingChargePercent: 12,
      defaultProfitPercent: 8,
      taxPercent: 9,
      currency: "TOMAN",
    },
    update: {},
  });

  // Gold rates are seed defaults only — the admin dashboard owns them at runtime.
  for (const [purity, price] of [
    [18, 6_480_000],
    [21, 7_560_000],
    [24, 8_640_000],
  ] as const) {
    await prisma.goldRate.upsert({
      where: { purity },
      create: { purity, pricePerGram: price },
      update: {},
    });
  }

  for (const category of categories) {
    await prisma.category.upsert({
      where: { slug: category.slug },
      create: category,
      update: { name: category.name, description: category.description, image: category.image, sortOrder: category.sortOrder },
    });
  }

  for (const collection of collections) {
    await prisma.collection.upsert({
      where: { slug: collection.slug },
      create: collection,
      update: { name: collection.name, description: collection.description, image: collection.image, sortOrder: collection.sortOrder },
    });
  }

  for (const item of products) {
    const category = await prisma.category.findUniqueOrThrow({ where: { slug: item.category } });
    const data = {
      slug: item.slug,
      name: item.name,
      shortDescription: item.short,
      description: item.description,
      categoryId: category.id,
      purity: item.purity ?? 18,
      weightGrams: item.weight,
      makingChargePercent: item.price?.making ?? 12,
      profitPercent: item.price?.profit ?? 8,
      taxPercent: 9,
      discountPercent: item.price?.discount ?? 0,
      stock: item.stock ?? 8,
      isActive: true,
      isFeatured: Boolean(item.featured),
      isNew: Boolean(item.isNew),
      popularity: item.popularity ?? 50,
      images: item.images,
      specs: item.specs ?? spec(),
      searchText: buildSearchText([
        item.name,
        item.short,
        item.description,
        category.name,
        item.specs?.stone,
        `${item.purity ?? 18} عیار طلا`,
      ]),
    };
    const product = await prisma.product.upsert({
      where: { slug: item.slug },
      create: data,
      update: data,
    });

    if (item.variants?.length) {
      for (const variant of item.variants) {
        const existing = await prisma.productVariant.findFirst({ where: { productId: product.id, name: variant.name } });
        if (existing) {
          await prisma.productVariant.update({ where: { id: existing.id }, data: { stock: variant.stock } });
        } else {
          await prisma.productVariant.create({ data: { productId: product.id, name: variant.name, stock: variant.stock } });
        }
      }
    }
  }

  for (const [slug, slugs] of Object.entries(collectionProducts)) {
    const collection = await prisma.collection.findUnique({ where: { slug } });
    if (!collection) continue;
    const items = await prisma.product.findMany({ where: { slug: { in: slugs } }, select: { id: true } });
    await prisma.collection.update({
      where: { id: collection.id },
      data: { products: { set: items.map((p) => ({ id: p.id })) } },
    });
  }

  if ((await prisma.testimonial.count()) === 0) {
    await prisma.testimonial.createMany({
      data: [
        { name: "نازنین رضایی", city: "تهران", rating: 5, text: "گردنبند مهتاب را برای تولد مادرم خریدم؛ بسته‌بندی و کیفیت از انتظارم بالاتر بود. وزن و عیار دقیقاً همان بود که در سایت نوشته شده بود.", sortOrder: 1 },
        { name: "امیرحسین کریمی", city: "اصفهان", rating: 5, text: "سفارش حلقه را سه روزه دریافت کردم. پشتیبانی تلفنی خیلی دقیق راهنمایی کرد و سایز درست بود.", sortOrder: 2 },
        { name: "مریم شریفی", city: "شیراز", rating: 4, text: "کیفیت طلا و صیقل سطح عالی است. فقط کاش رنگ جعبه هم با مجموعه هماهنگ‌تر بود.", sortOrder: 3 },
        { name: "سعید نوری", city: "تبریز", rating: 5, text: "قیمت‌ها شفاف است و ریز قیمت طلا، اجرت و مالیات جدا نشان داده می‌شود. همین باعث شد به شما اعتماد کنم.", sortOrder: 4 },
      ],
    });
  }

  if ((await prisma.shippingMethod.count()) === 0) {
    await prisma.shippingMethod.createMany({
      data: [
        { name: "پست پیشتاز بیمه‌شده", description: "ارسال به سراسر ایران، ۲ تا ۴ روز کاری", price: 65_000, minDays: 2, maxDays: 4, sortOrder: 1 },
        { name: "پیک اختصاصی تهران", description: "تحویل در همان روز برای سفارش‌های قبل از ساعت ۱۴", price: 120_000, minDays: 0, maxDays: 1, sortOrder: 2 },
        { name: "تیپاکس (پس‌کرایه)", description: "پرداخت هزینه ارسال هنگام تحویل", price: 0, minDays: 3, maxDays: 6, sortOrder: 3 },
      ],
    });
  }

  if ((await prisma.coupon.count()) === 0) {
    await prisma.coupon.createMany({
      data: [
        { code: "ZARRIN10", type: "PERCENT", value: 10, minSubtotal: 5_000_000, maxUses: 0, isActive: true },
        { code: "GOLD500", type: "FIXED", value: 500_000, minSubtotal: 10_000_000, maxUses: 50, isActive: true },
      ],
    });
  }

  if ((await prisma.banner.count()) === 0) {
    await prisma.banner.createMany({
      data: [
        { title: "کالکشن زمستان زرّین", subtitle: "قطعات محدود با طلای ۱۸ عیار و طراحی دست‌ساز", ctaLabel: "مشاهده کالکشن", ctaUrl: "/collections/special", placement: "HOME_STRIP", sortOrder: 1 },
      ],
    });
  }

  if ((await prisma.ad.count()) === 0) {
    await prisma.ad.createMany({
      data: [
        {
          advertiser: "گالری نگین",
          title: "نمایشگاه جواهرات نگین",
          description: "مجموعه‌ای از سنگ‌های رنگی و طراحی سفارشی — با مشاوره تخصصی رایگان.",
          imageDesktop: "/ad-wide.jpg",
          imageMobile: "/ad-mobile.jpg",
          targetUrl: "https://example.com/negin",
          placement: "HOME_MIDDLE",
          priority: 5,
          isActive: true,
        },
        {
          advertiser: "بیمه اطمینان",
          title: "بیمه جواهرات خانگی",
          description: "پوشش کامل جواهرات شما در منزل و سفر.",
          imageDesktop: "/ad-wide-2.jpg",
          imageMobile: "/ad-mobile.jpg",
          targetUrl: "https://example.com/insurance",
          placement: "SIDEBAR",
          priority: 2,
          isActive: true,
        },
      ],
    });
  }

  if ((await prisma.blogPost.count()) === 0) {
    await prisma.blogPost.createMany({
      data: [
        {
          slug: "how-gold-price-is-calculated",
          title: "قیمت طلا چگونه محاسبه می‌شود؟",
          excerpt: "از نرخ روز طلا تا اجرت ساخت و مالیات؛ همه چیز درباره ریز قیمت یک قطعه طلا.",
          body: "قیمت نهایی هر قطعه طلا از جمع چند جزء تشکیل می‌شود: ارزش طلای خام (وزن ضرب‌در نرخ روز گرم)، اجرت ساخت، سود فروشنده و مالیات بر ارزش افزوده.\n\nارزش طلای خام بیشترین سهم را دارد و با نرخ روز بازار تغییر می‌کند. اجرت ساخت بسته به پیچیدگی طراحی متفاوت است و در قطعات دست‌ساز بیشتر می‌شود.\n\nدر زرّین همه این اجزا به‌صورت شفاف در صفحه هر محصول نمایش داده می‌شود تا بدانید برای چه چیزی پرداخت می‌کنید.",
          cover: "/blog-1.jpg",
        },
        {
          slug: "gold-purity-guide",
          title: "عیار طلا: ۱۸، ۲۱ یا ۲۴؟",
          excerpt: "تفاوت عیارها در رنگ، استحکام و کاربرد روزمره.",
          body: "عیار نشان‌دهنده درصد طلای خالص در آلیاژ است. طلای ۲۴ عیار خالص‌ترین است اما نرم و برای استفاده روزمره حساس است.\n\nطلای ۱۸ عیار ترکیبی متعادل از درخشش و استحکام است و برای انگشتر و دستبند انتخاب مناسبی است. طلای ۲۱ عیار رنگ گرم‌تری دارد و در بازار ایران محبوب است.",
          cover: "/blog-2.jpg",
        },
        {
          slug: "jewelry-care",
          title: "نگهداری از جواهرات در خانه",
          excerpt: "چند عادت ساده که درخشش طلا را سال‌ها حفظ می‌کند.",
          body: "جواهرات را جدا از هم نگه دارید تا خط نیفتند. هنگام شنا، ورزش و استفاده از مواد شوینده آن‌ها را کنار بگذارید.\n\nبرای تمیز کردن، از آب گرم و صابون ملایم و یک برس نرم استفاده کنید و سپس با پارچه نخی خشک کنید. از مواد شیمیایی خشن پرهیز کنید.",
          cover: "/blog-3.jpg",
        },
      ],
    });
  }

  // Demo ads/blog covers were originally illustrations. Rewrite those exact
  // legacy paths once so existing databases pick up the photography set.
  const legacyAdImages = [
    ["/ad-wide.svg", "/ad-wide.jpg"],
    ["/ad-wide-2.svg", "/ad-wide-2.jpg"],
    ["/ad-mobile.svg", "/ad-mobile.jpg"],
  ];
  for (const [from, to] of legacyAdImages) {
    await prisma.ad.updateMany({ where: { imageDesktop: from }, data: { imageDesktop: to } });
    await prisma.ad.updateMany({ where: { imageMobile: from }, data: { imageMobile: to } });
  }
  for (const [from, to] of [
    ["/blog-1.svg", "/blog-1.jpg"],
    ["/blog-2.svg", "/blog-2.jpg"],
    ["/blog-3.svg", "/blog-3.jpg"],
  ]) {
    await prisma.blogPost.updateMany({ where: { cover: from }, data: { cover: to } });
  }

  if ((await prisma.review.count()) === 0) {
    const necklace = await prisma.product.findUnique({ where: { slug: "mah-tab-necklace" } });
    const ring = await prisma.product.findUnique({ where: { slug: "derakhshan-diamond-ring" } });
    const rows = [];
    if (necklace) {
      rows.push(
        { productId: necklace.id, authorName: "الهام ک.", rating: 5, title: "دقیقاً مثل عکس", body: "خیلی ظریف و خوش‌ساخت است. بسته‌بندی هم عالی بود و سالم رسید.", isApproved: true },
        { productId: necklace.id, authorName: "حمید ر.", rating: 4, title: "خوب بود", body: "کیفیت خوب است، فقط زنجیر کمی نازک‌تر از تصورم بود.", isApproved: true },
      );
    }
    if (ring) {
      rows.push({ productId: ring.id, authorName: "نگار م.", rating: 5, title: "درخشش فوق‌العاده", body: "نگین واقعاً می‌درخشد و گواهی اصالت هم همراه آن بود.", isApproved: true });
    }
    if (rows.length) await prisma.review.createMany({ data: rows });
  }

  console.log("✓ seed complete");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
