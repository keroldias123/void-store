import { faker } from "@faker-js/faker"
import { addDays, subDays } from "date-fns"
import { db } from "./index"
import {
  user,
  organization,
  member,
  account,
  invitation,
  session,
  notification,
  outline,
  verification,
  product,
  category,
  subcategory,
} from "./schema/schema"

// ============================================================================
// CONFIGURAÇÕES E CONSTANTES
// ============================================================================

const NAVIGATION_CATEGORIES = [
  {
    id: "eletronicos",
    name: "Eletrónicos",
    subcategories: [
      "computadores", "telemoveis", "portateis", "auscultadores", 
      "tablets", "camaras", "smartwatches", "consolas"
    ],
  },
  {
    id: "roupas",
    name: "Roupas",
    subcategories: ["calcas", "vestidos", "camisas", "casacos", "saias", "tshirts", "jeans", "blazers"],
  },
  {
    id: "acessorios",
    name: "Acessórios",
    subcategories: ["relogios", "oculos", "malas", "bijuteria", "cintos", "carteiras"],
  },
  {
    id: "calcado",
    name: "Calçado",
    subcategories: ["tenis", "sapatos", "sandalias", "botas", "chinelos", "sapatilhas"],
  },
  {
    id: "casa",
    name: "Casa & Decor",
    subcategories: ["moveis", "iluminacao", "banho", "texteis", "decoracao", "jardim"],
  },
  {
    id: "cozinha",
    name: "Cozinha",
    subcategories: ["eletrodomesticos", "utensilios", "cafe", "panelas", "loica", "facas"],
  },
  {
    id: "desporto",
    name: "Desporto",
    subcategories: ["fitness", "bicicletas", "campismo", "roupa-desportiva", "yoga", "natacao"],
  },
  {
    id: "beleza",
    name: "Beleza",
    subcategories: ["maquilhagem", "cuidados-pele", "cabelo", "perfumes", "unhas", "corpo"],
  },
  {
    id: "bebe",
    name: "Bebé",
    subcategories: ["roupa-bebe", "brinquedos", "carrinhos", "alimentacao", "higiene", "mobilario"],
  },
  {
    id: "animais",
    name: "Animais",
    subcategories: ["caes", "gatos", "peixes", "acessorios-pet", "alimentacao-pet", "higiene-pet"],
  },
] as const

const CATEGORY_IMAGE_MAP: Record<string, string> = {
  eletronicos: "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400&h=500&fit=crop",
  roupas: "https://images.unsplash.com/photo-1445205170230-053b83016050?w=400&h=500&fit=crop",
  acessorios: "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=400&h=500&fit=crop",
  calcado: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=500&fit=crop",
  casa: "https://images.unsplash.com/photo-1616046229478-9901c5536a45?w=400&h=500&fit=crop",
  cozinha: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=500&fit=crop",
  desporto: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=400&h=500&fit=crop",
  beleza: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=500&fit=crop",
  bebe: "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=400&h=500&fit=crop",
  animais: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400&h=500&fit=crop",
}

