import { z } from "zod";

export const estimate_ride_schema = z
	.object({
		customer_id: z.string(),
		origin: z.string(),
		destination: z.string(),
	})
	.refine((data) => data.origin !== data.destination, {
		message: "Origin and destination must be different",
	});

export type RideEstimateInput = z.infer<typeof estimate_ride_schema>;

export interface RideEstimateOutput {
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
