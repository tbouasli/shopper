import { DriverList } from "@/components/DriverList";
import { EstimateRideForm } from "@/components/LocationPicker";
import { LocationPreview } from "@/components/LocationPreview";
import { Form } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { estimate_ride_schema, type RideEstimateInput } from "@shopper/types";
import { useForm } from "react-hook-form";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { useMediaQuery } from "@/hooks/use-media-query";
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "@/components/ui/sheet";
import { Car } from "lucide-react";

const AppPage = () => {
	const isDesktop = useMediaQuery("(min-width: 1024px)");

	const form = useForm<RideEstimateInput>({
		resolver: zodResolver(
			estimate_ride_schema._def.schema.omit({ customer_id: true }),
		),
	});

	if (isDesktop) {
		return (
			<Form {...form}>
				<LocationPreview className="absolute top-0 left-0 w-full h-full" />
				<Sheet>
					<SheetTrigger className="fixed bottom-5 right-5 rounded-full bg-primary-500 bg-background p-3">
						<div className="flex items-center gap-4 ">
							<Car size={24} />
							Buscar Motorista
						</div>
					</SheetTrigger>
					<SheetContent>
						<SheetHeader>
							<SheetTitle>Estimar Corrida</SheetTitle>
							<SheetDescription>
								Buscar por motoristas disponíveis
							</SheetDescription>
						</SheetHeader>
						<EstimateRideForm />
						<DriverList />
					</SheetContent>
				</Sheet>
			</Form>
		);
	}

	return (
		<Form {...form}>
			<div className="container mx-auto max-w-4xl">
				<Card>
					<CardHeader>
						<CardTitle>Estimar Corrida</CardTitle>
						<CardDescription>Buscar por motoristas disponíveis</CardDescription>
					</CardHeader>
					<CardContent className="grid-rows-2 lg:grid-rows-1 lg:grid-cols-2 grid gap-5">
						<LocationPreview className="rounded-lg" />
						<EstimateRideForm />
					</CardContent>
					<CardFooter />
				</Card>
				<DriverList />
			</div>
		</Form>
	);
};

export default AppPage;
