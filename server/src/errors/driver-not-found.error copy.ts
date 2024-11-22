import { BaseError } from "./base.error";

export class DriverNotFoundError extends BaseError {
	constructor(error_description: string) {
		super("DRIVER_NOT_FOUND", error_description);
	}
}
