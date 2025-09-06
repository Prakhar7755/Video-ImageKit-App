import { Connection } from 'mongoose';

declare global {
  var mongoose: {
    conn: Connection | null;
    promise: Promise<Connection> | null;
  };
}

export {};

/* 
You're using Mongoose in your Next.js app to connect to MongoDB.

To reuse the same DB connection between API routes (and avoid reconnecting every time), developers often attach the connection to global.

But TypeScript doesn’t know that you’ve added mongoose to the global object, so it complains. 😬

So, you create this types.d.ts file to tell TypeScript:

"Hey, there's a new thing on the global object called mongoose, and here’s what it looks like." 
*/
