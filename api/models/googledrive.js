const { google } = require("googleapis");

const credentials = require("../credentials.json");
const SCOPES = ["https://www.googleapis.com/auth/drive"];
const drive = google.drive("v3");

async function uploadFileToDrive(file) {
  try {
    const auth = await google.auth.getClient({
      credentials,
      scopes: SCOPES,
    });

    const response = await drive.files.create({
      auth,
      resource: {
        name: file.name,
        parents: ["1VZ64UoMSPtXXNF09I-HdyVPyBObrbk8I"],
      },
      media: {
        body: file.stream,
      },
    });

    return response.data.webViewLink;
  } catch (error) {
    console.error("Error uploading file to Google Drive:", error);
    throw error;
  }
}

module.exports = {
  uploadFileToDrive,
};
