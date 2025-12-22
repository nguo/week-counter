import { db } from "./db";
import { calculationLogs, type InsertCalculationLog, type CalculationLog } from "@shared/schema";

export interface IStorage {
  logCalculation(log: InsertCalculationLog): Promise<CalculationLog>;
  getLogs(): Promise<CalculationLog[]>;
}

export class DatabaseStorage implements IStorage {
  async logCalculation(insertLog: InsertCalculationLog): Promise<CalculationLog> {
    const [log] = await db
      .insert(calculationLogs)
      .values(insertLog)
      .returning();
    return log;
  }

  async getLogs(): Promise<CalculationLog[]> {
    return await db.select().from(calculationLogs);
  }
}

export const storage = new DatabaseStorage();
