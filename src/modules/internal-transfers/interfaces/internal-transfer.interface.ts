export interface InternalTransfer {
  id: string;
  amount: string | number;
  description?: string;
  reference?: string;
  status: "PENDING" | "COMPLETED" | "CANCELLED";
  date: string;
  sourceTransactionId: string;
  destinationTransactionId: string;
  createdById?: string;
  createdAt: string;
  updatedAt: string;
  
  sourceTransaction?: {
    financialAccountId: string;
    financialAccount?: {
      id: string;
      name: string;
    }
  };
  destinationTransaction?: {
    financialAccountId: string;
    financialAccount?: {
      id: string;
      name: string;
    }
  };
}

export interface InternalTransfersResponse {
  data: InternalTransfer[];
  meta: {
    totalItems: number;
    itemsPerPage: number;
    totalPages: number;
    currentPage: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
    nextPage: number | null;
    prevPage: number | null;
  };
}
