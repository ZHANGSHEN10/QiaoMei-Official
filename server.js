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
    callback(null, true);
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

app.get('/', (req, res) => {
  res.json({ status: 'ok', message: 'API is running' });
});

app.get('/api/test', (req, res) => {
  res.json({ status: 'success', message: 'Backend API is working!' });
});

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
    const { username, password } = req.body;

    const usersRef = db.collection('users');
    const snapshot = await usersRef.where('username', '==', username).get();
    
    if (snapshot.empty) {
      return res.status(400).json({ success: false, error: '帳號或密碼錯誤' });
    }
    
    const userDoc = snapshot.docs[0];
    const userData = userDoc.data();
    const uid = userDoc.id;
    
    await admin.auth().getUser(uid);
    const idToken = await admin.auth().createCustomToken(uid);

    res.json({ 
      success: true, 
      user: {
        uid: uid,
        username: userData.username,
        email: userData.email
      },
      token: idToken
    });
  } catch (error) {
    res.status(400).json({ success: false, error: '帳號或密碼錯誤' });
  }
});

app.post('/api/forgot-password', async (req, res) => {
  try {
    const { username } = req.body;

    const usersRef = db.collection('users');
    const snapshot = await usersRef.where('username', '==', username).get();
    
    if (snapshot.empty) {
      return res.status(400).json({ success: false, error: '找不到此帳號' });
    }
    
    const userDoc = snapshot.docs[0];
    const userData = userDoc.data();
    const email = userData.email;

    const link = await admin.auth().generatePasswordResetLink(email);

    res.json({ success: true, message: '重設連結已發送' });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
