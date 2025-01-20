const path = require('path');
const { readdir, readFile, writeFile, unlink } = require('fs/promises');

readStyles();
async function readStyles() {
  const stylesFolderPath = path.join(__dirname, 'styles');
  const stylesOutputFolder = path.join(__dirname, 'project-dist');
  const bundlePath = path.join(stylesOutputFolder, 'bundle.css');

  try {
    await removeBundle(bundlePath);

    const files = await readdir(stylesFolderPath, { withFileTypes: true });
    for (const file of files) {
      const filePath = path.join(stylesFolderPath, file.name);
      if (file.isFile() && path.extname(filePath) === '.css') {
        const data = await readFile(filePath, { encoding: 'utf-8' });
        const outputFilePath = path.join(stylesOutputFolder, 'bundle.css');
        await writeFile(outputFilePath, data, { flag: 'a' });
      }
    }
  } catch (error) {
    console.log(error);
    return new Error('no files in folder');
  }
}

async function removeBundle(filePath) {
  try {
    await unlink(filePath);
    console.log('old bundle removed');
  } catch (error) {
    if (error.code !== 'ENOENT') {
      console.error('Error removing bundle.css:', error.message);
    }
  }
}
