import { Kafka } from 'kafkajs';
import { IOutputStrategy } from '../interfaces/output-strategy.interface';

export class KafkaStrategy implements IOutputStrategy {
  private kafka: Kafka;
  private broker: string;

  constructor(broker: string = process.env.KAFKA_BROKER || 'localhost:9092') {
    this.broker = broker;
    this.kafka = new Kafka({
      clientId: 'storm-events-producer',
      brokers: [this.broker],
    });
  }

  async output(data: Record<string, string>[]): Promise<void> {
    const producer = this.kafka.producer();

    try {
      await producer.connect();
      console.log(
        `\n=== Kafka Strategy: Connected to broker ${this.broker} ===\n`,
      );

      // Send data in batches of 200
      const batchSize = 200;
      const messages = data.map((row) => ({
        value: JSON.stringify(row),
      }));

      for (let i = 0; i < messages.length; i += batchSize) {
        const batch = messages.slice(i, i + batchSize);
        await producer.send({
          topic: 'storm-events',
          messages: batch,
        });
        console.log(
          `Sent batch ${Math.floor(i / batchSize) + 1} (${batch.length} messages)`,
        );
      }

      console.log(
        `\n=== Kafka Strategy: Completed sending ${data.length} records ===\n`,
      );
    } catch (error) {
      console.error('Kafka Strategy Error:', error);
      throw error;
    } finally {
      await producer.disconnect();
    }
  }
}
