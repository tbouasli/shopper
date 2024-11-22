import { BaseError } from "./base.error";

export class NoRidesFoundError extends BaseError {
	constructor(error_description: string) {
		super("NO_RIDES_FOUND", error_description);
	}
}
