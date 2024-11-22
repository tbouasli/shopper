import { LessThan, type DataSource, type Repository } from "typeorm";
import type { RideEstimate } from "./estimate-ride.interface";
import { Driver } from "@/db/entities/driver.entity";
import type { RoutesClient } from "@googlemaps/routing";
import { InvalidDataError } from "@/errors/invalid_data.error";
import type { google } from "@googlemaps/routing/build/protos/protos";
import type { RideEstimateInput, RideEstimateOutput } from "@shopper/types";

export class RideEstimateService implements RideEstimate {
	private readonly driver_repository: Repository<Driver>;

	constructor(
		data_source: DataSource,
		private readonly routing_client: RoutesClient,
	) {
		this.driver_repository = data_source.getRepository(Driver);
	}

	async execute(dto: RideEstimateInput): Promise<RideEstimateOutput> {
		const [originLat, originLng] = dto.origin.split(",");
		const [destinationLat, destinationLng] = dto.destination.split(",");

		const origin = {
			location: {
				latLng: {
					latitude: Number.parseFloat(originLat),
					longitude: Number.parseFloat(originLng),
				},
			},
		};

		const destination = {
			location: {
				latLng: {
					latitude: Number.parseFloat(destinationLat),
					longitude: Number.parseFloat(destinationLng),
				},
			},
		};

		const response = await this.routing_client.computeRoutes(
			{
				origin: origin,
				destination: destination,
				travelMode: "DRIVE",
			},
			{
				otherArgs: {
					headers: {
						"Content-Type": "application/json",
						"X-Goog-FieldMask": "*",
					},
				},
			},
		);

		const parserDesponse: google.maps.routing.v2.IComputeRoutesResponse =
			response[0];

		if (
			!parserDesponse.routes ||
			parserDesponse.routes.length === 0 ||
			!parserDesponse.routes[0].legs ||
			parserDesponse.routes[0].legs.length === 0
		) {
			throw new InvalidDataError("Invalid data provided");
		}

		const route = parserDesponse.routes[0];

		if (
			!Array.isArray(route.legs) ||
			route.legs.length === 0 ||
			!route.legs[0].duration ||
			!route.legs[0].duration.seconds ||
			!route.legs[0].distanceMeters
		) {
			throw new InvalidDataError("Invalid data provided");
		}

		const distance = route.legs[0].distanceMeters / 1000;

		const drivers = await this.driver_repository.find({
			where: {
				min_km: LessThan(Math.floor(distance)),
			},
		});

		const duration = route.legs[0].duration.seconds.toString();

		return {
			destination: {
				latitude: Number.parseFloat(destinationLat),
				longitude: Number.parseFloat(destinationLng),
			},
			origin: {
				latitude: Number.parseFloat(originLat),
				longitude: Number.parseFloat(originLng),
			},
			distance,
			duration,
			routeResponse: parserDesponse,
			options: drivers.map((driver) => ({
				id: driver.id,
				name: driver.name,
				description: driver.car_model,
				vehicle: driver.car_model,
				review: {
					rating: driver.rating,
					comment: driver.comment,
				},
				value: driver.rate * distance,
			})),
		};
	}
}
