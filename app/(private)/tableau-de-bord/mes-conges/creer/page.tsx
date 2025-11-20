'use client'
import Header from '@/components/header'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import useKizunaStore from '@/context/store'
import { demoHolidayTypes } from '@/data/temp'
import HolidaysQuery from '@/queries/holidays'
import { HolidayRequest } from '@/types/types'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { CalendarIcon } from 'lucide-react'
import React from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import z from 'zod'

const formSchema = z.object({
    typeId: z.string({message: "Choisissez un type"}).refine((val)=> !!Number(val)),
    startDate: z
    .string({ message: "Veuillez définir une date de début" })
    .refine((val) => {
      const d = new Date(val);
      return !isNaN(d.getTime());
    }, { message: "Date de début invalide" }),
    endDate: z
    .string({ message: "Veuillez définir une date de fin" })
    .refine((val) => {
      const d = new Date(val);
      return !isNaN(d.getTime());
    }, { message: "Date de début invalide" }),
    justificationFile: z.any(),
    reason: z.string().optional(),
});

function Page() {
    const { user } = useKizunaStore();
    const [startView, setStartView] = React.useState<boolean>(false);
    const [endView, setEndView] = React.useState<boolean>(false);
    const holidayRequest = new HolidaysQuery(); 
    const sendLeaveRequest = useMutation({
        mutationKey: ["leave-requests"],
        mutationFn: async(data:Omit<HolidayRequest, "id" | "status" | "requestedDays">)=>holidayRequest.sendRequest(data),
        onSuccess: ()=>{
            toast.success("Votre demande d'absence a été soumise avec succès !");
            form.reset();
        },
        onError: (error)=>{
            toast.error(error.message);
        }
    });
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            typeId: "",
            startDate: "",
            endDate: "",
            justificationFile: undefined,
            reason: ""
        }
    });
    function onSubmit(values: z.infer<typeof formSchema>){
        sendLeaveRequest.mutate({typeId: Number(values.typeId), startDate: new Date(values.startDate), endDate: new Date(values.endDate), justificationFile: values.justificationFile, reason: values.reason, createdAt: new Date(), userId: user?.id ?? 0})
        //console.log(values);
    }
  return (
    <div className="flex flex-col gap-4 sm:gap-6">
        <Header variant={"accent"} title="Créer une demande d'absence" />
        <div className="card-1">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-col-1 gap-4 max-w-lg">
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
                    <Button type="submit" disabled={sendLeaveRequest.isPending} isLoading={sendLeaveRequest.isPending}>{"Soumettre"}</Button>
                </form>
            </Form>
        </div>
    </div>
  )
}

export default Page