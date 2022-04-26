import 'dotenv/config';

import App from "./App";
import UserController from "./controllers/UserController";
import { AppDataSource } from "./db/data-source"
import UsersDbClass from "./db/Users";
import MovieController from "./controllers/MovieController";
import MoviesDbClass from "./db/Movies";
import InstagramController from 'controllers/Instagram';

const main = async () => {
    try{
        const db = await AppDataSource.initialize();
 

    const usersTable = new UsersDbClass(db);
    const moviesTable = new MoviesDbClass(db);

    const userController = new UserController(usersTable);
    const movieController = new MovieController(usersTable, moviesTable);

    const instagramController = new InstagramController(usersTable);

     const controllers = [
      userController,
      movieController,
      instagramController
    ];

    const port = Number(process.env.PORT) || 5000;
    const app = new App(controllers, port);
    app.listen();
    return app;
    } catch (e) {
        console.error(e)
    }
}

main();

export default main;
