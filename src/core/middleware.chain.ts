import { Middleware, MiddlewareContext } from '@/types';

export class MiddlewareChain {
  private middlewares: Middleware[] = [];

  use(middleware: Middleware): void {
    this.middlewares.push(middleware);
  }

  async execute(context: MiddlewareContext): Promise<void> {
    let index = 0;

    const next = async (): Promise<void> => {
      if (index >= this.middlewares.length) return;
      const middleware = this.middlewares[index++];
      await middleware(context, next);
    };

    await next();
  }

  clear(): void {
    this.middlewares = [];
  }
}

