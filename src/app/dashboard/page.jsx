'use client'
import React, { useEffect } from 'react'
import DeliveryHeader from '../_components/DeliveryUserHeader'
import Footer from '../_components/Footer'
import { useRouter } from 'next/navigation'

export default function page() {
  const router = useRouter();
  
  useEffect(()=>{
    if(!JSON.parse(localStorage.getItem('deliveryUser'))){
      router.push('/delivery-user');
    }
  },[])

  return (
    <div>
      <DeliveryHeader/>
      <p>delivery dashboard</p>
      <Footer/>
    </div>
  )
}
