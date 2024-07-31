// // routes/auth.ts
// import { Router } from 'express';

// import { verifyToken } from '../helpers';

// const router = Router();

// router.get('/verifyToken', (req, res) => {
//   const authHeader = req.headers.authorization;
  
//   if (!authHeader) {
//     return res.status(401).json({ error: 'Authorization header missing' });
//   }

//   const token = authHeader.split(' ')[1]; 
//   try {
//     const decoded = verifyToken(token);
//     res.json({ valid: true });
//   } catch (error) {
//     res.status(403).json({ error: 'Invalid token' });
//   }
// });

// export default router;