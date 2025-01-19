const fs = require('fs');
const path = require('path');

const secretPath = path.join(__dirname, 'secret-folder');

readFiles(secretPath);

async function readFiles(pathToFolder) {
  const files = await fs.promises.readdir(pathToFolder, {
    withFileTypes: true,
  });
  if (!files || !files.length) {
    console.log('no files');
    return;
  }

  for (const file of files) {
    if (file.isFile()) {
      const filePath = path.join(secretPath, file.name);
      const fileExtname = path.extname(file.name);
      const fileName = file.name.replace(fileExtname, '');

      try {
        const stats = await fs.promises.stat(filePath);
        const sizeKB = stats.size / 1024;
        console.log(
          `${fileName} - ${fileExtname.slice(1)} - ${sizeKB.toFixed(3)}kb`,
        );
      } catch (error) {
        console.log('error of read file size');
      }
    }
  }
}
