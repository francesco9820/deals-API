import { z } from 'zod';
import { registry } from 'src/docs/registry';
import express from "express";
import dealRouter from 'src/api/deal';

const router = express.Router();

registry.registerPath({
  method: 'get',
  path: '/ping',
  summary: 'Healhcheck to make sure the service is up.',
  responses: {
    200: {
      description: 'The service is up and running.',
      content: {
        'text/plain': { schema: z.string() },
      },
    },
  },
  tags: ['Healthcheck'],
});

router.get("/ping", (_req, res) => {
  res.send("pong");
});

router.use('/deals', dealRouter);

export default router;