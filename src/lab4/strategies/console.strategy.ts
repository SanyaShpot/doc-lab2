import { IOutputStrategy } from '../interfaces/output-strategy.interface';

export class ConsoleStrategy implements IOutputStrategy {
  async output(data: Record<string, string>[]): Promise<void> {
    console.log(`\n=== Console Strategy: Outputting ${data.length} records ===\n`);
    for (const row of data) {
      console.log(JSON.stringify(row));
    }
    console.log(`\n=== Completed outputting to console ===\n`);
  }
}
