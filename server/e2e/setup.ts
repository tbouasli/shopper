import { AppDataSource } from "@/db";
import { beforeEach } from "vitest";

import { seedDrivers } from "@/db/seed";

beforeEach(async () => {
	if (!AppDataSource.isInitialized) {
		await AppDataSource.initialize();
		await AppDataSource.dropDatabase();
		await AppDataSource.synchronize();
	}

	await seedDrivers(AppDataSource);

	await new Promise((resolve) => setTimeout(resolve, 2_000));
}, 10_000);
