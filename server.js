const express = require('express');
const cors = require('cors');
const admin = require('firebase-admin');

const allowedOrigins = [
  'http://localhost:3000',
  'https://qiaomei.netlify.app'
];

const app = express();
app.use(cors({
  origin: function(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(null, true);
    }
  },
  credentials: true
}));
app.use(express.json());

const serviceAccount = {
  type: 'service_account',
  project_id: process.env.FIREBASE_PROJECT_ID,
  private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
  private_key: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  client_email: process.env.FIREBASE_CLIENT_EMAIL,
  client_id: process.env.FIREBASE_CLIENT_ID,
  auth_uri: process.env.FIREBASE_AUTH_URI,
  token_uri: process.env.FIREBASE_TOKEN_URI,
  auth_provider_x509_cert_url: process.env.FIREBASE_AUTH_PROVIDER_X509_CERT_URL,
  client_x509_cert_url: process.env.FIREBASE_CLIENT_X509_CERT_URL
};

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

app.post('/api/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const userRecord = await admin.auth().createUser({
      email,
      password,
      displayName: username
    });

    await db.collection('users').doc(userRecord.uid).set({
      username,
      email,
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    });

    res.status(201).json({ success: true, uid: userRecord.uid });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const userRecord = await admin.auth().getUserByEmail(email);
    const idToken = await admin.auth().createCustomToken(userRecord.uid);

    const userDoc = await db.collection('users').doc(userRecord.uid).get();
    const userData = userDoc.data();

    res.json({ 
      success: true, 
      user: {
        uid: userRecord.uid,
        username: userData?.username,
        email: userRecord.email
      },
      token: idToken
    });
  } catch (error) {
    res.status(400).json({ success: false, error: '電子郵件或密碼錯誤' });
  }
});

app.post('/api/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;

    await admin.auth().generatePasswordResetLink(email);

    res.json({ success: true, message: '重設連結已發送' });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
