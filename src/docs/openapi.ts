import { OpenApiGeneratorV3 } from '@asteasolutions/zod-to-openapi';
import { registry } from 'src/docs/registry';

export function buildOpenApiSpec() {
  const generator = new OpenApiGeneratorV3(registry.definitions);
  const document = generator.generateDocument({
    openapi: '3.0.0',
    info: { title: 'Deals API', version: '1.0.0' },
    tags: [
      { name: 'Healthcheck', description: 'Service healthcheck endpoints' },
      { name: 'Deals', description: 'Deal endpoints' },
    ],
  });

  return document;
}


