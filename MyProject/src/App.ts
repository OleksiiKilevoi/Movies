import * as cors from 'cors';
import * as express from 'express';
import { Application } from 'express';
import * as fileUpload from 'express-fileupload';

import Controller from './controllers/Controller';

class App {
  public app: Application;
  private readonly port: number;
  private readonly controllers: Controller[];
  private readonly UPLOADS_PATH = process.env.UPLOADS_PATH;

  public constructor(controllers: Controller[], port: number) {
    this.app = express();
    this.port = port;
    this.controllers = controllers;

    this.initializeMiddlewares();
    this.initializeControllers();
  }

  public listen = () => {
    this.app.listen(this.port, () => {
      console.log(`App listening on the port ${this.port}`);
    });
  };

  private initializeMiddlewares = () => {
    this.app.use(fileUpload());
    this.app.use(express.static(this.UPLOADS_PATH || '/storage'));
    this.app.use(express.json());
    this.app.use(
      cors({
        origin: '*',
        methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
        preflightContinue: false,
        optionsSuccessStatus: 204,
      }),
    );
  };

  private initializeControllers = () => {
    this.controllers.forEach((controller) => {
      this.app.use(controller.path, controller.router);
    });
  };
}

export default App;
