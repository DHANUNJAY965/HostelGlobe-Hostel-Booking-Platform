import { compare } from 'bcryptjs';
import clientPromise from '../../../../lib/mongodb';

export async function POST(req) {
  try {
    const { email, password, role } = await req.json();

    // Validate input
    if (!email || !password || !role) {
      return new Response(JSON.stringify({ error: 'Email, password, and role are required.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Connect to MongoDB
    const client = await clientPromise;
    const usersCollection = client.db().collection('users');

    // Find user by email
    const user = await usersCollection.findOne({ email });
    if (!user) {
      return new Response(JSON.stringify({ error: 'Invalid email or password.' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Verify password
    const isValidPassword = await compare(password, user.password);
    if (!isValidPassword) {
      return new Response(JSON.stringify({ error: 'Invalid email or password.' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Check role
    if (user.role !== role) {
      return new Response(JSON.stringify({ error: 'Role mismatch.' }), {
        status: 403,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Create a session or token (simple example; integrate your session management)
    const session = {
        id: user._id,
        email: user.email,
        role: user.role,
        username: user.username, // Assuming `username` is stored in the database
      };

    return new Response(JSON.stringify(session), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Login error:', error);
    return new Response(JSON.stringify({ error: 'An error occurred during login.' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
