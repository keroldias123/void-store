import { faker } from "@faker-js/faker"

export async function getMonthRevenue() {
  // simula atraso de rede
  await new Promise((resolve) => setTimeout(resolve, 800))

  return {
    receipt: faker.number.int({ min: 2000000, max: 9000000 }),
    diffFromLastMonth: faker.number.int({ min: -20, max: 40 }),
  }
}

export async function getMonthOrdersAmount() {
  // simula tempo de rede
  await new Promise((resolve) => setTimeout(resolve, 700))

  return {
    amount: faker.number.int({ min: 120, max: 950 }),
    diffFromLastMonth: faker.number.int({ min: -30, max: 45 }),
  }
}

export async function getDayOrdersAmount() {
  // simula latência de rede
  await new Promise((resolve) => setTimeout(resolve, 600))

  return {
    amount: faker.number.int({ min: 5, max: 120 }),
    diffFromYesterday: faker.number.int({ min: -40, max: 40 }),
  }
}

export async function getMonthCanceledOrdersAmount() {
  // simula latência da rede
  await new Promise((resolve) => setTimeout(resolve, 700))

  return {
    amount: faker.number.int({ min: 0, max: 50 }), // cancelamentos do mês
    diffFromLastMonth: faker.number.int({ min: -30, max: 30 }), // variação %
  }
}


interface DailyRevenue {
  date: string
  receipt: number
}

interface Params {
  from?: Date
  to?: Date
}

export async function getDailyRevenueInPeriod({ from, to }: Params): Promise<DailyRevenue[]> {
  // simula atraso de rede
  await new Promise((resolve) => setTimeout(resolve, 700))

  if (!from || !to) return []

  const daysDiff = Math.ceil((to.getTime() - from.getTime()) / (1000 * 60 * 60 * 24)) + 1
  const data: DailyRevenue[] = []

  for (let i = 0; i < daysDiff; i++) {
    const date = new Date(from)
    date.setDate(from.getDate() + i)

    data.push({
      date: date.toLocaleDateString("pt-AO"), // formato dd/mm/yyyy
      receipt: faker.number.int({ min: 10000, max: 500000 }), // valores em centavos
    })
  }

  return data
}

interface PopularProduct {
  product: string
  amount: number
}

export async function getPopularProducts(): Promise<PopularProduct[]> {
  // simula latência de rede
  await new Promise((resolve) => setTimeout(resolve, 600))

  // gerar entre 5 e 8 produtos populares
  const productsCount = faker.number.int({ min: 5, max: 8 })

  const data: PopularProduct[] = []

  for (let i = 0; i < productsCount; i++) {
    data.push({
      product: faker.commerce.productName(),
      amount: faker.number.int({ min: 10, max: 300 }),
    })
  }

  return data
}