const SUBCATEGORY_IMAGE_MAP: Record<string, string> = {
  computadores: "https://images.unsplash.com/photo-1587831990711-23ca6441447b?w=300&h=300&fit=crop",
  telemoveis: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=300&h=300&fit=crop",
  portateis: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=300&h=300&fit=crop",
  auscultadores: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&h=300&fit=crop",
  tablets: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=300&h=300&fit=crop",
  camaras: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=300&h=300&fit=crop",
  smartwatches: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&h=300&fit=crop",
  consolas: "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=300&h=300&fit=crop",
  calcas: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=300&h=300&fit=crop",
  vestidos: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=300&h=300&fit=crop",
  camisas: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=300&h=300&fit=crop",
  casacos: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=300&h=300&fit=crop",
  saias: "https://images.unsplash.com/photo-1583496661160-fb5886a0uj5?w=300&h=300&fit=crop",
  tshirts: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=300&h=300&fit=crop",
  jeans: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=300&h=300&fit=crop",
  blazers: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=300&h=300&fit=crop",
  relogios: "https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=300&h=300&fit=crop",
  oculos: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=300&h=300&fit=crop",
  malas: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=300&h=300&fit=crop",
  bijuteria: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=300&h=300&fit=crop",
  cintos: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=300&h=300&fit=crop",
  carteiras: "https://images.unsplash.com/photo-1627123424574-724758594e93?w=300&h=300&fit=crop",
  tenis: "https://images.unsplash.com/photo-1552346154-21d32810aba3?w=300&h=300&fit=crop",
  sapatos: "https://images.unsplash.com/photo-1449505278894-297fdb3edbc1?w=300&h=300&fit=crop",
  sandalias: "https://images.unsplash.com/photo-1603487742131-4160ec999306?w=300&h=300&fit=crop",
  botas: "https://images.unsplash.com/photo-1608256246200-53e635b5b65f?w=300&h=300&fit=crop",
  chinelos: "https://images.unsplash.com/photo-1603487742131-4160ec999306?w=300&h=300&fit=crop",
  sapatilhas: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=300&h=300&fit=crop",
  moveis: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=300&h=300&fit=crop",
  iluminacao: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=300&h=300&fit=crop",
  banho: "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=300&h=300&fit=crop",
  texteis: "https://images.unsplash.com/photo-1616627547584-bf28cee262db?w=300&h=300&fit=crop",
  decoracao: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=300&h=300&fit=crop",
  jardim: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=300&h=300&fit=crop",
  eletrodomesticos: "https://images.unsplash.com/photo-1585659722983-3a675dabf23d?w=300&h=300&fit=crop",
  utensilios: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=300&h=300&fit=crop",
  cafe: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=300&h=300&fit=crop",
  panelas: "https://images.unsplash.com/photo-1584990347449-a2d4c2c044c4?w=300&h=300&fit=crop",
  loica: "https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=300&h=300&fit=crop",
  facas: "https://images.unsplash.com/photo-1593618998160-e34014e67546?w=300&h=300&fit=crop",
  fitness: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=300&h=300&fit=crop",
  bicicletas: "https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=300&h=300&fit=crop",
  campismo: "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=300&h=300&fit=crop",
  "roupa-desportiva": "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&h=300&fit=crop",
  yoga: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=300&h=300&fit=crop",
  natacao: "https://images.unsplash.com/photo-1530549387789-4c1017266635?w=300&h=300&fit=crop",
  maquilhagem: "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=300&h=300&fit=crop",
  "cuidados-pele": "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=300&h=300&fit=crop",
  cabelo: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=300&h=300&fit=crop",
  perfumes: "https://images.unsplash.com/photo-1541643600914-78b084683601?w=300&h=300&fit=crop",
  unhas: "https://images.unsplash.com/photo-1604654894610-df63bc536371?w=300&h=300&fit=crop",
  corpo: "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=300&h=300&fit=crop",
  "roupa-bebe": "https://images.unsplash.com/photo-1522771930-78b353025590?w=300&h=300&fit=crop",
  brinquedos: "https://images.unsplash.com/photo-1558060370-d644479cb6f7?w=300&h=300&fit=crop",
  carrinhos: "https://images.unsplash.com/photo-1591088398332-8a7791972843?w=300&h=300&fit=crop",
  alimentacao: "https://images.unsplash.com/photo-1584839404042-8bc21d240de9?w=300&h=300&fit=crop",
  higiene: "https://images.unsplash.com/photo-1544006659-f0b21884ce1d?w=300&h=300&fit=crop",
  mobilario: "https://images.unsplash.com/photo-1555252333-9f8e92e65df9?w=300&h=300&fit=crop",
  caes: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=300&h=300&fit=crop",
  gatos: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=300&h=300&fit=crop",
  peixes: "https://images.unsplash.com/photo-1522069169874-c58ec4b76be5?w=300&h=300&fit=crop",
  "acessorios-pet": "https://images.unsplash.com/photo-1601758124510-52d02ddb7cbd?w=300&h=300&fit=crop",
  "alimentacao-pet": "https://images.unsplash.com/photo-1568640347023-a616a30bc3bd?w=300&h=300&fit=crop",
  "higiene-pet": "https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?w=300&h=300&fit=crop",
}

