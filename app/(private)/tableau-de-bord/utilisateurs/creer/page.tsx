"use client"

import React, { useState } from "react"
import { useRouter } from "next/navigation"
import { useCreateEmployeeMutation } from "@/queries/employee"
import useKizunaStore from "@/context/store"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Eye, EyeOff, Loader2 } from "lucide-react"
import { toast } from "sonner"
import * as z from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

const roleLabels: Record<string, string> = {
    "COMPANY_ADMIN": "Administrateur",
    "ADMIN": "RH",
    "EMPLOYEE": "Employé",
}

const formSchema = z.object({
    email: z.string().email({ message: "Veuillez entrer une adresse mail valide." }),
    lastName: z.string().min(2, { message: "Le nom doit contenir au moins 2 caractères." }),
    password: z.string().min(6, { message: "Le mot de passe doit contenir au moins 6 caractères." }),
    role: z.enum(["COMPANY_ADMIN", "ADMIN", "EMPLOYEE"], {
        message: "Veuillez sélectionner un rôle.",
    }),
})

type FormValues = z.infer<typeof formSchema>

const Page = () => {
    const router = useRouter()
    const { selectedCompanyId } = useKizunaStore()
    const [showPassword, setShowPassword] = useState(false)

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            lastName: "",
            password: "",
            role: "EMPLOYEE",
        },
    })

    const createMutation = useCreateEmployeeMutation()

    const onSubmit = async (values: FormValues) => {
        const formData = new FormData()
        formData.append("email", values.email)
        formData.append("lastName", values.lastName)
        formData.append("firstName", "")
        formData.append("password", values.password)
        formData.append("role", values.role)

        if (selectedCompanyId && selectedCompanyId !== "all") {
            formData.append("companyId", selectedCompanyId)
        }

        createMutation.mutate(formData, {
            onSuccess: () => {
                toast.success("Utilisateur créé avec succès")
                router.push("/tableau-de-bord/utilisateurs")
            },
            onError: (error: any) => {
                toast.error(error.message || "Erreur lors de la création de l'utilisateur")
            }
        })
    }

    return (
        <div className="flex flex-col gap-6">
            <div>
                <h1 className="font-medium mb-1">Créer un utilisateur</h1>
                <p className="text-sm text-gray-500">Complétez le formulaire pour créer un nouvel utilisateur</p>
            </div>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="bg-white p-6 rounded-lg">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        {/* Adresse mail */}
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem className="max-w-[360px] w-full">
                                    <FormLabel>Adresse mail</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="email"
                                            placeholder="ex. omega@yahoo.fr"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Nom */}
                        <FormField
                            control={form.control}
                            name="lastName"
                            render={({ field }) => (
                                <FormItem className="max-w-[360px] w-full">
                                    <FormLabel>Nom</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="text"
                                            placeholder="ex. Omega"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Mot de passe */}
                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem className="max-w-[360px] w-full">
                                    <FormLabel>Mot de passe</FormLabel>
                                    <FormControl>
                                        <div className="relative">
                                            <Input
                                                type={showPassword ? "text" : "password"}
                                                placeholder="************"
                                                className="pr-10"
                                                {...field}
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                            >
                                                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                            </button>
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Rôle */}
                        <FormField
                            control={form.control}
                            name="role"
                            render={({ field }) => (
                                <FormItem className="max-w-[360px] w-full">
                                    <FormLabel>Rôle</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Sélectionnez un rôle" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {Object.entries(roleLabels).map(([key, label]) => (
                                                <SelectItem key={key} value={key}>{label}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <Button
                        type="submit"
                        variant="primary"
                        disabled={createMutation.isPending}
                        className="bg-[#2A2A2A] hover:bg-[#1A1A1A] text-white"
                    >
                        {createMutation.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                        Créer l'utilisateur
                    </Button>
                </form>
            </Form>
        </div>
    )
}

export default Page