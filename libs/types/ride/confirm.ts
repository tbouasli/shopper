import { z } from "zod";

export const confirm_ride_schema = z
	.object({
		customer_id: z.string(),
		driver: z.object({
			id: z.number(),
			name: z.string(),
		}),
		origin: z.string(),
		destination: z.string(),
		distance: z.number(),
		duration: z.string(),
		value: z.number(),
	})
	.refine((data) => data.origin !== data.destination, {
		message: "Origin and destination must be different",
	});

export type ConfirmRideInput = z.infer<typeof confirm_ride_schema>;

export interface ConfirmRideOutput {
	success: true;
}
