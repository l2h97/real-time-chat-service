export type RegisterInteractorResponse = {
  id: string,
  email: string,
  fullName: string,
  createdAt: string,
  updatedAt: string,
  isExistsEmail?: boolean;
};