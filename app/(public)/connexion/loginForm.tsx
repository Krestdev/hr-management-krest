'use client'
import OnViewAnimation from '@/components/onViewAnimation';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import useKizunaStore from '@/context/store';
import UserQuery from '@/queries/users';
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from '@tanstack/react-query';
import { ArrowRight } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import z from "zod";

const formSchema = z.object({
    email:z.email({message: "Ce champ est obligatoire"}),
    password: z.string(),
});

function LoginForm() {
    const { login } = useKizunaStore();
    const userQuery = new UserQuery();
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            password: ""
        }
    });
    const signIn = useMutation({
        mutationFn: (data:{email:string;password:string})=>{
            return userQuery.login(data);
        },
        onSuccess: (data)=>{
            login(data.user, data.token);
            toast.success("Connexion réussie !")
        },
        onError: (error)=>{
            toast.error(error.message)
        }
    })
    function onSubmit(values:z.infer<typeof formSchema>){
        signIn.mutate(values);
    }
  return (
    <Form {...form}>
        <OnViewAnimation animation="slideLeft" duration={0.75} delay={0.3} className="max-w-sm w-full">
            <form onSubmit={form.handleSubmit(onSubmit)} className="w-full flex flex-col gap-4">
                <FormField control={form.control} name="email" render={({field})=>(
                    <FormItem>
                        <FormLabel>{"Adresse mail"}</FormLabel>
                        <FormControl>
                            <Input {...field} placeholder="Ex. johndoe@gmail.com"/>
                        </FormControl>
                        <FormMessage/>
                    </FormItem>
                )} />
                <FormField control={form.control} name="password" render={({field})=>(
                    <FormItem>
                        <FormLabel>{"Mot de passe"}</FormLabel>
                        <FormControl>
                            <Input type="password" {...field} placeholder="*********" />
                        </FormControl>
                        <FormMessage/>
                    </FormItem>
                )} />
                <Button type="submit" variant={"primary"} disabled={signIn.isPending} isLoading={signIn.isPending}>{"Se connecter"}{!signIn.isPending && <ArrowRight/>}</Button>
            </form>
        </OnViewAnimation>
    </Form>
  )
}

export default LoginForm