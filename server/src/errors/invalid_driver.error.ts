import { BaseError } from "./base.error";

export class InvalidDriverError extends BaseError {
	constructor(error_description: string) {
		super("INVALID_DRIVER", error_description);
	}
}
