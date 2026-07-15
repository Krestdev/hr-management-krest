"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useState, useEffect } from "react"
import { useCreateCompanyMutation, useUpdateCompanyMutation } from "@/queries/company"
import { Company } from "@/types/types"
import { Loader2 } from "lucide-react"

interface CompanyDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    company?: Company | null
}

export function CompanyDialog({ open, onOpenChange, company }: CompanyDialogProps) {
    const [name, setName] = useState("")
    const [description, setDescription] = useState("")

    const createMutation = useCreateCompanyMutation()
    const updateMutation = useUpdateCompanyMutation()

    useEffect(() => {
        if (company) {
            setName(company.name || "")
            setDescription(company.description || "")
        } else {
            setName("")
            setDescription("")
        }
    }, [company, open])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            if (company) {
                await updateMutation.mutateAsync({ id: company.uuid, data: { name, description } })
            } else {
                await createMutation.mutateAsync({ name, description })
            }
            onOpenChange(false)
        } catch (error) {
            console.error("Erreur lors de la sauvegarde :", error)
        }
    }

    const isLoading = createMutation.isPending || updateMutation.isPending

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{company ? "Modifier la société" : "Créer une société"}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="flex flex-col gap-4 py-4">
                    <div className="flex flex-col gap-2">
                        <Label htmlFor="name">{"Nom de la société"}</Label>
                        <Input
                            id="name"
                            required
                            value={name}
                            onChange={e => setName(e.target.value)}
                            placeholder="Entrez le nom"
                        />
                    </div>
                    <div className="flex flex-col gap-2">
                        <Label htmlFor="description">{"Description"}</Label>
                        <Textarea
                            id="description"
                            required
                            value={description}
                            onChange={e => setDescription(e.target.value)}
                            placeholder="Entrez une description"
                        />
                    </div>
                    <DialogFooter className="mt-4">
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>
                            {"Annuler"}
                        </Button>
                        <Button type="submit" variant="primary" disabled={isLoading}>
                            {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
                            {company ? "Enregistrer" : "Créer"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
