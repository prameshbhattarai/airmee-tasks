import {Pool} from 'postgresql-client';

export interface DbConnection {
  host: string;
  username: string;
  password: string;
  port: number;
  database: string;
}

/**
 * Function to provide database connection pool.
 */
export async function createConnectionPool(): Promise<Pool> {
  try {
    const options = createConnectionOptions();
    return new Pool({
      max: 20,
      idleTimeoutMillis: 30000,
      host: `postgres://${options.username}:${options.password}@${options.host}:${options.port}/${options.database}`
    });
  } catch (error) {
    console.log('Error connecting to the database', error);
  }
}

/**
 * Extract database properties from environment file.
 */
function createConnectionOptions(): DbConnection {
  return {
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT, 10),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
  };
}
