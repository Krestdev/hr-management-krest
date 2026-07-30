"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import Header from "@/components/header";
import StatisticCard from "@/components/statistic-card";
import { useQueries } from "@tanstack/react-query";
import useKizunaStore from "@/context/store";
import LoadingComponent from "@/components/loading-comp";
import ErrorComponent from "@/components/error-comp";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import {
  BriefcaseBusiness,
  Clock,
  Search,
  PlusCircle,
  Filter,
  Eye
} from "lucide-react";
import { Recruitment, Candidacy } from "@/types/types";
import { useCreateCandidacyMutation, useRecruitmentsQuery } from "@/hooks/queries-hooks";
import { candidaciesQueryOptions } from "@/queries/candidacy";

// Types factices pour les besoins de l'UI (en attendant que l'API renvoie ces champs)
type ExtendedRecruitment = Recruitment & {
  contractType?: string;
  department?: string;
  candidatesCount?: number;
};

export default function RecruitmentPage() {
  const selectedCompanyId = useKizunaStore((state) => state.selectedCompanyId);
  const [activeTab, setActiveTab] = useState<"ACTIVE" | "EXPIRED">("ACTIVE");
  const [search, setSearch] = useState("");
  const [selectedOffer, setSelectedOffer] = useState<ExtendedRecruitment | null>(null);
  const [selectedOfferForCandidacies, setSelectedOfferForCandidacies] = useState<ExtendedRecruitment | null>(null);
  const [isCandidacyDialogOpen, setIsCandidacyDialogOpen] = useState(false);
  const createCandidacyMutation = useCreateCandidacyMutation();

  const handleCreateCandidacy = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedOffer) return;

    const formData = new FormData(e.currentTarget);
    formData.append("recruitmentUuid", selectedOffer.uuid);

    createCandidacyMutation.mutate(formData, {
      onSuccess: () => {
        toast.success("Candidature créée avec succès");
        setIsCandidacyDialogOpen(false);
      },
      onError: (error) => {
        toast.error(error.message || "Erreur lors de la création de la candidature");
      }
    });
  };

  const { data: recruitmentsData, isLoading: isLoadingRecruitments, isError: isErrorRecruitments } = useRecruitmentsQuery(selectedCompanyId);
  const offersList: ExtendedRecruitment[] = Array.isArray(recruitmentsData) ? recruitmentsData : (recruitmentsData?.data || []);

  const candidacyQueries = useQueries({
    queries: offersList.map((offer) => ({
      ...candidaciesQueryOptions(offer.uuid),
      enabled: !!offer.uuid,
    })),
  });

  const candidaciesList = candidacyQueries
    .filter((q) => q.isSuccess && q.data)
    .flatMap((q) => (Array.isArray(q.data) ? q.data : q.data?.data || []));

  const filteredOffers = useMemo(() => {
    return offersList.filter((offer: ExtendedRecruitment) => {
      const matchTab = offer.status === activeTab;
      const matchSearch = offer.title.toLowerCase().includes(search.toLowerCase());
      return matchTab && matchSearch;
    });
  }, [offersList, activeTab, search]);

  const getOfferCandidaciesCount = (offerId: string) => {
    const offerIndex = offersList.findIndex((o) => o.uuid === offerId);
    if (offerIndex === -1) return 0;
    const q = candidacyQueries[offerIndex];
    if (!q || !q.isSuccess || !q.data) return 0;
    const data = Array.isArray(q.data) ? q.data : q.data?.data || [];
    return data.length;
  };

  const getOfferCandidacies = (offerId: string): Candidacy[] => {
    const offerIndex = offersList.findIndex((o) => o.uuid === offerId);
    if (offerIndex === -1) return [];
    const q = candidacyQueries[offerIndex];
    if (!q || !q.isSuccess || !q.data) return [];
    return Array.isArray(q.data) ? q.data : q.data?.data || [];
  };

  const activeOffersCount = offersList.filter(offer => offer.status === "ACTIVE").length;
  const totalOffersCount = offersList.length;

  // En attente vs Total
  const pendingCandidaturesCount = candidaciesList.filter((c: any) => c.status === "PENDING" || c.status === "UNDER_REVIEW" || !c.status).length;
  const totalCandidaturesCount = candidaciesList.length;

  const isLoading = isLoadingRecruitments; //|| isLoadingCandidacies;
  const isError = isErrorRecruitments; // || isErrorCandidacies;

  if (isLoading) return <LoadingComponent />;
  if (isError) return <ErrorComponent description="Erreur lors du chargement des données." />;

  return (
    <div className="flex flex-col gap-6 w-full max-w-full p-6">
      <div className="flex items-center justify-between shrink-0">
        <Header title="Recrutement" variant="primary" />
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 shrink-0">
        <StatisticCard
          title="Offres actives"
          value={activeOffersCount < 10 ? `0${activeOffersCount}` : activeOffersCount}
          advanced={{ title: "Offres", value: totalOffersCount }}
          isIcon={false}
          iconBg="bg-primary text-white"
        >
          <BriefcaseBusiness className="w-4 h-4" />
        </StatisticCard>

        <StatisticCard
          title="Candidatures en attente"
          value={pendingCandidaturesCount < 10 ? `0${pendingCandidaturesCount}` : pendingCandidaturesCount}
          advanced={{ title: "Total", value: totalCandidaturesCount }}
          isIcon={false}
          iconBg="bg-orange-100 text-secondary"
        >
          <Clock className="w-4 h-4" />
        </StatisticCard>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-2 shrink-0">
        <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-lg">
          <button
            onClick={() => { setActiveTab("ACTIVE"); setSelectedOffer(null); }}
            className={cn(
              "px-4 py-1.5 text-sm font-medium rounded-md transition-colors",
              activeTab === "ACTIVE" ? "bg-secondary shadow-sm" : "text-gray-600 hover:text-gray-900"
            )}
          >
            Actives
          </button>
          <button
            onClick={() => { setActiveTab("EXPIRED"); setSelectedOffer(null); }}
            className={cn(
              "px-4 py-1.5 text-sm font-medium rounded-md transition-colors",
              activeTab === "EXPIRED" ? "bg-secondary shadow-sm" : "text-gray-600 hover:text-gray-900"
            )}
          >
            Expirées
          </button>
        </div>

        <Link href="/tableau-de-bord/recrutement/creation">
          <Button className="bg-[#1289A7] hover:bg-[#0E6C84] text-white">
            Créer une offre <PlusCircle className="ml-2 w-4 h-4" />
          </Button>
        </Link>
      </div>

      <div className="flex items-center justify-between gap-4 shrink-0">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Rechercher"
            className="pl-9 bg-white border-gray-200"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Button variant="outline" className="bg-white border-gray-200">
          Filtres (0) <Filter className="ml-2 w-4 h-4" />
        </Button>
      </div>

      {/* Main Content Area */}
      <div className={cn("grid h-full gap-6", selectedOffer ? "grid-cols-3" : "grid-cols-1")}>

        {/* Left Side: Offers List */}
        <div className={cn(
          "overflow-y-auto custom-scrollbar transition-all duration-300",
        )}>
          <div className={cn(
            "grid gap-4",
            selectedOffer ? "grid-cols-1" : "grid-cols-1 md:grid-cols-2 lg:grid-cols-4"
          )}>
            {filteredOffers.map((offer: ExtendedRecruitment) => (
              <div
                key={offer.uuid}
                onClick={() => setSelectedOffer(selectedOffer?.uuid === offer.uuid ? null : offer)}
                className={cn(
                  "flex flex-col gap-6 bg-white border rounded-xl p-5 cursor-pointer transition-all hover:shadow-md hover:border-primary",
                  selectedOffer?.uuid === offer.uuid ? "border-primary shadow-sm ring-1 ring-primary" : "border-gray-200"
                )}
              >
                <div className="flex items-center gap-3">
                  <div className="flex flex-col gap-2">
                    <div className="flex flex-row gap-3">
                      <Avatar className="h-12 w-12 border bg-gray-900 text-white">
                        <AvatarImage src={offer.imageUrl} />
                        <AvatarFallback className="bg-gray-900 text-yellow-500 text-xs text-center leading-tight p-1">
                          {offer.place?.split(" ")[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col gap-1">
                        <h3 className="font-semibold text-gray-900 text-base">{offer.title}</h3>
                        <p className="text-sm text-gray-500">{offer.place}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5">
                      {
                        offer.tags.map((tag) => (
                          <Badge key={tag} variant="secondary" className="bg-gray-100 text-gray-700 font-normal">
                            {tag}
                          </Badge>
                        ))
                      }
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between text-xs text-gray-500 mt-auto">
                  <span className="first-letter:uppercase">{formatDistanceToNow(new Date(offer.createdAt), { addSuffix: true, locale: fr })}</span>
                  <span className="font-semibold text-gray-900">{getOfferCandidaciesCount(offer.uuid)} Candidatures</span>
                </div>
              </div>
            ))}

            {filteredOffers.length === 0 && (
              <div className="col-span-full py-10 text-center text-gray-500">
                Aucune offre trouvée.
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Offer Details */}
        {selectedOffer && (
          <div className="col-span-2 h-fit bg-white border border-gray-200 rounded-xl p-6 custom-scrollbar flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-4">
                <Avatar className="h-14 w-14 border bg-gray-900 text-white">
                  <AvatarImage src={selectedOffer.imageUrl} />
                  <AvatarFallback className="bg-gray-900 text-yellow-500 text-xs text-center leading-tight p-1">
                    {selectedOffer.place?.split(" ")[0]}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <h2 className="font-bold text-gray-900 text-xl">{selectedOffer.title}</h2>
                  <p className="text-sm text-gray-500">{selectedOffer.place}</p>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                {
                  selectedOffer.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="bg-gray-100 text-gray-700 font-normal">
                      {tag}
                    </Badge>
                  ))
                }
              </div>
            </div>

            <div className="flex items-center justify-between text-sm text-gray-500">
              <span className="first-letter:uppercase">{formatDistanceToNow(new Date(selectedOffer.createdAt), { addSuffix: true, locale: fr })}</span>
              <span className="font-semibold text-gray-900">{getOfferCandidaciesCount(selectedOffer.uuid)} Candidatures</span>
            </div>

            <div className="h-px w-full bg-[#E2E2E2]" />

            <div className="mb-6">
              <h3 className="font-semibold text-gray-900 text-lg mb-3">Description</h3>
              <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-wrap">
                {selectedOffer.description || "Aucune description fournie pour cette offre."}
              </p>
            </div>

            {selectedOffer.criteria && selectedOffer.criteria.length > 0 && (
              <div className="mb-8">
                <h3 className="font-semibold text-gray-900 text-lg mb-3">Critères</h3>
                <ul className="text-gray-600 text-sm space-y-2">
                  {selectedOffer.criteria.map((crit, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-gray-400 mt-0.5">-</span>
                      <span>{crit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="mt-auto flex gap-3">
              <Link href={`/tableau-de-bord/recrutement/edition/${selectedOffer.uuid}`}>
                <Button className="bg-[#1289A7] hover:bg-[#0E6C84] text-white px-6">
                  Modifier l'offre
                </Button>
              </Link>
              <Button
                variant="secondary"
                className="bg-gray-800 text-white hover:bg-gray-700 px-6"
                onClick={() => setSelectedOfferForCandidacies(selectedOffer)}
              >
                Voir les candidatures
              </Button>
              <Dialog open={isCandidacyDialogOpen} onOpenChange={setIsCandidacyDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="border-[#1289A7] text-[#1289A7] hover:bg-[#1289A7]/10 px-6">
                    Créer une candidature
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[500px] overflow-y-auto max-h-[90vh]">
                  <DialogHeader>
                    <DialogTitle>Nouvelle candidature - {selectedOffer.title}</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleCreateCandidacy} className="flex flex-col gap-4 mt-4">
                    <div className="grid gap-2">
                      <Label htmlFor="fullName">Nom complet *</Label>
                      <Input id="fullName" name="fullName" required />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="phone">Téléphone *</Label>
                      <Input id="phone" name="phone" required />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="email">Email *</Label>
                      <Input id="email" name="email" type="email" required />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="address">Adresse *</Label>
                      <Input id="address" name="address" required />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="identityCard">Carte d'identité *</Label>
                      <Input id="identityCard" name="identityCard" type="file" required />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="cv">CV *</Label>
                      <Input id="cv" name="cv" type="file" required />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="degree">Diplôme</Label>
                      <Input id="degree" name="degree" type="file" />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="coverLetter">Lettre de motivation</Label>
                      <Input id="coverLetter" name="coverLetter" type="file" />
                    </div>
                    <DialogFooter className="mt-4">
                      <Button type="button" variant="outline" onClick={() => setIsCandidacyDialogOpen(false)}>
                        Annuler
                      </Button>
                      <Button type="submit" disabled={createCandidacyMutation.isPending} className="bg-[#1289A7] hover:bg-[#0E6C84] text-white">
                        {createCandidacyMutation.isPending ? "Création..." : "Créer"}
                      </Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        )}

      </div>

      {/* Candidacies Sheet Overlay */}
      <Sheet open={!!selectedOfferForCandidacies} onOpenChange={(open) => !open && setSelectedOfferForCandidacies(null)}>
        <SheetContent className="w-full sm:max-w-xl overflow-y-auto custom-scrollbar flex flex-col p-4">
          <SheetHeader>
            <SheetTitle>Candidatures pour "{selectedOfferForCandidacies?.title}"</SheetTitle>
            <SheetDescription>
              Retrouvez ici la liste des candidats ayant postulé à cette offre.
            </SheetDescription>
          </SheetHeader>
          <div className="flex flex-col gap-4">
            {selectedOfferForCandidacies && getOfferCandidacies(selectedOfferForCandidacies.uuid).length === 0 ? (
              <div className="text-center text-gray-500 py-10">
                Aucune candidature pour cette offre.
              </div>
            ) : (
              selectedOfferForCandidacies && getOfferCandidacies(selectedOfferForCandidacies.uuid).map((candidacy: Candidacy) => (
                <div key={candidacy.uuid} className="flex flex-col border border-gray-200 rounded-xl p-4 gap-3 bg-white hover:border-gray-300 transition-all">
                  <div className="flex items-center justify-between">
                    <div className="flex flex-col">
                      <span className="font-semibold text-gray-900">{candidacy.fullName}</span>
                      <span className="text-sm text-gray-500">{candidacy.email} • {candidacy.phone}</span>
                    </div>
                    <Badge variant="outline" className={cn(
                      candidacy.status === "PENDING" ? "bg-gray-100 text-gray-700" :
                        candidacy.status === "UNDER_REVIEW" ? "bg-blue-50 text-blue-700 border-blue-200" :
                          candidacy.status === "ACCEPTED" ? "bg-green-50 text-green-700 border-green-200" :
                            "bg-red-50 text-red-700 border-red-200"
                    )}>
                      {candidacy.status === "PENDING" ? "En attente" :
                        candidacy.status === "UNDER_REVIEW" ? "En cours d'examen" :
                          candidacy.status === "ACCEPTED" ? "Accepté" : "Refusé"}
                    </Badge>
                  </div>
                  {candidacy.address && (
                    <div className="text-sm text-gray-600">
                      📍 {candidacy.address}
                    </div>
                  )}
                  <div className="h-px bg-gray-100 my-1 w-full" />
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    {/* CV */}
                    {candidacy.cv ? (
                      <Link href={candidacy.cv} target="_blank">
                        <Button variant="outline" size="sm" className="w-full justify-start h-8 text-xs font-medium bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100 hover:text-blue-800">
                          <Eye className="w-3 h-3 mr-1.5" /> CV
                        </Button>
                      </Link>
                    ) : (
                      <Button variant="outline" size="sm" disabled className="w-full justify-start h-8 text-xs font-medium text-gray-400 bg-gray-50 border-gray-100">
                        CV absent
                      </Button>
                    )}

                    {/* Lettre de motivation */}
                    {candidacy.coverLetter ? (
                      <Link href={candidacy.coverLetter} target="_blank">
                        <Button variant="outline" size="sm" className="w-full justify-start h-8 text-xs font-medium text-gray-700 hover:bg-gray-100">
                          <Eye className="w-3 h-3 mr-1.5" /> Motivation
                        </Button>
                      </Link>
                    ) : (
                      <Button variant="outline" size="sm" disabled className="w-full justify-start h-8 text-xs font-medium text-gray-400 bg-gray-50 border-gray-100">
                        Lettre absente
                      </Button>
                    )}

                    {/* Pièce d'identité */}
                    {candidacy.identityCard ? (
                      <Link href={candidacy.identityCard} target="_blank">
                        <Button variant="outline" size="sm" className="w-full justify-start h-8 text-xs font-medium text-gray-700 hover:bg-gray-100">
                          <Eye className="w-3 h-3 mr-1.5" /> Pièce d'identité
                        </Button>
                      </Link>
                    ) : (
                      <Button variant="outline" size="sm" disabled className="w-full justify-start h-8 text-xs font-medium text-gray-400 bg-gray-50 border-gray-100">
                        CNI absente
                      </Button>
                    )}

                    {/* Diplôme */}
                    {candidacy.degree ? (
                      <Link href={candidacy.degree} target="_blank">
                        <Button variant="outline" size="sm" className="w-full justify-start h-8 text-xs font-medium text-gray-700 hover:bg-gray-100">
                          <Eye className="w-3 h-3 mr-1.5" /> Diplôme
                        </Button>
                      </Link>
                    ) : (
                      <Button variant="outline" size="sm" disabled className="w-full justify-start h-8 text-xs font-medium text-gray-400 bg-gray-50 border-gray-100">
                        Diplôme absent
                      </Button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}