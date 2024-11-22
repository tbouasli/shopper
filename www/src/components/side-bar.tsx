import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Car, ChevronUp, Home, LogOut } from "lucide-react";
import { Link } from "react-router";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar } from "@radix-ui/react-avatar";
import { AvatarFallback, AvatarImage } from "./ui/avatar";
import { useAuth } from "@/hooks/use-auth";
import { createAvatar } from "@dicebear/core";
import { funEmoji } from "@dicebear/collection";
import { Button } from "./ui/button";

export function AppSidebar() {
	const { logout, cpf } = useAuth();

	if (!cpf) {
		return null;
	}

	return (
		<Sidebar>
			<SidebarHeader>
				<div className="flex items-center space-x-2">
					<img src="/shopper.png" alt="Shopper" className="h-8" />
					<h1 className="text-xl font-bold">Shopper</h1>
				</div>
			</SidebarHeader>
			<SidebarContent>
				<SidebarMenu>
					<SidebarMenuItem className="p-1">
						<SidebarMenuButton asChild>
							<div>
								<Home size={24} />
								<Link to="/app">Home</Link>
							</div>
						</SidebarMenuButton>
					</SidebarMenuItem>
					<SidebarMenuItem className="p-1">
						<SidebarMenuButton asChild>
							<div>
								<Car size={24} />
								<Link to="/app/rides">Corridas</Link>
							</div>
						</SidebarMenuButton>
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarContent>
			<SidebarFooter>
				<SidebarMenu>
					<SidebarMenuItem className="p-1">
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<SidebarMenuButton>
									<div className="flex justify-between gap-4 w-full items-center">
										<Avatar className="rounded-full w-8 h-8 overflow-hidden">
											<AvatarImage
												src={createAvatar(funEmoji, {
													// biome-ignore lint/style/noNonNullAssertion: this is necessarilly a string
													seed: cpf!,
												}).toDataUri()}
											/>
											<AvatarFallback>
												<span>AN</span>
											</AvatarFallback>
										</Avatar>
										<span className="font-bold">{cpf}</span>
										<ChevronUp className="ml-auto" />
									</div>
								</SidebarMenuButton>
							</DropdownMenuTrigger>
							<DropdownMenuContent
								side="top"
								className="w-[--radix-popper-anchor-width]"
							>
								<DropdownMenuItem>
									<Button
										onClick={logout}
										className="flex gap-2 items-center"
										variant="ghost"
									>
										<LogOut size={24} />
										Logout
									</Button>
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarFooter>
		</Sidebar>
	);
}
