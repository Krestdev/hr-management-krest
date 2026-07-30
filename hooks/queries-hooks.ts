
import useKizunaStore from "@/context/store";
import AuthQuery from "@/queries/auth";
import CandidacyQuery, { candidaciesQueryOptions } from "@/queries/candidacy";
import CompanyQuery from "@/queries/company";
import DepartmentQuery from "@/queries/department";
import DocumentQuery from "@/queries/documents";
import UserQuery from "@/queries/employee";
import LeavesQuery from "@/queries/leaves";
import { NotificationQuery } from "@/queries/notifications";
import PayslipQuery from "@/queries/payslips";
import PositionQuery from "@/queries/positions";
import PresenceQuery from "@/queries/presences";
import { queryKeys } from "@/queries/queryKeys";
import RecruitmentQuery from "@/queries/recruitment";
import SalarialQuery from "@/queries/salarials";
import { Company, Department, Employee, LeavesType, LeaveType, Position, Presence } from "@/types/types";
import { useMutation, UseMutationOptions, useQuery, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "sonner";

// ============================================================
// 📄 Hooks pour l'authentification
// ============================================================

// Hook de connection
export function useLoginMutation(options?: UseMutationOptions<{ user: Employee; access_token: string }, Error, { email: string; password: string }>) {
    const authQuery = new AuthQuery();
    return useMutation({
        mutationFn: authQuery.login,
        ...options,
    });
}

// ============================================================
// 📄 Hooks pour les candidatures
// ============================================================

// Hook pour récupérer toutes les candidatures (avec filtre optionnel sur le recrutement)
export function useCandidaciesQuery(recruitmentUuid?: string) {
    return useQuery(candidaciesQueryOptions(recruitmentUuid));
}

// Hook pour récupérer une candidature par son id
export function useCandidacyQuery(id: string, enabled: boolean = true) {
    const candidacyQuery = new CandidacyQuery();
    return useQuery({
        queryKey: queryKeys.candidacies.detail(id),
        queryFn: () => candidacyQuery.getById(id),
        enabled: enabled && !!id,
    });
}

// Hook pour créer une candidature
export function useCreateCandidacyMutation() {
    const candidacyQuery = new CandidacyQuery();
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: candidacyQuery.create,
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: queryKeys.candidacies.all() });

            const recruitmentUuid = variables.get('recruitmentUuid') as string;

            if (recruitmentUuid) {
                queryClient.invalidateQueries({ queryKey: queryKeys.candidacies.all(recruitmentUuid) });
            }
        },
    });
}

// Hook pour mettre à jour le statut d'une candidature
export function useUpdateCandidacyStatusMutation() {
    const candidacyQuery = new CandidacyQuery();
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: candidacyQuery.updateStatus,
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries({ queryKey: queryKeys.candidacies.all() });
            queryClient.invalidateQueries({ queryKey: queryKeys.candidacies.detail(variables.id) });
        },
    });
}

// Hook pour supprimer une candidature
export function useDeleteCandidacyMutation() {
    const candidacyQuery = new CandidacyQuery();
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: candidacyQuery.delete,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.candidacies.all() });
        },
    });
}

// ============================================================
// 📄 Hooks pour les sociétés
// ============================================================

// Hooks pour récuperer toutes les societes
export function useCompaniesQuery(enabled: boolean = true) {
    const companyQuery = new CompanyQuery();
    return useQuery({
        queryKey: queryKeys.companies.all(),
        queryFn: () => companyQuery.getAll(),
        enabled,
    });
}

// Hook pour récupérer une societe par son id
export function useCompanyQuery(id: string, enabled: boolean = true) {
    const companyQuery = new CompanyQuery();
    return useQuery({
        queryKey: queryKeys.companies.detail(id),
        queryFn: () => companyQuery.getById(id),
        enabled: enabled && !!id,
    });
}

