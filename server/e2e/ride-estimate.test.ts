import supertest from "supertest";
import { describe, it, expect, afterAll } from "vitest";
import { faker } from "@faker-js/faker";
import { server } from "@/index";

const URL = server;

interface RequestBody {
	customer_id?: string;
	origin?: string;
	destination?: string;
}

interface SuccessResponseBody {
	origin: {
		latitude: number;
		longitude: number;
	};
	destination: {
		latitude: number;
		longitude: number;
	};
	distance: number;
	duration: string;
	options: {
		id: number;
		name: string;
		description: string;
		vehicle: string;
		review: {
			rating: number;
			comment: string;
		};
		value: number;
	}[];
	routeResponse: unknown;
}

interface ErrorResponse {
	error_code: "INVALID_DATA";
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
	};
}

describe("POST /ride/estimate", () => {
	afterAll(() => {
		server.close();
	});

	it("should return an error if customer_id is not provided", async () => {
		const body = mockRequestBody();

		body.customer_id = undefined;

		const response = await supertest(URL).post("/ride/estimate").send(body);

		expect(response.status).toBe(400);
		expect((response.body as ErrorResponse).error_code).toBe("INVALID_DATA");
	});

	it("should return an error if origin is not provided", async () => {
		const body = mockRequestBody();

		body.origin = undefined;

		const response = await supertest(URL).post("/ride/estimate").send(body);

		expect(response.status).toBe(400);
		expect((response.body as ErrorResponse).error_code).toBe("INVALID_DATA");
	});

	it("should return an error if destination is not provided", async () => {
		const body = mockRequestBody();

		body.destination = undefined;

		const response = await supertest(URL).post("/ride/estimate").send(body);

		expect(response.status).toBe(400);
		expect((response.body as ErrorResponse).error_code).toBe("INVALID_DATA");
	});

	it("should return an error if origin and destination are the same", async () => {
		const body = mockRequestBody();

		body.origin = body.destination;

		const response = await supertest(URL).post("/ride/estimate").send(body);

		expect(response.status).toBe(400);
		expect((response.body as ErrorResponse).error_code).toBe("INVALID_DATA");
	});

	it("should get the ride estimate based on the origin and destination", async () => {
		const body = mockRequestBody();

		const response = await supertest(URL).post("/ride/estimate").send(body);

		expect(response.status).toBe(200);
		expect(response.body).toMatchObject<SuccessResponseBody>({
			origin: {
				latitude: expect.any(Number),
				longitude: expect.any(Number),
			},
			destination: {
				latitude: expect.any(Number),
				longitude: expect.any(Number),
			},
			distance: expect.any(Number),
			duration: expect.any(String),
			options: expect.any(Array),
			routeResponse: expect.any(Object),
		});
	}, 20_000);

	it("should get the ride estimate based on specific origin and destination", async () => {
		const body = mockRequestBody();

		body.origin = "-23.5689557346998, -46.64749565924252"; // Metro Brigadeiro
		body.destination = "-23.561773697890867, -46.65597730121039"; // MASP

		const response = await supertest(URL).post("/ride/estimate").send(body);

		expect(response.status).toBe(200);
		expect(response.body).toMatchObject<SuccessResponseBody>({
			origin: {
				latitude: expect.any(Number),
				longitude: expect.any(Number),
			},
			destination: {
				latitude: expect.any(Number),
				longitude: expect.any(Number),
			},
			distance: expect.any(Number),
			duration: expect.any(String),
			options: expect.any(Array),
			routeResponse: expect.any(Object),
		});

		expect(response.body.distance).toBeGreaterThan(1);
	}, 20_000);
});
