import { BaseError } from "./base.error";

export class InvalidDistanceError extends BaseError {
	constructor(error_description: string) {
		super("INVALID_DISTANCE", error_description);
	}
}
