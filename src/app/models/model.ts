export interface dashboardModel {
    storeName: string;
    summary: summaryModel;
    transactions: transactionsModel[];
}

export interface summaryModel {
    stampsIssued: number;
    rewardsClaimed: number;
    newEnrollments: number;
}

export interface transactionsModel {
    name: string;
    email: string;
    activity: string;
    timestamp: string;
    icon: string;
}

export interface memberData {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
}

export interface storeData {
    storeName: string;
    email: string;
    password: string;
}

export interface loginData {
    email: string;
    password: string;
}

export interface validateStampResponse {
    isValid: boolean;
    rewardPending: boolean;
    total_stamps: number;
    message?: string;
    account?: Array<{
        first_name: string;
        last_name: string;
        total_stamps: number;
        customer_id: string;
    }>;
}

export interface confirmRewardResponse {
    success: boolean;
    message: string;
}