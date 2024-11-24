import { connectionUrl } from '@/app/lib/db';
import { RestaurantsSchema } from '@/app/lib/RestaurantModel';
import mongoose from 'mongoose';
import { NextResponse } from 'next/server';

export async function GET(request) {
    // Get the query parameters
    const queryParams = request.nextUrl.searchParams;

    // Log the value of the location query parameter ex: http://localhost:3000/api/customer?restaurant=BBQ
    //   const name = queryParams.get('restaurant');
    //   console.log(name); // BBQ

    let filter = {};
    // search by location
    if (queryParams.get('location')) {
        let address = queryParams.get('location');
        filter = { address: { $regex: new RegExp(address, 'i') } };
    }
    // search by restaurant name
    else if (queryParams.get('restaurant')) {
        let name = queryParams.get('restaurant');
        filter = { restaurantName: { $regex: new RegExp(name, 'i') } };
    }
    await mongoose.connect(connectionUrl);
    let result = await RestaurantsSchema.find(filter);

    return NextResponse.json({ success: true, result });
}