// Hook pour créer une societe
export function useCreateCompanyMutation() {
    const companyQuery = new CompanyQuery();
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: companyQuery.create,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.companies.all() });
            toast.success("Société créée avec succès")
        },
        onError: (error: AxiosError) => {
            const message =
                error.message ??
                "Une erreur s'est produite";
            toast.error(message);
        }
    });
}

// Hook pour mettre à jour une societe
export function useUpdateCompanyMutation() {
    const companyQuery = new CompanyQuery();
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: Partial<Omit<Company, "uuid" | "createdAt" | "updatedAt">> }) =>
            companyQuery.update(id, data),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: queryKeys.companies.all() });
            queryClient.invalidateQueries({ queryKey: queryKeys.companies.detail(data.uuid) });
            toast.success("Société mise à jour avec succès")
        },
        onError: (error: AxiosError) => {
            const message =
                error.message ??
                "Une erreur s'est produite";
            toast.error(message);
        }
    });
}

// Hook pour supprimer une societe
export function useDeleteCompanyMutation() {
    const companyQuery = new CompanyQuery();
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: companyQuery.delete,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.companies.all() });
            toast.success("Société supprimée avec succès")
        },
        onError: (error: AxiosError) => {
            const message =
                error.message ??
                "Une erreur s'est produite";
            toast.error(message);
        }
    });
}

// ============================================================
// 📄 Hooks pour les départements
// ============================================================

// Hook pour récupérer tous les départements
export function useDepartmentsQuery(companyId?: string, enabled: boolean = true) {
    const storeCompanyId = useKizunaStore((state) => state.selectedCompanyId);
    const activeCompanyId = storeCompanyId === "all" ? companyId : storeCompanyId;

    const departmentQuery = new DepartmentQuery();
    return useQuery({
        queryKey: queryKeys.departments.all(activeCompanyId),
        queryFn: () => departmentQuery.getAll(activeCompanyId === "all" ? undefined : activeCompanyId),
        enabled: enabled,
    });
}

// Hook pour récupérer un département par son id
export function useDepartmentQuery(id: string, companyId?: string, enabled: boolean = true) {
    const departmentQuery = new DepartmentQuery();
    return useQuery({
        queryKey: queryKeys.departments.detail(id, companyId),
        queryFn: () => departmentQuery.getById(id, companyId),
        enabled: enabled && !!id && companyId !== undefined,
    });
}

// Hook pour créer un département
export function useCreateDepartmentMutation() {
    const departmentQuery = new DepartmentQuery();
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: departmentQuery.create,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.departments.all() });
        },
    });
}

// Hook pour mettre à jour un département
export function useUpdateDepartmentMutation() {
    const departmentQuery = new DepartmentQuery();
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: Partial<Omit<Department, "uuid" | "createdAt" | "updatedAt">> }) =>
            departmentQuery.update(id, data),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: queryKeys.departments.all() });
            queryClient.invalidateQueries({ queryKey: queryKeys.departments.detail(data.uuid) });
        },
    });
}

// Hook pour supprimer un département
export function useDeleteDepartmentMutation() {
    const departmentQuery = new DepartmentQuery();
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: departmentQuery.delete,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.departments.all() });
        },
    });
}

// Hook pour assigner un manager à un département
export function useAssignDepartmentManagerMutation() {
    const departmentQuery = new DepartmentQuery();
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ departmentId, managerId }: { departmentId: string; managerId: string }) =>
            departmentQuery.assignManager(departmentId, managerId),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: queryKeys.departments.all() });
            queryClient.invalidateQueries({ queryKey: queryKeys.departments.detail(data.uuid) });
        },
    });
}

// ============================================================
// 📄 Hooks pour les documents
// ============================================================

// Hook pour récupérer tous les documents
export function useDocumentsQuery(companyId?: string, enabled: boolean = true) {
    const documentQuery = new DocumentQuery();
    return useQuery({
        queryKey: queryKeys.documents.all(companyId),
        queryFn: () => documentQuery.getAll(companyId),
        enabled: enabled && companyId !== undefined,
    });
}

