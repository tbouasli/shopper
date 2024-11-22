import "reflect-metadata";
import "dotenv/config";

import Express from "express";
import cors from "cors";

import { GetRideController } from "./features/get-rides/get-ride.controller";
import { GetRidesByCustomerService } from "./features/get-rides/get-ride.service";
import { ConfirmRideRouter } from "./features/confirm-ride/confirm-ride.controller";
import { ConfirmRideService } from "./features/confirm-ride/confirm-ride.service";
import { errorHandler } from "./errors/middleware";
import { RideEstimateController } from "./features/estimate-ride/estimate-ride.controller";
import { RideEstimateService } from "./features/estimate-ride/estimate-ride.service";
import { RoutesClient } from "@googlemaps/routing";
import { AppDataSource } from "./db";

const app = Express();

app.use(Express.json());
app.use(cors());

const confirmRideService = new ConfirmRideService(AppDataSource);
const getRidesByCustomerService = new GetRidesByCustomerService(AppDataSource);
const rideEstimateService = new RideEstimateService(
	AppDataSource,
	new RoutesClient({
		apiKey: process.env.GOOGLE_API_KEY,
	}),
);

app.use(new RideEstimateController(rideEstimateService).router);
app.use(new ConfirmRideRouter(confirmRideService).router);
app.use(new GetRideController(getRidesByCustomerService).router);

app.use(errorHandler);

export const server = app.listen(8080, () => {
	console.log("Server is running on port 8080");
});
