import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import type { RideEstimateOutput } from "@shopper/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { createAvatar } from "@dicebear/core";
import { funEmoji } from "@dicebear/collection";

interface DriverProps {
	data: RideEstimateOutput["options"][number];
}

const Driver = ({ data }: DriverProps) => {
	return (
		<Card>
			<CardHeader>
				<Avatar>
					<AvatarImage
						src={createAvatar(funEmoji, {
							seed: data.id.toString(),
						}).toDataUri()}
					/>
					<AvatarFallback>
						<span>{data.name[0]}</span>
					</AvatarFallback>
				</Avatar>
				<CardTitle>{data.name}</CardTitle>
				<CardDescription>{data.description}</CardDescription>
			</CardHeader>
			<CardContent>
				<p>{data.review.comment}</p>
			</CardContent>
			<CardFooter>
				<p>{data.vehicle}</p>
			</CardFooter>
		</Card>
	);
};

export default Driver;
