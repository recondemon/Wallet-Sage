export interface Account {
  account_id: string;
  name: string;
  type: string;
  institution_name: string;
  balance: number;
  id: string;
}

export interface Institution {
  institution_id: string;
  name: string;
}

export interface SavingsGoal {
  id: string;
  name: string;
  goal: number;
  balance: number;
  description?: string;
  accounts: string[];
  userId: string;
}

export interface Envelope {
  id: string;
  name: string;
  goal: number;
  balance: number;
  description?: string;
  userId: string;
}
