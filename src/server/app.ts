import express, { NextFunction, Request, Response } from 'express';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import * as OpenApiValidator from 'express-openapi-validator';
import api_endpoints from 'src/api';
import { buildOpenApiSpec } from 'src/docs/openapi';

const app = express();

app.use(cors());
app.use(express.json());

const openApiDocument = buildOpenApiSpec();

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(openApiDocument));

app.use(
  OpenApiValidator.middleware({
    apiSpec: openApiDocument as any,
    validateRequests: true,
    validateResponses: true,
  })
);

app.use('/', api_endpoints);

app.use((_req: Request, res: Response) => {
  res.status(404).json({ error: '404 Not Found' });
});

app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error(err.stack);
  
  if ('status' in err && typeof err.status === 'number') {
    return res.status(err.status).json({
      error: err.message
    });
  }

  res.status(500).json({ error: 'Internal Server Error' });
});

export default app;