// Hook pour récupérer les documents d'un utilisateur
export function useMyDocumentsQuery(userId: string, companyId?: string, enabled: boolean = true) {
    const documentQuery = new DocumentQuery();
    return useQuery({
        queryKey: queryKeys.documents.mine(userId, companyId),
        queryFn: () => documentQuery.getMine(userId, companyId),
        enabled: enabled && !!userId && companyId !== undefined,
    });
}

// Hook pour récupérer un document par son id
export function useDocumentByIdQuery(id: number, companyId?: string, enabled: boolean = true) {
    const documentQuery = new DocumentQuery();
    return useQuery({
        queryKey: queryKeys.documents.detail(id, companyId),
        queryFn: () => documentQuery.getById(id, companyId),
        enabled: enabled && !!id && companyId !== undefined,
    });
}

// ============================================================
// 📄 Hooks pour les employés
// ============================================================

// Hook pour récupérer tous les employés
export function useEmployeesQuery(
    page: number,
    limit: number,
    companyId: string,
    departmentId?: string,
    positionUuid?: string,
    status: string = "ACTIVE",
    search?: string,
    includeInactive?: boolean,
    includeSensitive: boolean = false,
    enabled: boolean = true
) {
    const storeCompanyId = useKizunaStore((state) => state.selectedCompanyId);
    const activeCompanyId = storeCompanyId === "all" ? companyId : storeCompanyId;

    const userQuery = new UserQuery();
    return useQuery({
        queryKey: queryKeys.employees.all({
            page,
            limit,
            companyId: activeCompanyId,
            departmentId,
            positionUuid,
            status,
            search,
            includeInactive,
            includeSensitive,
        }),
        queryFn: () =>
            userQuery.getAll(
                page,
                limit,
                activeCompanyId === "all" ? "" : activeCompanyId,
                departmentId,
                positionUuid,
                status,
                search,
                includeInactive,
                includeSensitive
            ),
        enabled: enabled && activeCompanyId !== undefined,
    });
}

// Hook pour récupérer un employé par son id
export function useEmployeeQuery(id: string, enabled: boolean = true) {
    const userQuery = new UserQuery();
    return useQuery({
        queryKey: queryKeys.employees.detail(id),
        queryFn: () => userQuery.getById(id),
        enabled: enabled && !!id,
    });
}

// Hook pour créer un employé
export function useCreateEmployeeMutation() {
    const userQuery = new UserQuery();
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: userQuery.create,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["employees"] });
        },
    });
}

// Hook pour mettre à jour un employé
export function useUpdateEmployeeMutation() {
    const userQuery = new UserQuery();
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: FormData }) =>
            userQuery.update(id, data),
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries({ queryKey: ["employees"] });
            const uuid = data?.data?.uuid || (data as any)?.uuid || variables.id;
            if (uuid) {
                queryClient.invalidateQueries({ queryKey: queryKeys.employees.detail(uuid) });
            }
        },
    });
}

// Hook pour mettre à jour le mot de passe d'un employé
export function useUpdateEmployeePasswordMutation() {
    const userQuery = new UserQuery();
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: { newPassword: string } }) =>
            userQuery.updatePassword(id, data),
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries({ queryKey: ["employees"] });
            const uuid = data?.data?.uuid || (data as any)?.uuid || variables.id;
            if (uuid) {
                queryClient.invalidateQueries({ queryKey: queryKeys.employees.detail(uuid) });
            }
        },
    });
}

// Hook pour récupérer les informations personnelles d'un employé
export function useEmployeePersonalInfoQuery(id: string, enabled: boolean = true) {
    const userQuery = new UserQuery();
    return useQuery({
        queryKey: queryKeys.employees.personal(id),
        queryFn: () => userQuery.getPersonnalInformation(id),
        enabled: enabled && !!id,
    });
}

