'use client'
import React, { useEffect, useState } from 'react'
import CustomerHeader from '../_components/CustomerHeader'
import About from '../_components/About'
import Footer from '../_components/Footer'
import RestaurantHeader from '../_components/RestaurantHeader';
import DeliveryUserHeader from '../_components/DeliveryUserHeader';
import CommonHeader from '../_components/CommonHeader'

export default function AboutPage() {
  const [cusUser, setCusUser] = useState(null);
  const [restUser, setRestUser] = useState(null);
  const [deliUser, setDeliUser] = useState(null);

  useEffect(() => {
    const customerUser = localStorage.getItem('user');
    const restaurantUser = localStorage.getItem('restaurantUser');
    const deliveryUser = localStorage.getItem('deliveryUser');

    if (customerUser) setCusUser(JSON.parse(customerUser)); 
    if (restaurantUser) setRestUser(JSON.parse(restaurantUser)); 
    if (deliveryUser) setDeliUser(JSON.parse(deliveryUser));
  }, []);

  return (
    <div>
      {/* Conditional Rendering for Headers */}
      {cusUser?.userType === 'customerUser' && <CustomerHeader />}
      {restUser?.userType === 'restaurantUser' && <RestaurantHeader />}
      {deliUser?.userType === 'deliveryUser' && <DeliveryUserHeader />}
      {!cusUser && !restUser && !deliUser && <CommonHeader />}

      {/* Main Content */}
      <About />
      <Footer />
    </div>
  );
}
