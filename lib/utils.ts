import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export const DEFAULT_CURRENCY = "AOA"

export function formatKwanza(amountInCents: number) {
  const amount = amountInCents / 100
  return new Intl.NumberFormat("pt-AO", {
    style: "currency",
    currency: DEFAULT_CURRENCY,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount)
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
