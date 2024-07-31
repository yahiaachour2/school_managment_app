export interface CreateSessionInput {
  StartDate: string;
  FinDate: string;
  schoolId: string;
}

export interface GetSessionInput {
  id: string;
}
export interface UpdateSessionInput {
  id: string;
  StartDate: Date;
  FinDate: Date;

  schoolId: string;
}
export interface deleteSessionInput {
  id: string;
}
