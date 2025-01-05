'use client';
import React, { useEffect, useState } from 'react';
import CustomerHeader from '../_components/CustomerHeader';
import About from '../_components/About';
import Footer from '../_components/Footer';
import RestaurantHeader from '../_components/RestaurantHeader';
import DeliveryUserHeader from '../_components/DeliveryUserHeader';
import CommonHeader from '../_components/CommonHeader';

export default function AboutPage() {
    const [cusUser, setCusUser] = useState(null);
    const [cusAuthUser, setCusAuthUser] = useState(null);
    const [restUser, setRestUser] = useState(null);
    const [deliUser, setDeliUser] = useState(null);

    useEffect(() => {
      try {
          const customerUser = localStorage.getItem('user');
          const customerAuthUser = localStorage.getItem('authUser');
          const restaurantUser = localStorage.getItem('restaurantUser');
          const deliveryUser = localStorage.getItem('deliveryUser');
  
          if (customerUser) {
              setCusUser(JSON.parse(customerUser));
          }
          if (customerAuthUser) {
            setCusAuthUser(JSON.parse(customerAuthUser));
          }
  
          if (restaurantUser) {
              setRestUser(JSON.parse(restaurantUser));
          }
  
          if (deliveryUser) {
              setDeliUser(JSON.parse(deliveryUser));
          }
      } catch (error) {
          console.error('Error parsing user data from localStorage:', error);
      }
  }, []);  

    return (
        <div>
            {/* Conditional Rendering for Headers */}
            {cusUser && <CustomerHeader />}
            {cusAuthUser && <CustomerHeader />}
            {restUser && <RestaurantHeader />}
            {deliUser && <DeliveryUserHeader />}

            {/* Main Content */}
            <About />
            <Footer />
        </div>
    );
}
