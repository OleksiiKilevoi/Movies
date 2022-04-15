import { DataSource } from "typeorm";
import { Movie } from "../entity/Movie";



export default class MoviesDbClass {
    public constructor(public db: DataSource) {
    }

    public create = async (movie: Movie): Promise<Movie> => this.db.manager.save(Movie, movie);

 
}
