// src/app/api/players/route.ts
import { NextResponse } from 'next/server';
import clientPromise from '../../lib/mongodb';

export async function GET() {
  const client = await clientPromise;
  const db = client.db('test'); 
  const players = await db.collection('user').find({}).toArray(); 

  return NextResponse.json(players);
}

export async function POST(request: Request) {
  const client = await clientPromise;
  const db = client.db('test'); 
  const { name, score = 0, streak = 0 } = await request.json();

  const existingUser = await db.collection('user').findOne({ name });

  if (!existingUser) {
    const newUser = {
      name,
      score: 0,
      streak: 0,
    };
    await db.collection('user').insertOne(newUser);
    return NextResponse.json({ message: 'New user created', user: newUser }, { status: 201 });
  } else {
    const updatedUser = await db.collection('user').findOneAndUpdate(
      { name },
      { $set: { score, streak } },
      { returnOriginal: false }
    );
    return NextResponse.json(updatedUser, { status: 200 });
  }
}

// export async function POST(request: Request) {
//   const client = await clientPromise;
//   const db = client.db('test');
//   const { name, score, streak } = await request.json();
  
//   const player = await db.collection('user').findOneAndUpdate(
//     { name },
//     { $set: { score, streak } },
//     { new: true, upsert: true }
//   );

//   return NextResponse.json(player, { status: 201 });
// }
