const express = require('express');
const axios = require('axios');
const app = express();
const path = require('path');

// 静的ファイルを提供
app.use(express.static(path.join(__dirname, 'public')));

// HTMLフォームの表示
app.get('/', (req, res) => {
  res.send(`
    <html>
      <head>
        <title>Proxy Browser</title>
        <style>
          body {
            background-color: #121212;
            color: #ffffff;
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
          }
          #container {
            display: flex;
            height: 100vh;
            flex-direction: column;
          }
          #url-bar {
            background-color: #1f1f1f;
            padding: 10px;
            display: flex;
            align-items: center;
          }
          #url-input {
            width: 100%;
            padding: 10px;
            border: none;
            background-color: #333;
            color: #fff;
            font-size: 18px;
          }
          #iframe-container {
            flex-grow: 1;
            display: flex;
            justify-content: center;
            align-items: center;
            padding: 20px;
            background-color: #1a1a1a;
          }
          iframe {
            width: 100%;
            height: 100%;
            border: none;
          }
        </style>
      </head>
      <body>
        <div id="container">
          <div id="url-bar">
            <input type="text" id="url-input" placeholder="Enter a URL (e.g., https://google.com)" />
          </div>
          <div id="iframe-container">
            <iframe id="browser" src=""></iframe>
          </div>
        </div>

        <script>
          const urlInput = document.getElementById('url-input');
          const iframe = document.getElementById('browser');

          urlInput.addEventListener('keydown', function(event) {
            if (event.key === 'Enter') {
              const url = urlInput.value;
              iframe.src = '/go?url=' + encodeURIComponent(url);
            }
          });
        </script>
      </body>
    </html>
  `);
});

// プロキシ経由でページを取得
app.get('/go', async (req, res) => {
  const targetUrl = req.query.url;

  if (!targetUrl) return res.send('URLを入力してください。');

  let cleanedUrl = targetUrl;
  if (!/^https?:\/\//i.test(cleanedUrl)) {
    cleanedUrl = 'https://' + cleanedUrl;
  }

  try {
    // axiosでページを取得
    const response = await axios.get(cleanedUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      },
      maxRedirects: 0, // リダイレクトを追跡しない
      validateStatus: (status) => status < 400, // 400番台はエラーと判定
    });

    // レスポンスのHTMLをそのまま返す
    res.send(response.data);
  } catch (error) {
    res.send('ページの取得に失敗しました。');
  }
});

// サーバーを起動
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Proxy Browser起動中：http://localhost:${PORT}`);
});
