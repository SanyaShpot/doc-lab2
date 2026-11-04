import Redis from 'ioredis';
import { IOutputStrategy } from '../interfaces/output-strategy.interface';

export class RedisStrategy implements IOutputStrategy {
  private redis: Redis;
  private host: string;
  private port: number;

  constructor(
    host: string = process.env.REDIS_HOST || 'localhost',
    port: number = parseInt(process.env.REDIS_PORT || '6379'),
  ) {
    this.host = host;
    this.port = port;
    this.redis = new Redis({
      host: this.host,
      port: this.port,
    });
  }

  async output(data: Record<string, string>[]): Promise<void> {
    try {
      await this.redis.ping();
      console.log(
        `\n=== Redis Strategy: Connected to ${this.host}:${this.port} ===\n`,
      );

      let processedCount = 0;

      for (const row of data) {
        // Use EVENT_ID as unique identifier if available, otherwise use index
        const eventId = row.EVENT_ID || `event_${processedCount}`;
        const key = `storm-event:${eventId}`;

        // Store each row as a Redis HASH
        await this.redis.hset(key, row);
        processedCount++;

        if (processedCount % 100 === 0) {
          console.log(`Processed ${processedCount} records...`);
        }
      }

      console.log(
        `\n=== Redis Strategy: Completed storing ${processedCount} records ===\n`,
      );
    } catch (error) {
      console.error('Redis Strategy Error:', error);
      throw error;
    } finally {
      await this.redis.quit();
    }
  }
}
