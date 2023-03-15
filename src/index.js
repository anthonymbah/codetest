require('dotenv').config();
const { connect, disconnect } = require('./mongo-db/mongo-db');
const importData = require('./import-data/import-data');

const runCodingTest = async () => {
    await connect();
    const errors = await importData(process.env.FILE_PATH);
    console.error(...errors);
    await disconnect();
};

runCodingTest();