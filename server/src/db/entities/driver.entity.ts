import { Column, Entity, OneToMany, PrimaryColumn } from "typeorm";
import { Ride } from "./ride.entity";

@Entity()
export class Driver {
	@PrimaryColumn("int")
	id!: number;

	@Column("varchar")
	name!: string;

	@Column("text")
	description!: string;

	@Column("varchar")
	car_model!: string;

	@Column("int")
	rating!: number;

	@Column("text")
	comment!: string;

	@Column("float")
	rate!: number;

	@Column("int")
	min_km!: number;

	@OneToMany(
		() => Ride,
		(ride) => ride.driver,
	)
	rides!: Ride[];
}
