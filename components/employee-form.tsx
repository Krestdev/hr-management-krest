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
import { usePositionsQuery } from '@/queries/positions'
import { useCreateEmployeeMutation, useUpdateEmployeeMutation } from '@/queries/employee'
import { toast } from 'sonner'

interface Props {
    employee?: Employee;
    users: Array<Employee>;
}

const formSchema = z.object({
    firstName: z.string().min(3, { message: "Trop court" }),
    lastName: z.string().min(3, { message: "Trop court" }),
    email: z.email({ message: "Veuillez entrer une adresse valide" }),
    birthday: z
        .string({ message: "Veuillez définir une date de naissance" })
        .refine((val) => {
            const d = new Date(val);
            return !isNaN(d.getTime());
        }, { message: "Date invalide" }),
    gender: z.string(),
    nationality: z.string(),
    countryOfResidence: z.string(),
    address: z.string(),
    phoneNumber: z.string(),
    matrimonial_status: z.number(),
    number_of_children: z.number(),
    EmergencyContactPhone: z.string().optional(),
    //Info admin
    CNPSNumber: z.string().optional(),
    idDocumentType: z.string(),
    idDocumentNumber: z.string(),
    idDocumentIssueDate: z
        .string({ message: "Veuillez définir une date" })
        .refine((val) => {
            const d = new Date(val);
            return !isNaN(d.getTime());
        }, { message: "Date invalide" }),
    idDocumentExpiryDate: z
        .string({ message: "Veuillez définir une date" })
        .refine((val) => {
            const d = new Date(val);
            return !isNaN(d.getTime());
        }, { message: "Date invalide" }),
    idDocumentIssuePlace: z.string(),
    idDocumentFileUrl: z.any(),
    //Infos pro
    position: z.string(),
    department: z.string(),
    supervisorId: z.string().optional(),
    category: z.string(),
    grade: z.string(),
    hireData: z
        .string({ message: "Veuillez définir une date" })
        .refine((val) => {
            const d = new Date(val);
            return !isNaN(d.getTime());
        }, { message: "Date invalide" }),
    endDate: z
        .string({ message: "Veuillez définir une date" })
        .refine((val) => {
            const d = new Date(val);
            return !isNaN(d.getTime());
        }, { message: "Date invalide" })
        .optional(),
    contract_type: z.string(),
    baseSalary: z.number(),
    paymentMode: z.string(),
    workLocation: z.string(),
    workLocationName: z.string().optional(),
    leaveDays: z.number(),
    attachments: z.array(z.any()).optional()
});

