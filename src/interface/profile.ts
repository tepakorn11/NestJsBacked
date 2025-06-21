export interface IProfile {
  id: number;
  first_name: string | null;
  last_name: string | null;
  role: string | null;
  avatar: string | null;
  email: string | null;
  location: string | null;
  status: string | null;
  created_at: Date;
  socials: ISocial[];
}

export interface ISocial {
name:string | null;
icon:string | null;
link:string | null;

}