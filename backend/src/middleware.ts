import { Request, Response, NextFunction } from 'express';
import { verifyToken, extractToken } from './auth.js';

export interface AuthRequest extends Request {
  userId?: number;
  userEmail?: string;
}

export function authMiddleware(req: AuthRequest, res: Response, next: NextFunction): void {
  const token = extractToken(req.headers.authorization);
  
  if (!token) {
    res.status(401).json({ error: 'No token provided' });
    return;
  }

  const payload = verifyToken(token);
  if (!payload) {
    res.status(401).json({ error: 'Invalid token' });
    return;
  }

  req.userId = payload.id;
  req.userEmail = payload.email;
  next();
}