const PRODUCT_VARIANTS = ["popular", "desconto", "visto", "novidade"] as const
const PRODUCTS_PER_GROUP = 20
const USERS_COUNT = 30
const ORGS_COUNT = 8

// ============================================================================
// UTILITÁRIOS
// ============================================================================

const usedProductSlugs = new Set<string>()

function generateUniqueProductSlug(baseSlug: string): string {
  let slug = baseSlug
  let suffix = 1

  while (usedProductSlugs.has(slug)) {
    slug = `${baseSlug}-${suffix++}`
  }

  usedProductSlugs.add(slug)
  return slug
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
}

// ============================================================================
// FUNÇÕES DE SEED
// ============================================================================

function createProductSeedData(
  orgId: string,
  group: typeof PRODUCT_VARIANTS[number],
  categoryId: string,
  subcategoryId: string,
  categoryPath: string
) {
  const title = faker.commerce.productName()
  const priceCents = faker.number.int({ min: 1500, max: 250000 })

  const baseSlug = slugify(title)
  const slug = generateUniqueProductSlug(baseSlug)
  
  let originalPriceCents: number | undefined = undefined
  
  if (group === "desconto") {
    const discountPercent = [10, 15, 20, 25, 30][Math.floor(Math.random() * 5)]
    originalPriceCents = Math.round((priceCents * 100) / (100 - discountPercent))
  } else if (Math.random() < 0.4) {
    const markupPercent = [10, 15, 20][Math.floor(Math.random() * 3)]
    originalPriceCents = Math.round(priceCents * (1 + markupPercent / 100))
  }

  const isNew = group === "novidade"
  const createdAt = isNew
    ? subDays(new Date(), Math.floor(Math.random() * 14))
    : subDays(new Date(), Math.floor(Math.random() * 365))

  const stock = group === "popular" 
    ? faker.number.int({ min: 10, max: 150 }) 
    : faker.number.int({ min: 0, max: 120 })

  return {
    organizationId: orgId,
    categoryId,
    subcategoryId,
    title,
    slug,
    description: faker.commerce.productDescription(),
    price: priceCents,
    originalPrice: originalPriceCents,
    currency: "AOA",
    imageUrl: faker.image.urlLoremFlickr({ category: "products", width: 600, height: 600 }),
    category: categoryPath,
    stock,
    status: "active" as const,
    createdAt,
    updatedAt: createdAt,
  }
}

// ============================================================================
// LIMPEZA DO BANCO
// ============================================================================

async function safetyDeleteAllTables(): Promise<void> {
  console.log("🧹 Limpando tabelas...")
  
  // Ordem de dependência para evitar FK issues
  const deleteOrder = [
    product, subcategory, category, verification, notification, 
    outline, account, session, member, invitation, organization, user
  ]
  
  for (const table of deleteOrder) {
    await db.delete(table).execute()
  }
  
  console.log("✅ Tabelas limpas!")
}

// ============================================================================
// SEED PRINCIPAL
// ============================================================================

