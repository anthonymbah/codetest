require('dotenv').config();
const importData = require('./import-data');
const { Contract, Track } = require('./models');
const { connect, disconnect } = require('../mongo-db/mongo-db');
const filePath = process.env.FILE_PATH;
const contractName = "Contract 1";

describe('importData', () => {
  beforeAll(async () => {
    await connect();
  });

  afterAll(async () => {
    await Contract.deleteMany();
    await disconnect();
  });

  beforeEach(async () => {
    await Track.deleteMany();
  });

  it('should import valid data', async () => {
    const errors = await importData(filePath);

    expect(errors).toHaveLength(1);

    const tracks = await Track.find();
    expect(tracks).toHaveLength(2);
    const contract = await Contract.findOne({ name: contractName });

    const [track1, track2] = tracks;
    expect(track1).toMatchObject({
      title: 'Track 1',
      version: 'Version 1',
      artist: 'Artist 1',
      isrc: 'ISRC1',
      pLine: 'P Line 1',
      aliases: ["aliases1", "aliases2"],
    })
    expect(track1.contractId.toString()).toBe(contract._id.toString());

    expect(track2).toMatchObject({
      title: 'Track 2',
      version: 'Version 2',
      artist: 'Artist 2',
      isrc: 'ISRC2',
      pLine: 'P Line 2',
      aliases: ["aliases11", "aliases22"],
      contractId: "",
    })
  });

  it('should handle validation errors', async () => {
    await expect(importData(filePath)).resolves.toEqual(['Line 2: Track validation failed: title: Path `title` is required.']);
  });
});
