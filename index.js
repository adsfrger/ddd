const express = require('express');
const axios = require('axios');
const app = express();

// HTMLフォームの表示
app.get('/', (req, res) => {
  res.send(`
    <form method="GET" action="/go">
      <input name="url" placeholder="URLを入力してね" style="width:300px">
      <button type="submit">表示</button>
    </form>
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
    // そのURLからページを取得
    const response = await axios.get(cleanedUrl);

    // レスポンスのHTMLをそのまま返す
    res.send(`
      <html>
        <head><title>${response.data.match(/<title>(.*?)<\/title>/)[1]}</title></head>
        <body>
          <div style="margin: 0; padding: 0; width: 100%; height: 100vh;">
            ${response.data}
          </div>
        </body>
      </html>
    `);
  } catch (error) {
    res.send('ページの取得に失敗しました。');
  }
});

// サーバーを起動
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Proxy起動中：http://localhost:${PORT}`);
});
