import { useFormContext } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";
import { LoaderCircle } from "lucide-react";
import { RideService } from "@/service/rides.service";
import type { RideEstimateInput } from "@shopper/types";

import { Button } from "@/components/ui/button";
import {
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/use-auth";

export function EstimateRideForm() {
	const { cpf } = useAuth();
	const [data, setData] = useState<RideEstimateInput | null>(null);

	const { toast } = useToast();

	const estimateRide = useQuery({
		queryKey: ["estimate-ride"],
		queryFn: () =>
			data
				? RideService.estimate({
						...data,
						// biome-ignore lint/style/noNonNullAssertion: this is necessarilly a string
						customer_id: cpf!,
					})
				: Promise.resolve(null),
		enabled: Boolean(data),
		retry: 0,
	});

	const form = useFormContext<RideEstimateInput>();

	const onSubmit = form.handleSubmit(setData);

	useEffect(() => {
		if (estimateRide.isError) {
			toast({
				title: "Erro ao estimar corrida",
				description:
					"Ocorreu um erro ao estimar a corrida, por favor tente novamente",
				variant: "destructive",
			});
			setData(null);
		}
	}, [estimateRide.isError, toast]);

	return (
		<form onSubmit={onSubmit} className="space-y-4">
			<FormField
				control={form.control}
				name="origin"
				render={({ field }) => (
					<FormItem>
						<FormLabel>Origem</FormLabel>
						<FormControl>
							<Input {...field} />
						</FormControl>
						<FormDescription>Endereço de origem</FormDescription>
						<FormMessage />
					</FormItem>
				)}
			/>
			<FormField
				control={form.control}
				name="destination"
				render={({ field }) => (
					<FormItem>
						<FormLabel>Destino</FormLabel>
						<FormControl>
							<Input {...field} />
						</FormControl>
						<FormDescription>Endereço de destino</FormDescription>
					</FormItem>
				)}
			/>
			<Button
				type="submit"
				disabled={estimateRide.isFetching}
				className="w-full"
			>
				{estimateRide.isFetching && <LoaderCircle className="animate-spin" />}
				Estimar corrida
			</Button>
		</form>
	);
}
