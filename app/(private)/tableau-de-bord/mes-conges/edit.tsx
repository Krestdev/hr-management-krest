"use client";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import useKizunaStore from "@/context/store";
import { demoHolidayTypes } from "@/data/temp";
import HolidaysQuery from "@/queries/holidays";
import { HolidayRequest } from "@/types/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { CalendarIcon } from "lucide-react";
import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

type Props = {
  isOpen: boolean;
  openChange: React.Dispatch<React.SetStateAction<boolean>>;
  request: HolidayRequest;
};

const formSchema = z.object({
  typeId: z
    .string({ message: "Choisissez un type" })
    .refine((val) => !!Number(val)),
  startDate: z.string({ message: "Veuillez définir une date de début" }).refine(
    (val) => {
      const d = new Date(val);
      return !isNaN(d.getTime());
    },
    { message: "Date de début invalide" }
  ),
  endDate: z.string({ message: "Veuillez définir une date de fin" }).refine(
    (val) => {
      const d = new Date(val);
      return !isNaN(d.getTime());
    },
    { message: "Date de début invalide" }
  ),
  justificationFile: z.any(),
  reason: z.string().optional(),
  isAnnual: z.boolean(),
});

function EditLeaveRequest({ isOpen, openChange, request }: Props) {
    const { user } = useKizunaStore();
    const [startView, setStartView] = React.useState<boolean>(false);
    const [endView, setEndView] = React.useState<boolean>(false);
    const holidayQuery = new HolidaysQuery();
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            typeId: String(request.typeId),
            startDate: new Date (request.startDate).toISOString().slice(0,10),
            endDate: new Date(request.endDate).toISOString().slice(0,10),
            justificationFile: request.justificationFile,
            reason: request.reason,
            isAnnual: true
        }
    });
    const editRequest = useMutation({
        mutationFn: (data:{request: Omit<HolidayRequest, "id" | "requestedDays" | "status">, id:number})=>holidayQuery.editRequest(data),
        onSuccess: ()=>{
            toast.success("Votre requête a été mise à jour avec succès !");
            openChange(false);
        },
        onError: (error)=>{
            toast.error(error.message);
        }
    })
    function onSubmit(values: z.infer<typeof formSchema>){
            editRequest.mutate(
                {
                    request:{typeId:Number(values.typeId), startDate: new Date(values.startDate), endDate: new Date(values.endDate), justificationFile: values.justificationFile, reason: values.reason, createdAt: new Date(), userId: user?.id ?? 0}, 
                    id: request.id})
            //console.log(values);
        }
  return (
    <Dialog open={isOpen} onOpenChange={openChange}>
      <DialogContent>
        <DialogHeader className="bg-accent">
          <DialogTitle className="text-white">{"Modifier ma demande"}</DialogTitle>
          <DialogDescription className="text-neutral-100">
            {"Change les informations relatives à ma demande"}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
                <FormField control={form.control} name="typeId" render={({field})=>(
                    <FormItem>
                        <FormLabel>{"Type d'absence"}</FormLabel>
                        <FormControl>
                            <Select defaultValue={field.value} onValueChange={field.onChange}>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Sélectionner un type"/>
                                </SelectTrigger>
                                <SelectContent>
                                    {demoHolidayTypes.map((type)=>(
                                            <SelectItem key={type.id} value={String(type.id)}>{type.label}</SelectItem>
                                        ))}
                                </SelectContent>
                            </Select>
                        </FormControl>
                        <FormMessage/>
                    </FormItem>
                )} />
                <FormField control={form.control} name="startDate" render={({field})=>(
                        <FormItem>
                            <FormLabel>{"Date de début"}</FormLabel>
                            <FormControl>
                                <div className="relative flex gap-2">
                                    <Input
                                        id={field.name}
                                        value={field.value}
                                        placeholder="Sélectionner une date"
                                        className="bg-background pr-10"
                                        onChange={(e) => {
                                            field.onChange(e.target.value)
                                        }}
                                        onKeyDown={(e) => {
                                            if (e.key === "ArrowDown") {
                                            e.preventDefault()
                                            setStartView(true)
                                            }
                                        }}
                                    />
                                    <Popover open={startView} onOpenChange={setStartView}>
                                        <PopoverTrigger asChild>
                                            <Button
                                            id="date-picker"
                                            variant="ghost"
                                            className="absolute top-1/2 right-2 size-6 -translate-y-1/2"
                                            >
                                            <CalendarIcon className="size-3.5" />
                                            <span className="sr-only">{"Sélectionner une date"}</span>
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent
                                            className="w-auto overflow-hidden p-0"
                                            align="end"
                                            alignOffset={-8}
                                            sideOffset={10}
                                        >
                                            <Calendar
                                            mode="single"
                                            selected={field.value ? new Date(field.value) : undefined}
                                            captionLayout="dropdown"
                                            onSelect={(date) => {
                                                if (!date) return;
                                                const value = date.toISOString().slice(0, 10); // "YYYY-MM-DD"
                                                field.onChange(value);
                                                setStartView(false);
                                            }}
                                            />
                                        </PopoverContent>
                                    </Popover>
                                </div>
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )} />
                    <FormField control={form.control} name="endDate" render={({field})=>(
                        <FormItem>
                            <FormLabel>{"Date de fin"}</FormLabel>
                            <FormControl>
                                <div className="relative flex gap-2">
                                    <Input
                                        id={field.name}
                                        value={field.value}
                                        placeholder="Sélectionner une date"
                                        className="bg-background pr-10"
                                        onChange={(e) => {
                                            field.onChange(e.target.value)
                                        }}
                                        onKeyDown={(e) => {
                                            if (e.key === "ArrowDown") {
                                            e.preventDefault()
                                            setEndView(true)
                                            }
                                        }}
                                    />
                                    <Popover open={endView} onOpenChange={setEndView}>
                                        <PopoverTrigger asChild>
                                            <Button
                                            id="date-picker"
                                            variant="ghost"
                                            className="absolute top-1/2 right-2 size-6 -translate-y-1/2"
                                            >
                                            <CalendarIcon className="size-3.5" />
                                            <span className="sr-only">{"Sélectionner une date"}</span>
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent
                                            className="w-auto overflow-hidden p-0"
                                            align="end"
                                            alignOffset={-8}
                                            sideOffset={10}
                                        >
                                            <Calendar
                                            mode="single"
                                            selected={field.value ? new Date(field.value) : undefined}
                                            captionLayout="dropdown"
                                            onSelect={(date) => {
                                                if (!date) return;
                                                const value = date.toISOString().slice(0, 10); // "YYYY-MM-DD"
                                                field.onChange(value);
                                                setStartView(false);
                                            }}
                                            />
                                        </PopoverContent>
                                    </Popover>
                                </div>
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )} />
                    <FormField control={form.control} name="justificationFile" render={({field})=>(
                        <FormItem>
                            <FormLabel>{"Justificatif"}</FormLabel>
                            <FormControl>
                                <Input type="file" {...field} />
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )} />
                    <FormField control={form.control} name="reason" render={({field})=>(
                        <FormItem>
                            <FormLabel>{"Observation"}</FormLabel>
                            <FormControl>
                                <Textarea {...field} placeholder="Observations"/>
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )} />
                    <FormField control={form.control} name="isAnnual" render={({field})=>(
                        <FormItem className="flex flex-row-reverse justify-end">
                            <FormLabel>{"Déduire sur mes droits de congés annuels"}</FormLabel>
                            <FormControl className="inline-flex">
                                <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )} />
                    <DialogFooter>
                        <Button type="submit" isLoading={editRequest.isPending} disabled={editRequest.isPending}>{"Modifier"}</Button>
                        <Button type="reset" variant={"outline"} onClick={(e)=>{e.preventDefault(); form.reset(); openChange(prev=>!prev)}} disabled={editRequest.isPending}>{"Annuler"}</Button>
                    </DialogFooter>
            </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export default EditLeaveRequest;
