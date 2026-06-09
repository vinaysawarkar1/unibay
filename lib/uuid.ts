/**
 * UUID v4 generator that works in both secure (HTTPS) and non-secure (HTTP) contexts.
 * crypto.randomUUID() is only available in secure contexts (HTTPS / localhost).
 * This polyfill uses crypto.getRandomValues() which works in HTTP too,
 * and falls back to Math.random() if even that is unavailable.
 */
export function generateUUID(): string {
  // Use native crypto.randomUUID if available (HTTPS / localhost)
  if (
    typeof crypto !== 'undefined' &&
    typeof (crypto as any).randomUUID === 'function'
  ) {
    return (crypto as any).randomUUID()
  }

  // Fallback: use crypto.getRandomValues (works on HTTP in modern browsers)
  if (typeof crypto !== 'undefined' && typeof crypto.getRandomValues === 'function') {
    const bytes = new Uint8Array(16)
    crypto.getRandomValues(bytes)
    // Set version 4
    bytes[6] = (bytes[6] & 0x0f) | 0x40
    // Set variant bits
    bytes[8] = (bytes[8] & 0x3f) | 0x80
    const hex = Array.from(bytes).map(b => b.toString(16).padStart(2, '0'))
    return [
      hex.slice(0, 4).join(''),
      hex.slice(4, 6).join(''),
      hex.slice(6, 8).join(''),
      hex.slice(8, 10).join(''),
      hex.slice(10, 16).join(''),
    ].join('-')
  }

  // Last resort fallback using Math.random (not cryptographically secure, but functional)
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0
    const v = c === 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}
