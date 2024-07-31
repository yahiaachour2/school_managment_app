import jwt from 'jsonwebtoken';

const JWT_SECRET = 'your_secret_key';

export const generateToken =(payload: any): string => {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: '33h' });
}

export function verifyToken(token: string): any {
    try {
      return jwt.verify(token, JWT_SECRET);
    } catch (error) {
      throw new Error('Invalid token');
    }
  }