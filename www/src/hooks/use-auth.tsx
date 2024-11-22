import { createContext, useContext, useEffect } from "react";
import { useNavigate } from "react-router";
const AuthContext = createContext<{
	cpf: string | null;
	login: (cpf: string) => void;
	logout: () => void;
}>({
	cpf: null,
	login: () => {},
	logout: () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
	const navigate = useNavigate();

	const login = (cpf: string) => {
		sessionStorage.setItem("cpf", cpf);
		navigate("/app");
	};

	const logout = () => {
		sessionStorage.removeItem("cpf");
		navigate("/", { replace: true });
	};

	useEffect(() => {
		if (!sessionStorage.getItem("cpf")) {
			navigate("/");
		} else {
			if (window.location.pathname === "/") {
				navigate("/app");
			}
		}
	}, [navigate]);

	return (
		<AuthContext.Provider
			value={{
				cpf: sessionStorage.getItem("cpf"),
				login,
				logout,
			}}
		>
			{children}
		</AuthContext.Provider>
	);
};

export const useAuth = () => {
	return useContext(AuthContext);
};
