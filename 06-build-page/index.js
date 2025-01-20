const path = require('path');
const {
  mkdir,
  readdir,
  readFile,
  writeFile,
  copyFile,
  rm,
} = require('fs/promises');

const projectDistPath = path.join(__dirname, 'project-dist');
const componentsPath = path.join(__dirname, 'components');
const stylesPath = path.join(__dirname, 'styles');
const assetsPath = path.join(__dirname, 'assets');
const templatePath = path.join(__dirname, 'template.html');

(async () => {
  try {
    await clearDirectory(projectDistPath);
    await mkdir(projectDistPath, { recursive: true });

    const components = await loadComponents(componentsPath);

    const templateContent = await readFile(templatePath, 'utf-8');
    const finalHTML = replaceComponents(templateContent, components);
    await writeFile(path.join(projectDistPath, 'index.html'), finalHTML);

    await buildCSSBundle(stylesPath, path.join(projectDistPath, 'style.css'));

    const destAssetsPath = path.join(projectDistPath, 'assets');
    await copyDirectory(assetsPath, destAssetsPath);

    console.log('Project built successfully!');
  } catch (error) {
    console.error('Error during build:', error);
  }
})();

async function loadComponents(folderPath) {
  const components = {};
  const files = await readdir(folderPath, { withFileTypes: true });

  for (const file of files) {
    if (file.isFile() && path.extname(file.name) === '.html') {
      const componentName = path.basename(file.name, '.html');
      const componentContent = await readFile(
        path.join(folderPath, file.name),
        'utf-8',
      );
      components[componentName] = componentContent;
    }
  }

  return components;
}

function replaceComponents(template, components) {
  let result = template;

  for (const [name, content] of Object.entries(components)) {
    const placeholder = `{{${name}}}`;
    result = result.replace(new RegExp(placeholder, 'g'), content);
  }

  return result;
}

async function buildCSSBundle(stylesFolder, outputFilePath) {
  const files = await readdir(stylesFolder, { withFileTypes: true });

  for (const file of files) {
    if (file.isFile() && path.extname(file.name) === '.css') {
      const filePath = path.join(stylesFolder, file.name);
      const cssContent = await readFile(filePath, 'utf-8');
      await writeFile(outputFilePath, cssContent, { flag: 'a' });
    }
  }

  console.log('Styles bundled successfully!');
}

async function copyDirectory(source, destination) {
  await mkdir(destination, { recursive: true });
  const entries = await readdir(source, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(source, entry.name);
    const destPath = path.join(destination, entry.name);

    if (entry.isDirectory()) {
      await copyDirectory(srcPath, destPath);
    } else {
      await copyFile(srcPath, destPath);
    }
  }
}

async function clearDirectory(dirPath) {
  try {
    await rm(dirPath, { recursive: true, force: true });
    console.log(`Directory ${dirPath} cleared successfully.`);
  } catch (err) {
    console.error(`Failed to clear directory ${dirPath}:`, err);
  }
}
