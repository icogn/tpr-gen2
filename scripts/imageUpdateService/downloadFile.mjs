import Downloader from 'nodejs-file-downloader';

async function downloadFile(url, outputDir) {
  const downloader = new Downloader({
    url, // If the file name already exists, a new file with the name 200MB1.zip is created.
    directory: outputDir, // This folder will be created, if it doesn't exist.
  });

  try {
    const result = await downloader.download(); //Downloader.download() resolves with some useful properties.

    console.log('All done');
    return result;
  } catch (error) {
    // IMPORTANT: Handle a possible error. An error is thrown in case of network errors, or status codes of 400 and above.
    // Note that if the maxAttempts is set to higher than 1, the error is thrown only if all attempts fail.
    console.log('Download failed', error);
    throw error;
  }
}

export default downloadFile;
