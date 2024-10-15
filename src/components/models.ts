export interface Project {
  id?: number;
  name: string;
  description: string;
  customerId: number | null;
}

export interface Customer {
  id: number;
  name: string;
}

export interface FormErrors {
  name?: string;
  description?: string;
  customerId?: string;
}
