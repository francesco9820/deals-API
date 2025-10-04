import mongoose, { Schema, model } from 'mongoose';

export interface DailyCustomerStatDocument {
  _id: mongoose.Types.ObjectId;
  date: Date;
  customerOrganisationNumber: string;
  totalDeals: number;
  totalPrice: number;
  updatedAt: Date;
}

const DailyCustomerStatSchema = new Schema<DailyCustomerStatDocument>({
  date: { type: Date, required: true, index: true },
  customerOrganisationNumber: { type: String, required: true },
  totalDeals: { type: Number, required: true },
  totalPrice: { type: Number, required: true },
  updatedAt: { type: Date, required: true },
}, {
  collection: 'stats',
  versionKey: false,
});

DailyCustomerStatSchema.index({ date: 1, customerOrganisationNumber: 1 }, { unique: true });

const DailyCustomerStatModel = mongoose.models.DailyCustomerStat || model<DailyCustomerStatDocument>('DailyCustomerStat', DailyCustomerStatSchema);

export default DailyCustomerStatModel;
