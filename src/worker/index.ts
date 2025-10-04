import { connectMongo } from "src/data/mongo";
import { disconnectMongo } from "src/data/mongo";
import { computeStatsByCustomer } from "src/worker/computeStatsByCustomer";

const mapWorkerNameToFunction: Record<string, Function> = {
    [computeStatsByCustomer.name]: computeStatsByCustomer,
}

async function main() {
    const workerName = process.argv[2];
    const workerFunction = mapWorkerNameToFunction[workerName];
    if (!workerFunction) {
        console.error(`Worker ${workerName} not found`);
        process.exit(1);
    }
    try {
        await connectMongo();
    } catch (error) {
        console.error('Failed to connect to MongoDB:', (error as Error).message);
        process.exit(1);
    }

    try {
        await workerFunction();
    } finally {
        await disconnectMongo().catch(() => {});
    }
}

main();
