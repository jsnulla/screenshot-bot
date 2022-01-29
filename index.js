const puppeteer = require('puppeteer');
const args = process.argv.slice(2);
const URL = require('url').URL;
const allowedFormats = ['pdf', 'png'];
const resolutions = {
  '420p': {
    width: 720,
    height: 420
  },
  'shd': {
    width: 1024,
    height: 720
  },
  'fhd': {
    width: 1920,
    height: 1080
  },
  'qhd': {
    width: 2560,
    height: 1440
  },
  'uhd': {
    width: 3840,
    height: 2160
  }
};

const main = async () => {
  if (!args[0]) {
    console.error('No URL was specified');
    return;
  }

  const format = args[1] ?? 'png';
  if (!allowedFormats.includes(format)) {
    console.error(`Format is not accepted. Allowed values are: ${allowedFormats.join(' | ')}`);
    return;
  }

  const resolution = args[2] ?? 'shd';
  if (!Object.keys(resolutions).includes(resolution)) {
    console.error(`Resolution is not accepted. Allowed values are: ${Object.keys(resolutions).join(' | ')}`);
    return;
  }

  const imageUrl = new URL(args[0]);
  const fileName = `${imageUrl.host}_${Date.now()}`;
  const browser = await puppeteer.launch({
    headless: true,
    defaultViewport: resolutions[resolution]
  });
  const page = await browser.newPage();
  await page.goto(imageUrl);

  await page.waitForTimeout(3000);
  await generateOutput(page, format, fileName);

  await browser.close();
};

const generateOutput = async (page, format, fileName) => {
  const fileDir = `output/${fileName}.${format}`;
  console.log('Saving to', fileDir);
  const options = {
    path: fileDir,
    scale: 2,
    fullPage: true
  };

  switch (format) {
    case 'pdf':
      await page.pdf(options);
      break;
    default:
      await page.screenshot(options);
  }
};

main();
