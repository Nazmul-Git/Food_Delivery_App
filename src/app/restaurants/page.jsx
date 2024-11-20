'use client'

import React, { useState } from 'react'
import RestaurantHeader from '../_components/RestaurantHeader';
import Footer from '../_components/Footer';
import RestaurantLogin from '../_components/RestaurantLogin';

export default function Restaurant() {
    const [login, setLogin] = useState(true);

    return (
        <>
            <RestaurantHeader />
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
                <div className="bg-white p-8 rounded-xl shadow-lg w-96">
                    {
                        login ?
                            <RestaurantLogin /> :
                            <RestaurantSignup />
                    }
                    <div onClick={() => setLogin(!login)}>
                        {
                            login ?
                                <p className="mt-6 text-center text-sm cursor-pointer text-gray-500">
                                    Don't have an account?{' '}
                                    <span className="text-indigo-600 hover:underline">Sign up</span>
                                </p> :
                                <p className="mt-6 text-center text-sm cursor-pointer text-gray-500">
                                    Already have an account?{' '}
                                    <span className="text-indigo-600 hover:underline">Login here</span>
                                </p>
                        }
                    </div>
                </div>
            </div>
            <Footer/>
        </>
    )
}
