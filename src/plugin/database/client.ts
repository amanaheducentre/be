import { drizzle } from "drizzle-orm/libsql/web";
import * as schema from "./schema.js";

export const tables = schema;

export function useDB() {
  return drizzle({
    connection: {
      url: process.env.TURSO_DATABASE_URL!,
      authToken: process.env.TURSO_AUTH_TOKEN!,
    },
  });
}
