import { pgTable, text, serial, timestamp, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const calculationLogs = pgTable("calculation_logs", {
  id: serial("id").primaryKey(),
  startDate: text("start_date").notNull(),
  weeksResult: integer("weeks_result").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertCalculationLogSchema = createInsertSchema(calculationLogs).omit({ 
  id: true, 
  createdAt: true 
});

export type CalculationLog = typeof calculationLogs.$inferSelect;
export type InsertCalculationLog = z.infer<typeof insertCalculationLogSchema>;
