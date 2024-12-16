
import clientPromise from '../../../lib/mongodb';
import { ObjectId } from 'mongodb';

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db();

    // Fetch users without passwords
    const users = await db
      .collection('users')
      .find({}, { projection: { password: 0 } })
      .toArray();

    return new Response(JSON.stringify(users), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error fetching users:', error);

    return new Response(JSON.stringify({ message: 'Internal Server Error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

export async function PATCH(req) {
  try {
    // Parse the request body
    const body = await req.json();
    const { userId, currentRole, newRole } = body;

    // Validate input
    if (!userId || !currentRole || !newRole) {
      return new Response(JSON.stringify({ 
        message: 'User ID, current role, and new role are required' 
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Validate roles
    const validRoles = ['user', 'admin'];
    if (!validRoles.includes(newRole)) {
      return new Response(JSON.stringify({ 
        message: 'Invalid role' 
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Connect to MongoDB
    const client = await clientPromise;
    const db = client.db();

    // Update user role
    const result = await db.collection('users').updateOne(
      { 
        _id: new ObjectId(userId), 
        role: currentRole 
      }, 
      { 
        $set: { role: newRole } 
      }
    );

    // Check if the update was successful
    if (result.modifiedCount === 0) {
      return new Response(JSON.stringify({ 
        message: 'User not found or role already updated' 
      }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Return success response
    return new Response(JSON.stringify({ 
      message: 'User role updated successfully',
      userId,
      newRole 
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error updating user role:', error);

    return new Response(JSON.stringify({ 
      message: 'Internal Server Error',
      error: error instanceof Error ? error.message : String(error)
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}