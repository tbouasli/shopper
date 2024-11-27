import type { RideEstimateOutput } from "@shopper/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Driver from "./Driver";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Button } from "./ui/button";
import { useEffect, useState } from "react";
import { RideService } from "@/service/rides.service";
import { LoaderCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router";
import { useAuth } from "@/hooks/use-auth";
import { useMediaQuery } from "@/hooks/use-media-query";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export function DriverList() {
  const { cpf } = useAuth();
  const [isDrawerOpen, setIsDrawerOpen] = useState(true);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  const queryClient = useQueryClient();

  const { data, isSuccess } = useQuery<RideEstimateOutput>({
    queryKey: ["estimate-ride"],
  });

  const navigate = useNavigate();

  const { toast } = useToast();

  const confirmRide = useMutation({
    mutationKey: ["confirm-ride", data],
    mutationFn: (option: { id: number; name: string; value: number }) =>
      RideService.confirm({
        // biome-ignore lint/style/noNonNullAssertion: this is necessarilly a string
        customer_id: cpf!,
        destination: `${data?.destination.latitude},${data?.destination.longitude}`,
        origin: `${data?.origin.latitude},${data?.origin.longitude}`,
        distance: data?.distance || 0,
        driver: {
          id: option.id,
          name: option.name,
        },
        duration: data?.duration || "",
        value: option.value,
      }),
    onError: (error) => {
      toast({
        title: "Erro ao confirmar corrida",
        description: error.message,
        variant: "destructive",
      });
      setIsDrawerOpen(true);
    },
    onSuccess: () => {
      navigate("/app/rides");
    },
  });

  useEffect(() => {
    if (isSuccess && data) {
      setIsDrawerOpen(true);
    }
  }, [isSuccess, data]);

  if (!data) {
    return null;
  }

  function onClose() {
    queryClient.clear();
    setIsDrawerOpen(false);
  }

  if (isDesktop) {
    return (
      <AlertDialog
        open={Boolean(data)}
        onOpenChange={(value) => !value && onClose}
      >
        <AlertDialogContent className="max-w-3xl">
          <AlertDialogHeader>
            <AlertDialogTitle>Escolha seu Motorista</AlertDialogTitle>
          </AlertDialogHeader>
          <div className="mx-auto px-10 py-5">
            <Carousel>
              <CarouselContent>
                {data.options.map((option) => (
                  <CarouselItem key={option.id} className="flex flex-col gap-4">
                    <Driver data={option} />
                    <div className="flex justify-end gap-4">
                      <AlertDialogAction
                        onClick={() => confirmRide.mutate(option)}
                      >
                        {confirmRide.isPending ? (
                          <LoaderCircle className="animate-spin" />
                        ) : (
                          "Confirmar"
                        )}
                      </AlertDialogAction>
                      <AlertDialogCancel onClick={onClose} asChild>
                        <Button variant="destructive">Cancelar</Button>
                      </AlertDialogCancel>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          </div>
          <AlertDialogFooter />
        </AlertDialogContent>
      </AlertDialog>
    );
  }

  return (
    <Drawer
      open={Boolean(data) && isDrawerOpen}
      onClose={onClose}
      dismissible={false}
    >
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Escolha seu Motorista</DrawerTitle>
        </DrawerHeader>
        <div className="container mx-auto px-10 py-5">
          <Carousel>
            <CarouselContent>
              {data.options.map((option) => (
                <CarouselItem key={option.id}>
                  <Driver data={option} />
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </div>
        <DrawerFooter>
          <Button onClick={() => confirmRide.mutate(0)}>
            {confirmRide.isPending ? (
              <LoaderCircle className="animate-spin" />
            ) : (
              "Confirmar"
            )}
          </Button>
          <DrawerClose onClick={onClose}>
            <Button className="w-full" variant="destructive">
              Cancel
            </Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
