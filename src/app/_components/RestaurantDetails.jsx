import { FaEnvelope, FaPhoneAlt, FaMapMarkerAlt } from 'react-icons/fa'; // Import specific icons

const RestaurantDetails = ({ restaurantDetails }) => {
    const googleMapUrl = `https://www.google.com/maps?q=${encodeURIComponent(restaurantDetails.address)}&t=&z=13&ie=UTF8&iwloc=&output=embed`;

    return (
        <div className="bg-gray-100 py-20 mt-10">
            <div className="container mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* Left Section: Address and Google Map */}
                <div className="space-y-8">
                    <div className="flex justify-start items-center space-x-4">
                        <FaMapMarkerAlt className="text-red-600 text-4xl" /> {/* Map icon */}
                        <div className="text-left">
                            <h3 className="text-xl font-semibold text-gray-800">Address</h3>
                            <p className="text-lg text-gray-600">{restaurantDetails.address}</p>
                        </div>
                    </div>

                    {/* Embed Google Map based on address */}
                    <div className="w-full h-80">
                        <iframe
                            src={googleMapUrl}
                            width="100%"
                            height="100%"
                            frameBorder="0"
                            style={{ border: '0' }}
                            allowFullScreen=""
                            aria-hidden="false"
                            tabIndex="0"
                        ></iframe>
                    </div>
                </div>

                {/* Right Section: Email and Phone Number */}
                <div className="space-y-10">
                    {/* Email */}
                    <div className="flex justify-start items-center space-x-4">
                        <FaEnvelope className="text-indigo-600 text-4xl" />
                        <div className="text-left">
                            <h3 className="text-xl font-semibold text-gray-800">Email</h3>
                            <p className="text-lg text-gray-600">{restaurantDetails.email}</p>
                        </div>
                    </div>

                    {/* Phone Number */}
                    <div className="flex justify-start items-center space-x-4">
                        <FaPhoneAlt className="text-green-600 text-4xl" />
                        <div className="text-left">
                            <h3 className="text-xl font-semibold text-gray-800">Phone Number</h3>
                            <p className="text-lg text-gray-600">{restaurantDetails.phone}</p>
                        </div>
                    </div>

                    {/* Styled Last Paragraph */}
                    <p className="p-6 text-md text-gray-700 leading-relaxed text-justify">
                        <strong>NOTE:</strong> Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quia dolorum explicabo cum atque, dolorem repellat quasi vel natus, tenetur voluptatum quisquam doloribus similique non voluptatibus assumenda omnis optio harum saepe. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quia dolorum explicabo cum atque, dolorem repellat quasi vel natus, tenetur voluptatum quisquam doloribus similique non.
                    </p>

                </div>
            </div>
        </div>
    );
};

export default RestaurantDetails;
