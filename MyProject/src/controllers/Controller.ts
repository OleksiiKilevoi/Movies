import { RequestHandler, Router } from 'express';
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
   
      return next();
    } catch (e: any) {
    }
  };



}

export default Controller;
