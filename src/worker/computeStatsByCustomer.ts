import DealModel from 'src/data/deal';
import DailyCustomerStatModel from 'src/data/stats';
import { connectMongo, disconnectMongo } from 'src/data/mongo';
import dayjs from 'src/lib/dayjs';

export type CustomerStats = {
  customerOrganisationNumber: string;
  totalDeals: number;
  averagePrice: number;
};

export async function computeStatsByCustomer() {
  console.log('Computing stats by customer...');

  const start = dayjs().startOf('day').toDate();
  const end = dayjs().endOf('day').toDate();

  const dealsPerCustomer = await DealModel.aggregate([
    {
      $match: {
        $expr: {
          $and: [
            { $gte: [{ $toDate: '$creationDate' }, start] },
            { $lte: [{ $toDate: '$creationDate' }, end] },
          ],
        },
      },
    },
    {
      $group: {
        _id: '$customerOrganisationNumber',
        totalDeals: { $sum: 1 },
        totalPrice: { $sum: '$price' },
      },
    },
  ]);

  for (const row of dealsPerCustomer) {
    await DailyCustomerStatModel.updateOne(
      { date: dayjs(start).toDate(), customerOrganisationNumber: row._id },
      {
        $set: {
          totalDeals: row.totalDeals,
          totalPrice: row.totalPrice,
          updatedAt: dayjs().toDate(),
        },
      },
      { upsert: true }
    );
  }

  console.log('Finished computing stats by customer.');
}
