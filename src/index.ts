export * from '@loopback/rest';
export * from './application';
export * from './models';
export * from './repositories';

import { ApplicationConfig, TodoListApplication } from './application';

export async function main(options: ApplicationConfig = {}) {
  const app = new TodoListApplication(options);
  await app.boot();
  await app.start();

  const url = app.restServer.url;
  console.log(`Server is running at ${url}`);
  return app;
}

if (require.main === module) {
  const port = process.env.PORT ?? 4000;
  // Run the application
  const config = {
    rest: {
      port,
      host: process.env.HOST ?? 'localhost',
      openApiSpec: {
        // useful when used with OpenAPI-to-GraphQL to locate your application
        setServersFromRequest: true,
      },
    },
  };
  main(config).catch(err => {
    console.error('Cannot start the application.', err);
    process.exit(1);
  });
}