// Hook pour supprimer un employé
export function useDeleteEmployeeMutation() {
    const userQuery = new UserQuery();
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => userQuery.delete(id),
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries({ queryKey: ["employees"] });
            const uuid = data?.data?.uuid || (data as any)?.uuid || variables;
            if (uuid) {
                queryClient.invalidateQueries({ queryKey: queryKeys.employees.detail(uuid) });
            }
        },
    });
}

// Hook pour réactiver un employé
export function useReactivateEmployeeMutation() {
    const userQuery = new UserQuery();
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => userQuery.reactivate(id),
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries({ queryKey: ["employees"] });
            const uuid = data?.data?.uuid || (data as any)?.uuid || variables;
            if (uuid) {
                queryClient.invalidateQueries({ queryKey: queryKeys.employees.detail(uuid) });
            }
        },
    });
}

// Hook pour récupérer les demandes de congés d'un employé
export function useEmployeeLeaveRequestsQuery(id: string, enabled: boolean = true) {
    const userQuery = new UserQuery();
    return useQuery({
        queryKey: queryKeys.employees.leaves(id),
        queryFn: () => userQuery.getLeaveRequests(id),
        enabled: enabled && !!id,
    });
}

// Hook pour récupérer le solde de congés d'un employé
export function useEmployeeLeaveBalanceQuery(id: string, enabled: boolean = true) {
    const userQuery = new UserQuery();
    return useQuery({
        queryKey: queryKeys.employees.leaveBalance(id),
        queryFn: () => userQuery.getLeaveBalance(id),
        enabled: enabled && !!id,
    });
}

// Hook pour mettre à jour le solde de congés d'un employé
export function useUpdateEmployeeLeaveQuotaMutation() {
    const userQuery = new UserQuery();
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, date }: { id: string; date: string }) =>
            userQuery.updateLeaveBalanceQuota(id, date),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: queryKeys.employees.leaveBalance(variables.id) });
        },
    });
}

// ============================================================
// 📄 Hooks pour les demandes d'absence
// ============================================================

// Hook pour récupérer toutes les demandes de congés
export function useLeavesQuery() {
    const leavesQuery = new LeavesQuery();
    return useQuery({
        queryKey: queryKeys.leaves.all(),
        queryFn: leavesQuery.getAll,
    });
}

// Hook pour récupérer toutes les demandes de congés d'un utilisateur
export function useMyLeavesQuery(userId: number, enabled: boolean = true) {
    const leavesQuery = new LeavesQuery();
    return useQuery({
        queryKey: queryKeys.leaves.mine(userId),
        queryFn: () => leavesQuery.getMine(userId),
        enabled: enabled && !!userId,
    });
}

// Hook pour récupérer toutes les demandes de congés d'un utilisateur par son id
export function useLeavesByUserIdQuery(userId: string, enabled: boolean = true) {
    const leavesQuery = new LeavesQuery();
    return useQuery({
        queryKey: queryKeys.leaves.byUserId(userId),
        queryFn: () => leavesQuery.getByUserId(userId),
        enabled: enabled && !!userId,
    });
}

// Hook pour récupérer une demande de congé par son id
export function useLeaveByIdQuery(id: number, enabled: boolean = true) {
    const leavesQuery = new LeavesQuery();
    return useQuery({
        queryKey: queryKeys.leaves.detail(id),
        queryFn: () => leavesQuery.getById(id),
        enabled: enabled && !!id,
    });
}

// Hook pour créer une demande de congé
export function useCreateLeaveMutation() {
    const leavesQuery = new LeavesQuery();
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: leavesQuery.create,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.leaves.all() });
        },
    });
}

// Hook pour récupérer les demandes de congés récentes
export function useRecentLeavesQuery() {
    const leavesQuery = new LeavesQuery();
    return useQuery({
        queryKey: [...queryKeys.leaves.all(), "recent"],
        queryFn: leavesQuery.getRecent,
    });
}

