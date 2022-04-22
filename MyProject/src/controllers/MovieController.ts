import { RequestHandler } from 'express';
import Controller from './Controller';
import UsersDbClass from '../db/Users';
import MoviesDbClass from '../db/Movies';
import { Movie } from '../entity/Movie';

import fileUpload = require('express-fileupload');
import * as fs from 'fs';


class MovieController extends Controller {
  public constructor(
    users: UsersDbClass, 
    private movies: MoviesDbClass,
    private UPLOADS_PATH = process.env.UPLOADS_PATH
    ) {
    super('/movies', users);

    this.initializeRoutes();
  }

  private initializeRoutes = () => {
    this.router.post('/', this.protectRoute, this.createMovie);
    this.router.post('/import', this.protectRoute, this.importMovies);
  };

  private importMovies: RequestHandler<
  {},
  {}> = async (req, res) => {

    const { files } = req.files!;
      
    const movies = files as unknown as fileUpload.UploadedFile;
 
    const destination = `${this.UPLOADS_PATH || '/storage'}/${movies.name}`;

    movies.mv(destination);

    const movieString = fs.readFileSync(destination).toString().split(/\n{2}/)
    .filter((el)=> el !== '')

      const movieProperty = movieString.map((el) => {
          return el.trim().split('\n')
      })

      const arrayOfMovies = movieProperty.map((el) => {
          const newObj = el.reduce((acc, el1) => {
              const [key, value] = el1.split(':')
              return { ...acc, ...{ [key.toLowerCase().replace(' ', '_')]: value } }
          }, {})
          return newObj
      }, {})

      interface MovieFormTxt {
      title: string,
      release_year: string,
      format: string,
      stars: string
      }
      const moviesTxt = arrayOfMovies as MovieFormTxt[]

      moviesTxt.forEach(async element => {

        const dbMovie: Movie = {
          year: Number(element.release_year),
          actors: element.stars.split(','),
          format: element.format,
          title: element.title,
        }
        await this.movies.create(dbMovie)
      });

    
    return res.status(200).json('dsf');
  };

  private createMovie: RequestHandler<{}, {}, Movie> = async (req, res) => {
    const newMovie = await this.movies.create(req.body);

    return res.status(200).json(newMovie);
  };
}

export default MovieController;
