"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Plus, Pencil, Trash2, Loader2, ArrowLeft } from "lucide-react"
import Link from "next/link"

import Header from "@/components/header"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"

import useKizunaStore from "@/context/store"
import { LeaveType } from "@/types/types"
import { useCreateLeaveTypeMutation, useDeleteLeaveTypeMutation, useLeaveTypesQuery, useUpdateLeaveTypeMutation } from "@/hooks/queries-hooks"

const formSchema = z.object({
  label: z.string().min(2, "Le titre doit faire au moins 2 caractères"),
  daysAllowed: z.number().min(0, "Le nombre de jours doit être positif"),
  isActive: z.boolean(),
})

type FormValues = z.infer<typeof formSchema>

export default function TypeDeCongesPage() {
  const selectedCompanyId = useKizunaStore((state) => state.selectedCompanyId)

  const { data: leaveTypes, isLoading } = useLeaveTypesQuery(selectedCompanyId)
  const createMutation = useCreateLeaveTypeMutation()
  const updateMutation = useUpdateLeaveTypeMutation()
  const deleteMutation = useDeleteLeaveTypeMutation()

  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedType, setSelectedType] = useState<LeaveType | null>(null)

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      label: "",
      daysAllowed: 0,
      isActive: true,
    },
  })

  const handleOpenDialog = (type?: LeaveType) => {
    if (type) {
      setSelectedType(type)
      form.reset({
        label: type.label,
        daysAllowed: type.daysAllowed,
        isActive: type.isActive,
      })
    } else {
      setSelectedType(null)
      form.reset({
        label: "",
        daysAllowed: 0,
        isActive: true,
      })
    }
    setIsDialogOpen(true)
  }

  const handleDeleteClick = (type: LeaveType) => {
    setSelectedType(type)
    setIsDeleteDialogOpen(true)
  }

  const onSubmit = async (values: FormValues) => {
    if (!selectedCompanyId) {
      toast.error("Aucune entreprise sélectionnée")
      return
    }

    try {
      if (selectedType) {
        await updateMutation.mutateAsync({
          uuid: selectedType.uuid,
          data: {
            ...values,
            companyId: selectedCompanyId,
          },
        })
        toast.success("Type de congé mis à jour")
      } else {
        await createMutation.mutateAsync({
          ...values,
          companyId: selectedCompanyId,
        })
        toast.success("Type de congé créé")
      }
      setIsDialogOpen(false)
    } catch (error) {
      toast.error("Une erreur s'est produite")
    }
  }

  const confirmDelete = async () => {
    if (!selectedType) return
    try {
      await deleteMutation.mutateAsync(selectedType.uuid)
      toast.success("Type de congé supprimé")
      setIsDeleteDialogOpen(false)
    } catch (error) {
      toast.error("Erreur lors de la suppression")
    }
  }

  return (
    <div className="flex flex-col gap-6 pb-10">
      <Header title="Types de Congés" />

      <div className="px-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <Link href="/tableau-de-bord/referentiels">
          <Button variant="outline" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Retour aux référentiels
          </Button>
        </Link>
        <Button variant={"primary"} onClick={() => handleOpenDialog()}>
          <Plus className="h-4 w-4" />
          Ajouter un type
        </Button>
      </div>

      <div className="px-6">
        <div className="rounded-md border bg-white shadow-sm">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50 hover:bg-gray-50">
                <TableHead className="font-semibold text-gray-900">Titre</TableHead>
                <TableHead className="font-semibold text-gray-900">Jours autorisés</TableHead>
                <TableHead className="font-semibold text-gray-900">Statut</TableHead>
                <TableHead className="text-right font-semibold text-gray-900">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={4} className="h-24 text-center">
                    <Loader2 className="h-6 w-6 animate-spin mx-auto text-gray-500" />
                  </TableCell>
                </TableRow>
              ) : leaveTypes && leaveTypes.length > 0 ? (
                leaveTypes.map((type) => (
                  <TableRow key={type.uuid}>
                    <TableCell className="font-medium text-gray-900">{type.label}</TableCell>
                    <TableCell>{type.daysAllowed} jours</TableCell>
                    <TableCell>
                      <Badge variant={type.isActive ? "default" : "secondary"} className={type.isActive ? "bg-green-100 text-green-800 hover:bg-green-100 border-green-200" : ""}>
                        {type.isActive ? "Actif" : "Inactif"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleOpenDialog(type)}
                          className="h-8 w-8 text-blue-600 hover:text-blue-800 hover:bg-blue-50"
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteClick(type)}
                          className="h-8 w-8 text-red-600 hover:text-red-800 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="h-24 text-center text-gray-500">
                    Aucun type de congé trouvé.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* CREATE/EDIT DIALOG */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              {selectedType ? "Modifier le type de congé" : "Nouveau type de congé"}
            </DialogTitle>
            <DialogDescription>
              Remplissez les informations ci-dessous pour ce type de congé.
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="label"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Titre</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: Congé Annuel" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="daysAllowed"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Jours autorisés</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Ex: 30"
                        {...field}
                        onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : 0)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="isActive"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 bg-gray-50/50">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Statut Actif</FormLabel>
                      <FormDescription>
                        Désactivez pour masquer ce type de congé aux employés.
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <DialogFooter className="pt-4">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Annuler
                </Button>
                <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending} variant={"primary"}>
                  {(createMutation.isPending || updateMutation.isPending) && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Enregistrer
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* DELETE DIALOG */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Supprimer le type de congé</DialogTitle>
            <DialogDescription>
              Êtes-vous sûr de vouloir supprimer le type de congé <span className="font-semibold text-gray-900">{selectedType?.label}</span> ? Cette action est irréversible.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="pt-4">
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Annuler
            </Button>
            <Button variant="destructive" onClick={confirmDelete} disabled={deleteMutation.isPending}>
              {deleteMutation.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Supprimer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}