// Hook pour récupérer l'historique des demandes de congés
export function useLeavesHistoryQuery() {
    const leavesQuery = new LeavesQuery();
    return useQuery({
        queryKey: [...queryKeys.leaves.all(), "history"],
        queryFn: leavesQuery.getHistory,
    });
}

// Hook pour approuver une demande de congé
export function useApproveLeaveMutation() {
    const leavesQuery = new LeavesQuery();
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: leavesQuery.approve,
        onSuccess: (_, id) => {
            queryClient.invalidateQueries({ queryKey: queryKeys.leaves.all() });
            queryClient.invalidateQueries({ queryKey: queryKeys.leaves.detail(id) });
        },
    });
}

// Hook pour rejeter une demande de congé
export function useRejectLeaveMutation() {
    const leavesQuery = new LeavesQuery();
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: leavesQuery.reject,
        onSuccess: (_, id) => {
            queryClient.invalidateQueries({ queryKey: queryKeys.leaves.all() });
            queryClient.invalidateQueries({ queryKey: queryKeys.leaves.detail(id) });
        },
    });
}

// Hook pour annuler une demande de congé
export function useCancelLeaveMutation() {
    const leavesQuery = new LeavesQuery();
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: leavesQuery.cancel,
        onSuccess: (_, id) => {
            queryClient.invalidateQueries({ queryKey: queryKeys.leaves.all() });
            queryClient.invalidateQueries({ queryKey: queryKeys.leaves.detail(id) });
        },
    });
}

// Hook pour annuler une demande de congé approuvée
export function useCancelApprovedLeaveMutation() {
    const leavesQuery = new LeavesQuery();
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: leavesQuery.cancelApproved,
        onSuccess: (_, id) => {
            queryClient.invalidateQueries({ queryKey: queryKeys.leaves.all() });
            queryClient.invalidateQueries({ queryKey: queryKeys.leaves.detail(id) });
        },
    });
}

// ==========================================
// Hooks pour les types de demandes d'absence
// ==========================================

// Hook pour récupérer tous les types de demandes d'absence
export function useLeaveTypesQuery(companyId: string, enabled: boolean = true) {
    const leavesQuery = new LeavesQuery();
    return useQuery({
        queryKey: queryKeys.leavesType.all(companyId),
        queryFn: () => leavesQuery.getTypes(companyId),
        enabled: enabled && !!companyId,
    });
}

// Hook pour créer un type de demande d'absence
export function useCreateLeaveTypeMutation() {
    const leavesQuery = new LeavesQuery();
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: leavesQuery.createType,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.leavesType.all() });
        },
    });
}

// Hook pour mettre à jour un type de demande d'absence
export function useUpdateLeaveTypeMutation() {
    const leavesQuery = new LeavesQuery();
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ uuid, data }: { uuid: string; data: Partial<LeaveType> }) => leavesQuery.updateType(uuid, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.leavesType.all() });
        },
    });
}

// Hook pour supprimer un type de demande d'absence
export function useDeleteLeaveTypeMutation() {
    const leavesQuery = new LeavesQuery();
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: leavesQuery.deleteType,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.leavesType.all() });
        },
    });
}

// ============================================================
// 📄 Hooks pour les notifications
// ============================================================

// Hook pour récupérer toutes les notifications
export function useNotificationsQuery() {
    const notificationQuery = new NotificationQuery();
    return useQuery({
        queryKey: queryKeys.notifications.all(),
        queryFn: notificationQuery.getAll,
    });
}

// ============================================================
// 📄 Hooks pour les bulletins de paie
// ============================================================

