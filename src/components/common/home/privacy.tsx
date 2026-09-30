"use client"
import { cn } from '@/lib';
import { useGetAboutQuery } from '@/redux/api/settingApi';
import React from 'react'

export default function PrivacyBox({className}:any) {
    const { data: privacy, isLoading } = useGetAboutQuery({
        type: "privacy",
      });
  return (
    <div className={cn("backdrop-blur-md container rounded-3xl p-8 md:p-12 border border-white/20 ",className)}>
         <div className="ql-container ql-snow">
         <div
          className="ql-editor !p-0 !overflow-hidden"
          dangerouslySetInnerHTML={{ __html: privacy?.data?.content }}
        />
         </div>
      </div>
  )
}

