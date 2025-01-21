const { google } = require('googleapis');

// OAuth2 client setup
const oAuth2Client = new google.auth.OAuth2(
  '1012840825507-9tf1veqnd9gcodjh41u6ldh7vvbijh5c.apps.googleusercontent.com', // Your Client ID
  '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', // Your Client Secret
  'http://localhost:3000/oauth2callback' // Redirect URI
);

const SCOPES = ['https://www.googleapis.com/auth/youtube.readonly'];

const auth = async (req, res) => {
  const authorizeUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline', // Get refresh token
    scope: SCOPES,
  });
  res.redirect(authorizeUrl); // Redirect user to Google OAuth consent screen
};

const oauth2callback = async (req, res) => {
  const code = req.query.code;

  if (!code) {
    return res.status(400).send('Authorization code missing');
  }

  try {
    // Exchange authorization code for access token
    const { tokens } = await oAuth2Client.getToken(code);
    oAuth2Client.setCredentials(tokens);

    // Send the access token to the frontend
    console.log('Access Token:', tokens.access_token);
    res.json({ accessToken: tokens.access_token });
  } catch (error) {
    console.error('Error retrieving access token:', error);
    res.status(500).send('Error retrieving access token');
  }
};

module.exports = { oauth2callback, auth };
