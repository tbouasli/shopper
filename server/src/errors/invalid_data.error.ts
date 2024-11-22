import { BaseError } from "./base.error";

export class InvalidDataError extends BaseError {
	constructor(error_description: string) {
		super("INVALID_DATA", error_description);
	}
}
