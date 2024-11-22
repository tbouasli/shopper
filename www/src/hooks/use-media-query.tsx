import { useState, useEffect } from "react";

export function useMediaQuery(query: string) {
	const [matches, setMatches] = useState(false);

	useEffect(() => {
		const mediaQueryList = window.matchMedia(query);

		const handleChange = (event: MediaQueryListEvent) => {
			setMatches(event.matches);
		};

		// Define o estado inicial
		setMatches(mediaQueryList.matches);

		// Adiciona o listener
		mediaQueryList.addEventListener("change", handleChange);

		return () => {
			// Remove o listener
			mediaQueryList.removeEventListener("change", handleChange);
		};
	}, [query]);

	return matches;
}
