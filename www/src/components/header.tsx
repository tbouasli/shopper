import { useAuth } from "@/hooks/use-auth";
import { Button } from "./ui/button";

const Header = () => {
	const { logout } = useAuth();
	return (
		<header className="bg-background text-white p-4 border-b border-zinc-700 sticky top-0 w-full z-10">
			<div className="container mx-auto flex justify-between items-center">
				<div className="flex items-center space-x-2">
					<img src="/shopper.png" alt="Shopper" className="h-8" />
					<h1 className="text-xl font-bold">Shopper</h1>
				</div>
				<Button onClick={logout}>Logout</Button>
			</div>
		</header>
	);
};

export default Header;
