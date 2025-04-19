const express = require('express');
const proxy = require('express-http-proxy');
const app = express();

// ホームページ（フォーム）
app.get('/', (req, res) => {
  res.send(`
    <form method="GET" action="/go">
      <input name="url" placeholder="URLを入力してね" style="width:300px">
      <button type="submit">開く</button>
    </form>
  `);
});

// プロキシ経由でページを表示
app.use('/go', (req, res, next) => {
  const target = req.query.url;
  if (!target) return res.send('URLを入力してください。');

  let cleanedUrl = target;
  if (!/^https?:\/\//i.test(cleanedUrl)) {
    cleanedUrl = 'https://' + cleanedUrl;
  }

  // クエリを次のミドルウェアに渡すために、req.urlを上書き
  req.url = '/';
  proxy(cleanedUrl)(req, res, next);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Proxy起動中：http://localhost:${PORT}`);
});
