import {
	type ConfirmRideInput,
	type ConfirmRideOutput,
	type GetRidesByCustomerInput,
	type GetRidesByCustomerOutput,
	type RideEstimateInput,
	type RideEstimateOutput,
	confirm_ride_schema,
	estimate_ride_schema,
	list_rides_schema,
} from "@shopper/types";

// biome-ignore lint/complexity/noStaticOnlyClass: <explanation>
export class RideService {
	static async estimate(input: RideEstimateInput): Promise<RideEstimateOutput> {
		const data = estimate_ride_schema.parse(input);

		console.log(import.meta.env.VITE_API_URL);

		const response = await fetch(
			new URL("/ride/estimate", import.meta.env.VITE_API_URL),
			{
				method: "POST",
				body: JSON.stringify(data),
				headers: {
					"Content-Type": "application/json",
				},
			},
		);

		if (!response.ok) {
			throw new Error("Erro no servidor, por favor tente novamente mais tarde");
		}

		return response.json();
	}

	static async confirm(input: ConfirmRideInput): Promise<ConfirmRideOutput> {
		const data = confirm_ride_schema.parse(input);

		const response = await fetch(
			new URL("/ride/confirm", import.meta.env.VITE_API_URL),
			{
				method: "PATCH",
				body: JSON.stringify(data),
				headers: {
					"Content-Type": "application/json",
				},
			},
		);

		return response.json();
	}

	static async listRidesByCustomer(
		dto: GetRidesByCustomerInput,
	): Promise<GetRidesByCustomerOutput> {
		const data = list_rides_schema.parse(dto);

		const url = new URL(
			`/ride/${dto.customer_id}`,
			import.meta.env.VITE_API_URL,
		);

		if (data.driver_id) {
			url.searchParams.append("driver_id", data.driver_id.toString());
		}

		const response = await fetch(url, {
			headers: {
				"Content-Type": "application/json",
			},
		});

		return response.json();
	}
}
