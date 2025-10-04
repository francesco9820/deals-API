import { Request, Response } from 'express';
import DealModel, { ArrayOfDealsSchema } from 'src/data/deal';
import z from 'zod';
import { registry } from 'src/docs/registry';

registry.registerPath({
    method: 'get',
    path: '/deals',
    summary: 'List deals',
    tags: ['Deals'],
    responses: {
      200: {
        description: 'Returns all deals sorted by creation date desc.',
        content: {
          'application/json': { schema: ArrayOfDealsSchema },
        },
      },
      400: { 
        description: 'Invalid request.',
        content: {
          'application/json': { schema: z.object({ error: z.string() }) },
        },
      },
      404: { description: 'Not found.' },
    },
});

const list = async (_req: Request, res: Response) => {
  const docs = await DealModel.find().sort({ creationDate: -1 });
  const dealsArray = docs.map(d => ({
    ...d.toObject(),
    _id: d._id.toString(),
  }));

  res.status(200).json(dealsArray);
};

export default list;


