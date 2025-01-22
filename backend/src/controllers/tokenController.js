const { google } = require('googleapis');

// OAuth2 client setup
const oAuth2Client = new google.auth.OAuth2(
  process.env.Client_ID,
  process.env.CLEINT_SECRET,
  'http://localhost:3000/oauth2callback' 
);

const SCOPES = ['https://www.googleapis.com/auth/youtube.readonly'];

const auth = async (req, res) => {
  const authorizeUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline', 
    scope: SCOPES,
  });
  res.redirect(authorizeUrl); 
};

const oauth2callback = async (req, res) => {
  const code = req.query.code;

  if (!code) {
    return res.status(400).send('Authorization code missing');
  }

  try {
    const { tokens } = await oAuth2Client.getToken(code);
    oAuth2Client.setCredentials(tokens);

    console.log('Access Token:', tokens.access_token);
    res.json({ accessToken: tokens.access_token });

  } catch (error) {
    console.error('Error retrieving access token:', error);
    res.status(500).send('Error retrieving access token');
  }
};

module.exports = { oauth2callback, auth };
