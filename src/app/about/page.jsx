'use client'
import React, { useEffect, useState } from 'react'
import CustomerHeader from '../_components/CustomerHeader'
import About from '../_components/About'
import Footer from '../_components/Footer'
import RestaurantHeader from '../_components/RestaurantHeader';
import DeliveryUserHeader from '../_components/DeliveryUserHeader';

export default function about() {
    const [cusUser, setCusUser] = useState({});
    const [restUser, setRestUser] = useState({});
    const [deliUser, setDeliUser] = useState({});
    useEffect(()=>{
        const customerUser = localStorage.getItem('user');
        const restaurantUser = localStorage.getItem('restaurantUser');
        const deliveryUser = localStorage.getItem('deliveryUser');

        if(customerUser) setCusUser(customerUser);
        if(restaurantUser) setRestUser(restaurantUser);
        if(deliveryUser) setDeliUser(deliveryUser);
    },[])

    console.log(restUser);
  return (
    <div>
        {
            cusUser?.userType === 'customerUser' && <CustomerHeader/>
        }
        {
            restUser?.userType === 'restaurantUser' && <RestaurantHeader/>
        }
        {
            deliUser?.userType === 'deliveryUser' && <DeliveryUserHeader/>
        }
      <About/>
      <Footer/>
    </div>
  )
}
