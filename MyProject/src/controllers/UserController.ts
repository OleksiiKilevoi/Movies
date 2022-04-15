
import { RequestHandler } from 'express';
import Controller from './Controller';
import { User } from '../entity/User';
import UsersDbClass from '../db/Users';
import { errorResponse, okResponse } from '../api/baseResponses';
import Jwt from '../utils/Jwt';

class UserController extends Controller {
    protected readonly jwt: Jwt

    public constructor(
        users: UsersDbClass,
    ) {
        super('/users', users);

        this.initializeRoutes();
    }

    private initializeRoutes = () => {
        this.router.post('/', this.createUser);
        this.router.post('/sessions', this.login);

    };

    private createUser: RequestHandler<
        {},
        {},
        User> = async (req, res) => {

            const newUser = await this.users.create(req.body);

            return res.status(200).json(newUser);
        };

    private login: RequestHandler<
        {},
        {},
        {
            email: string,
            password: string
        }> = async (req, res) => {
            const { email, password } = req.body;
            const user =  await this.users.getByEmail(email);

            if (user.password !== password) return res.status(400).json(errorResponse('400', 'Can\'t find user'));

            const token = await this.jwt.createAccessToken(user.id);

            return res.status(200).json(okResponse(token));
        }

}

export default UserController;
