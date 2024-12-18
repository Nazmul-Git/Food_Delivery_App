import { connectionUrl } from "@/app/lib/db";
import DeliveryUserModel from "@/app/lib/DeliveryUserModel";
import mongoose from "mongoose";
import { NextResponse } from "next/server";

export async function GET(req) {
    // Log the request URL and the searchParams to debug
    // console.log("Request URL:", req.nextUrl.toString());
    // console.log("Search Params:", req.nextUrl.searchParams);

    // Destructure the query parameters from the request
    const city = req.nextUrl.searchParams.get('city');
    const zone = req.nextUrl.searchParams.get('zone');

    console.log('City:', city);
    console.log('Zone:', zone);

    // Ensure city and zone are both provided
    if (!city || !zone) {
        return NextResponse.json({
            success: false,
            error: "City and Zone are required parameters."
        }, { status: 400 });
    }

    let success = false;
    let result = [];

    try {
        // Connect to the database
        await mongoose.connect(connectionUrl);

        const filter = {
            $and: [
                { "city": { $regex: new RegExp(city, "i") } },
                { "zone": { $regex: new RegExp(zone, "i") } },
            ],
        };

        // Find matching users
        result = await DeliveryUserModel.find(filter);

        success = result.length > 0;

        // Return the result and success status
        return NextResponse.json({ result, success });
    } catch (error) {
        console.error("Error filtering delivery users by city and zone:", error);

        return NextResponse.json(
            { success: false, error: "Internal server error!" },
            { status: 500 }
        );
    } finally {
        mongoose.connection.close();
    }
}
