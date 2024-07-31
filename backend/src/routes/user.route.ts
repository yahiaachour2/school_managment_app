// import express from 'express';

// import { authController } from '../controllers/auth';
// import { userController } from '../controllers/user';

// const routes = express.Router();
// //users
// routes.post("/", userController.create);

// routes.get("/", userController.getUsers);
// routes.get("/get/:id", userController.get);

// routes.put("/update/:id",userController.update);
// routes.delete("/delete/:id", userController.delete);

// routes.post ("/login",authController.login)




// export default routes;

import express from 'express';

import { authController } from '../controllers/auth';
import { userController } from '../controllers/user';
import {
  authenticateToken,
} from '../Middleware/authVerifier'; // Import the authentication middleware

const routes = express.Router();

// Public routes
routes.post("/", userController.create);
routes.post("/login", authController.login);

// Protected routes - require authentication
routes.get("/", authenticateToken, userController.getUsers);
routes.get("/:id", authenticateToken, userController.get);
routes.put("/:id", authenticateToken, userController.update);
routes.delete("/:id", authenticateToken, userController.delete);

export default routes;