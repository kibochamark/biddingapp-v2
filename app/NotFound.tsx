"use client";
import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React from 'react'

const NotFound = () => {
    const router = useRouter()
    const handleGoBack = () => {
        router.back();
    }
  return (
    <>
          <button
              onClick={handleGoBack}
              className="mt-8 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
              <ArrowLeft className="h-4 w-4" />
              Go Back
          </button>
    </>
  )
}

export default NotFound