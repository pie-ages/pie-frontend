export type LoginPayload = {
  email: string;
  password: string;
};

export type AuthenticatedUser = {
  id: string;
  name: string;
  email: string;
  photoUrl: string | null;
};

export type LoginResponse = {
  token: string;
  user: AuthenticatedUser;
};
export type RegisterPayload = {
  name: string;
  email: string;
  password: string;
};
