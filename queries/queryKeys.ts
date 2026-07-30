export const queryKeys = {
  auth: {
    login: () => ["auth", "login"] as const,
  },
  companies: {
    all: () => ["companies", "all"] as const,
    detail: (id: string) => ["companies", "detail", id] as const,
  },
  departments: {
    all: (companyId?: string) => ["departments", "all", companyId] as const,
    detail: (id: string, companyId?: string) => ["departments", "detail", id, companyId] as const,
  },
  positions: {
    all: (companyId?: string) => ["positions", "all", companyId] as const,
    detail: (id: string, companyId?: string) => ["positions", "detail", id, companyId] as const,
  },
  employees: {
    all: (filters?: any) => ["employees", "all", filters] as const, // filters will contain companyId
    detail: (id: string, companyId?: string) => ["employees", "detail", id, companyId] as const,
    personal: (id: string, companyId?: string) => ["employees", "personal", id, companyId] as const,
    leaves: (id: string, companyId?: string) => ["employees", "leaves", id, companyId] as const,
    leaveBalance: (id: string, companyId?: string) => ["employees", "leave-balance", id, companyId] as const,
  },
  documents: {
    all: (companyId?: string) => ["documents", "all", companyId] as const,
    mine: (userId: string, companyId?: string) => ["documents", "mine", userId, companyId] as const,
    detail: (id: number, companyId?: string) => ["documents", "detail", id, companyId] as const,
  },
  holidays: {
    all: (companyId?: string) => ["holidays", "requests", "all", companyId] as const,
    byUser: (userId: string, companyId?: string) => ["holidays", "requests", "user", userId, companyId] as const,
    stats: (companyId?: string) => ["holidays", "stats", companyId] as const,
    balance: (userId: string, year?: number, companyId?: string) => ["holidays", "balance", userId, year, companyId] as const,
    types: (companyId?: string) => ["holidays", "types", companyId] as const,
  },
  leaves: {
    all: (companyId?: string) => ["leaves", "all", companyId] as const,
    mine: (userId: number, companyId?: string) => ["leaves", "mine", userId, companyId] as const,
    byUserId: (userId: string, companyId?: string) => ["leaves", "byUserId", userId, companyId] as const,
    detail: (id: number, companyId?: string) => ["leaves", "detail", id, companyId] as const,
  },
  leavesType: {
    all: (companyId?: string) => ["leaves-type", "all", companyId] as const,
    detail: (id: number, companyId?: string) => ["leaves-type", "detail", id, companyId] as const,
    byCode: (code: string, companyId?: string) => ["leaves-type", "byCode", code, companyId] as const,
  },
  presences: {
    all: (companyId?: string) => ["presences", "all", companyId] as const,
    byUserId: (userId: string, companyId?: string) => ["presences", "byUserId", userId, companyId] as const,
  },
  salarials: {
    all: (companyId?: string) => ["salarials", "all", companyId] as const,
    detail: (id: number, companyId?: string) => ["salarials", "detail", id, companyId] as const,
  },
  notifications: {
    all: (companyId?: string) => ["notifications", companyId] as const,
  },
  payslips: {
    all: (companyId?: string) => ["payslips", "all", companyId] as const,
    one: (uuid: string) => ["payslips", uuid] as const,
    byEmployeeUuid: (employeeUuid: string) => ["payslips", "employee", employeeUuid] as const,
    download: (uuid: string) => ["payslips", "download", uuid] as const,
  },
  recruitments: {
    all: (companyId?: string) => ["recruitments", "all", companyId] as const,
    detail: (id: string, companyId?: string) => ["recruitments", "detail", id, companyId] as const,
  },
  candidacies: {
    all: (recuitmentUuid?: string) => ["candidacies", "all", recuitmentUuid] as const,
    detail: (id: string) => ["candidacies", "detail", id] as const,
  }
};
