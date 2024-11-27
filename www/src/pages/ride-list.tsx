import { useAuth } from "@/hooks/use-auth";
import { RideService } from "@/service/rides.service";
import { useQuery } from "@tanstack/react-query";
import React, { useEffect } from "react";
import { format, secondsToMinutes } from "date-fns";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const currency = Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

const distance = Intl.NumberFormat("pt-BR", {
  style: "unit",
  unit: "kilometer",
  maximumFractionDigits: 2,
});

const RideList = () => {
  const [filterOptions, setFilterOptions] = React.useState<
    {
      value: number;
      label: string;
    }[]
  >([]);
  const { cpf } = useAuth();
  const [driverId, setDriverId] = React.useState<number | undefined>();

  const { data } = useQuery({
    queryKey: [
      "list-rides",
      { driver_id: driverId === 0 ? undefined : driverId },
    ],
    queryFn: () =>
      RideService.listRidesByCustomer({
        // biome-ignore lint/style/noNonNullAssertion: this is necessarilly a string
        customer_id: cpf!,
        driver_id: driverId,
      }),
  });

  useEffect(() => {
    if (data?.rides) {
      const map = new Map();

      for (const ride of data.rides) {
        if (!map.has(ride.driver.id)) {
          map.set(ride.driver.id, ride.driver.name);
        }
      }

      setFilterOptions(
        Array.from(map).map(([value, label]) => ({
          value,
          label,
        }))
      );
    }
  }, [data]);

  return (
    <section className="p-4 mt-5 w-full space-y-10">
      <h1 className="text-2xl font-bold">Minhas corridas</h1>
      <div className="w-full">
        <Select onValueChange={(value) => setDriverId(Number(value))}>
          <SelectTrigger className="w-[180px]">
            <SelectValue
              placeholder="Filtrar por motorista"
              defaultValue="all"
            />
          </SelectTrigger>
          <SelectContent>
            {/* remove duplicates */}
            {filterOptions.map((option) => (
              <SelectItem key={option.value} value={option.value.toString()}>
                {option.label}
              </SelectItem>
            ))}
            <SelectItem value={"0"}>Todos</SelectItem>
          </SelectContent>
        </Select>
        <Table>
          <TableCaption>Lista de corridas</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">id</TableHead>
              <TableHead>Origem</TableHead>
              <TableHead>Destino</TableHead>
              <TableHead>Distancia</TableHead>
              <TableHead>Motorista</TableHead>
              <TableHead>Duracao</TableHead>
              <TableHead>Valor</TableHead>
              <TableHead>Data</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data?.rides?.map((ride) => (
              <TableRow key={ride.id}>
                <TableCell>{ride.id}</TableCell>
                <TableCell>{ride.origin}</TableCell>
                <TableCell>{ride.destination}</TableCell>
                <TableCell>{distance.format(ride.distance)}</TableCell>
                <TableCell>{ride.driver.name}</TableCell>
                <TableCell>
                  {secondsToMinutes(Number.parseInt(ride.duration))} min
                </TableCell>
                <TableCell>{currency.format(ride.value)}</TableCell>
                <TableCell>{format(ride.date, "dd/MM/yyyy HH:mm")}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </section>
  );
};

export default RideList;
