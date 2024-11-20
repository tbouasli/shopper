import supertest from 'supertest';
import { describe, it, expect } from 'vitest';
import { faker } from '@faker-js/faker';

const URL = process.env.URL ?? 'http://localhost:3000';


describe('PATCH /ride/confirm', () => {

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
        error_code: 'INVALID_DATA' | 'DRIVER_NOT_FOUND' | 'INVALID_DISTANCE',
        error_description: string;
    }

    function mockRequestBody() : RequestBody {
      return {
        customer_id: faker.string.uuid(),
        origin: `${faker.location.latitude()},${faker.location.longitude()}`,
        destination: `${faker.location.latitude()},${faker.location.longitude()}`,
        distance: faker.number.int({min: 1, max: 100}),
        duration: faker.date.recent().toISOString(),
        driver: {
          id: faker.number.int({min: 1, max: 100}),
          name: faker.person.fullName(),
        },
        value: faker.number.int({min: 1, max: 100}),
      }
    }

    it('should return an error if customer_id is not provided', async () => {
      const body = mockRequestBody();

      delete body.customer_id;

      const response = await supertest(URL).patch('/ride/confirm').send(body);

      expect(response.status).toBe(400);
      expect((response.body as ErrorResponse).error_code).toBe('INVALID_DATA');
    })

    it('should return an error if origin is not provided', async () => {
      const body = mockRequestBody();

      delete body.origin;

      const response = await supertest(URL).patch('/ride/confirm').send(body);
      

      expect(response.status).toBe(400);
      expect((response.body as ErrorResponse).error_code).toBe('INVALID_DATA');
    })

    it('should return an error if destination is not provided', async () => {
      const body = mockRequestBody();

      delete body.destination;

      const response = await supertest(URL).patch('/ride/confirm').send(body);
      

      expect(response.status).toBe(400);
      expect((response.body as ErrorResponse).error_code).toBe('INVALID_DATA');
    })

    it('should return an error if origin and destination are the same', async () => {
      const body = mockRequestBody();

      body.origin = body.destination;

      const response = await supertest(URL).patch('/ride/confirm').send(body);
      

      expect(response.status).toBe(400);
      expect((response.body as ErrorResponse).error_code).toBe('INVALID_DATA');
    })

    it('should return an error if driver is not found', async () => {
      const body = mockRequestBody();

      delete body.driver;

      const response = await supertest(URL).patch('/ride/confirm').send(body);
      

      expect(response.status).toBe(400);
      expect((response.body as ErrorResponse).error_code).toBe('DRIVER_NOT_FOUND');
    })

    it('should return an error if the distance is invalid', async () => {
      const body = mockRequestBody();

      body.distance = 0;

      const response = await supertest(URL).patch('/ride/confirm').send(body);
      

      expect(response.status).toBe(400);
      expect((response.body as ErrorResponse).error_code).toBe('INVALID_DISTANCE');
    })

    it('should get the ride estimate based on the origin and destination', async () => {
      const response = await supertest(URL).patch('/ride/confirm');

      expect(response.status).toBe(200);
      expect(response.body).toMatchObject<SuccessResponseBody>({
        success: true
      });
    });
  });

  