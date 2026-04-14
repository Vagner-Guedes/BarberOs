import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import authRoutes from './routes/authRoutes';
import clientRoutes from './routes/clientRoutes';
import professionalRoutes from './routes/professionalRoutes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3333;

app.use(cors());
app.use(express.json());

// Rotas
app.use('/auth', authRoutes);
app.use('/clients', clientRoutes);
app.use('/professionals', professionalRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'BarberOs API is running!' });
});

// Rota inicial
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to BarberOs API' });
});

app.listen(PORT, () => {
  console.log(`íº€ Server running on http://localhost:${PORT}`);
});
