import fs from 'fs';
import path from 'path';

const writeBlockchainToFile = (fileName, blockchainData) => {
  const filePath = path.join(__appdir, fileName);

  // Write blockchain data to the JSON file
  fs.writeFile(filePath, JSON.stringify(blockchainData, null, 2), (err) => {
    if (err) {
      console.error('Failed to write blockchain data to file:', err);
    } else {
      console.log('Blockchain data successfully written to file.');
    }
  });
};

export default writeBlockchainToFile;
