export interface JwtDecoded {
  sub: string;
  id: number;
  role: 'ADMIN' | 'USER';
  iat: number;
  exp: number;
}
