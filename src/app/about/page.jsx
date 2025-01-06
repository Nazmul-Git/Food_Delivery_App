'use client';
import React from 'react';
import CustomerHeader from '../_components/CustomerHeader';
import About from '../_components/About';
import Footer from '../_components/Footer';

export default function AboutPage() {
    return (
        <>
            <CustomerHeader />
            {/* Main Content */}
            <About />
            <Footer />
        </>
    );
}