// Hook pour récupérer tous les bulletins de paie
export function usePayslipsQuery(companyId: string, enabled: boolean = true) {
    const payslipQuery = new PayslipQuery();
    return useQuery({
        queryKey: queryKeys.payslips.all(companyId),
        queryFn: () => payslipQuery.getAll(companyId),
        enabled: enabled && !!companyId,
    });
}
// Hook pour récupérer un bulletin de paie par son uuid
export function usePayslipQuery(uuid: string, enabled: boolean = true) {
    const payslipQuery = new PayslipQuery();
    return useQuery({
        queryKey: queryKeys.payslips.one(uuid),
        queryFn: () => payslipQuery.getOne(uuid),
        enabled: enabled && !!uuid,
    });
}

// Récupérer les bulletins de paie par employé
export function usePayslipsByEmployeeUuidQuery(employeeUuid: string, enabled: boolean = true) {
    const payslipQuery = new PayslipQuery();
    return useQuery({
        queryKey: queryKeys.payslips.byEmployeeUuid(employeeUuid),
        queryFn: () => payslipQuery.getByEmployeeUuid(employeeUuid),
        enabled: enabled && !!employeeUuid,
    });
}

// Hook pour télécharger un bulletin de paie
export function useDownloadPayslipQuery(uuid: string, enabled: boolean = true) {
    const payslipQuery = new PayslipQuery();
    return useQuery({
        queryKey: queryKeys.payslips.download(uuid),
        queryFn: () => payslipQuery.download(uuid),
        enabled: enabled && !!uuid,
    });
}

// Hook pour générer le bulletin de paie
export function useGeneratePayslipMutation() {
    const payslipQuery = new PayslipQuery();
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: payslipQuery.generate
    });
}

// ============================================================
// 📄 Hooks pour les positions
// ============================================================

// Hook pour récupérer toutes les positions
export function usePositionsQuery(companyId?: string, enabled: boolean = true) {
    const storeCompanyId = useKizunaStore((state) => state.selectedCompanyId);
    const activeCompanyId = storeCompanyId === "all" ? companyId : storeCompanyId;

    const positionQuery = new PositionQuery();
    return useQuery({
        queryKey: queryKeys.positions.all(activeCompanyId),
        queryFn: () => positionQuery.getAll(activeCompanyId === "all" ? undefined : activeCompanyId),
        enabled: enabled,
    });
}

// Hook pour récupérer une position par son id
export function usePositionQuery(id: string, companyId?: string, enabled: boolean = true) {
    const positionQuery = new PositionQuery();
    return useQuery({
        queryKey: queryKeys.positions.detail(id, companyId),
        queryFn: () => positionQuery.getById(id, companyId),
        enabled: enabled && !!id && companyId !== undefined,
    });
}

// Hook pour créer une position
export function useCreatePositionMutation() {
    const positionQuery = new PositionQuery();
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: positionQuery.create,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.positions.all() });
        },
    });
}

// Hook pour modifier une position
export function useUpdatePositionMutation() {
    const positionQuery = new PositionQuery();
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: Partial<Omit<Position, "uuid" | "createdAt" | "updatedAt">> }) =>
            positionQuery.update(id, data),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: queryKeys.positions.all() });
            queryClient.invalidateQueries({ queryKey: queryKeys.positions.detail(data.uuid) });
        },
    });
}

// Hook pour supprimer une position
export function useDeletePositionMutation() {
    const positionQuery = new PositionQuery();
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: positionQuery.delete,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.positions.all() });
        },
    });
}

// ============================================================
// 📄 Hooks pour les presences
// ============================================================

// Hook pour récupérer toutes les présences
export function usePresencesQuery(month?: number, year?: number) {
    const presenceQuery = new PresenceQuery();
    return useQuery({
        queryKey: [...queryKeys.presences.all(), month, year],
        queryFn: () => presenceQuery.getAll(month, year),
    });
}

// Hook pour récupérer les présences par id utilisateur
export function usePresencesByUserIdQuery(userId: string, month?: number, year?: number, enabled: boolean = true) {
    const presenceQuery = new PresenceQuery();
    return useQuery({
        queryKey: [...queryKeys.presences.byUserId(userId), month, year],
        queryFn: () => presenceQuery.getByUserId(userId, month, year),
        enabled: enabled && !!userId,
    });
}

