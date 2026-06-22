'use client'
import OnViewAnimation from '@/components/onViewAnimation';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import useKizunaStore from '@/context/store';
import { useLoginMutation } from '@/queries/auth';
import UserQuery from '@/queries/employee';
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import z from "zod";

const formSchema = z.object({
    email: z.string().email({ message: "Veuillez entrer une adresse email valide" }),
    password: z.string().min(1, { message: "Ce champ est obligatoire" }),
});

function LoginForm() {
    const { setToken, setUser } = useKizunaStore(); // On utilise les fonctions séparées

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            password: ""
        }
    });

    const signIn = useLoginMutation({
        onSuccess: async (data) => {
            try {
                // ÉTAPE 1: Stocker le token immédiatement
                setToken(data.access_token);

                // ÉTAPE 2: Récupérer les données complètes de l'utilisateur
                let userToStore = data.user; // Données de base par défaut

                if (data.user.employeeId && data.user.role !== "SUPER_ADMIN") {
                    try {
                        const userQuery = new UserQuery();
                        const userDetails = await userQuery.getById(data.user.employeeId);
                        userToStore = userDetails;
                    } catch (fetchError) {
                        console.warn("Impossible de récupérer les détails complets, utilisation des données partielles");
                        // On garde les données de base
                    }
                }

                // ÉTAPE 3: Stocker l'utilisateur complet
                setUser(userToStore);

                console.log(userToStore);


                toast.success("Connexion réussie !");

            } catch (error) {
                // En cas d'erreur, on tente quand même de stocker le token et les données de base
                setToken(data.access_token);
                setUser(data.user);
                toast.success("Connexion réussie avec données basiques");
                console.error("Login error:", error);
            }
        },
        onError: (error: Error) => {
            toast.error(error.message || "Erreur lors de la connexion");
        }
    });

    function onSubmit(values: z.infer<typeof formSchema>) {
        signIn.mutate(values);
    }

    return (
        <Form {...form}>
            <OnViewAnimation animation="slideLeft" duration={0.75} delay={0.3} className="max-w-sm w-full">
                <form onSubmit={form.handleSubmit(onSubmit)} className="w-full flex flex-col gap-4">
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>{"Adresse mail"}</FormLabel>
                                <FormControl>
                                    <Input {...field} placeholder="Ex. johndoe@gmail.com" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>{"Mot de passe"}</FormLabel>
                                <FormControl>
                                    <Input type="password" {...field} placeholder="*********" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Button
                        type="submit"
                        variant={"primary"}
                        disabled={signIn.isPending}
                        isLoading={signIn.isPending}
                    >
                        {"Se connecter"}
                        {!signIn.isPending && <ArrowRight />}
                    </Button>
                </form>
            </OnViewAnimation>
        </Form>
    );
}

export default LoginForm;