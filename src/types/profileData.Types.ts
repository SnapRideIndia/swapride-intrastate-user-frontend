export interface IProfileData {
  id: string;
  createdAt: string;
  updatedAt: string;
  fullName: string;
  referralCode: string;
  referredById: any;
  mobileNumber: string;
  email: string;
  gender: string;
  dateOfBirth: string;
  bloodGroup: any;
  status: string;
  profileUrl: string;
  lastLogin: string;
  isOnboarded: boolean;
  deletedAt: any;
  wallet: Wallet;
  walletBalance: number;
  totalBookings: number;
  totalAmountSpent: number;
  lastBookingDate: any;
}

export interface Wallet {
  id: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
  balance: string;
  isActive: boolean;
}
