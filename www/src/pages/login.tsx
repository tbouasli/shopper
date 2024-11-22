"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { AlertCircle } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

export function Login() {
	const { login } = useAuth();
	const [cpf, setCpf] = useState("");
	const [error, setError] = useState("");

	const formatCPF = (value: string) => {
		return value
			.replace(/\D/g, "")
			.replace(/(\d{3})(\d)/, "$1.$2")
			.replace(/(\d{3})(\d)/, "$1.$2")
			.replace(/(\d{3})(\d{1,2})/, "$1-$2")
			.replace(/(-\d{2})\d+?$/, "$1");
	};

	const handleCPFChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const formattedCPF = formatCPF(e.target.value);
		setCpf(formattedCPF);
		setError("");
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		const cleanCPF = cpf.replace(/\D/g, "");
		if (cleanCPF.length !== 11) {
			setError("CPF must have 11 digits");
			return;
		}

		login(cleanCPF);
	};

	return (
		<section className="flex items-center justify-center h-screen">
			<Card className="w-full max-w-md mx-auto">
				<CardHeader>
					<CardTitle className="text-2xl font-bold text-center">
						Login
					</CardTitle>
				</CardHeader>
				<form onSubmit={handleSubmit}>
					<CardContent>
						<div className="space-y-4">
							<div className="space-y-2">
								<Label htmlFor="cpf">CPF</Label>
								<Input
									id="cpf"
									placeholder="000.000.000-00"
									value={cpf}
									onChange={handleCPFChange}
									maxLength={14}
								/>
							</div>
							{error && (
								<div className="text-red-500 text-sm flex items-center">
									<AlertCircle className="w-4 h-4 mr-2" />
									{error}
								</div>
							)}
						</div>
					</CardContent>
					<CardFooter>
						<Button type="submit" className="w-full">
							Login
						</Button>
					</CardFooter>
				</form>
			</Card>
		</section>
	);
}
