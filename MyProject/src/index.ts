import { getRepository } from "typeorm";
import App from "./App";
import UserController from "./controllers/UserController";
import { AppDataSource } from "./data-source"
import { Movie } from "./entity/Movie";
import { User } from "./entity/User"
import UsersDbClass from "./Users";

const main = async () => {
    const db = await AppDataSource.initialize();

    const usersTable = new UsersDbClass(db);

    const userController = new UserController(usersTable)
    // const movie = new Movie()

    // movie.title = "Casablanca";
    // movie.year = 1942;
    // movie.format = "DVD";
    // movie.actors = [
    //     "Humphrey Bogartt",
    //     "Ingrid Bergman",
    //     "Claude Rains",
    //     "Peter Lorre"
    // ]
     const controllers = [
      userController
    ];

    const port = Number(process.env.PORT) || 5000;
    const app = new App(controllers, port);
    app.listen();
    return app;
}

main();

export default main;
// .then(async () => {

//     console.log("Inserting a new user into the database...")
//     const user = new User()
//     user.firstName = "Timber"
//     user.lastName = "Saw"
//     user.age = 25
//     await AppDataSource.manager.save(user)
//     console.log("Saved a new user with id: " + user.id)

//     console.log("Loading users from the database...")
//     const users = await AppDataSource.manager.find(User)
//     console.log("Loaded users: ", users)

//     console.log("Here you can setup and run express / fastify / any other framework.")

// }).catch(error => console.log(error))
