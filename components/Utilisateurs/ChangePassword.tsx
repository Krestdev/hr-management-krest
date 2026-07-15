"use client"

import z from "zod";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useUpdateEmployeePasswordMutation } from "@/queries/employee";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Input } from "../ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Button } from "../ui/button";

interface Props {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    userId: string;
}

const formSchema = z.object({
    password: z.string().min(6, { message: "Le mot de passe doit contenir au moins 6 caractères." }),
    cfPassword: z.string().min(6, { message: "Le mot de passe doit contenir au moins 6 caractères." }),
}).refine((data) => data.password === data.cfPassword, {
    message: "Les mots de passe ne correspondent pas.",
    path: ["cfPassword"],
});

type FormSchema = z.infer<typeof formSchema>;


const ChangePassword = ({ open, onOpenChange, userId }: Props) => {

    const updateMutation = useUpdateEmployeePasswordMutation()
    const router = useRouter()

    const form = useForm<FormSchema>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            password: "",
            cfPassword: "",
        },
    });

    const onSubmit = async (values: FormSchema) => {
        updateMutation.mutate(
            { id: userId, data: { newPassword: values.password } },
            {
                onSuccess: () => {
                    toast.success("Utilisateur modifié avec succès")
                    onOpenChange(false)
                    router.refresh()
                },
                onError: (error: any) => {
                    toast.error(error.message || "Erreur lors de la modification de l'utilisateur")
                }
            }
        )
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Changer le mot de passe</DialogTitle>
                    <DialogDescription>Soyez prudent en choisissant votre nouveau mot de passe</DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <div className="grid grid-cols-1 gap-6">
                            <FormField
                                control={form.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem className="max-w-[360px] w-full">
                                        <FormLabel>Mot de passe</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="password"
                                                placeholder="********"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="cfPassword"
                                render={({ field }) => (
                                    <FormItem className="max-w-[360px] w-full">
                                        <FormLabel>Confirmer le mot de passe</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="password"
                                                placeholder="********"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <div className="flex justify-end gap-4">
                            <Button type="button" onClick={() => onOpenChange(false)} variant="outline">Annuler</Button>
                            <Button type="submit">
                                {updateMutation.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Modifier"}
                            </Button>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog >
    )
}

export default ChangePassword