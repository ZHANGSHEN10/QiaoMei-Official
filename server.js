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
  const html = `
<!DOCTYPE html>
<html lang="zh-TW">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>喬美卡巴拉島 - API 文件</title>
    <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+TC:wght@400;500;700;900&display=swap" rel="stylesheet">
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: 'Noto Sans TC', sans-serif;
            background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
            color: #f8fafc;
            min-height: 100vh;
            padding: 40px 20px;
        }
        .container { max-width: 900px; margin: 0 auto; }
        .header { text-align: center; margin-bottom: 50px; }
        .logo { font-size: 48px; margin-bottom: 20px; }
        h1 { font-size: 36px; font-weight: 900; margin-bottom: 10px; }
        h1 span { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        .subtitle { color: #94a3b8; font-size: 18px; }
        .status-badge {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            background: rgba(16, 185, 129, 0.2);
            color: #10b981;
            padding: 8px 20px;
            border-radius: 50px;
            margin-top: 20px;
            font-weight: 600;
        }
        .status-badge::before {
            content: '';
            width: 10px;
            height: 10px;
            background: #10b981;
            border-radius: 50%;
            animation: pulse 2s infinite;
        }
        @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.5; }
        }
        .section { margin-bottom: 40px; }
        .section-title {
            font-size: 24px;
            font-weight: 700;
            margin-bottom: 20px;
            display: flex;
            align-items: center;
            gap: 10px;
        }
        .section-title i { color: #818cf8; }
        .endpoint {
            background: rgba(30, 41, 59, 0.8);
            border-radius: 16px;
            padding: 25px;
            margin-bottom: 20px;
            border: 1px solid rgba(255,255,255,0.1);
        }
        .endpoint-header {
            display: flex;
            align-items: center;
            gap: 15px;
            margin-bottom: 15px;
        }
        .method {
            padding: 6px 16px;
            border-radius: 8px;
            font-weight: 700;
            font-size: 14px;
        }
        .method.post { background: rgba(16, 185, 129, 0.2); color: #10b981; }
        .method.get { background: rgba(99, 102, 241, 0.2); color: #818cf8; }
        .endpoint-path { font-family: monospace; font-size: 18px; color: #e2e8f0; }
        .endpoint-desc { color: #94a3b8; margin-bottom: 15px; }
        .params { background: rgba(15, 23, 42, 0.5); border-radius: 12px; padding: 15px; }
        .param-title { color: #818cf8; font-weight: 600; margin-bottom: 10px; font-size: 14px; }
        .param { display: flex; gap: 10px; margin-bottom: 8px; font-size: 14px; }
        .param-name { color: #f59e0b; font-family: monospace; min-width: 100px; }
        .param-type { color: #94a3b8; }
        .param-desc { color: #64748b; }
        .response { background: rgba(15, 23, 42, 0.5); border-radius: 12px; padding: 15px; margin-top: 15px; }
        .response-title { color: #10b981; font-weight: 600; margin-bottom: 10px; font-size: 14px; }
        pre { 
            background: rgba(15, 23, 42, 0.8);
            padding: 15px;
            border-radius: 8px;
            overflow-x: auto;
            font-size: 13px;
            color: #a5b4fc;
        }
        .footer { text-align: center; margin-top: 60px; color: #64748b; font-size: 14px; }
        @media (max-width: 600px) {
            h1 { font-size: 28px; }
            .endpoint { padding: 20px; }
            .endpoint-header { flex-direction: column; align-items: flex-start; gap: 8px; }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo">✦</div>
            <h1><span>喬美卡巴拉島</span> API</h1>
            <p class="subtitle">遊戲官方網站後端服務</p>
            <div class="status-badge">服務正常運行中</div>
        </div>

        <div class="section">
            <h2 class="section-title"><i class="fas fa-rocket"></i> 快速開始</h2>
            <div class="endpoint">
                <div class="endpoint-header">
                    <span class="method get">GET</span>
                    <span class="endpoint-path">/api/test</span>
                </div>
                <p class="endpoint-desc">測試 API 是否正常運作</p>
                <div class="response">
                    <div class="response-title">回應範例</div>
                    <pre>${'{'} "status": "success", "message": "Backend API is working!" }</pre>
                </div>
            </div>
        </div>

        <div class="section">
            <h2 class="section-title"><i class="fas fa-user-plus"></i> 會員註冊</h2>
            <div class="endpoint">
                <div class="endpoint-header">
                    <span class="method post">POST</span>
                    <span class="endpoint-path">/api/register</span>
                </div>
                <p class="endpoint-desc">建立新會員帳號</p>
                <div class="params">
                    <div class="param-title">請求參數 (JSON)</div>
                    <div class="param">
                        <span class="param-name">username</span>
                        <span class="param-type">string</span>
                        <span class="param-desc">會員帳號 (3-20字元)</span>
                    </div>
                    <div class="param">
                        <span class="param-name">email</span>
                        <span class="param-type">string</span>
                        <span class="param-desc">電子郵件地址</span>
                    </div>
                    <div class="param">
                        <span class="param-name">password</span>
                        <span class="param-type">string</span>
                        <span class="param-desc">密碼 (至少6字元)</span>
                    </div>
                </div>
                <div class="response">
                    <div class="response-title">成功回應</div>
                    <pre>${'{'} "success": true, "uid": "abc123..." }</pre>
                </div>
            </div>
        </div>

        <div class="section">
            <h2 class="section-title"><i class="fas fa-sign-in-alt"></i> 會員登入</h2>
            <div class="endpoint">
                <div class="endpoint-header">
                    <span class="method post">POST</span>
                    <span class="endpoint-path">/api/login</span>
                </div>
                <p class="endpoint-desc">驗證會員帳號密碼</p>
                <div class="params">
                    <div class="param-title">請求參數 (JSON)</div>
                    <div class="param">
                        <span class="param-name">username</span>
                        <span class="param-type">string</span>
                        <span class="param-desc">會員帳號</span>
                    </div>
                    <div class="param">
                        <span class="param-name">password</span>
                        <span class="param-type">string</span>
                        <span class="param-desc">會員密碼</span>
                    </div>
                </div>
                <div class="response">
                    <div class="response-title">成功回應</div>
                    <pre>${'{'} "success": true, "user": {...}, "token": "..." }</pre>
                </div>
            </div>
        </div>

        <div class="section">
            <h2 class="section-title"><i class="fas fa-key"></i> 忘記密碼</h2>
            <div class="endpoint">
                <div class="endpoint-header">
                    <span class="method post">POST</span>
                    <span class="endpoint-path">/api/forgot-password</span>
                </div>
                <p class="endpoint-desc">寄送密碼重設連結到會員信箱</p>
                <div class="params">
                    <div class="param-title">請求參數 (JSON)</div>
                    <div class="param">
                        <span class="param-name">username</span>
                        <span class="param-type">string</span>
                        <span class="param-desc">會員帳號</span>
                    </div>
                </div>
                <div class="response">
                    <div class="response-title">成功回應</div>
                    <pre>${'{'} "success": true, "message": "重設連結已發送" }</pre>
                </div>
            </div>
        </div>

        <div class="footer">
            <p>© 2026 喬美卡巴拉島. All Rights Reserved.</p>
        </div>
    </div>
</body>
</html>
  `;
  res.type('html').send(html);
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

