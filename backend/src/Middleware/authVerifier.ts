import {
  NextFunction,
  Request,
  Response,
} from 'express';

import { verifyToken } from '../helpers';

interface CustomRequest extends Request {
  user?: any; // Define the user property
}

export function authenticateToken(req: CustomRequest, res: Response, next: NextFunction): void | Response {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];


  if (!token) return res.sendStatus(401); // Unauthorized

  try {
    const decoded = verifyToken(token);
    req.user = decoded; // Attach user data to request object
    next();
  } catch (error) {
    return res.sendStatus(403); // Forbidden
  }
}
