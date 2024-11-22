import { DataSource } from "typeorm";

import { Driver } from "@/db/entities/driver.entity";
import { Ride } from "@/db/entities/ride.entity";
import { seedDrivers } from "./seed";

export const AppDataSource = new DataSource({
	type: "postgres",
	// host: "localhost",
	// username: "postgres",
	// password: "postgres",
	// database: "shopper",
	url: process.env.DATABASE_URL,
	entities: [Driver, Ride],
	synchronize: true,
	dropSchema: true,
});

if (!AppDataSource.isInitialized) {
	AppDataSource.initialize().then(() => {
		seedDrivers(AppDataSource);
	});
}
