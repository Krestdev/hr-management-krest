export const queryKeys = {
  auth: {
    login: () => ["auth", "login"] as const,
  },
  departments: {
    all: () => ["departments", "all"] as const,
    detail: (id: string) => ["departments", "detail", id] as const,
  },
  positions: {
    all: () => ["positions", "all"] as const,
    detail: (id: string) => ["positions", "detail", id] as const,
  },
  employees: {
    all: (filters?: any) => ["employees", "all", filters] as const,
    detail: (id: string) => ["employees", "detail", id] as const,
    personal: (id: string) => ["employees", "personal", id] as const,
    leaves: (id: string) => ["employees", "leaves", id] as const,
    leaveBalance: (id: string) => ["employees", "leave-balance", id] as const,
  },
  documents: {
    all: () => ["documents", "all"] as const,
    mine: (userId: string) => ["documents", "mine", userId] as const,
    detail: (id: number) => ["documents", "detail", id] as const,
  },
  holidays: {
    all: () => ["holidays", "requests", "all"] as const,
    byUser: (userId: string) => ["holidays", "requests", "user", userId] as const,
    stats: () => ["holidays", "stats"] as const,
    balance: (userId: string, year?: number) => ["holidays", "balance", userId, year] as const,
    types: () => ["holidays", "types"] as const,
  },
  leaves: {
    all: () => ["leaves", "all"] as const,
    mine: (userId: number) => ["leaves", "mine", userId] as const,
    byUserId: (userId: string) => ["leaves", "byUserId", userId] as const,
    detail: (id: number) => ["leaves", "detail", id] as const,
  },
  leavesType: {
    all: () => ["leaves-type", "all"] as const,
    detail: (id: number) => ["leaves-type", "detail", id] as const,
    byCode: (code: string) => ["leaves-type", "byCode", code] as const,
  },
  presences: {
    all: () => ["presences", "all"] as const,
    byUserId: (userId: string) => ["presences", "byUserId", userId] as const,
  },
  salarials: {
    all: () => ["salarials", "all"] as const,
    detail: (id: number) => ["salarials", "detail", id] as const,
  },
  notifications: {
    all: () => ["notifications"] as const,
  },
  payslips: {
    all: () => ["payslips"] as const,
  }
};
