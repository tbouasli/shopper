import Header from "@/components/header";
import { Outlet } from "react-router";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/side-bar";
import { useMediaQuery } from "@/hooks/use-media-query";
const BaseLayout = () => {
	const isDesktop = useMediaQuery("(min-width: 1024px)");

	return (
		<div className="bg-background min-h-dvh w-full space-y-5">
			{!isDesktop && <Header />}
			<main className="container mx-auto">
				<SidebarProvider>
					{isDesktop && <AppSidebar />}
					<Outlet />
				</SidebarProvider>
			</main>
		</div>
	);
};

export default BaseLayout;
