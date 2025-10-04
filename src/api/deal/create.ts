import { ZodError } from 'zod';
import { Request, Response } from 'express';
import DealModel, { DealRequestSchema, DealSchema, Deal, DealRequest } from 'src/data/deal';
import { registry } from 'src/docs/registry';
import dayjs from 'src/lib/dayjs';

registry.registerPath({
    method: 'post',
    path: '/deals',
    summary: 'Create a new deal.',
    tags: ['Deals'],
    request: {
        body: {
            required: true,
            content: {
                'application/json': { schema: DealRequestSchema },
            },
        },
    },
    responses: {
        201: {
            description: 'Deal created.',
            content: {
                'application/json': { schema: DealSchema },
            },
        },
        400: { description: 'Invalid request body.' },
    },
});

const create = async (req: Request, res: Response) => {
    try {
        const validatedData: DealRequest = DealRequestSchema.parse(req.body);

        console.log(dayjs().toDate());

        const newDeal = await DealModel.create({
            ...validatedData,
            creationDate: dayjs().toDate(),
            expiryDate: dayjs(validatedData.expiryDate).toDate(),
        });

        res.status(201).json({
            ...newDeal.toObject(),
            _id: newDeal._id.toString(),
        });
    } catch (error) {
        if (error instanceof ZodError) {
            res.status(400).json({ error: error.message });
        } else {
            console.error(error);
            res.status(500).json({ error: 'Unexpected error' });
        }
    }
};

export default create;


