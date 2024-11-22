import type { RideEstimateInput, RideEstimateOutput } from "@shopper/types";

export interface RideEstimate {
	execute(input: RideEstimateInput): Promise<RideEstimateOutput>;
}
