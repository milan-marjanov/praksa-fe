export interface JwtDecoded {
  username: string;
  email: string;
  role: string;
  exp: number;
}
