
import clientPromise from "../../../lib/mongodb"
import { ObjectId } from "mongodb"

export async function POST(req) {
  try {
    // Ensure the request body is JSON
    if (!req.headers.get("Content-Type")?.includes("application/json")) {
      return new Response(JSON.stringify({ message: 'Content-Type must be application/json' }), { status: 400 })
    }

    const { session, hostelData } = await req.json()

    console.log('Received hostel data:', hostelData)

    if (!session) {
      return new Response(JSON.stringify({ message: 'No session provided' }), { status: 401 })
    }

    if (session.role !== 'admin') {
      return new Response(JSON.stringify({ message: 'Unauthorized' }), { status: 403 })
    }

    // Validate images
    if (!hostelData.images || !Array.isArray(hostelData.images)) {
      console.log('Invalid image data received:', hostelData.images)
      return new Response(JSON.stringify({ message: 'Invalid image data' }), { status: 400 })
    }

    // Filter out null or empty image URLs
    const validImages = hostelData.images.filter(image => image && image.trim() !== '')

    console.log('Valid images after filtering:', validImages)

    // Ensure we don't exceed 5 images
    const finalImages = validImages.slice(0, 5)

    console.log('Final images to be saved:', finalImages)

    hostelData.images = finalImages
    hostelData.adminId = session.id

    const client = await clientPromise
    const db = client.db()

    const result = await db.collection('hostels').insertOne(hostelData)

    console.log('Hostel inserted with ID:', result.insertedId)

    return new Response(
      JSON.stringify({ 
        message: 'Hostel created successfully', 
        hostelId: result.insertedId,
        images: finalImages 
      }),
      { status: 201 }
    )
  } catch (error) {
    console.error('Error in POST method:', error)
    return new Response(
      JSON.stringify({ message: 'Internal server error', error: error.message }),
      { status: 500 }
    )
  }
}


export async function GET(req) {
  try {
    const authHeader = req.headers.get('Authorization'); 
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return new Response(JSON.stringify({ message: 'Unauthorized' }), { status: 401 });
    }

    const adminId = authHeader.split(' ')[1]; // Extract adminId from Bearer token

    if (!adminId) {
      return new Response(JSON.stringify({ message: 'No admin ID provided' }), { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db();

    console.log("the admin id is : ", adminId);
    const hostels = await db.collection('hostels').find({ adminId }).toArray();

    if (hostels.length === 0) {
      return new Response(JSON.stringify({ message: 'No hostels found for the given adminId' }));
    }

    return new Response(JSON.stringify(hostels), { status: 200 });
  } catch (error) {
    console.error('Error in GET method:', error);
    return new Response(
      JSON.stringify({ message: 'Internal server error', error: error.message }),
      { status: 500 }
    );
  }
}


export async function PUT(req) {
  try {
    // Ensure the request body is JSON
    if (!req.headers.get("Content-Type")?.includes("application/json")) {
      return new Response(JSON.stringify({ message: 'Content-Type must be application/json' }), { status: 400 });
    }

    // Parse the request body to get session and hostelData
    const { session, hostelData } = await req.json();

    if (!session) {
      return new Response(JSON.stringify({ message: 'No session provided' }), { status: 401 });
    }

    if (session.role !== 'admin') {
      return new Response(JSON.stringify({ message: 'Unauthorized' }), { status: 403 });
    }

    // Get hostelId from the request header (X-Hostel-Id)
    const hostelId = req.headers.get('X-Hostel-Id');
    if (!hostelId) {
      return new Response(JSON.stringify({ message: 'Hostel ID is missing in the headers' }), { status: 400 });
    }

    // Ensure hostelId is a valid ObjectId
    if (!ObjectId.isValid(hostelId)) {
      return new Response(JSON.stringify({ message: 'Invalid Hostel ID' }), { status: 400 });
    }

    // Debug log to check the values
    console.log('Hostel ID:', hostelId);
    console.log('Session ID:', session.id);

    // Ensure images is an array and remove any null values
    if (hostelData.images) {
      hostelData.images = Array.isArray(hostelData.images) ? hostelData.images.filter(Boolean) : [];
    }

    const client = await clientPromise;
    const db = client.db();

    // Debug log the hostel data before the update
    console.log('Hostel Data:', hostelData);

    // Update the hostel in the database
    const result = await db.collection('hostels').updateOne(
      { _id: hostelId, adminId: session.id }, 
      { $set: hostelData }
    );

    if (result.matchedCount === 0) {
      return new Response(
        JSON.stringify({ message: 'Hostel not found or you are not authorized to update it' })
      );
    }

    return new Response(JSON.stringify({ message: 'Hostel updated successfully' }), { status: 200 });
  } catch (error) {
    console.error('Error in PUT method:', error);
    return new Response(
      JSON.stringify({ message: 'Internal server error', error: error.message }),
      { status: 500 }
    );
  }
}

export async function DELETE(req) {
  try {
    // Ensure the request body is JSON
    if (!req.headers.get("Content-Type")?.includes("application/json")) {
      return new Response(JSON.stringify({ message: 'Content-Type must be application/json' }), { status: 400 });
    }

    // Extract hostelId from the headers (X-Hostel-Id)
    const hostelId = req.headers.get('X-Hostel-Id');
   
    if (!hostelId) {
      return new Response(JSON.stringify({ message: 'Hostel ID is missing in the headers' }), { status: 400 });
    }

    // Ensure hostelId is a valid ObjectId
    if (!ObjectId.isValid(hostelId)) {
      return new Response(JSON.stringify({ message: 'Invalid Hostel ID' }), { status: 400 });
    }

    // Convert hostelId to ObjectId before using it in the query
    const hostelObjectId = new ObjectId(hostelId);

    // Debug log to check the hostelId and session data
    console.log('Hostel ID:', hostelObjectId);

    const client = await clientPromise;
    const db = client.db();

    // Delete the hostel in the database
    const result = await db.collection('hostels').deleteOne(
      { _id: hostelObjectId } // Use ObjectId here
    );

    console.log("the delete operation", result);
    if (result.deletedCount === 0) {
      return new Response(
        JSON.stringify({ message: 'Hostel not found or you are not authorized to delete it' }),
        { status: 404 }
      );
    }

    return new Response(JSON.stringify({ message: 'Hostel deleted successfully' }), { status: 200 });
  } catch (error) {
    console.error('Error in DELETE method:', error);
    return new Response(
      JSON.stringify({ message: 'Internal server error', error: error.message }),
      { status: 500 }
    );
  }
}