import { RequestHandler, Router } from 'express';
import { errorResponse } from '../api/baseResponses';
import Users from '../db/Users';



import Jwt from '../utils/Jwt';

abstract class Controller {
  public readonly path: string;
  public readonly router: Router;
  protected readonly jwt: Jwt;
  protected readonly users: Users;

  public constructor(
    path: string,
    users: Users,
  ) {
    this.path = path;
    this.router = Router();
    this.jwt = new Jwt();
    this.users = users;
  }

  protected protectRoute: RequestHandler = async (req, res, next) => {
    try {
      if (!req.headers.authorization) return res.status(400).json(errorResponse('400', 'Can\'t find authorization header'));

      const auth = req.headers.authorization.split(' ');
      if (auth[0] !== 'Bearer' && auth.length !== 2) return res.status(400).json(errorResponse('400', 'Wrong auth type: should be "Bearer <access_token>"'));

      const token = auth[1];
      if (!token) return res.status(400).json(errorResponse('400', 'Can\'t find token in authorization header'));

      const decoded = this.jwt.verifyAccessToken(token);
      if (!decoded) return res.status(400).json(errorResponse('400', 'Can\'t find user from token'));

      const user = await this.users.getById(Number(decoded.id))
      if (!user) return res.status(400).json(errorResponse('400', `Can't find user by id: ${decoded.id} from token`));
      
      // req.user = user;

      return next();
    } catch (e: any) {
    }
  };



}

export default Controller;
