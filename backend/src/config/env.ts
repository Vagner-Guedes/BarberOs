import dotenv from 'dotenv';
dotenv.config();

export const config = {
  port: process.env.PORT || 3333,
  jwtSecret: process.env.JWT_SECRET || 'default-secret',
  databaseUrl: process.env.DATABASE_URL || '',
};
