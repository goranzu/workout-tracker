export type AuthResponse = {
  userInfo: { username: string };
  token: string;
  expiresAt: number;
};

export type AuthAxiosResponse = {
  data: AuthResponse;
};
