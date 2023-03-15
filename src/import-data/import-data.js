const xlsx = require('xlsx');
const { Contract, Track } = require('./models');

async function importData(filePath) {

  //seed the database with one contract
  const contractName = "Contract 1";
  let contract = await Contract.findOne({ name: contractName });
  if (!(contract instanceof Contract)) {
    contract = new Contract({ name: 'Contract 1' });
    await contract.save();
  }

  //Load the workbook and select the first sheet
  //assumption: only one sheet in worksheet
  const workbook = xlsx.readFile(filePath);
  const sheetNames = workbook.SheetNames;
  const sheet = workbook.Sheets[sheetNames[0]];
  const errors = [];
  const rows = xlsx.utils.sheet_to_json(sheet);
  for (let rowNum = 0; rowNum < rows.length; rowNum++) {
    const row = rows[rowNum];
    const {
      Contract: contractName,
      Aliases: rawAliases = "",
      Title: title,
      Version: version,
      Artist: artist,
      ISRC: isrc,
      "P Line": pLine,
    } = row;

    const aliases = rawAliases.replace(/\s/g, "").split(";");

    const contract = await Contract.findOne({ name: contractName });
    const contractId = contract instanceof Contract ? contract._id : "";
    let track = await Track.findOne({ title, contractId });

    if (track instanceof Track) {
      errors.push(`Line ${rowNum + 2}: Track with title "${title}" already exists`);
      continue;
    }

    track = new Track({
      title,
      version,
      artist,
      isrc,
      pLine,
      aliases,
      contractId,
    });

    try {
      await track.save();
    } catch (error) {
      errors.push(`Line ${rowNum + 2}: ${error.message}`);
    }
  }

  return errors;
}

module.exports = importData;
