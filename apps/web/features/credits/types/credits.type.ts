export interface UserCredits {
  freeCredits: number;
  purchasedCredits: number;
  totalCredits: number;
}

export interface GetCreditsResponse {
  success: boolean;
  data: UserCredits;
}
