import "./index.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "./components/ui/toaster";
import { Route, Routes } from "react-router";
import { Login } from "./pages/login";
import { AuthProvider } from "./hooks/use-auth";
import AppPage from "./pages/app";
import RideList from "./pages/ride-list";
import BaseLayout from "./layout/base";

const queryClient = new QueryClient();

function App() {
	return (
		<AuthProvider>
			<Toaster />
			<QueryClientProvider client={queryClient}>
				<Routes>
					<Route path="/" element={<Login />} />
					<Route path="/" element={<BaseLayout />}>
						<Route path="/app" element={<AppPage />} />
						<Route path="/app/rides" element={<RideList />} />
					</Route>
				</Routes>
			</QueryClientProvider>
		</AuthProvider>
	);
}

export default App;
