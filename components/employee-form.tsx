"use client"
import { Employee } from '@/types/types'
import { zodResolver } from '@hookform/resolvers/zod'
import { UserAccountIcon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { CalendarIcon, Check, LoaderCircleIcon } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import z from 'zod'
import { Button } from './ui/button'
import { Calendar } from './ui/calendar'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from './ui/form'
import { Input } from './ui/input'
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { Stepper, StepperContent, StepperIndicator, StepperItem, StepperNav, StepperPanel, StepperSeparator, StepperTitle, StepperTrigger } from './ui/stepper'
import countries from '@/data/countries'
import departmentsSample from '@/data/departments'
import { employeeCategories } from '@/data/categories'
import TableUpload from './table-upload'

interface Props {
    employee?:Employee;
    users: Array<Employee>;
}

const formSchema = z.object({
    firstName: z.string().min(3, {message: "Trop court"}),
    lastName: z.string().min(3, {message: "Trop court"}),
    email: z.email({message: "Veuillez entrer une adresse valide"}),
    birthDate: z
    .string({message: "Veuillez définir une date de naissance"})
    .refine((val)=> {
        const d = new Date(val);
        return !isNaN(d.getTime());
    }, {message: "Date invalide"}),
    gender: z.string(),
    nationality: z.string(),
    country: z.string(),
    address: z.string(),
    phone: z.string(),
    maritalStatus: z.string(),
    childrenCount: z.number(),
    emergencyContact: z.string().optional(),
    //Info admin
    cnpsNumber: z.string().optional(),
    idType: z.string(),
    idNumber: z.string(),
    idIssueDate: z
    .string({message: "Veuillez définir une date"})
    .refine((val)=> {
        const d = new Date(val);
        return !isNaN(d.getTime());
    }, {message: "Date invalide"}),
    idExpiryDate: z
    .string({message: "Veuillez définir une date"})
    .refine((val)=> {
        const d = new Date(val);
        return !isNaN(d.getTime());
    }, {message: "Date invalide"}),
    idIssuePlace: z.string(),
    idDocumentFile: z.any(),
    //Infos pro
    position: z.string(),
    department: z.string(),
    supervisorId: z.number().optional(),
    category: z.string(),
    level: z.string(),
    startDate: z
    .string({message: "Veuillez définir une date"})
    .refine((val)=> {
        const d = new Date(val);
        return !isNaN(d.getTime());
    }, {message: "Date invalide"}),
    endDate: z
    .string({message: "Veuillez définir une date"})
    .refine((val)=> {
        const d = new Date(val);
        return !isNaN(d.getTime());
    }, {message: "Date invalide"})
    .optional(),
    contractType: z.string(),
    baseSalary: z.number(),
    paymentMode: z.string(),
    workLocation: z.string(),
    workLocationName: z.string().optional(),
    leaveDays: z.number(),
    attachments: z.array(z.any()).optional()
});

function EmployeeForm({employee, users}:Props) {
    const [step, setStep] = useState(1);
    const [popBD, setPopBD] = useState(false);
    const [issueDate, setIssueDate] = useState(false);
    const [expiryDate, setExpiryDate] = useState(false);
    const [startDate, setStartDate] = useState(false);
    const [endDate, setEndDate] = useState(false);

    const steps = [
        {
            title: "Informations personnelles",
            icon: UserAccountIcon,
        },
        {
            title: "Informations administratives",
            icon: UserAccountIcon,
        },
        {
            title: "Informations professionnelles",
            icon: UserAccountIcon,
        },
    ];

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            firstName: employee?.firstName ?? "",
            lastName: employee?.lastName ?? "",
            birthDate: employee?.birthDate ? new Date(employee.birthDate).toISOString().slice(0, 10) : "",
            email: employee?.email ?? "",
            gender: employee?.gender ?? "",
            nationality: employee?.nationality ?? "",
            country: employee?.country ?? "",
            phone: employee?.phone ?? "",
            maritalStatus: employee?.maritalStatus ?? "",
            childrenCount: employee?.childrenCount ?? 0,
            emergencyContact: employee?.emergencyContact ?? "",
            cnpsNumber: employee?.cnpsNumber ?? "",
            idType: employee?.idType ?? "",
            idNumber: employee?.idNumber ?? "",
            idIssueDate: employee?.idIssueDate ? new Date(employee.idIssueDate).toISOString().slice(0,10) : "",
            idExpiryDate: employee?.idExpiryDate ? new Date(employee.idExpiryDate).toISOString().slice(0,10)  : "",
            position: employee?.position ?? "",
            department: employee?.department ?? "",
            supervisorId: employee?.supervisorId ?? undefined,
            category: employee?.category ?? "",
            level: employee?.level ?? "",
            startDate: employee?.startDate ? new Date(employee.startDate).toISOString().slice(0,10) : "",
            endDate: employee?.endDate ? new Date(employee.endDate).toISOString().slice(0,10) : undefined,
            contractType: employee?.contractType ?? "",
            baseSalary: employee?.baseSalary ?? 100000,
            paymentMode: employee?.paymentMode ?? "",
            workLocation: employee?.workLocation ?? "",
            workLocationName: employee?.workLocationName ?? "",
            leaveDays: employee?.leaveDays ?? 21,
            attachments: employee?.attachments ?? undefined,
            idIssuePlace: employee?.idIssuePlace ?? "",
            idDocumentFile: employee?.idDocumentFile
        }

    });
    function onSubmit(values:z.infer<typeof formSchema>){
        console.log(values);
    }
  return (
    <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="@container">
            <Stepper
                value={step}
                onValueChange={setStep}
                className="space-y-4"
                indicators={{
                    completed: <Check className="size-4" />,
                    loading: <LoaderCircleIcon className="size-4 animate-spin" />,
            }}>
                <StepperNav className="gap-3 mb-15">
                    {
                        steps.map((el, ix)=>
                        <StepperItem key={ix} step={ix + 1} className="relative flex-1 items-start">
                            <StepperTrigger className="flex flex-col items-start justify-center gap-2.5 grow" asChild>
                                 <StepperIndicator className="size-8 border-2 data-[state=completed]:text-white data-[state=completed]:bg-green-500 data-[state=inactive]:bg-transparent data-[state=inactive]:border-border data-[state=inactive]:text-muted-foreground">
                                    <HugeiconsIcon icon={el.icon} className="size-4" />
                                </StepperIndicator>
                                <div className="flex flex-col items-start gap-1">
                                    <div className="text-[10px] font-semibold uppercase text-muted-foreground">{"Étape "}{ix + 1}</div>
                                        <StepperTitle className="hidden @min-[400px]:inline-flex text-start text-base font-semibold group-data-[state=inactive]/step:text-muted-foreground">
                                            {el.title}
                                        </StepperTitle>
                                    </div>
                            </StepperTrigger>
                            {steps.length > ix + 1 && (
                                <StepperSeparator className="absolute top-4 inset-x-0 start-9 m-0 group-data-[orientation=horizontal]/stepper-nav:w-[calc(100%-2rem)] group-data-[orientation=horizontal]/stepper-nav:flex-none  group-data-[state=completed]/step:bg-green-500" />
                            )}
                        </StepperItem>)
                    }
                </StepperNav>
                <StepperPanel className="text-sm">
                    <StepperContent value={1} className="grid gap-3 grid-cols-1 @min-[400px]:grid-cols-2">
                            <FormField control={form.control} name="firstName" render={({field})=>
                            <FormItem>
                                <FormLabel isRequired>{"Prénoms"}</FormLabel>
                                <FormControl>
                                    <Input {...field} placeholder="ex. Jean François" />
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                            } />
                            <FormField control={form.control} name="lastName" render={({field})=>
                            <FormItem>
                                <FormLabel isRequired>{"Noms"}</FormLabel>
                                <FormControl>
                                    <Input {...field} placeholder="ex. Atangana" />
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                            } />
                            <FormField control={form.control} name="phone" render={({field})=>
                            <FormItem>
                                <FormLabel isRequired>{"Numéro de téléphone"}</FormLabel>
                                <FormControl>
                                    <Input {...field} placeholder="ex. 677556642" />
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                            } />
                            <FormField control={form.control} name="birthDate" render={({field})=>
                            <FormItem>
                                <FormLabel isRequired>{"Date de naissance"}</FormLabel>
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
                                                    setPopBD(true)
                                                    }
                                                }}
                                            />
                                            <Popover open={popBD} onOpenChange={setPopBD}>
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
                                                        setPopBD(false);
                                                    }}
                                                    />
                                                </PopoverContent>
                                            </Popover>
                                        </div>
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                            } />
                            <FormField control={form.control} name="email" render={({field})=>
                            <FormItem>
                                <FormLabel isRequired>{"Email"}</FormLabel>
                                <FormControl>
                                    <Input {...field} placeholder="ex. atanganaflobert@gmail.com" disabled={!!employee} />
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                            } />
                            <FormField control={form.control} name="gender" render={({field})=>
                            <FormItem>
                                <FormLabel isRequired>{"Sexe"}</FormLabel>
                                <FormControl>
                                    <Select value={field.value} onValueChange={field.onChange}>
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Sélectionner"/>
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Homme">{"Masculin"}</SelectItem>
                                            <SelectItem value="Femme">{"Féminin"}</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                            } />
                            <FormField control={form.control} name="nationality" render={({field})=>
                            <FormItem>
                                <FormLabel isRequired>{"Nationalité"}</FormLabel>
                                <FormControl>
                                    <Select value={field.value} onValueChange={field.onChange} >
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Sélectionner"/>
                                        </SelectTrigger>
                                        <SelectContent>
                                            {
                                                countries
                                                .sort((a,b)=>a.nationality.localeCompare(b.nationality)) //Alphabetic sort
                                                .map(country=>
                                                    <SelectItem key={country.name} value={country.name}>{country.nationality}</SelectItem>
                                                )
                                            }
                                        </SelectContent>
                                    </Select>
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                            } />
                            <FormField control={form.control} name="country" render={({field})=>
                            <FormItem>
                                <FormLabel isRequired>{"Pays de résidence"}</FormLabel>
                                <FormControl>
                                    <Select value={field.value} onValueChange={field.onChange} >
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Sélectionner"/>
                                        </SelectTrigger>
                                        <SelectContent>
                                            {
                                                countries
                                                .sort((a,b)=>a.name.localeCompare(b.name)) //Alphabetic sort
                                                .map(country=>
                                                    <SelectItem key={country.name} value={country.name}>{country.name}</SelectItem>
                                                )
                                            }
                                        </SelectContent>
                                    </Select>
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                            } />
                            <FormField control={form.control} name="address" render={({field})=>
                            <FormItem>
                                <FormLabel isRequired>{"Adresse complète"}</FormLabel>
                                <FormControl>
                                    <Input {...field} placeholder="ex. Rue des palmiers, Akwa - Douala" />
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                            } />
                            <FormField control={form.control} name="maritalStatus" render={({field})=>
                            <FormItem>
                                <FormLabel isRequired>{"Situation Matrimoniale"}</FormLabel>
                                <FormControl>
                                    <Select value={field.value} onValueChange={field.onChange}>
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Sélectionner"/>
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Célibataire">{"Célibataire"}</SelectItem>
                                            <SelectItem value="Marié">{"Marié(e)"}</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                            } />
                            <FormField control={form.control} name="childrenCount" render={({field : {value, onChange, ...props}})=>
                            <FormItem>
                                <FormLabel isRequired>{"Nombre d'enfants"}</FormLabel>
                                <FormControl>
                                    <Input type="number" value={value} onChange={(e)=>onChange(Number(e.target.value))} {...props} placeholder="0" />
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                            } />
                            <FormField control={form.control} name="emergencyContact" render={({field})=>
                            <FormItem>
                                <FormLabel>{"Personne à contacter"}</FormLabel>
                                <FormControl>
                                    <Input {...field} />
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                            } />
                    </StepperContent>
                    <StepperContent value={2} className="grid gap-3 grid-cols-1 @min-[400px]:grid-cols-2">
                        <FormField control={form.control} name="cnpsNumber" render={({field})=>
                            <FormItem>
                                <FormLabel>{"Numéro CNPS"}</FormLabel>
                                <FormControl>
                                    <Input {...field} />
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                            } />
                        <FormField control={form.control} name="idType" render={({field})=>
                            <FormItem>
                                <FormLabel isRequired>{"Type de pièce d'identité"}</FormLabel>
                                <FormControl>
                                    <Select value={field.value} onValueChange={field.onChange}>
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Sélectionner"/>
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="CNI">{"Carte d'Identité Nationale (CNI)"}</SelectItem>
                                            <SelectItem value="PASSPORT">{"Passport"}</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                            } />
                        <FormField control={form.control} name="idNumber" render={({field})=>
                            <FormItem>
                                <FormLabel isRequired>{"Numéro de pièce d'Identité"}</FormLabel>
                                <FormControl>
                                    <Input {...field} placeholder="ex. LT-0124" />
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                            } />
                        <FormField control={form.control} name="idIssueDate" render={({field})=>
                            <FormItem>
                                <FormLabel isRequired>{"Date de délivrance"}</FormLabel>
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
                                                    setIssueDate(true)
                                                    }
                                                }}
                                            />
                                            <Popover open={issueDate} onOpenChange={setIssueDate}>
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
                                                        setIssueDate(false);
                                                    }}
                                                    />
                                                </PopoverContent>
                                            </Popover>
                                        </div>
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                            } />
                        <FormField control={form.control} name="idExpiryDate" render={({field})=>
                            <FormItem>
                                <FormLabel isRequired>{"Date d'Expiration"}</FormLabel>
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
                                                    setExpiryDate(true)
                                                    }
                                                }}
                                            />
                                            <Popover open={expiryDate} onOpenChange={setExpiryDate}>
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
                                                        setExpiryDate(false);
                                                    }}
                                                    />
                                                </PopoverContent>
                                            </Popover>
                                        </div>
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                            } />
                            <FormField control={form.control} name="idIssuePlace" render={({field})=>
                            <FormItem>
                                <FormLabel isRequired>{"Lieu de délivrance"}</FormLabel>
                                <FormControl>
                                    <Input {...field} placeholder='ex. Douala' />
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                            } />
                            <FormField control={form.control} name="idDocumentFile" render={({field})=>
                            <FormItem>
                                <FormLabel isRequired>{"Importer la pièce d'identité"}</FormLabel>
                                <FormControl>
                                    <Input type="file" {...field} />
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                            } />
                    </StepperContent>
                    <StepperContent value={3} className="grid gap-3 grid-cols-1 @min-[400px]:grid-cols-2">
                        <FormField control={form.control} name="position" render={({field})=>
                            <FormItem>
                                <FormLabel isRequired>{"Poste occupé"}</FormLabel>
                                <FormControl>
                                    <Input {...field} placeholder="ex. Gardien" />
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                            } />
                        <FormField control={form.control} name="department" render={({field})=>
                            <FormItem>
                                <FormLabel isRequired>{"Département"}</FormLabel>
                                <FormControl>
                                    <Select value={field.value} onValueChange={(e)=>field.onChange(Number(e))}>
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Sélectionner"/>
                                        </SelectTrigger>
                                        <SelectContent>
                                            {
                                                departmentsSample.map((dep, id)=>
                                                <SelectItem key={id} value={dep}>{dep}</SelectItem>)
                                            }
                                        </SelectContent>
                                    </Select>
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                            } />
                            <FormField control={form.control} name="category" render={({field})=>
                            <FormItem>
                                <FormLabel isRequired>{"Catégorie"}</FormLabel>
                                <FormControl>
                                    <Select value={field.value} onValueChange={field.onChange}>
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Sélectionner"/>
                                        </SelectTrigger>
                                        <SelectContent>
                                            {
                                                employeeCategories.map((category)=>
                                                <SelectItem key={category.value} value={category.value}>{category.name}</SelectItem>)
                                            }
                                        </SelectContent>
                                    </Select>
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                            } />
                            <FormField control={form.control} name="level" render={({field})=>
                            <FormItem>
                                <FormLabel isRequired>{"Échelon"}</FormLabel>
                                <FormControl>
                                    <Select value={field.value} onValueChange={field.onChange}>
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Sélectionner"/>
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="A">{"A"}</SelectItem>
                                            <SelectItem value="B">{"B"}</SelectItem>
                                            <SelectItem value="C">{"C"}</SelectItem>
                                            <SelectItem value="D">{"D"}</SelectItem>
                                            <SelectItem value="E">{"E"}</SelectItem>
                                            <SelectItem value="F">{"F"}</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                            } />
                            <FormField control={form.control} name="baseSalary" render={({field})=>
                            <FormItem>
                                <FormLabel isRequired>{"Salaire de base"}</FormLabel>
                                <FormControl>
                                    <div className='w-full relative h-fit'>
                                        <Input type="number" {...field} placeholder="ex. 200 000" className='z-2 pr-16' />
                                        <span 
                                        className="custom-label">
                                            {"FCFA"}
                                        </span>
                                    </div>
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                            } />
                            <FormField control={form.control} name="supervisorId" render={({field})=>{
                                const value = isNaN(Number(field.value)) ? "" : String(field.value) ;
                            return <FormItem>
                                <FormLabel isRequired>{"Superviseur Hiérarchique"}</FormLabel>
                                <FormControl>
                                    <Select value={value} onValueChange={field.onChange}>
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Sélectionner"/>
                                        </SelectTrigger>
                                        <SelectContent>
                                            {
                                                users.map((user)=>
                                                <SelectItem key={user.id} 
                                                value={String(user.id)}>
                                                    {user.firstName.concat(" ", user.lastName)}
                                                </SelectItem>)
                                            }
                                        </SelectContent>
                                    </Select>
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                            }
                            } />
                            <FormField control={form.control} name="paymentMode" render={({field})=>
                            <FormItem>
                                <FormLabel isRequired>{"Mode de Paiement"}</FormLabel>
                                <FormControl>
                                    <Select value={field.value} onValueChange={(e)=>field.onChange(Number(e))}>
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Sélectionner"/>
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Virement bancaire">{"Virement bancaire"}</SelectItem>
                                            <SelectItem value="Espèces">{"Espèces"}</SelectItem>
                                            <SelectItem value="Mobile Money">{"Mobile Money"}</SelectItem>
                                            <SelectItem value="Chèque">{"Chèque"}</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                            } />
                            <FormField control={form.control} name="workLocation" render={({field})=>
                            <FormItem>
                                <FormLabel isRequired>{"Lieu de travail"}</FormLabel>
                                <FormControl>
                                    <Select value={field.value} onValueChange={field.onChange}>
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Sélectionner"/>
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="headquarters">{"Siège"}</SelectItem>
                                            <SelectItem value="agency">{"Agence"}</SelectItem>
                                            <SelectItem value="other">{"Autre"}</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                            } />
                            {
                                form.watch("workLocation")=== "other" &&
                                <FormField control={form.control} name="workLocationName" render={({field})=>
                            <FormItem>
                                <FormLabel>{"Nom du lieu de travail"}</FormLabel>
                                <FormControl>
                                    <Input {...field} placeholder="ex. Chantier Oco" />
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                            } />}
                            <FormField control={form.control} name="leaveDays" render={({field})=>
                            <FormItem>
                                <FormLabel isRequired>{"Droit de congés annuel"}</FormLabel>
                                <FormControl>
                                    <div className="relative w-full">
                                        <Input type="number" {...field} className="pr-16 z-2" />
                                        <span 
                                            className="custom-label">
                                            {"Jours"}
                                        </span>
                                    </div>
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                            } />
                            <FormField control={form.control} name="contractType" render={({field})=>
                            <FormItem>
                                <FormLabel isRequired>{"Type de contrat"}</FormLabel>
                                <FormControl>
                                    <Select value={field.value} onValueChange={field.onChange}>
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Sélectionner"/>
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="CDI">{"CDI"}</SelectItem>
                                            <SelectItem value="CDD">{"CDD"}</SelectItem>
                                            <SelectItem value="Stage">{"Stage"}</SelectItem>
                                            <SelectItem value="Prestation">{"Prestation"}</SelectItem>
                                            <SelectItem value="Essai">{"Essai"}</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                            } />
                            <FormField control={form.control} name="startDate" render={({field})=>
                            <FormItem>
                                <FormLabel isRequired>{"Date d'entrée"}</FormLabel>
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
                                                    setStartDate(true)
                                                    }
                                                }}
                                            />
                                            <Popover open={startDate} onOpenChange={setStartDate}>
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
                                                        setStartDate(false);
                                                    }}
                                                    />
                                                </PopoverContent>
                                            </Popover>
                                        </div>
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                            } />
                            <FormField control={form.control} name="endDate" render={({field})=>
                            <FormItem>
                                <FormLabel isRequired>{"Date de Fin de contrat"}</FormLabel>
                                <FormControl>
                                    <div className="relative flex gap-2">
                                            <Input
                                                id={field.name}
                                                value={field.value}
                                                placeholder="Sélectionner une date si applicable"
                                                className="bg-background pr-10"
                                                onChange={(e) => {
                                                    field.onChange(e.target.value)
                                                }}
                                                onKeyDown={(e) => {
                                                    if (e.key === "ArrowDown") {
                                                    e.preventDefault()
                                                    setEndDate(true)
                                                    }
                                                }}
                                            />
                                            <Popover open={endDate} onOpenChange={setEndDate}>
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
                                                        setEndDate(false);
                                                    }}
                                                    />
                                                </PopoverContent>
                                            </Popover>
                                        </div>
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                            } />
                            <FormField control={form.control} name="attachments" render={({field})=>
                            <FormItem>
                                <FormLabel isRequired>{"Pièces jointes"}</FormLabel>
                                <FormControl>
                                    {/* <TableUpload  /> */}
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                            } />
                    </StepperContent>
                </StepperPanel>
                {/**Footer */}
                <div className="flex items-center justify-between gap-2.5">
                    <Button variant="outline" 
                    onClick={(e) =>{e.preventDefault(); setStep((prev) => prev - 1)}} 
                    disabled={step === 1}>
                        {"Précédent"}
                    </Button>
                    {
                        step !== steps.length ?
                        <Button
                    variant="default"
                    onClick={(e) =>{e.preventDefault(); setStep((prev) => prev + 1)}}
                    disabled={step === steps.length}
                    >
                     {"Suivant"}
                    </Button>
                    :
                    <Button variant={"primary"} disabled={false}>{"Enregistrer"}</Button>
                    }
                </div>
            </Stepper>
        </form>
    </Form>
  )
}

export default EmployeeForm