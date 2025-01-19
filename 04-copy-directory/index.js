const path = require('path');
const { copyFile, mkdir, readdir, unlink, rm } = require('fs/promises');

const copyPath = path.join(__dirname, 'files-copy');
const mainFolderPath = path.join(__dirname, 'files');

copyDir();

async function copyDir() {
  try {
    await mkdir(copyPath, { recursive: true });

    await clearDirectory(copyPath);

    const files = await readdir(mainFolderPath, { withFileTypes: true });

    if (!files || !files.length) {
      console.log('No files to copy');
      return;
    }

    for (const file of files) {
      if (file.isFile()) {
        const srcPath = path.join(mainFolderPath, file.name);
        const destPath = path.join(copyPath, file.name);
        await copyFile(srcPath, destPath);
      }
    }

    console.log('Files copied successfully!');
  } catch (err) {
    console.error('Error during copying:', err.message);
  }
}
async function clearDirectory(folderPath) {
  try {
    const files = await readdir(folderPath, {
      withFileTypes: true,
    });

    for (const file of files) {
      const filePath = path.join(folderPath, file.name);

      if (file.isFile()) {
        await unlink(filePath);
      } else if (file.isDirectory()) {
        await rm(filePath, { recursive: true, force: true });
      }
    }
  } catch (err) {
    console.error('Error clearing directory:', err.message);
  }
}
