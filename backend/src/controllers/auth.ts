import {
  Request,
  Response,
} from 'express';

import { User } from '../entities/user';
import { checkPassword } from '../helpers/hashPassword';
import { generateToken } from '../helpers/jsonwebtoken';
import { dataSource } from '../ormconfig';

export class AuthController {
  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required" });
      }
      const userRepository = dataSource.getRepository(User);
      const user = await userRepository.findOne({ where: { email } });

      if (!user || !checkPassword(password, user.password)) {
        return res.status(401).json({ message: "Invalid email or password" });
      }

      // Generate token
      const token = generateToken({
        userId: user.userId,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        gender: user.gender
      });

      // Update user's token in the database
      user.token = token;
      await userRepository.save(user);

      return res.status(200).json({ message: "Login successful", token });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }
}

export const authController = new AuthController();
