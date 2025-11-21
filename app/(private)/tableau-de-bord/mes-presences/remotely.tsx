import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useMutation } from '@tanstack/react-query';
import React from 'react'
import { toast } from 'sonner';

type Props = {
  isOpen: boolean;
  openChange: React.Dispatch<React.SetStateAction<boolean>>;
};

function Remotely({isOpen, openChange}:Props) {
    const { mutate, isPending } = useMutation({
        mutationFn: async() => true,
        onSuccess: ()=>{
            toast.success("Opération réussie !");
            openChange(false);
        },
        onError: (error)=>{
            toast.error(error.message);
        }
    })
  return (
    <Dialog open={isOpen} onOpenChange={openChange}>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>{"Signaler un déplacement"}</DialogTitle>
                <DialogDescription>{"Marquer que je suis en déplacement"}</DialogDescription>
            </DialogHeader>
            <DialogFooter>
                <Button variant={"default"} disabled={isPending} isLoading={isPending} onClick={()=>mutate()}>{"Confirmer"}</Button>
                <Button variant={"outline"} disabled={isPending} onClick={()=>openChange(prev=>!prev)}>{"Annuler"}</Button>
            </DialogFooter>
        </DialogContent>
    </Dialog>
  )
}

export default Remotely