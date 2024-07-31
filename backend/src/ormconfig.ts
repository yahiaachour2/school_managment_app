import dotenv from 'dotenv';
import { DataSource } from 'typeorm';

dotenv.config();

export const dataSource = new DataSource({
  type: "postgres",
  host: process.env.HOST,
  port: parseInt(process.env.DATA_BASE_PORT as string),
  username: process.env.USER_NAME,
  password: process.env.PASSWORD,

  database: process.env.DATABASE,
  synchronize: false,
  logging: false,
  entities: ["src/entities/*.ts"],
});

dataSource
  .initialize()
  .then(async () => {
    // Check if the CLI argument "--sync" is provided
    const shouldSync = process.argv.includes("--sync");

    if (shouldSync) {
      await dataSource
        .synchronize()
        .then(() => {
          console.log("database synchronized");
        })
        .catch((err: any) => {
          console.error("Error  Data Source initialization", err);
        });
      return "database synchronized";
    }
  })
  .catch((error) => console.log(error));
