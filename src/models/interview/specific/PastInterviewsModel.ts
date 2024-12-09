import { PastInterviewModel } from "./PeerInterviewModel";

export interface PastInterviewsModel {
    page: number;
    limit: number;
    totalListings: number;
    totalPages: number;
    results: PastInterviewModel[];
  }