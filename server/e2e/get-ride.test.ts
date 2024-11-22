import supertest from "supertest";
import { describe, it, expect, afterAll } from "vitest";
import { faker } from "@faker-js/faker";
import { server } from "@/index";
import { AppDataSource } from "@/db";
import { Ride } from "@/db/entities/ride.entity";
import { Driver } from "@/db/entities/driver.entity";

const URL = server;

describe("GET /ride/{customer_id}?driver_id={id do motorista}", () => {
	interface SuccessResponseBody {
		customer_id: string;
		rides: [
			{
				id: number;
				date: Date;
				origin: string;
				destination: string;
				distance: number;
				duration: string;
				driver: {
					id: number;
					name: string;
				};
				value: number;
			},
		];
	}

	interface ErrorResponse {
		error_code: "NO_RIDES_FOUND" | "INVALID_DRIVER";
		error_description: string;
	}

	afterAll(() => {
		server.close();
	});

	it("should return an error if customer_id is not provided", async () => {
		const response = await supertest(URL).get("/ride");

		expect(response.status).toBe(404);
	});

	it("should return an error a customer has no rides", async () => {
		const response = await supertest(URL).get(`/ride/${faker.string.uuid()}`);

		expect(response.status).toBe(404);
		expect(response.body).toMatchObject<ErrorResponse>({
			error_code: "NO_RIDES_FOUND",
			error_description: "No rides found for this customer",
		});
	});

	it("should return an error if the driver does not exist", async () => {
		const response = await supertest(URL).get(
			`/ride/${faker.string.uuid()}?driver_id=${faker.number.int({ min: -100, max: -1 })}`,
		);

		expect(response.status).toBe(400);
		expect(response.body).toMatchObject<ErrorResponse>({
			error_code: "INVALID_DRIVER",
			error_description: expect.any(String),
		});
	});

	it("should return rides if customer_id and driver_id are provided", async () => {
		const baseRide = {
			customer_id: faker.string.uuid(),
			date: faker.date.recent(),
			destination_latitude: faker.location.latitude(),
			destination_longitude: faker.location.longitude(),
			distance: faker.number.float({ min: 1, max: 100 }),
			duration: faker.date.recent().toISOString(),
			origin_latitude: faker.location.latitude(),
			origin_longitude: faker.location.longitude(),
			driver: {
				id: 1,
			},
			value: faker.number.float({ min: 1, max: 100 }),
		};

		await AppDataSource.getRepository(Ride).save(baseRide);

		const response = await supertest(URL).get(
			`/ride/${baseRide.customer_id}?driver_id=${baseRide.driver.id}`,
		);

		expect(response.status).toBe(200);
		expect((response.body as SuccessResponseBody).customer_id).toBe(
			baseRide.customer_id,
		);

		const homer = await AppDataSource.getRepository(Driver).findOne({
			where: {
				id: baseRide.driver.id,
			},
		});

		expect(response.body).toMatchObject<SuccessResponseBody>({
			customer_id: baseRide.customer_id,
			rides: expect.arrayContaining([
				{
					id: expect.any(Number),
					date: baseRide.date.toISOString(),
					origin: `${baseRide.origin_latitude} ${baseRide.origin_longitude}`,
					destination: `${baseRide.destination_latitude} ${baseRide.destination_longitude}`,
					distance: baseRide.distance,
					duration: baseRide.duration,
					driver: {
						id: baseRide.driver.id,
						name: homer?.name,
					},
					value: expect.any(Number),
				},
			]),
		});
	});
});
