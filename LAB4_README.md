# Lab 4: Strategy Pattern Implementation

## Overview
Lab 4 implements the GoF **Strategy Pattern** to read storm events data from a CSV file and output it to multiple destinations (Console, Kafka, Redis) with minimal configuration changes.

## Structure

```
src/lab4/
├── interfaces/
│   └── output-strategy.interface.ts    # Strategy interface
├── strategies/
│   ├── console.strategy.ts             # Output to console
│   ├── kafka.strategy.ts               # Output to Kafka topic
│   └── redis.strategy.ts               # Output to Redis cache
├── csv-reader.ts                       # CSV file reader
├── data-processor.ts                   # Data processing service
├── lab4.runner.ts                      # Main orchestrator
└── lab4.module.ts                      # NestJS module
```

## Key Features

1. **Strategy Pattern**: Each output destination (Console, Kafka, Redis) implements `IOutputStrategy`
2. **Environment-Based Configuration**: Switch strategies using `OUTPUT_STRATEGY` env variable
3. **Zero Code Changes**: Strategy switching requires only environment variable changes
4. **Graceful Error Handling**: Kafka and Redis strategies handle connection errors
5. **Batch Processing**: Kafka sends data in batches of 200 records for efficiency
6. **CSV Streaming**: Reads and parses CSV files efficiently

## Configuration

### Environment Variables (.env)
```
OUTPUT_STRATEGY=console          # console | kafka | redis
KAFKA_BROKER=localhost:9092
REDIS_HOST=localhost
REDIS_PORT=6379
RUN_LAB4=true                    # true to run Lab 4 on app startup
```

## Usage

### 1. Console Output (Default)
```bash
RUN_LAB4=true OUTPUT_STRATEGY=console npm start
```
Each record prints as JSON on a single line.

### 2. Kafka Output
```bash
# Start Docker services first
docker-compose up -d

# Run with Kafka strategy
RUN_LAB4=true OUTPUT_STRATEGY=kafka npm start

# View messages in Kafka UI: http://localhost:8080
# Topic: storm-events
```

### 3. Redis Output
```bash
# Start Docker services first
docker-compose up -d

# Run with Redis strategy
RUN_LAB4=true OUTPUT_STRATEGY=redis npm start

# View data in Redis Insight: http://localhost:5540
# Keys pattern: storm-event:*
```

## Docker Services

Start all services:
```bash
docker-compose up -d
```

Services:
- **Kafka**: `localhost:9092` - Message broker
- **Zookeeper**: `localhost:2181` - Kafka coordination
- **Redis**: `localhost:6379` - In-memory cache
- **Kafka UI**: `http://localhost:8080` - Kafka monitoring
- **Redis Insight**: `http://localhost:5540` - Redis monitoring

Stop services:
```bash
docker-compose down
```

## CSV File Format

The system expects a CSV file at `data/storm-events.csv` with headers. Each row becomes a record with field names as keys.

**Sample fields:**
- EVENT_ID (unique identifier)
- STATE
- YEAR
- EVENT_TYPE
- DIRECT_DEATHS, INDIRECT_DEATHS
- PROPERTY_DAMAGE, CROP_DAMAGE
- etc.

## How It Works

1. **Data Reading**: `CsvReader` reads CSV and returns array of objects
2. **Strategy Selection**: `runLab4()` selects strategy based on env variable
3. **Processing**: `DataProcessor` delegates to the selected strategy
4. **Output**:
   - **Console**: Prints JSON per line
   - **Kafka**: Sends to topic in batches of 200
   - **Redis**: Stores as HASH with key pattern `storm-event:{EVENT_ID}`

## Testing

Console strategy has been tested and verified to work correctly with sample data.

To test Kafka and Redis strategies:
1. Ensure Docker and Docker Compose are running
2. Start services: `docker-compose up -d`
3. Run with desired strategy
4. Monitor in respective UI (Kafka UI or Redis Insight)

## Implementation Notes

- CSV reader uses synchronous parsing for simplicity
- Each strategy handles its own connection management
- Error handling is graceful with try-catch blocks
- All code follows NestJS patterns and conventions
- Strategy switching requires NO code changes, only env vars

## Files Modified/Created

**New Files:**
- src/lab4/* (all Strategy pattern components)
- docker-compose.yml (Docker services)
- .env (Configuration file)
- data/storm-events.csv (Sample data)

**Modified Files:**
- src/main.ts (Added Lab 4 integration)
- package.json (New dependencies: kafkajs, ioredis)

## Next Steps

1. Download real NCDC Storm Events data from: https://www.ncdc.noaa.gov/stormevents/ftp.jsp
2. Place CSV file at `data/storm-events.csv`
3. Update .env with your configuration
4. Run Lab 4 with desired strategy
5. Monitor output in respective monitoring tools
