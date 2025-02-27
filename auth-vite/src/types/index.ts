export type Expense = {
  _id: string | undefined;
  title: string;
  amount: string;
  date: string;
  category?: string;
  isNew?: boolean;
};
