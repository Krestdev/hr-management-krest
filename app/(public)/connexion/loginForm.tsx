'use client'
import React from 'react'
import { useForm } from 'react-hook-form';
import { zodResolver } from "@hookform/resolvers/zod"
import z from "zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import OnViewAnimation from '@/components/onViewAnimation';
import useKizunaStore from '@/context/store';
import { useRouter } from 'next/navigation';

const formSchema = z.object({
    email:z.email({message: "Ce champ est obligatoire"}),
    password: z.string(),
});

function LoginForm() {
    const { login } = useKizunaStore();
    const router = useRouter();
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            password: ""
        }
    });
    function onSubmit(values:z.infer<typeof formSchema>){
        console.log(values);
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
                <Button type="submit" variant={"primary"}>{"Se connecter"}<ArrowRight/></Button>
            </form>
        </OnViewAnimation>
    </Form>
  )
}

export default LoginForm