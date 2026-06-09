'use client'

import { Suspense } from 'react'
import { SignIn } from '@/components/auth/sign-in'
import { AuthListener } from '@/components/auth/auth-listener'

export default function SignInPage() {
  return (
    <>
      <AuthListener />
      <Suspense fallback={null}>
        <SignIn />
      </Suspense>
    </>
  )
}
