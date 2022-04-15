
import { RequestHandler } from 'express';
import Controller from './Controller';
import { User } from '../entity/User';
import UsersDbClass from '../db/Users';
import MoviesDbClass from '../db/Movies';
import { Movie } from '../entity/Movie';

class MovieController extends Controller {
    public constructor(
        users: UsersDbClass,
        private movies: MoviesDbClass
    ) {
        super('/movies', users);

        this.initializeRoutes();
    }

    private initializeRoutes = () => {
        this.router.post('/', this.protectRoute, this.createMovie);

    };

    private createMovie: RequestHandler<
        {},
        {},
        Movie> = async (req, res) => {

            const newMovie = await this.movies.create(req.body)

            return res.status(200).json(newMovie);
        };

}

export default MovieController;
