export interface AdminForgeListResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
}

export interface AdminForgeUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AdminForgeProduct {
  id: string;
  name: string;
  description: string | null;
  price: number;
  category: string | null;
  imageUrl: string | null;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AdminForgeApiForm {
  id: string;
  name: string;
  definition: unknown[];
  createdAt: string;
  updatedAt: string;
}
