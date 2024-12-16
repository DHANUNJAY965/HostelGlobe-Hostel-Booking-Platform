
import { hash } from 'bcryptjs'
// import clientPromise from '../../../lib/mongodb'
import clientPromise from "../../../../lib/mongodb"

export async function POST(req) {
  const { username, fullName, email, phoneNumber, password, role } = await req.json()

  if (!username || !fullName || !email || !phoneNumber || !password || !role) {
    return new Response(
      JSON.stringify({ message: 'Missing required fields' }),
      { status: 400 }
    )
  }

  const client = await clientPromise
  const db = client.db()

  const existingUser = await db.collection('users').findOne({ email })
  if (existingUser) {
    return new Response(
      JSON.stringify({ message: 'User already exists' }),
      { status: 400 }
    )
  }

  const hashedPassword = await hash(password, 12)

  const result = await db.collection('users').insertOne({
    username,
    fullName,
    email,
    phoneNumber,
    password: hashedPassword,
    role,
    createdAt: new Date(),
  })

  return new Response(
    JSON.stringify({ message: 'User created successfully', userId: result.insertedId }),
    { status: 201 }
  )
}
