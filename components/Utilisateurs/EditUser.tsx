"use client"

import React, { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useEmployeeQuery, useUpdateEmployeeMutation } from "@/queries/employee"
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
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { roleLabels } from "@/types/types"

const formSchema = z.object({
    email: z.string().email({ message: "Veuillez entrer une adresse mail valide." }),
    lastName: z.string().min(2, { message: "Le nom doit contenir au moins 2 caractères." }),
    firstName: z.string().min(2, { message: "Le prénom doit contenir au moins 2 caractères." }),
    role: z.enum(["SUPER_ADMIN", "ADMIN", "COMPANY_ADMIN", "RH", "EMPLOYEE"], {
        message: "Veuillez sélectionner un rôle.",
    }),
})

type FormValues = z.infer<typeof formSchema>

interface EditUserDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    userId: string
}

const EditUserDialog = ({ open, onOpenChange, userId }: EditUserDialogProps) => {
    const router = useRouter()
    const { selectedCompanyId } = useKizunaStore()

    const { data: userData, isLoading: isLoadingUser } = useEmployeeQuery(userId)

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            lastName: "",
            firstName: "",
            role: "EMPLOYEE",
        },
    })

    const updateMutation = useUpdateEmployeeMutation()

    // Remplir le formulaire avec les données de l'utilisateur
    useEffect(() => {
        if (userData) {
            form.reset({
                email: userData.user.email || "",
                lastName: userData.lastName || "",
                firstName: userData.firstName || "",
                role: userData.role || "EMPLOYEE",
            })
        }
    }, [userData, form])

    const onSubmit = async (values: FormValues) => {
        const formData = new FormData()
        formData.append("email", values.email || userData?.user?.email || "")
        formData.append("lastName", values.lastName)
        formData.append("firstName", values.firstName || userData?.firstName || "")
        formData.append("role", values.role)
        formData.append("companyId", selectedCompanyId || userData?.companyId || "")

        updateMutation.mutate(
            { id: userId, data: formData },
            {
                onSuccess: () => {
                    toast.success("Utilisateur modifié avec succès")
                    onOpenChange(false)
                    router.refresh()
                },
                onError: (error: any) => {
                    console.error(error.message);

                    toast.error(error.message || "Erreur lors de la modification de l'utilisateur")
                }
            }
        )
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Modifier l'utilisateur</DialogTitle>
                    <DialogDescription>
                        Modifiez les informations de l'utilisateur
                    </DialogDescription>
                </DialogHeader>

                {isLoadingUser ? (
                    <div className="flex justify-center items-center py-8">
                        <Loader2 className="w-8 h-8 animate-spin text-gray-500" />
                    </div>
                ) : (
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                                                    disabled
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

                                {/* Prénom */}
                                <FormField
                                    control={form.control}
                                    name="firstName"
                                    render={({ field }) => (
                                        <FormItem className="max-w-[360px] w-full">
                                            <FormLabel>Prénom</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="text"
                                                    placeholder="ex. John"
                                                    {...field}
                                                />
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

                            <div className="flex justify-end gap-3 pt-4 border-t">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => onOpenChange(false)}
                                >
                                    Annuler
                                </Button>
                                <Button
                                    type="submit"
                                    variant="primary"
                                    disabled={updateMutation.isPending}
                                    className="bg-[#2A2A2A] hover:bg-[#1A1A1A] text-white"
                                >
                                    {updateMutation.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                                    Enregistrer les modifications
                                </Button>
                            </div>
                        </form>
                    </Form>
                )}
            </DialogContent>
        </Dialog>
    )
}

export default EditUserDialog