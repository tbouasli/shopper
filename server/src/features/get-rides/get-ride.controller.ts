import { Router } from "express";
import type { GetRidesByCustumer } from "./get-ride.interface";
import { InvalidDriverError } from "@/errors/invalid_driver.error";
import { list_rides_schema } from "@shopper/types";

export class GetRideController {
	readonly router: Router;

	constructor(private readonly service: GetRidesByCustumer) {
		this.router = Router();

		this.router.get("/ride/:customer_id", async (req, res, next) => {
			try {
				//eu adoraria validar, mas nao tenho a garantia que o customer_id é um uuid
				const customer_id = req.params.customer_id;
				const { data, error } = list_rides_schema
					.omit({ customer_id: true })
					.safeParse(req.query);

				if (error) {
					throw new InvalidDriverError(error.errors[0].message);
				}

				const result = await this.service.execute({
					customer_id,
					driver_id: data.driver_id,
				});

				res.json(result).status(200);
				return;
			} catch (err) {
				next(err);
			}
		});
	}
}
