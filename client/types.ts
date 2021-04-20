export type AuthResponse = {
    userInfo: {
        username: string;
        id: string;
    }
};

export type AuthAxiosResponse = {
  data: AuthResponse;
};
