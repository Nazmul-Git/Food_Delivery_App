'use client'

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from 'next/navigation'; 
import Footer from "../_components/Footer";
import DeliveryUserLogin from "../_components/DeliveryUserLogin";
import DeliveryUserSignup from "../_components/DeliveryUserSignup";
import DeliveryHeader from "../_components/DeliveryUserHeader";

const deliveryDashboard = () => {
    const [login, setLogin] = useState(true);
    const [queryParams, setQueryParams] = useState(null);
    const searchParams = useSearchParams(); 
    const router = useRouter();

    // Fetch query parameters in useEffect
    useEffect(() => {
        if (searchParams) {
            // Example of accessing specific query parameters like `order`
            setQueryParams({
                dashboard: searchParams.get('dashboard')
            });
        }
    }, [searchParams]);

    useEffect(()=>{
        if(JSON.parse(localStorage.getItem('deliveryUser'))){
          router.push('/dashboard');
        }
      },[])

    return (
        <>
            <DeliveryHeader />

            <div className="min-h-screen bg-gray-100 flex items-center justify-center p-16">
                <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md">
                    {
                        login ? 
                            <h2 className="text-2xl font-bold text-center text-pink-600 mb-6">User Login</h2>
                            :
                            <h2 className="text-2xl font-bold text-center text-pink-600 mb-6">Create Account</h2>
                    }
                    {
                        login ? 
                            <DeliveryUserLogin redirect={queryParams} />
                            :
                            <DeliveryUserSignup redirect={queryParams} />
                    }
                    <div onClick={() => setLogin(!login)}>
                        {
                            login ? 
                                <p className="mt-6 text-center text-sm cursor-pointer text-gray-500">
                                    Don't have an account?{' '}
                                    <span className="text-pink-600 hover:underline">Sign up</span>
                                </p>
                                :
                                <p className="mt-6 text-center text-sm cursor-pointer text-gray-500">
                                    Already have an account?{' '}
                                    <span className="text-pink-600 hover:underline">Login here</span>
                                </p>
                        }
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
}

export default deliveryDashboard;
