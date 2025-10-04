import { describe, beforeEach, afterEach, it, expect } from 'vitest';
import DealModel from 'src/data/deal';
import DailyCustomerStatModel from 'src/data/stats';
import { connectUniqueTestDb, closeAndDropDb } from 'src/test/setup-db-test';
import { computeStatsByCustomer } from 'src/worker/computeStatsByCustomer';

describe('computeStatsByCustomer', () => {
  beforeEach(async () => {
    await connectUniqueTestDb();
  });

  afterEach(async () => {
    await closeAndDropDb();
  });

  it('computes correct totals for each customer for today', async () => {
    const now = new Date();
    const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);

    await DealModel.create([
      {
        sellerId: 's1',
        customerOrganisationNumber: 'CUST-1',
        price: 100,
        creationDate: now,
        expiryDate: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000),
      },
      {
        sellerId: 's2',
        customerOrganisationNumber: 'CUST-1',
        price: 50,
        creationDate: now,
        expiryDate: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000),
      },
      {
        sellerId: 's3',
        customerOrganisationNumber: 'CUST-2',
        price: 200,
        creationDate: now,
        expiryDate: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000),
      },
      {
        sellerId: 's4',
        customerOrganisationNumber: 'CUST-1',
        price: 999,
        creationDate: yesterday,
        expiryDate: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000),
      },
    ]);

    await computeStatsByCustomer();

    const stats = await DailyCustomerStatModel.find().lean();
    const byCustomer = new Map(stats.map(s => [s.customerOrganisationNumber, s]));

    const cust1 = byCustomer.get('CUST-1');
    const cust2 = byCustomer.get('CUST-2');

    expect(cust1?.totalDeals).toBe(2);
    expect(cust1?.totalPrice).toBe(150);
    expect(cust2?.totalDeals).toBe(1);
    expect(cust2?.totalPrice).toBe(200);
  });

  it('upserts once per customer/date when run multiple times', async () => {
    const now = new Date();
    await DealModel.create([
      {
        sellerId: 's1',
        customerOrganisationNumber: 'CUST-3',
        price: 10,
        creationDate: now,
        expiryDate: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000),
      },
      {
        sellerId: 's2',
        customerOrganisationNumber: 'CUST-3',
        price: 20,
        creationDate: now,
        expiryDate: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000),
      },
    ]);

    await computeStatsByCustomer();
    await computeStatsByCustomer();

    const docs = await DailyCustomerStatModel.find({ customerOrganisationNumber: 'CUST-3' });
    expect(docs).toHaveLength(1);
    expect(docs[0].totalDeals).toBe(2);
    expect(docs[0].totalPrice).toBe(30);
  });
});


