import type { RideEstimateInput } from "@shopper/types";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";

const start_icon = L.icon({
	iconUrl: "/map-pin-house.svg",
	iconSize: [25, 41],
	iconAnchor: [12, 41],
});

const end_icon = L.icon({
	iconUrl: "/map-pin.svg",
	iconSize: [25, 41],
	iconAnchor: [12, 41],
});

export const LocationPreview = ({ className }: { className?: string }) => {
	const [origin, setOrigin] = useState<[number, number] | null>(null);
	const [destination, setDestination] = useState<[number, number] | null>(null);

	const form = useFormContext<RideEstimateInput>();

	useEffect(() => {
		const data = form.watch();

		//nao e a melhor validacao do mundo
		if (data.origin && data.origin.split(",").length === 2) {
			const origin = data.origin.split(",").map(Number) as [number, number];
			setOrigin(origin);
		}

		if (data.destination && data.destination.split(",").length === 2) {
			const destination = data.destination.split(",").map(Number) as [
				number,
				number,
			];
			setDestination(destination);
		}
	}, [form]);

	return (
		<MapContainer
			className={className}
			center={[51.505, -0.09]}
			zoom={15}
			zoomControl={false}
			attributionControl={false}
		>
			<TileLayer
				url="https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}.png"
				zIndex={0}
			/>
			{origin && (
				<Marker position={origin} icon={start_icon}>
					<Popup>Partida</Popup>
				</Marker>
			)}
			{destination && (
				<Marker position={destination} icon={end_icon}>
					<Popup>Destino</Popup>
				</Marker>
			)}
			<ChangeCenter />
		</MapContainer>
	);
};

function ChangeCenter() {
	const map = useMap();
	const form = useFormContext<RideEstimateInput>();

	useEffect(() => {
		const data = form.watch();

		for (const key of Object.keys(map.getPanes())) {
			const pane = map.getPane(key);

			if (pane) {
				pane.style.zIndex = String(Number(pane.style.zIndex) / 100);
			}
		}

		if (data.origin && data.destination) {
			const origin = data.origin.split(",").map(Number) as [number, number];
			const destination = data.destination.split(",").map(Number) as [
				number,
				number,
			];

			const originLat = origin[0];
			const originLng = origin[1];
			const destinationLat = destination[0];
			const destinationLng = destination[1];

			map.setView([
				(originLat + destinationLat) / 2,
				(originLng + destinationLng) / 2,
			]);
		} else {
			if (data.origin) {
				const origin = data.origin.split(",").map(Number) as [number, number];
				map.setView(origin);
			}
		}
	}, [form, map]);

	return null;
}
