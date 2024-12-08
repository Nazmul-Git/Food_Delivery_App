'use client'

import { useState, useEffect } from "react";
import { useSearchParams } from 'next/navigation';
import CustomerHeader from "../_components/CustomerHeader";
import Footer from "../_components/Footer";
import UserLogin from "../_components/UserLogin";
import UserSignUp from "../_components/UserSignUp";

const UserAuth = () => {
    const [login, setLogin] = useState(true);
    const [queryParams, setQueryParams] = useState(null);
    const searchParams = useSearchParams(); 

    // Fetch query parameters in useEffect
    useEffect(() => {
        if (searchParams) {
            // Example of accessing specific query parameters like `order`
            setQueryParams({
                order: searchParams.get('order')
            });
        }
    }, [searchParams]);

    return (
        <>
            <CustomerHeader />

            <div className="min-h-screen bg-gray-100 flex items-center justify-center p-16">
                <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md">
                    {
                        login ? 
                            <h2 className="text-2xl font-bold text-center text-orange-600 mb-6">User Login</h2>
                            :
                            <h2 className="text-2xl font-bold text-center text-orange-600 mb-6">Create Account</h2>
                    }
                    {
                        login ? 
                            <UserLogin redirect={queryParams} />
                            :
                            <UserSignUp redirect={queryParams} />
                    }
                    <div onClick={() => setLogin(!login)}>
                        {
                            login ? 
                                <p className="mt-6 text-center text-sm cursor-pointer text-gray-500">
                                    Don't have an account?{' '}
                                    <span className="text-orange-600 hover:underline">Sign up</span>
                                </p>
                                :
                                <p className="mt-6 text-center text-sm cursor-pointer text-gray-500">
                                    Already have an account?{' '}
                                    <span className="text-orange-600 hover:underline">Login here</span>
                                </p>
                        }
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
}

export default UserAuth;
