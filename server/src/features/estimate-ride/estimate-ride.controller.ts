import { Router } from "express";
import type { RideEstimate } from "./estimate-ride.interface";
import { InvalidDataError } from "@/errors/invalid_data.error";
import { estimate_ride_schema } from "@shopper/types";

export class RideEstimateController {
	readonly router: Router;

	constructor(private readonly service: RideEstimate) {
		this.router = Router();

		this.router.post("/ride/estimate", async (req, res, next) => {
			try {
				const data = estimate_ride_schema.safeParse(req.body);

				if (!data.success) {
					throw new InvalidDataError(data.error.errors[0].message);
				}

				const response = await this.service.execute(data.data);

				res.json(response).status(200);
			} catch (err) {
				next(err);
			}
		});
	}
}
