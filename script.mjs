import https from 'https';
import fs from 'fs';
import path from 'path';
import AdmZip from 'adm-zip';

// Define constants
const zipUrl =
  'https://github.com/mozilla/pdf.js/releases/download/v4.10.38/pdfjs-4.10.38-dist.zip'; // URL of the pdf.js pre built ZIP file
const tempFilePath = path.join('file.zip'); // Temporary file path
const outputFolder = path.join('public', 'pdfjs'); // Destination folder

function downloadFile(url, dest) {
  return new Promise((resolve, reject) => {
    https
      .get(url, (response) => {
        if ([301, 302].includes(response.statusCode)) {
          // Handle redirect by making another request to the new location
          const redirectUrl = response.headers.location;
          return downloadFile(redirectUrl, dest).then(resolve).catch(reject);
        }

        if (response.statusCode !== 200) {
          return reject(
            new Error(`Failed to download file: ${response.statusCode}`)
          );
        } 

        // Pipe response data into a file stream
        const file = fs.createWriteStream(dest);
        response.pipe(file);
        file.on('finish', () => {
          file.close(resolve);
        });
      })
      .on('error', (err) => {
        fs.unlink(dest, () => reject(err));
      });
  });
}

function extractZip(source, destination) {
  const zip = new AdmZip(source);

  // Create output directory if it doesn't exist
  if (!fs.existsSync(destination)) {
    fs.mkdirSync(destination, { recursive: true });
  }

  // Extract all contents to the destination folder
  zip.extractAllTo(destination, true);
}

async function main() {
  try {
    console.log('Downloading ZIP file...');
    await downloadFile(zipUrl, tempFilePath);

    console.log('Extracting ZIP file...');
    extractZip(tempFilePath, outputFolder);

    console.log(`Extraction complete. Files saved in: ${outputFolder}`);

    // Clean up: Delete the temporary ZIP file
    fs.unlinkSync(tempFilePath);
    console.log('Temporary file cleaned up.');
    process.exit(1);
  } catch (err) {
    console.error('An error occurred:', err.message);
  }
}

main();
