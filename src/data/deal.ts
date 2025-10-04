import { z } from 'zod';
import mongoose, { model, Schema } from 'mongoose';

export const DealRequestSchema = z.object({
    sellerId: z.string().min(1),
    customerOrganisationNumber: z.string().min(1),
    price: z.number(),
    expiryDate: z.coerce.date(),
});

export const DealSchema = z.object({
    _id: z.string().min(1),
    sellerId: z.string().min(1),
    customerOrganisationNumber: z.string().min(1),
    price: z.number(),
    creationDate: z.coerce.date(),
    expiryDate: z.coerce.date(),
});

export const DealExpiryUpdateSchema = z.object({
    expiryDate: z.coerce.date(),
});

export const ArrayOfDealsSchema = z.array(DealSchema);

export type DealRequest = z.infer<typeof DealRequestSchema>;
export type Deal = z.infer<typeof DealSchema>;
export type ArrayOfDeals = z.infer<typeof ArrayOfDealsSchema>;

export interface DealDocument {
    _id: mongoose.Types.ObjectId;
    sellerId: string;
    customerOrganisationNumber: string;
    price: number;
    creationDate: Date;
    expiryDate: Date;
}

const DealMongooseSchema = new Schema<DealDocument>({
    sellerId: { type: String, required: true },
    customerOrganisationNumber: { type: String, required: true },
    price: { type: Number, required: true },
    creationDate: { type: Date, required: true },
    expiryDate: { type: Date, required: true },
}, {
    collection: 'deals',
    versionKey: false,
});

const DealModel = mongoose.models.Deal || model<DealDocument>('Deal', DealMongooseSchema);

export default DealModel;


