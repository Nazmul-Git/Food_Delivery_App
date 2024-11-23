import { connectionUrl } from '@/app/lib/db';
import { RestaurantsSchema } from '@/app/lib/RestaurantModel';
import mongoose from 'mongoose';
import { NextResponse } from 'next/server';

export async function GET(request) {
    // Get the query parameters
    const queryParams = request.nextUrl.searchParams;

    // Log the value of the location query parameter ex: http://localhost:3000/api/customer?restaurants=BBQ
    //   const location = queryParams.get('restaurants');
    //   console.log(location); // BBQ

    let filter ={};
    if(queryParams.get('location')){
        let address = queryParams.get('location');
        filter = {$regex : new RegExp(address, 'i')};
    }
    await mongoose.connect(connectionUrl);
    let result = await RestaurantsSchema.find(filter);

    return NextResponse.json({ success: true, result });
}
