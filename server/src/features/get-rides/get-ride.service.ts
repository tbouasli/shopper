import { Ride } from "@/db/entities/ride.entity";
import { NoRidesFoundError } from "@/errors/no-rides-found.error";
import type { DataSource, FindOptionsWhere, Repository } from "typeorm";
import type { GetRidesByCustumer } from "./get-ride.interface";
import type {
	GetRidesByCustomerInput,
	GetRidesByCustomerOutput,
} from "@shopper/types";

export class GetRidesByCustomerService implements GetRidesByCustumer {
	private readonly ride_repository: Repository<Ride>;

	constructor(data_source: DataSource) {
		this.ride_repository = data_source.getRepository(Ride);
	}

	async execute(
		dto: GetRidesByCustomerInput,
	): Promise<GetRidesByCustomerOutput> {
		const where: FindOptionsWhere<Ride> = {
			customer_id: dto.customer_id,
		};

		if (dto.driver_id) {
			where.driver = { id: dto.driver_id };
		}

		const rides = await this.ride_repository.find({
			where,
			relations: { driver: true },
			order: { date: "DESC" },
		});

		if (rides.length === 0) {
			throw new NoRidesFoundError("No rides found for this customer");
		}

		return {
			customer_id: dto.customer_id,
			rides: rides.map((ride) => ({
				id: ride.id,
				origin: `${ride.origin_latitude} ${ride.origin_longitude}`,
				destination: `${ride.destination_latitude} ${ride.destination_longitude}`,
				distance: ride.distance,
				date: ride.date,
				driver: {
					id: ride.driver.id,
					name: ride.driver.name,
				},
				duration: ride.duration,
				value: ride.value,
			})),
		};
	}
}
