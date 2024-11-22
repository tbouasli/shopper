import type {
	GetRidesByCustomerInput,
	GetRidesByCustomerOutput,
} from "@shopper/types";

export interface GetRidesByCustumer {
	execute(input: GetRidesByCustomerInput): Promise<GetRidesByCustomerOutput>;
}
