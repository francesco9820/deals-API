import { z, ZodError } from 'zod';
import { Request, Response } from 'express';
import DealModel, { DealSchema, DealExpiryUpdateSchema } from 'src/data/deal';
import { registry } from 'src/docs/registry';
import dayjs from 'src/lib/dayjs';

const ParamsSchema = z.object({
  id: z
    .string()
    .regex(/^[a-fA-F0-9]{24}$/, 'Invalid id')
    .openapi({ example: '68dd8ee514f13317db9d0508' }),
});

registry.registerPath({
  method: 'patch',
  path: '/deals/{id}/expiry',
  summary: 'Update the expiry date of a deal.',
  tags: ['Deals'],
  request: {
    params: ParamsSchema,
    body: {
      required: true,
      content: {
        'application/json': { schema: DealExpiryUpdateSchema },
      },
    },
  },
  responses: {
    200: {
      description: 'Updated deal.',
      content: {
        'application/json': { schema: DealSchema },
      },
    },
    400: { description: 'Invalid request.' },
    404: { description: 'Deal not found.' },
  },
});

const updateExpiry = async (req: Request, res: Response) => {
  try {
    const params = ParamsSchema.parse(req.params);
    const body = DealExpiryUpdateSchema.parse(req.body);

    const updated = await DealModel.findOneAndUpdate(
      { _id: params.id },
      { $set: { expiryDate: dayjs(body.expiryDate).toDate() } },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ error: 'Deal not found' });
    }

    const response = {
      ...updated.toObject(),
      _id: updated._id.toString(),
    };

    return res.status(200).json(response);
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({ error: error.message });
    }
    return res.status(500).json({ error: 'Unexpected error' });
  }
};

export default updateExpiry;


