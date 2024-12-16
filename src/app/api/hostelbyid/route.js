import clientPromise from "../../../lib/mongodb";
import { ObjectId } from "mongodb";

export async function GET(req) {
  try {
    const hostelId = req.headers.get("X-Hostel-Id");

    if (!hostelId) {
      return new Response(
        JSON.stringify({ message: "Hostel ID is missing in the headers" }),
        { status: 400 }
      );
    }

    // Ensure the Hostel ID is a valid MongoDB ObjectId
    if (!ObjectId.isValid(hostelId)) {
      return new Response(
        JSON.stringify({ message: "Invalid Hostel ID" }),
        { status: 400 }
      );
    }

    // Connect to the MongoDB database
    const client = await clientPromise;
    const db = client.db();

    // Convert the hostelId to an ObjectId
    const hostelObjectId = new ObjectId(hostelId);

    // Fetch the hostel details by ID
    const hostel = await db.collection("hostels").findOne({ _id: hostelObjectId });

    // Check if the hostel was found
    if (!hostel) {
      console.log("Hostel not found", hostelId);
      return new Response(
        JSON.stringify({ message: "Hostel not found for the given ID" }),
        { status: 404 }
      );
    }

    // Return the hostel details
    return new Response(JSON.stringify(hostel), { status: 200 });
  } catch (error) {
    console.error("Error in GET method:", error);

    // Handle unexpected server errors
    return new Response(
      JSON.stringify({ message: "Internal server error", error: error.message }),
      { status: 500 }
    );
  }
}
