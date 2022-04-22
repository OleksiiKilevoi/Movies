import { DataSource } from "typeorm";
import { Movie } from "../entity/Movie";



export default class MoviesDbClass {
    public constructor(public db: DataSource) {
    }

    public create = async (movie: Movie): Promise<Movie> => this.db.manager.save(Movie, movie);

    public getAll = async (): Promise<Movie[]> => this.db.manager.find(Movie, {});

    public deleteById = async (id: number) => this.db.manager.delete(Movie, { id });

    public patchMovie = async (id: number, update: Movie) => {
        const movie = await this.db.manager.findOneBy(Movie, { id });

        movie.actors = update.actors
        movie.format = update.format
        movie.title = update.title
        movie.year = update.year

        return this.db.manager.save(Movie, movie)
    };
}
