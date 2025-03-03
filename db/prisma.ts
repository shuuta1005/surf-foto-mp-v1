//🟥 This is very important to implement!!!
//Gotta do a bit later in the production

import { PrismaClient } from "@prisma/client";
import { Pool } from "@neondatabase/serverless";
import { PrismaNeon } from "@prisma/adapter-neon";
import { neonConfig } from "@neondatabase/serverless";
import ws from "ws";

// Enable WebSocket support for Neon
neonConfig.webSocketConstructor = ws;

// Create a Neon connection pool
const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });

// Create the adapter
const adapter = new PrismaNeon(pool);

// Initialize Prisma with the adapter
const prisma = new PrismaClient({
  adapter: adapter,
});

export default prisma;
