'use client'
import { FileUploader } from '@/components/fileUpload';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { DialogTitle } from '@radix-ui/react-dialog';
import { useMutation } from '@tanstack/react-query';
import React from 'react'
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import z from 'zod';

interface Props {
    open:boolean;
    openChange: React.Dispatch<React.SetStateAction<boolean>>;
    photo?:string;
}

const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

const formSchema = z.object({
    imgUrl: z
    .custom<File>()
    .refine((file) => !file || ACCEPTED_IMAGE_TYPES.includes(file.type), {
      message: "Format accepté: JPG, JPEG, PNG, WEBP uniquement",
    })
});

function UpdatePhoto({open, openChange, photo}:Props) {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
    })
    const {mutate, isPending} = useMutation({
        mutationFn: async(values:z.infer<typeof formSchema>)=>{return true},
        onSuccess: (data)=>{
            toast.success("Votre photo de profil à bien été mise à jour !");
            openChange(false);
        },
        onError: (error)=>{
            toast.error(error.message);
        }
    });

    function onSubmit(values:z.infer<typeof formSchema>){
        mutate(values);
    }
  return (
    <Dialog open={open} onOpenChange={openChange}>
        <DialogContent>
            <DialogHeader className="bg-slate-100">
                <DialogTitle>{"Changer sa photo de profil"}</DialogTitle>
                <DialogDescription>{"Importez une image pour remplacer votre photo de profil"}</DialogDescription>
            </DialogHeader>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-2">
                    <FormField control={form.control} name="imgUrl" render={({field: { onChange, value, ...rest }})=>(
                        <FormItem>
                            <FormLabel>{"Photo"}</FormLabel>
                            <FormControl>
                                <FileUploader value={value} onChange={onChange} {...rest} />
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )} />
                    <Button type="submit">{"Enregistrer"}</Button>
                    <Button variant={"outline"} onClick={(e)=>{e.preventDefault(); form.reset(); openChange(false)}}>{"Annuler"}</Button>
                </form>
            </Form>
        </DialogContent>
    </Dialog>
  )
}

export default UpdatePhoto