import { z } from "zod";

export const list_rides_schema = z.object({
	customer_id: z.string(),
	driver_id: z.coerce.number().int().positive().optional(),
});

export type GetRidesByCustomerInput = z.infer<typeof list_rides_schema>;

export interface GetRidesByCustomerOutput {
	customer_id: string;
	rides: {
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
	}[];
}
