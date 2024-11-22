import type { ConfirmRideInput, ConfirmRideOutput } from "@shopper/types";

export interface ConfirmRide {
	execute(input: ConfirmRideInput): Promise<ConfirmRideOutput>;
}
