export interface JwtPayload {
  sub: string;
  email: string;
  name: string;
  role: string;
  type?: 'access' | 'refresh';
  sessionId?: string;
}
