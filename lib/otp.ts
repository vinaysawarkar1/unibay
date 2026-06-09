export function generateOTP(length: number = 6): string {
  const digits = '0123456789'
  let otp = ''
  for (let i = 0; i < length; i++) {
    otp += digits.charAt(Math.floor(Math.random() * digits.length))
  }
  return otp
}

export function getOTPExpiryTime(minutes: number = 10): Date {
  const now = new Date()
  return new Date(now.getTime() + minutes * 60 * 1000)
}

export function isOTPExpired(expiryTime: Date): boolean {
  return new Date() > expiryTime
}