async function main(): Promise<void> {
  console.log("🚀 Iniciando seed do banco com Faker...")
  
  // 1. Limpar banco
  await safetyDeleteAllTables()
  
  // 2. Criar usuários
  console.log("👥 Criando usuários...")
  const usersData = Array.from({ length: USERS_COUNT }, () => ({
    name: faker.person.fullName(),
    email: faker.internet.email(),
    emailVerified: faker.datatype.boolean(),
    image: faker.image.avatar(),
    password: faker.internet.password({ length: 12 }),
    createdAt: subDays(new Date(), faker.number.int({ min: 1, max: 730 })),
    updatedAt: new Date(),
  }))
  
  const createdUsers = await db.insert(user).values(usersData).returning()
  
  // 3. Criar organizações
  console.log("🏢 Criando organizações...")
  const orgsData = Array.from({ length: ORGS_COUNT }, (_, idx) => {
    const owner = createdUsers[idx]!
    return {
      name: `${faker.company.name()} Store`,
      slug: slugify(`${faker.company.name()}-${idx}`),
      ownerId: owner.id,
      nif: faker.finance.bic(),
      phone: faker.phone.number(),
      createdAt: subDays(new Date(), faker.number.int({ min: 1, max: 365 })),
      metadata: JSON.stringify({ industry: faker.commerce.department() }),
    }
  })
  
  const createdOrgs = await db.insert(organization).values(orgsData).returning()
  
  // 4. Criar categorias e subcategorias
  console.log("📂 Criando categorias...")
  const categoryRows = NAVIGATION_CATEGORIES.map((cat) => ({
    name: cat.name,
    slug: cat.id,
    image: CATEGORY_IMAGE_MAP[cat.id] ?? null,
    description: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  }))
  
  const createdCategories = await db.insert(category).values(categoryRows).returning()
  
  const subcategoryRows = createdCategories.flatMap((cat) => {
    const source = NAVIGATION_CATEGORIES.find((c) => c.id === cat.slug)
    if (!source) return []
    return source.subcategories.map((sub) => ({
      categoryId: cat.id,
      name: sub,
      slug: sub,
      image: SUBCATEGORY_IMAGE_MAP[sub] ?? null,
      description: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    }))
  })
  
  const createdSubcategories = await db.insert(subcategory).values(subcategoryRows).returning()
  
  // 5. Criar relacionamentos (membros, convites, etc.)
  console.log("🔗 Criando relacionamentos...")
  const memberRows: any[] = []
  const invitationRows: any[] = []
  const sessionRows: any[] = []
  const accountRows: any[] = []
  const notificationRows: any[] = []
  const outlineRows: any[] = []
  
  for (const org of createdOrgs) {
    const ownerUser = createdUsers.find((u) => u.id === org.ownerId)!
    
    // Membros
    memberRows.push({
      organizationId: org.id,
      userId: ownerUser.id,
      role: "owner",
      createdAt: subDays(new Date(), faker.number.int({ min: 1, max: 365 })),
    })
    
    const admins = faker.helpers.arrayElements(
      createdUsers.filter((u) => u.id !== ownerUser.id), 2
    )
    const resellers = faker.helpers.arrayElements(
      createdUsers.filter((u) => u.id !== ownerUser.id && !admins.includes(u)), 3
    )
    
    admins.forEach((admin) =>
      memberRows.push({
        organizationId: org.id,
        userId: admin.id,
        role: "admin",
        createdAt: subDays(new Date(), faker.number.int({ min: 1, max: 100 })),
      })
    )
    
    resellers.forEach((reseller) =>
      memberRows.push({
        organizationId: org.id,
        userId: reseller.id,
        role: "reseller",
        createdAt: subDays(new Date(), faker.number.int({ min: 1, max: 100 })),
      })
    )
    
    // Convites
    Array.from({ length: 2 }).forEach(() => {
      invitationRows.push({
        organizationId: org.id,
        email: faker.internet.email(),
        role: faker.helpers.arrayElement(["member", "reseller"]),
        status: "pending",
        expiresAt: addDays(new Date(), faker.number.int({ min: 3, max: 7 })),
        createdAt: subDays(new Date(), faker.number.int({ min: 1, max: 30 })),
        inviterId: ownerUser.id,
      })
    })
    
    // Sessões e contas
    sessionRows.push({
      expiresAt: addDays(new Date(), faker.number.int({ min: 1, max: 7 })),
      token: faker.string.uuid(),
      createdAt: new Date(),
      updatedAt: new Date(),
      ipAddress: faker.internet.ip(),
      userAgent: faker.internet.userAgent(),
      userId: ownerUser.id,
      activeOrganizationId: org.id,
    })
    
    accountRows.push({
      accountId: faker.string.uuid(),
      providerId: "google",
      userId: ownerUser.id,
      accessToken: faker.string.alphanumeric(80),
      refreshToken: faker.string.alphanumeric(80),
      idToken: faker.string.alphanumeric(80),
      accessTokenExpiresAt: addDays(new Date(), faker.number.int({ min: 15, max: 30 })),
      refreshTokenExpiresAt: addDays(new Date(), faker.number.int({ min: 90, max: 120 })),
      scope: "openid profile email",
      password: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    })
    
    // Notificações
    Array.from({ length: 3 }).forEach(() => {
      const randomUser = faker.helpers.arrayElement(createdUsers)
      notificationRows.push({
        userId: randomUser.id,
        type: faker.helpers.arrayElement(["info", "warning", "success"]),
        title: faker.lorem.sentence(6),
        message: faker.lorem.sentences(2),
        metadata: JSON.stringify({ url: "/" }),
        read: faker.datatype.boolean(),
        createdAt: subDays(new Date(), faker.number.int({ min: 0, max: 35 })),
      })
    })
    
    // Outlines
    Array.from({ length: 2 }).forEach(() => {
      outlineRows.push({
        organizationId: org.id,
        header: faker.company.catchPhrase(),
        sectionType: faker.helpers.arrayElement(["Technical Approach", "Design", "Capabilities"]),
        status: faker.helpers.arrayElement(["Pending", "In-Progress", "Completed"]),
        target: faker.number.int({ min: 0, max: 100 }),
        limit: faker.number.int({ min: 0, max: 100 }),
        reviewer: faker.helpers.arrayElement(["Assim", "Bini", "Mami"]),
        createdAt: subDays(new Date(), faker.number.int({ min: 1, max: 90 })),
      })
    })
  }
  
  // 6. Inserir relacionamentos
  await Promise.all([
    db.insert(member).values(memberRows).execute(),
    db.insert(invitation).values(invitationRows).execute(),
    db.insert(session).values(sessionRows).execute(),
    db.insert(account).values(accountRows).execute(),
    db.insert(notification).values(notificationRows).execute(),
    db.insert(outline).values(outlineRows).execute(),
  ])
  
  // 7. Criar produtos
  console.log("📦 Criando produtos...")
  const products: any[] = []
  
  for (const org of createdOrgs) {
    for (const group of PRODUCT_VARIANTS) {
      Array.from({ length: PRODUCTS_PER_GROUP }).forEach(() => {
        const chosenSubcategory = faker.helpers.arrayElement(createdSubcategories)
        const chosenCategory = createdCategories.find((c) => c.id === chosenSubcategory.categoryId)
        
        products.push(createProductSeedData(
          org.id,
          group,
          chosenCategory?.id ?? createdCategories[0].id,
          chosenSubcategory.id,
          `${chosenCategory?.slug ?? createdCategories[0].slug}/${chosenSubcategory.slug}`
        ))
      })
    }
  }
  
  await db.insert(product).values(products).execute()
  
  // 8. Resumo
  console.log("\n🎉 SEED COMPLETADO COM SUCESSO!")
  console.log("📊 Resumo:")
  console.log(`  👥 ${createdUsers.length} usuários`)
  console.log(`  🏢 ${createdOrgs.length} organizações`)
  console.log(`  🔗 ${memberRows.length} membros`)
  console.log(`  📧 ${invitationRows.length} convites`)
  console.log(`  📱 ${sessionRows.length} sessões`)
  console.log(`  💳 ${accountRows.length} contas`)
  console.log(`  🔔 ${notificationRows.length} notificações`)
  console.log(`  📋 ${outlineRows.length} outlines`)
  console.log(`  📦 ${products.length} produtos`)
}

// ============================================================================
// EXECUÇÃO
// ============================================================================

main()
  .then(() => {
    console.log("\n✅ Seed finalizado com sucesso!")
    process.exit(0)
  })
  .catch((err) => {
    console.error("\n❌ Erro na seed:", err)
    process.exit(1)
  })