import "reflect-metadata"
import { DataSource } from "typeorm"
import { Movie } from "../entity/Movie"
import { User } from "../entity/User"

export const AppDataSource = new DataSource({
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: "postgres",
    password: "2131",
    database: "movies",
    synchronize: true,
    logging: false,
    entities: [User, Movie],
    migrations: [],
    subscribers: [],
})
