import { helpers } from '@/lib'
import React from 'react'

export default function CopyRight() {
  return (
    <div className="container border-t mx-auto px-5 py-5 mt-10 text-center">
    <p className="text-white/60 text-sm">
      © {helpers.formatDate(new Date())}. All rights reserved
    </p>
  </div>
  )
}
