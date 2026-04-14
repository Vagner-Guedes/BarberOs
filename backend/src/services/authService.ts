import { prisma } from '../config/database';
import { comparePassword, hashPassword } from '../utils/hashPassword';
import { generateToken } from '../utils/generateToken';

export const authService = {
  async register(email: string, password: string, name: string) {
    const hashedPassword = await hashPassword(password);
    const user = await prisma.user.create({
      data: { email, password: hashedPassword, name },
    });
    const token = generateToken(user.id);
    return { user: { id: user.id, email: user.email, name: user.name }, token };
  },

  async login(email: string, password: string) {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) throw new Error('Usuário não encontrado');

    const isValid = await comparePassword(password, user.password);
    if (!isValid) throw new Error('Senha inválida');

    const token = generateToken(user.id);
    return { user: { id: user.id, email: user.email, name: user.name }, token };
  },
};
