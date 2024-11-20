import supertest from 'supertest';
import { describe, it, expect } from 'vitest';
import { faker } from '@faker-js/faker';

const URL = process.env.URL ?? 'http://localhost:3000';


describe('POST /ride/estimate', () => {
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
      options: any[];
      routeResponse: any;
    }

    interface ErrorResponse {
        error_code: 'INVALID_DATA';
        error_description: string;
    }

    function mockRequestBody() : RequestBody {
      return {
        customer_id: faker.string.uuid(),
        origin: `${faker.location.latitude()},${faker.location.longitude()}`,
        destination: `${faker.location.latitude()},${faker.location.longitude()}`
      }
    }

    it('should return an error if customer_id is not provided', async () => {
      const body = mockRequestBody();

      delete body.customer_id;

      const response = await supertest(URL).post('/ride/estimate').send(body);
      

      expect(response.status).toBe(400);
      expect((response.body as ErrorResponse).error_code).toBe('INVALID_DATA');
    })

    it('should return an error if origin is not provided', async () => {
      const body = mockRequestBody();

      delete body.origin;

      const response = await supertest(URL).post('/ride/estimate').send(body);
      

      expect(response.status).toBe(400);
      expect((response.body as ErrorResponse).error_code).toBe('INVALID_DATA');
    })

    it('should return an error if destination is not provided', async () => {
      const body = mockRequestBody();

      delete body.destination;

      const response = await supertest(URL).post('/ride/estimate').send(body);
      

      expect(response.status).toBe(400);
      expect((response.body as ErrorResponse).error_code).toBe('INVALID_DATA');
    })

    it('should return an error if origin and destination are the same', async () => {
      const body = mockRequestBody();

      body.origin = body.destination;

      const response = await supertest(URL).post('/ride/estimate').send(body);
      

      expect(response.status).toBe(400);
      expect((response.body as ErrorResponse).error_code).toBe('INVALID_DATA');
    })

    it('should get the ride estimate based on the origin and destination', async () => {
      const response = await supertest(URL).post('/ride/estimate');

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
    });
  });

  