// Hook pour créer une présence
export function useCreatePresenceMutation() {
    const presenceQuery = new PresenceQuery();
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: presenceQuery.post,
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: queryKeys.presences.all() });
            queryClient.invalidateQueries({ queryKey: queryKeys.presences.byUserId(variables.employeeId) });
        },
    });
}

// Hook pour mettre à jour une présence
export function useUpdatePresenceMutation() {
    const presenceQuery = new PresenceQuery();
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: Partial<Omit<Presence, "uuid" | "createdAt" | "updatedAt">> }) =>
            presenceQuery.update(id, data),
        onSuccess: (response, variables) => {
            queryClient.invalidateQueries({ queryKey: queryKeys.presences.all() });
            if (variables.data.employeeId || response?.item?.employeeId) {
                queryClient.invalidateQueries({ queryKey: queryKeys.presences.byUserId(variables.data.employeeId || response?.item?.employeeId as string) });
            }
        },
    });
}

// Hook pour créer plusieurs présences en masse
export function useCreateManyPresencesMutation() {
    const presenceQuery = new PresenceQuery();
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: presenceQuery.postMany,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.presences.all() });
        },
    });
}

// ============================================================
// 📄 Hooks pour les recruitments
// ============================================================

// Hook pour récupérer tous les recrutements
export function useRecruitmentsQuery(companyId?: string, enabled: boolean = true) {
    const storeCompanyId = useKizunaStore((state) => state.selectedCompanyId);
    const activeCompanyId = storeCompanyId === "all" ? companyId : storeCompanyId;

    const recruitmentQuery = new RecruitmentQuery();
    return useQuery({
        queryKey: queryKeys.recruitments.all(activeCompanyId),
        queryFn: () => recruitmentQuery.getAll(activeCompanyId === "all" ? undefined : activeCompanyId),
        enabled: enabled,
    });
}

// Hook pour récupérer un recrutement par son id
export function useRecruitmentQuery(id: string, enabled: boolean = true) {
    const recruitmentQuery = new RecruitmentQuery();
    return useQuery({
        queryKey: queryKeys.recruitments.detail(id),
        queryFn: () => recruitmentQuery.getById(id),
        enabled: enabled && !!id,
    });
}

// Hook pour créer un recrutement
export function useCreateRecruitmentMutation() {
    const recruitmentQuery = new RecruitmentQuery();
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: recruitmentQuery.create,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.recruitments.all() });
        },
    });
}

// Hook pour mettre à jour un recrutement
export function useUpdateRecruitmentMutation() {
    const recruitmentQuery = new RecruitmentQuery();
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: recruitmentQuery.update,
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries({ queryKey: queryKeys.recruitments.all() });
            queryClient.invalidateQueries({ queryKey: queryKeys.recruitments.detail(variables.id) });
        },
    });
}

// Hook pour supprimer un recrutement
export function useDeleteRecruitmentMutation() {
    const recruitmentQuery = new RecruitmentQuery();
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: recruitmentQuery.delete,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.recruitments.all() });
        },
    });
}

// ============================================================
// 📄 Hooks pour les salaires
// ============================================================

// Hook pour récupérer tous les salaires
export function useSalarialsQuery() {
    const salarialQuery = new SalarialQuery();
    return useQuery({
        queryKey: queryKeys.salarials.all(),
        queryFn: salarialQuery.getAll,
    });
}

// Hook pour récupérer un salaire par son id
export function useSalarialQuery(id: number, enabled: boolean = true) {
    const salarialQuery = new SalarialQuery();
    return useQuery({
        queryKey: queryKeys.salarials.detail(id),
        queryFn: () => salarialQuery.getById(id),
        enabled: enabled && !!id,
    });
}

