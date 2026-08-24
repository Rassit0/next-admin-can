export interface ISessionBooking {
  id: string;
  isExternal: boolean;
  attended: boolean;
  chargeId?: string | null;
  createdAt: string;
  updatedAt: string;
  session?: {
    id: string;
    durationMin: number;
    event?: {
      title: string;
      startDate: string;
    };
  };
  studentId?: string;
  student?: {
    id: string;
    person?: {
      id: string;
      name: string;
      lastName: string;
      secondLastName?: string;
    };
  };
  player?: {
    id: string;
    isActive: boolean;
    person?: {
      id: string;
      name: string;
      lastName: string;
      secondLastName?: string;
    };
  };
}

export interface ISessionBookingResponse {
  data: ISessionBooking[];
  meta: {
    totalItems: number;
    itemCount: number;
    itemsPerPage: number;
    totalPages: number;
    currentPage: number;
  };
}
