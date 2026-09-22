import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "postgresql",
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  tablesFilter: ["user", "session", "account", "verification"],
  dbCredentials: {
    url: process.env.DATABASE_URL ?? "",
  },
});