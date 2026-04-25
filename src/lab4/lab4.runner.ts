import { CsvReader } from './csv-reader';
import { DataProcessor } from './data-processor';
import { ConsoleStrategy } from './strategies/console.strategy';
import { KafkaStrategy } from './strategies/kafka.strategy';
import { RedisStrategy } from './strategies/redis.strategy';
import { IOutputStrategy } from './interfaces/output-strategy.interface';

export async function runLab4(): Promise<void> {
  try {
    // Read the output strategy from environment
    const strategyName = process.env.OUTPUT_STRATEGY || 'console';
    console.log(`\n=== Lab 4: Strategy Pattern ===`);
    console.log(`Using strategy: ${strategyName}\n`);

    // Instantiate the appropriate strategy
    let strategy: IOutputStrategy;

    switch (strategyName.toLowerCase()) {
      case 'kafka':
        strategy = new KafkaStrategy(process.env.KAFKA_BROKER);
        break;
      case 'redis':
        strategy = new RedisStrategy(
          process.env.REDIS_HOST,
          parseInt(process.env.REDIS_PORT || '6379'),
        );
        break;
      case 'console':
      default:
        strategy = new ConsoleStrategy();
        break;
    }

    // Read CSV data
    const csvReader = new CsvReader();
    const data = await csvReader.read('data/storm-events.csv');

    // Process with selected strategy
    const processor = new DataProcessor(strategy);
    await processor.process(data);

    console.log('✓ Lab 4 completed successfully');
  } catch (error) {
    console.error('Lab 4 failed:', error);
    throw error;
  }
}
