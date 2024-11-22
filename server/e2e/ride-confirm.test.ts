import supertest from "supertest";
import { describe, it, expect, afterAll } from "vitest";
import { faker } from "@faker-js/faker";
import { server } from "@/index";

const URL = server;

describe("PATCH /ride/confirm", () => {
	interface RequestBody {
		customer_id?: string;
		origin?: string;
		destination?: string;
		distance?: number;
		duration?: string;
		driver?: {
			id: number;
			name: string;
		};
		value?: number;
	}

	interface SuccessResponseBody {
		success: true;
	}

	interface ErrorResponse {
		error_code: "INVALID_DATA" | "DRIVER_NOT_FOUND" | "INVALID_DISTANCE";
		error_description: string;
	}

	function mockRequestBody(): RequestBody {
		// Isso serve para garantir que existe uma rota válida
		// por padrão, o faker pode gerar valores no oceano
		const SP = {
			west_lat: -46.84,
			east_lat: -46.36,
			north_long: -23.36,
			south_long: -24.0,
		};

		return {
			customer_id: faker.string.uuid(),
			origin: `${faker.location.latitude({
				min: SP.south_long,
				max: SP.north_long,
			})},${faker.location.longitude({
				min: SP.west_lat,
				max: SP.east_lat,
			})}`,
			destination: `${faker.location.latitude({
				min: SP.south_long,
				max: SP.north_long,
			})},${faker.location.longitude({
				min: SP.west_lat,
				max: SP.east_lat,
			})}`,
			distance: faker.number.int({ min: 1, max: 100 }),
			duration: faker.number.int({ min: 1, max: 100 }).toString(),
			driver: {
				id: faker.number.int({ min: 1, max: 3 }),
				name: faker.person.fullName(),
			},
			value: faker.number.int({ min: 1, max: 100 }),
		};
	}

	afterAll(() => {
		server.close();
	});

	it("should return an error if customer_id is not provided", async () => {
		const body = mockRequestBody();

		body.customer_id = undefined;

		const response = await supertest(URL).patch("/ride/confirm").send(body);

		expect(response.status).toBe(400);
		expect((response.body as ErrorResponse).error_code).toBe("INVALID_DATA");
	});

	it("should return an error if origin is not provided", async () => {
		const body = mockRequestBody();

		body.origin = undefined;

		const response = await supertest(URL).patch("/ride/confirm").send(body);

		expect(response.status).toBe(400);
		expect((response.body as ErrorResponse).error_code).toBe("INVALID_DATA");
	});

	it("should return an error if destination is not provided", async () => {
		const body = mockRequestBody();

		body.destination = undefined;

		const response = await supertest(URL).patch("/ride/confirm").send(body);

		expect(response.status).toBe(400);
		expect((response.body as ErrorResponse).error_code).toBe("INVALID_DATA");
	});

	it("should return an error if origin and destination are the same", async () => {
		const body = mockRequestBody();

		body.origin = body.destination;

		const response = await supertest(URL).patch("/ride/confirm").send(body);

		expect(response.status).toBe(400);
		expect((response.body as ErrorResponse).error_code).toBe("INVALID_DATA");
	});

	it("should return an error if driver is not found", async () => {
		const body = mockRequestBody();

		// biome-ignore lint/style/noNonNullAssertion: <explanation>
		body.driver!.id = 0;

		const response = await supertest(URL).patch("/ride/confirm").send(body);

		expect(response.status).toBe(404);
		expect((response.body as ErrorResponse).error_code).toBe(
			"DRIVER_NOT_FOUND",
		);
	}, 10_000);

	it("should return an error if the distance is invalid", async () => {
		const body = mockRequestBody();

		body.distance = 0;

		const response = await supertest(URL).patch("/ride/confirm").send(body);

		expect(response.status).toBe(406);
		expect((response.body as ErrorResponse).error_code).toBe(
			"INVALID_DISTANCE",
		);
	});

	it("should get the ride estimate based on the origin and destination", async () => {
		const body = mockRequestBody();

		const response = await supertest(URL).patch("/ride/confirm").send(body);

		expect(response.status).toBe(200);
		expect(response.body).toMatchObject<SuccessResponseBody>({
			success: true,
		});
	});
});
