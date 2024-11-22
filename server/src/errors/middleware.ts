import type { ErrorRequestHandler } from "express";
import { InvalidDataError } from "./invalid_data.error";
import { DriverNotFoundError } from "./driver-not-found.error";
import { InvalidDistanceError } from "./invalid_distance.error";
import { NoRidesFoundError } from "./no-rides-found.error";
import { InvalidDriverError } from "./invalid_driver.error";

export const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
	switch (true) {
		case err instanceof InvalidDriverError:
		case err instanceof InvalidDataError:
			res.status(400).json(err.toJSON());
			break;
		case err instanceof NoRidesFoundError:
		case err instanceof DriverNotFoundError:
			res.status(404).json(err.toJSON());
			break;
		case err instanceof InvalidDistanceError:
			res.status(406).json(err.toJSON());
			break;
		default:
			res
				.status(500)
				.json({ error_code: "INTERNAL_SERVER_ERROR", error_description: err });
			break;
	}

	next();
};
