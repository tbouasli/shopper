import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Driver } from "./driver.entity";

@Entity()
export class Ride {
	@PrimaryGeneratedColumn("increment")
	id!: number;

	@Column("float")
	origin_latitude!: number;

	@Column("float")
	origin_longitude!: number;

	@Column("float")
	destination_latitude!: number;

	@Column("float")
	destination_longitude!: number;

	@Column("float")
	distance!: number;

	@Column("text")
	duration!: string;

	@ManyToOne(
		() => Driver,
		(driver) => driver.rides,
	)
	driver!: Driver;

	@Column("text")
	customer_id!: string;

	@Column("timestamp")
	date!: Date;

	@Column("float")
	value!: number;
}