function EmployeeForm({ employee, users }: Props) {
    const [step, setStep] = useState(1);
    const [popBD, setPopBD] = useState(false);
    const [issueDate, setIssueDate] = useState(false);
    const [expiryDate, setExpiryDate] = useState(false);
    const [hireData, setHireData] = useState(false);
    const [endDate, setEndDate] = useState(false);

    const positionData = usePositionsQuery();

    const updateEmployee = useUpdateEmployeeMutation();

    const createEmployee = useCreateEmployeeMutation();

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
            birthday: employee?.birthday ? new Date(employee.birthday).toISOString().slice(0, 10) : "",
            email: employee?.user.email ?? "",
            gender: employee?.gender ?? "",
            nationality: employee?.countryOfResidence ?? "",
            countryOfResidence: employee?.countryOfResidence ?? "",
            address: employee?.address,
            phoneNumber: employee?.phoneNumber.toString() ?? "",
            matrimonial_status: employee?.matrimonial_status ?? 0,
            number_of_children: employee?.number_of_children ?? 0,
            EmergencyContactPhone: employee?.EmergencyContactPhone ?? "",
            CNPSNumber: employee?.CNPSNumber ?? "",
            idDocumentType: employee?.idDocumentType ?? "",
            idDocumentNumber: employee?.idDocumentNumber ?? "",
            idDocumentIssueDate: employee?.idDocumentIssueDate ? new Date(employee.idDocumentIssueDate).toISOString().slice(0, 10) : "",
            idDocumentExpiryDate: employee?.idDocumentExpiryDate ? new Date(employee.idDocumentExpiryDate).toISOString().slice(0, 10) : "",
            position: employee?.position && employee?.position.length > 0 ? employee.position[0] : "",
            department: employee?.department && employee?.department.length > 0 ? employee?.department[0] : "",
            supervisorId: employee?.supervisorId ?? undefined,
            category: employee?.category ?? "",
            grade: employee?.grade ?? "",
            hireData: employee?.hireDate ? new Date(employee.hireDate).toISOString().slice(0, 10) : "",
            endDate: employee?.endDate ? new Date(employee.endDate).toISOString().slice(0, 10) : undefined,
            contract_type: employee?.contracts?.[0].contract_type ?? "",
            baseSalary: employee?.contracts![0].baseSalary ?? 100000,
            paymentMode: employee?.paymentMode ?? "",
            workLocation: employee?.workLocation ?? "",
            workLocationName: employee?.workLocationName ?? "",
            leaveDays: employee?.leaveDays ?? 21,
            attachments: employee?.attachments ?? undefined,
            idDocumentIssuePlace: employee?.idDocumentIssuePlace ?? "",
            idDocumentFileUrl: employee?.idDocumentFileUrl
        }

    });
    function onSubmit(values: z.infer<typeof formSchema>) {
        const data = {
            ...values,
            idDocumentIssueDate: new Date(values.idDocumentIssueDate),
            idDocumentExpiryDate: new Date(values.idDocumentExpiryDate),
            hireData: new Date(values.hireData),
        }
        if (employee) {
            updateEmployee.mutate({ id: employee.uuid, data: data as unknown as Partial<Omit<Employee, "uuid" | "createdAt" | "updatedAt">> }, {
                onSuccess: () => {
                    form.reset();
                    setStep(1);
                    toast.success("Employe mis à jour avec succès");
                },
                onError: (error) => {
                    toast.error("Erreur lors de la mise à jour de l'employe: " + error.message);
                }
            });
        } else {
            createEmployee.mutate(data as unknown as Omit<Employee, "uuid" | "createdAt" | "updatedAt">, {
                onSuccess: () => {
                    form.reset();
                    setStep(1);
                    toast.success("Employe créé avec succès");
                },
                onError: (error) => {
                    toast.error("Erreur lors de la création de l'employe: " + error.message);
                }
            });
        }
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
                            steps.map((el, ix) =>
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
                            <FormField control={form.control} name="firstName" render={({ field }) =>
                                <FormItem>
                                    <FormLabel isRequired>{"Prénoms"}</FormLabel>
                                    <FormControl>
                                        <Input {...field} placeholder="ex. Jean François" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            } />
                            <FormField control={form.control} name="lastName" render={({ field }) =>
                                <FormItem>
                                    <FormLabel isRequired>{"Noms"}</FormLabel>
                                    <FormControl>
                                        <Input {...field} placeholder="ex. Atangana" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            } />
                            <FormField control={form.control} name="phoneNumber" render={({ field }) =>
                                <FormItem>
                                    <FormLabel isRequired>{"Numéro de téléphone"}</FormLabel>
                                    <FormControl>
                                        <Input {...field} placeholder="ex. 677556642" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            } />
                            <FormField control={form.control} name="birthday" render={({ field }) =>
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
                                    <FormMessage />
                                </FormItem>
                            } />
                            <FormField control={form.control} name="email" render={({ field }) =>
                                <FormItem>
                                    <FormLabel isRequired>{"Email"}</FormLabel>
                                    <FormControl>
                                        <Input {...field} placeholder="ex. atanganaflobert@gmail.com" disabled={!!employee} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            } />
                            <FormField control={form.control} name="gender" render={({ field }) =>
                                <FormItem>
                                    <FormLabel isRequired>{"Sexe"}</FormLabel>
                                    <FormControl>
                                        <Select value={field.value} onValueChange={field.onChange}>
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Sélectionner" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="MALE">{"Masculin"}</SelectItem>
                                                <SelectItem value="FEMALE">{"Féminin"}</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            } />
                            <FormField control={form.control} name="nationality" render={({ field }) =>
                                <FormItem>
                                    <FormLabel isRequired>{"Nationalité"}</FormLabel>
                                    <FormControl>
                                        <Select value={field.value} onValueChange={field.onChange} >
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Sélectionner" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {
                                                    countries
                                                        .sort((a, b) => a.nationality.localeCompare(b.nationality)) //Alphabetic sort
                                                        .map(country =>
                                                            <SelectItem key={country.name} value={country.name}>{country.nationality}</SelectItem>
                                                        )
                                                }
                                            </SelectContent>
                                        </Select>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            } />
                            <FormField control={form.control} name="countryOfResidence" render={({ field }) =>
                                <FormItem>
                                    <FormLabel isRequired>{"Pays de résidence"}</FormLabel>
                                    <FormControl>
                                        <Select value={field.value} onValueChange={field.onChange} >
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Sélectionner" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {
                                                    countries
                                                        .sort((a, b) => a.name.localeCompare(b.name)) //Alphabetic sort
                                                        .map(country =>
                                                            <SelectItem key={country.name} value={country.name}>{country.name}</SelectItem>
                                                        )
                                                }
                                            </SelectContent>
                                        </Select>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            } />
                            <FormField control={form.control} name="address" render={({ field }) =>
                                <FormItem>
                                    <FormLabel isRequired>{"Adresse complète"}</FormLabel>
                                    <FormControl>
                                        <Input {...field} placeholder="ex. Rue des palmiers, Akwa - Douala" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            } />
                            <FormField control={form.control} name="matrimonial_status" render={({ field }) =>
                                <FormItem>
                                    <FormLabel isRequired>{"Situation Matrimoniale"}</FormLabel>
                                    <FormControl>
                                        <Select value={String(field.value)} onValueChange={field.onChange}>
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Sélectionner" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="0">{"Célibataire"}</SelectItem>
                                                <SelectItem value="1">{"Marié(e)"}</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            } />
                            <FormField control={form.control} name="number_of_children" render={({ field: { value, onChange, ...props } }) =>
                                <FormItem>
                                    <FormLabel isRequired>{"Nombre d'enfants"}</FormLabel>
                                    <FormControl>
                                        <Input type="number" value={value} onChange={(e) => onChange(Number(e.target.value))} {...props} placeholder="0" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            } />
                            <FormField control={form.control} name="EmergencyContactPhone" render={({ field }) =>
                                <FormItem>
                                    <FormLabel>{"Personne à contacter"}</FormLabel>
                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            } />
                        </StepperContent>
                        <StepperContent value={2} className="grid gap-3 grid-cols-1 @min-[400px]:grid-cols-2">
                            <FormField control={form.control} name="CNPSNumber" render={({ field }) =>
                                <FormItem>
                                    <FormLabel>{"Numéro CNPS"}</FormLabel>
                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            } />
                            <FormField control={form.control} name="idDocumentType" render={({ field }) =>
                                <FormItem>
                                    <FormLabel isRequired>{"Type de pièce d'identité"}</FormLabel>
                                    <FormControl>
                                        <Select value={field.value} onValueChange={field.onChange}>
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Sélectionner" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="CNI">{"Carte d'Identité Nationale (CNI)"}</SelectItem>
                                                <SelectItem value="PASSPORT">{"Passport"}</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            } />
                            <FormField control={form.control} name="idDocumentNumber" render={({ field }) =>
                                <FormItem>
                                    <FormLabel isRequired>{"Numéro de pièce d'Identité"}</FormLabel>
                                    <FormControl>
                                        <Input {...field} placeholder="ex. LT-0124" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            } />
                            <FormField control={form.control} name="idDocumentIssueDate" render={({ field }) =>
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
                                    <FormMessage />
                                </FormItem>
                            } />
                            <FormField control={form.control} name="idDocumentExpiryDate" render={({ field }) =>
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
                                    <FormMessage />
                                </FormItem>
                            } />
                            <FormField control={form.control} name="idDocumentIssuePlace" render={({ field }) =>
                                <FormItem>
                                    <FormLabel isRequired>{"Lieu de délivrance"}</FormLabel>
                                    <FormControl>
                                        <Input {...field} placeholder='ex. Douala' />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            } />
                            <FormField control={form.control} name="idDocumentFileUrl" render={({ field }) =>
                                <FormItem>
                                    <FormLabel isRequired>{"Importer la pièce d'identité"}</FormLabel>
                                    <FormControl>
                                        <Input type="file" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            } />
                        </StepperContent>
                        <StepperContent value={3} className="grid gap-3 grid-cols-1 @min-[400px]:grid-cols-2">
                            <FormField control={form.control} name="position" render={({ field }) =>
                                <FormItem>
                                    <FormLabel isRequired>{"Poste occupé"}</FormLabel>
                                    <FormControl>
                                        <Select value={field.value} onValueChange={(e) => field.onChange(e)}>
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Sélectionner" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {
                                                    positionData.data?.map((pos, id) =>
                                                        <SelectItem key={id} value={pos.uuid}>{pos.title}</SelectItem>)
                                                }
                                            </SelectContent>
                                        </Select>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            } />
                            <FormField control={form.control} name="department" render={({ field }) =>
                                <FormItem>
                                    <FormLabel isRequired>{"Département"}</FormLabel>
                                    <FormControl>
                                        <Select value={field.value} onValueChange={(e) => field.onChange(e)}>
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Sélectionner" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {
                                                    departmentsSample.map((dep, id) =>
                                                        <SelectItem key={id} value={dep}>{dep}</SelectItem>)
                                                }
                                            </SelectContent>
                                        </Select>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            } />
                            <FormField control={form.control} name="category" render={({ field }) =>
                                <FormItem>
                                    <FormLabel isRequired>{"Catégorie"}</FormLabel>
                                    <FormControl>
                                        <Select value={field.value} onValueChange={field.onChange}>
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Sélectionner" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {
                                                    employeeCategories.map((category) =>
                                                        <SelectItem key={category.value} value={category.value}>{category.name}</SelectItem>)
                                                }
                                            </SelectContent>
                                        </Select>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            } />
                            <FormField control={form.control} name="grade" render={({ field }) =>
                                <FormItem>
                                    <FormLabel isRequired>{"Échelon"}</FormLabel>
                                    <FormControl>
                                        <Select value={field.value} onValueChange={field.onChange}>
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Sélectionner" />
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
                                    <FormMessage />
                                </FormItem>
                            } />
                            <FormField control={form.control} name="baseSalary" render={({ field }) =>
                                <FormItem>
                                    <FormLabel isRequired>{"Salaire de base"}</FormLabel>
                                    <FormControl>
                                        <div className='w-full relative h-fit'>
                                            <Input type="number" value={field.value} placeholder="ex. 200 000" className='z-2 pr-16' onChange={(e) => field.onChange(Number(e.target.value))} />
                                            <span
                                                className="custom-label">
                                                {"FCFA"}
                                            </span>
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            } />
                            <FormField control={form.control} name="supervisorId" render={({ field }) => {
                                return <FormItem>
                                    <FormLabel isRequired>{"Superviseur Hiérarchique"}</FormLabel>
                                    <FormControl>
                                        <Select value={field.value} onValueChange={field.onChange}>
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Sélectionner" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {
                                                    users.map((user) =>
                                                        <SelectItem key={user.uuid}
                                                            value={user.uuid}>
                                                            {user.firstName.concat(" ", user.lastName)}
                                                        </SelectItem>)
                                                }
                                            </SelectContent>
                                        </Select>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            }
                            } />
                            <FormField control={form.control} name="paymentMode" render={({ field }) =>
                                <FormItem>
                                    <FormLabel isRequired>{"Mode de Paiement"}</FormLabel>
                                    <FormControl>
                                        <Select value={field.value} onValueChange={(e) => field.onChange(e)}>
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Sélectionner" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="VIREMENT">{"Virement bancaire"}</SelectItem>
                                                <SelectItem value="ESPECE">{"Espèces"}</SelectItem>
                                                <SelectItem value="MOBILE_MONEY">{"Mobile Money"}</SelectItem>
                                                <SelectItem value="CHEQUE">{"Chèque"}</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            } />
                            <FormField control={form.control} name="workLocation" render={({ field }) =>
                                <FormItem>
                                    <FormLabel isRequired>{"Lieu de travail"}</FormLabel>
                                    <FormControl>
                                        <Select value={field.value} onValueChange={field.onChange}>
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Sélectionner" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="headquarters">{"Siège"}</SelectItem>
                                                <SelectItem value="agency">{"Agence"}</SelectItem>
                                                <SelectItem value="other">{"Autre"}</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            } />
                            {
                                form.watch("workLocation") === "other" &&
                                <FormField control={form.control} name="workLocationName" render={({ field }) =>
                                    <FormItem>
                                        <FormLabel>{"Nom du lieu de travail"}</FormLabel>
                                        <FormControl>
                                            <Input {...field} placeholder="ex. Chantier Oco" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                } />}
                            <FormField control={form.control} name="leaveDays" render={({ field }) =>
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
                                    <FormMessage />
                                </FormItem>
                            } />
                            <FormField control={form.control} name="contract_type" render={({ field }) =>
                                <FormItem>
                                    <FormLabel isRequired>{"Type de contrat"}</FormLabel>
                                    <FormControl>
                                        <Select value={field.value} onValueChange={field.onChange}>
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Sélectionner" />
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
                                    <FormMessage />
                                </FormItem>
                            } />
                            <FormField control={form.control} name="hireData" render={({ field }) =>
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
                                                        setHireData(true)
                                                    }
                                                }}
                                            />
                                            <Popover open={hireData} onOpenChange={setHireData}>
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
                                                            setHireData(false);
                                                        }}
                                                    />
                                                </PopoverContent>
                                            </Popover>
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            } />
                            <FormField control={form.control} name="endDate" render={({ field }) =>
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
                                    <FormMessage />
                                </FormItem>
                            } />
                            <FormField control={form.control} name="attachments" render={({ field }) =>
                                <FormItem>
                                    <FormLabel isRequired>{"Pièces jointes"}</FormLabel>
                                    <FormControl>
                                        {/* <TableUpload  /> */}
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            } />
                        </StepperContent>
                    </StepperPanel>
                    {/**Footer */}
                    <div className="flex items-center justify-between gap-2.5">
                        <Button variant="outline"
                            onClick={(e) => { e.preventDefault(); setStep((prev) => prev - 1) }}
                            disabled={step === 1}>
                            {"Précédent"}
                        </Button>
                        {
                            step !== steps.length ?
                                <Button
                                    variant="default"
                                    onClick={(e) => { e.preventDefault(); setStep((prev) => prev + 1) }}
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