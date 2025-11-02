export interface UserAccountRequestDto {
    id: number;
    username: string;
    isReviewed: boolean;
    isApproved: boolean;
    createdDate: string;
    reviewedDate: string | null;
}

