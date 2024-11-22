'use client';

import React from 'react';
import Image from 'next/image';

export default function Banner() {
    return (
        <div className="relative w-full h-[300px]  overflow-hidden rounded-tl-full rounded-br-full">
            {/* overflow-hidden ensures the rounded corners apply to the image */}
            <Image 
                src="/images/banner.jpg" 
                sizes=''
                alt="Banner" 
                fill 
                className="object-cover" 
                priority 
            />
        </div>
    );
}
