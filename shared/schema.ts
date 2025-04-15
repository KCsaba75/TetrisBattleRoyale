import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull().unique(),
  uid: text("uid").notNull().unique(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const scores = pgTable("scores", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  score: integer("score").notNull(),
  level: integer("level").notNull(),
  lines: integer("lines").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  email: true,
  uid: true,
});

export const insertScoreSchema = createInsertSchema(scores).pick({
  userId: true,
  score: true,
  level: true,
  lines: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type InsertScore = z.infer<typeof insertScoreSchema>;
export type User = typeof users.$inferSelect;
export type Score = typeof scores.$inferSelect;
