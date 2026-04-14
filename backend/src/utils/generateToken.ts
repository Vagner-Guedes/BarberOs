import jwt from 'jsonwebtoken';
import { config } from '../config/env';

export const generateToken = (userId: number): string => {
  return jwt.sign({ id: userId }, config.jwtSecret, { expiresIn: '7d' });
};
