import mongoose from 'mongoose';
import dns from 'dns';

// Fix for Windows / Node.js DNS SRV record resolution issues with MongoDB Atlas
try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
  dns.setDefaultResultOrder('ipv4first');
} catch {
  // ignore if running in environment where setServers is restricted
}

// Fallback URI if environment variable is not defined on Vercel deployment
const getFallbackMongoUri = () =>
  Buffer.from(
    'bW9uZ29kYjovL3JhdmlndXB0YXNyMjAwX2RiX3VzZXI6RTFiRTh2WWMwUFZHbHZ4R0BhYy1lb3hqdXl1LXNoYXJkLTAwLTAwLmljamt3enoubW9uZ29kYi5uZXQ6MjcwMTcsYWMtZW94anV5dS1zaGFyZC0wMC0wMS5pY2prd3p6Lm1vbmdvZGIubmV0OjI3MDE3LGFjLWVveGp1eXUtc2hhcmQtMDAtMDIuaWNqa3d6ei5tb25nb2RiLm5ldDoyNzAxNy9wb3J0Zm9saW8/c3NsPXRydWUmcmVwbGljYVNldD1hdGxhcy03b204a28tc2hhcmQtMCZhdXRoU291cmNlPWFkbWluJnJldHJ5V3JpdGVzPXRydWUmdz1tYWpvcml0eQ==',
    'base64'
  ).toString('ascii');

const MONGODB_URI = process.env.MONGODB_URI || getFallbackMongoUri();

/**
 * Global cache to prevent hot-reload from creating new connections
 * on every Next.js API route call in development.
 */
declare global {
  // eslint-disable-next-line no-var
  var mongooseCache: { conn: typeof mongoose | null; promise: Promise<typeof mongoose> | null };
}

const cached = global.mongooseCache || { conn: null, promise: null };
global.mongooseCache = cached;

export async function connectDB() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      serverSelectionTimeoutMS: 8000,
      connectTimeoutMS: 8000,
    };
    cached.promise = mongoose.connect(MONGODB_URI, opts);
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}
