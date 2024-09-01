import {
  NextFunction,
  Request,
  Response,
} from 'express';

export const phoneRegex = /^\+?[1-9]\d{1,14}$/;

export const validatePhoneNumber = (req: Request, res: Response, next: NextFunction): void => {
    const { phone }: { phone: string } = req.body;

    if (!phoneRegex.test(phone)) {
        res.status(400).json({ error: "Numéro de téléphone invalide" });
        return;
    }

    next();
};