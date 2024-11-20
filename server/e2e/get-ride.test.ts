import supertest from "supertest";
import { describe, it, expect } from "vitest";
import { faker } from "@faker-js/faker";

const URL = process.env.URL ?? "http://localhost:3000";

describe("GET /ride/{customer_id}?driver_id={id do motorista}", () => {
  interface RequestBody {
    customer_id?: string;
    driver_id?: number;
  }

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
      }
    ];
  }

  interface ErrorResponse {
    error_code: "NO_RIDES_FOUND" | "DRIVER_NOT_FOUND";
    error_description: string;
  }

  function mockRequestQuery(): RequestBody {
    return {
      customer_id: faker.string.uuid(),
      driver_id: faker.number.int({ min: 1, max: 100 }),
    };
  }

  it("should return an error if customer_id is not provided", async () => {
    const query = mockRequestQuery();

    delete query.customer_id;

    const response = await supertest(URL).get(
      `/ride/${query.customer_id}?driver_id=${query.driver_id}`
    );

    expect(response.status).toBe(400);
    expect((response.body as ErrorResponse).error_code).toBe("NO_RIDES_FOUND");
  });

  it("should return an error if driver_id is not provided", async () => {
    const query = mockRequestQuery();

    delete query.driver_id;

    const response = await supertest(URL).get(
      `/ride/${query.customer_id}?driver_id=${query.driver_id}`
    );

    expect(response.status).toBe(400);
    expect((response.body as ErrorResponse).error_code).toBe(
      "DRIVER_NOT_FOUND"
    );
  });

  it("should return rides if customer_id and driver_id are provided", async () => {
    const query = mockRequestQuery();

    const response = await supertest(URL).get(
      `/ride/${query.customer_id}?driver_id=${query.driver_id}`
    );

    expect(response.status).toBe(200);
    expect((response.body as SuccessResponseBody).customer_id).toBe(
      query.customer_id
    );
    expect(response.body).toMatchObject<SuccessResponseBody>({
      customer_id: query.customer_id!,
      rides: expect.arrayContaining([
        {
          id: expect.any(Number),
          date: expect.any(String),
          origin: expect.any(String),
          destination: expect.any(String),
          distance: expect.any(Number),
          duration: expect.any(String),
          driver: {
            id: expect.any(Number),
            name: expect.any(String),
          },
          value: expect.any(Number),
        },
      ]),
    });
  });
});
