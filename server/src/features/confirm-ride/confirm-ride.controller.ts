import { Router } from "express";
import type { ConfirmRide } from "./confirm-ride.interface";
import { InvalidDataError } from "@/errors/invalid_data.error";
import { confirm_ride_schema } from "@shopper/types";

export class ConfirmRideRouter {
	readonly router: Router;

	constructor(private readonly service: ConfirmRide) {
		this.router = Router();

		this.router.patch("/ride/confirm", async (req, res, next) => {
			try {
				const data = confirm_ride_schema.safeParse(req.body);

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