const https = require('https');

const FIREBASE_WEB_API_KEY = 'AIzaSyB-tmjRpFHD9aCCUKUoRJNSI_-mS7WEdtg';

function verifyPassword(email, password) {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify({
      email: email,
      password: password,
      returnSecureToken: true
    });

    const options = {
      hostname: 'www.googleapis.com',
      port: 443,
      path: `/identitytoolkit/v3/relyingparty/verifyPassword?key=${FIREBASE_WEB_API_KEY}`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try {
          const result = JSON.parse(data);
          if (result.idToken) {
            resolve(result);
          } else {
            reject(new Error(result.error?.message || '密碼錯誤'));
          }
        } catch (e) {
          reject(e);
        }
      });
    });

    req.on('error', reject);
    req.write(postData);
    req.end();
  });
}

app.post('/api/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ success: false, error: '請輸入帳號和密碼' });
    }

    const usersRef = db.collection('users');
    const snapshot = await usersRef.where('username', '==', username).get();
    
    if (snapshot.empty) {
      return res.status(400).json({ success: false, error: '帳號不存在' });
    }
    
    const userDoc = snapshot.docs[0];
    const userData = userDoc.data();
    const email = userData.email;
    
    await verifyPassword(email, password);
    
    const userRecord = await admin.auth().getUserByEmail(email);
    const idToken = await admin.auth().createCustomToken(userRecord.uid);

    res.json({ 
      success: true, 
      user: {
        uid: userRecord.uid,
        username: userData.username,
        email: email
      },
      token: idToken
    });
  } catch (error) {
    console.error('Login error:', error.message);
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
