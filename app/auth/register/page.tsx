'use client'

import { Register } from '@/components/auth/register'

import { AuthListener } from '@/components/auth/auth-listener'

export default function RegisterPage() {
  return (
    <>
      <AuthListener />
      <Register />
    </>
  )
}
