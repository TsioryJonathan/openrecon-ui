import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import * as schema from "@/db/schema";

const url = process.env.DATABASE_URL ?? "";

const queryClient = postgres(url, { prepare: false, max: 1 });

export const db = drizzle(queryClient, { schema });