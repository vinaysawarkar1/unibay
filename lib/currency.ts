const gbp = new Intl.NumberFormat('en-GB', {
  style: 'currency',
  currency: 'GBP',
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
})

const gbpWithPence = new Intl.NumberFormat('en-GB', {
  style: 'currency',
  currency: 'GBP',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

/** Whole pounds (catalog stores GBP as integer pounds). */
export function formatGBP(pounds: number): string {
  if (!Number.isFinite(pounds)) return '£0'
  return gbp.format(Math.round(pounds))
}

export function formatGBPWithPence(pounds: number): string {
  if (!Number.isFinite(pounds)) return '£0.00'
  return gbpWithPence.format(pounds)
}
