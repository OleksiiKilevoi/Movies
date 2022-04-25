import { RequestHandler, response } from 'express';
import Controller from './Controller';
import UsersDbClass from '../db/Users';
import MoviesDbClass from '../db/Movies';
import { Movie } from '../entity/Movie';

import fileUpload = require('express-fileupload');
import * as fs from 'fs';
import { sort as sortUtil, SortOrder, SortType } from 'utils/sortUtil';


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
    this.router.get('/', this.protectRoute, this.getList);
    this.router.post('/', this.protectRoute, this.createMovie);
    this.router.post('/import', this.protectRoute, this.importMovies);
    this.router.delete('/:id', this.protectRoute, this.deleteMovie);
    this.router.patch('/:id', this.protectRoute, this.patchMovie);
  };

  private patchMovie: RequestHandler<{id: string }, {}, Movie>= async (req, res) => {
    const { id } = req.params;
    const result = await this.movies.patchMovie(Number(id), req.body);

    return res.status(201).json(result)
  };


  private deleteMovie: RequestHandler = async (req, res) => {
    const { id } = req.params;
    const result = await this.movies.deleteById(Number(id))
    return res.status(201).json(result)
  };

  private getList: RequestHandler<
  {},
  Movie[],
  {},
  { sort: 'title' | 'year' | 'id', order: SortOrder, limit: string, offset: string, actor: string, title: string, search: string }
  > = async (req, res) => {
    const { 
      sort = 'id',
      order = SortOrder.ASCENDING,
      limit = '20',
      offset = '0',
      actor, 
      title,
      search
    } = req.query;
    const startIndex = (Number(offset) - 1) * Number(limit);
    const endIndex = Number(offset) * Number(limit);

    const response: any = {};


    const allMovies = await this.movies.getAll();
    const sorted = sortUtil(allMovies, ((movies) => movies[sort]), order, sort === 'id' ?SortType.Number: SortType.String);

    const sliced = sorted.slice(Number(offset), Number(limit))

    response.data = sliced
    response.pagination = {startIndex, endIndex}
    if(actor) {
     const moviesFiltered = allMovies.filter((movie) => movie.actors.join(',').includes(actor))
      const sorted = sortUtil(moviesFiltered, ((movies) => movies[sort]), order, sort === 'id' ? SortType.Number : SortType.String);
     return res.status(200).json(sorted);
    }

    if(title){
      const moviesFiltered = allMovies.filter((movie) => movie.title.includes(title))
      const sorted = sortUtil(moviesFiltered, ((movies) => movies[sort]), order, sort === 'id' ? SortType.Number : SortType.String);
      return res.status(200).json(sorted);
    }

    if(search) {
      const mapped = allMovies.map((movie) =>{ 
        return { ...movie, combined: movie.actors + movie.title }})
        const searched = mapped.filter((el) => el.combined.includes(search))
        .map((el) => {
          const {combined, ...params} = el
          return {...params}
        })
        return res.status(200).json(searched);
    }

      return res.status(200).json(response);
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
