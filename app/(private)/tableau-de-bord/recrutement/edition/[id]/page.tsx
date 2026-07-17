"use client";

import { useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { ArrowLeft, Plus, Trash2, Loader2 } from "lucide-react";

import Header from "@/components/header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRecruitmentQuery, useUpdateRecruitmentMutation } from "@/queries/recruitment";
import { useCompaniesQuery } from "@/queries/company";
import { toast } from "sonner";
import LoadingComponent from "@/components/loading-comp";
import ErrorComponent from "@/components/error-comp";

const formSchema = z.object({
  title: z.string().min(2, "Le titre est requis"),
  description: z.string().optional(),
  place: z.string().min(2, "Le lieu est requis"),
  deadline: z.string().min(1, "La date limite est requise"),
  companyId: z.string().min(1, "Veuillez sélectionner une entreprise"),
  criteria: z.array(z.object({ value: z.string().min(1, "Le critère ne peut pas être vide") })),
  tags: z.array(z.object({ value: z.string().min(1, "Le tag ne peut pas être vide") })),
});

type FormValues = z.infer<typeof formSchema>;

export default function EditRecruitmentPage(props: { params: Promise<{ id: string }> }) {
  const params = use(props.params);
  const router = useRouter();
  const recruitmentId = params.id;

  const { data: offer, isLoading: isOfferLoading, isError: isOfferError } = useRecruitmentQuery(recruitmentId);
  const { data: companies } = useCompaniesQuery();
  const { mutate: updateRecruitment, isPending } = useUpdateRecruitmentMutation();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      place: "",
      deadline: "",
      companyId: "",
      criteria: [{ value: "" }],
      tags: [{ value: "" }],
    },
  });

  // Pre-fill form when data arrives
  useEffect(() => {
    if (offer) {
      // Format datetime-local requires YYYY-MM-DDTHH:mm format
      const formattedDeadline = offer.deadline ? new Date(offer.deadline).toISOString().slice(0, 16) : "";
      
      form.reset({
        title: offer.title || "",
        description: offer.description || "",
        place: offer.place || "",
        deadline: formattedDeadline,
        companyId: offer.companyId || offer.company?.uuid || "",
        criteria: offer.criteria?.length ? offer.criteria.map((c: string) => ({ value: c })) : [{ value: "" }],
        tags: offer.tags?.length ? offer.tags.map((t: string) => ({ value: t })) : [{ value: "" }],
      });
    }
  }, [offer, form]);

  const { fields: criteriaFields, append: appendCriteria, remove: removeCriteria } = useFieldArray({
    name: "criteria",
    control: form.control,
  });

  const { fields: tagsFields, append: appendTag, remove: removeTag } = useFieldArray({
    name: "tags",
    control: form.control,
  });

  const onSubmit = (data: FormValues) => {
    const payload = {
      title: data.title,
      description: data.description,
      place: data.place,
      deadline: new Date(data.deadline).toISOString(),
      criteria: data.criteria.map((c) => c.value).filter(Boolean),
      tags: data.tags.map((t) => t.value).filter(Boolean),
      companyId: data.companyId,
    };

    updateRecruitment({ id: recruitmentId, data: payload }, {
      onSuccess: () => {
        toast.success("Offre de recrutement modifiée avec succès");
        router.push("/tableau-de-bord/recrutement");
      },
      onError: (error) => {
        toast.error(error.message || "Erreur lors de la modification de l'offre");
      },
    });
  };

  if (isOfferLoading) return <LoadingComponent />;
  if (isOfferError) return <ErrorComponent description="Erreur lors du chargement de l'offre" />;

  return (
    <div className="flex flex-col gap-6 w-full mx-auto p-6">
      <div className="flex items-center gap-4 shrink-0 mb-4">
        <Header title="Modifier l'offre de recrutement" variant="primary" />
      </div>

      <div className="bg-white max-w-4xl border rounded-xl p-6 shadow-sm">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="companyId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Entreprise *</FormLabel>
                    {companies ? (
                      <Select onValueChange={field.onChange} value={field.value || undefined}>
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Sélectionnez une entreprise" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {companies.map((company: any) => (
                            <SelectItem key={company.uuid} value={company.uuid}>
                              {company.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : (
                      <div className="h-10 w-full bg-gray-100 animate-pulse rounded-md border border-gray-200" />
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Titre du poste *</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: Serveur(se)" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="place"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Lieu *</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: Saga Africa • Douala" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="deadline"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date limite *</FormLabel>
                    <FormControl>
                      <Input type="datetime-local" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Description détaillée du poste..."
                      className="min-h-[120px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4 border-t">
              {/* TAGS */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <FormLabel>Tags (Département, Contrat, etc.)</FormLabel>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="h-8 text-xs"
                    onClick={() => appendTag({ value: "" })}
                  >
                    <Plus className="w-3 h-3 mr-1" /> Ajouter
                  </Button>
                </div>
                <div className="space-y-3">
                  {tagsFields.map((field, index) => (
                    <FormField
                      key={field.id}
                      control={form.control}
                      name={`tags.${index}.value`}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <div className="flex items-center gap-2">
                              <Input placeholder="Ex: CDD, Cuisine..." {...field} />
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="text-red-500 hover:text-red-700 hover:bg-red-50 shrink-0"
                                onClick={() => removeTag(index)}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  ))}
                  {tagsFields.length === 0 && (
                    <p className="text-sm text-gray-500 italic">Aucun tag ajouté.</p>
                  )}
                </div>
              </div>

              {/* CRITERIA */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <FormLabel>Critères / Pré-requis</FormLabel>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="h-8 text-xs"
                    onClick={() => appendCriteria({ value: "" })}
                  >
                    <Plus className="w-3 h-3 mr-1" /> Ajouter
                  </Button>
                </div>
                <div className="space-y-3">
                  {criteriaFields.map((field, index) => (
                    <FormField
                      key={field.id}
                      control={form.control}
                      name={`criteria.${index}.value`}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <div className="flex items-start gap-2">
                              <Textarea
                                placeholder="Ex: 3 ans d'expérience minimum..."
                                className="min-h-[40px] h-10 resize-none"
                                {...field}
                              />
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="text-red-500 hover:text-red-700 hover:bg-red-50 shrink-0"
                                onClick={() => removeCriteria(index)}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  ))}
                  {criteriaFields.length === 0 && (
                    <p className="text-sm text-gray-500 italic">Aucun critère ajouté.</p>
                  )}
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-4 pt-6 border-t">
              <Button type="button" variant="outline" onClick={() => router.back()}>
                Annuler
              </Button>
              <Button type="submit" disabled={isPending} className="bg-primary text-white">
                {isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                Sauvegarder
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
