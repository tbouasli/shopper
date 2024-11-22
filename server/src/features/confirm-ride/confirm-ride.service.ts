import { Ride } from "@/db/entities/ride.entity";
import type { DataSource, Repository } from "typeorm";
import type { ConfirmRide } from "./confirm-ride.interface";
import { Driver } from "@/db/entities/driver.entity";
import { DriverNotFoundError } from "@/errors/driver-not-found.error";
import { InvalidDistanceError } from "@/errors/invalid_distance.error";
import type { ConfirmRideInput, ConfirmRideOutput } from "@shopper/types";

export class ConfirmRideService implements ConfirmRide {
	private readonly ride_repository: Repository<Ride>;
	private readonly driver_repository: Repository<Driver>;

	constructor(data_source: DataSource) {
		this.ride_repository = data_source.getRepository(Ride);
		this.driver_repository = data_source.getRepository(Driver);
	}

	async execute(dto: ConfirmRideInput): Promise<ConfirmRideOutput> {
		const driver = await this.driver_repository.findOne({
			where: {
				id: dto.driver.id,
			},
		});

		if (!driver) {
			throw new DriverNotFoundError("Driver not found");
		}

		if (driver.min_km > dto.distance) {
			throw new InvalidDistanceError("Invalid distance");
		}

		const [origin_latitude, origin_longitude] = dto.origin
			.split(",")
			.map(Number);
		const [destination_latitude, destination_longitude] = dto.destination
			.split(",")
			.map(Number);

		const ride = this.ride_repository.create({
			customer_id: dto.customer_id,
			date: new Date(),
			destination_latitude,
			destination_longitude,
			origin_latitude,
			origin_longitude,
			distance: dto.distance,
			duration: dto.duration,
			driver,
			value: dto.value,
		});

		await this.ride_repository.save(ride);

		// Nao vejo o motivo de retornar isso, status 200 ja é suficiente
		return {
			success: true,
		};
	}
}
