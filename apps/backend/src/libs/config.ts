import type { Request, Response, Application, Express } from 'express';

// Define the resource controller interface
interface ResourceController {
  index: (req: Request, res: Response) => void;
  range?: (req: Request, res: Response, a: number, b: number, format?: string) => void;
  show: (req: Request, res: Response) => void;
  destroy: (req: Request, res: Response, id: number) => void;
}

// Extend Express Application
// declare module 'express' {
//   interface Application {
//     resource(path: string, controller: ResourceController): this;
//   }
// }

// Extend Express app type to include resource method
declare global {
  namespace Express {
    interface Application {
      resource: (path: string, controller: ResourceController) => void;
    }
  }
}

// The resource method implementation
export function resource(app: Express | Application, path: string, controller: ResourceController): void {
  // GET /path - index
  app.get(path, controller.index.bind(controller));

  // GET /path/:a..:b{.:format} - range
  app.get(`${path}/:a..:b{.:format}`, (req: Request, res: Response) => {
    const a = parseInt(req.params.a, 10);
    const b = parseInt(req.params.b, 10);
    const format = req.params.format;

    if (controller.range) {
      controller.range(req, res, a, b, format);
    } else {
      res.status(404).json({ error: 'Range not implemented' });
    }
  });

  // GET /path/:id - show
  app.get(`${path}/:id`, controller.show.bind(controller));

  // DELETE /path/:id - destroy
  app.delete(`${path}/:id`, (req: Request, res: Response) => {
    const id = parseInt(req.params.id, 10);
    controller.destroy(req, res, id);
  });
}

// Implement the resource method
Application.prototype.resource = resource;

// Function to add resource routes
export const addResourceRoutes = resource;

// Example User Controller implementation
class UserController implements ResourceController {
  index(req: Request, res: Response): void {
    res.json({ message: 'Users index' });
  }

  range(req: Request, res: Response, a: number, b: number, format?: string): void {
    res.json({ message: `Users range ${a} to ${b}`, format });
  }

  show(req: Request, res: Response): void {
    const id = parseInt(req.params.id, 10);
    res.json({ message: `User ${id}` });
  }

  destroy(req: Request, res: Response, id: number): void {
    res.json({ message: `User ${id} deleted` });
  }
}


// Usage
const app: Express = express();
const userController = new UserController();

app.resource('/users', userController);

addResourceRoutes(app, '/users', userController);