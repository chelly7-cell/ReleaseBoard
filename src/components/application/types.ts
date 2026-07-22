export type Application = {
  id: number;
  name: string;
  description: string | null;
  logo: string | null;
  website: string | null;
  views: number;
  createdAt: string | Date;
};

export type Update = {
  id: number;
  title: string;
  version: string;
  status: "draft" | "published";
  createdAt: string | Date;
};

export type ApplicationDetailsResponse = {
  application: Application;
  updates: Update[];
};