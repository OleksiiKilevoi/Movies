
import { RequestHandler } from 'express';
import Controller from './Controller';
import { User } from '../entity/User';
import UsersDbClass from '../db/Users';

class UserController extends Controller {
    public constructor(
        users: UsersDbClass,
    ) {
        super('/users', users);

        this.initializeRoutes();
    }

    private initializeRoutes = () => {
        this.router.post('/', this.createUser);

    };

    private createUser: RequestHandler<
        {},
        {},
        User> = async (req, res) => {

            const newUser = await this.users.create(req.body);

            return res.status(200).json(newUser);
        };

}

export default UserController;
