
import Head from 'next/head';
import CustomerHeader from '../_components/CustomerHeader';
import Footer from '../_components/Footer';

export default function Vision() {
    return (
        <>
            <CustomerHeader />
            <div className="bg-gradient-to-br from-green-400 to-blue-500 min-h-screen flex flex-col items-center justify-center text-white">
                <Head>
                    <title>Vision | Foodie App</title>
                    <meta name="description" content="Our vision for the Foodie App." />
                </Head>

                <main className="text-center max-w-4xl">
                    <h1 className="text-5xl font-extrabold mb-6">Our Vision</h1>
                    <p className="text-lg md:text-xl leading-relaxed">
                        At Foodie App, we envision a world where food lovers can effortlessly
                        connect with their favorite cuisines and restaurants. Our goal is to
                        redefine dining experiences with seamless technology, exceptional
                        service, and unmatched convenience.
                    </p>
                    <p className="text-lg md:text-xl leading-relaxed mt-6">
                        We strive to empower local restaurants by providing them with the tools
                        they need to reach a broader audience. Through innovative solutions,
                        we aim to create a community where everyone can explore new flavors,
                        support local businesses, and enjoy delicious meals delivered right to
                        their doorstep.
                    </p>
                    <p className="text-lg md:text-xl leading-relaxed mt-6">
                        Our vision includes leveraging cutting-edge AI to personalize food
                        recommendations, reducing delivery times with advanced logistics, and
                        ensuring sustainability by partnering with eco-friendly services.
                    </p>
                    <div className="mt-10">
                        <button className="bg-white text-green-500 px-6 py-3 rounded-full shadow-lg hover:shadow-xl hover:bg-green-50 transition">
                            Explore More
                        </button>
                    </div>
                </main>
            </div>
            <Footer />
        </>
    );
}
