const express = require('express');
const axios = require('axios');
const app = express();

// HTMLフォームの表示
app.get('/', (req, res) => {
  res.send(`
    <html>
      <head><title>Multi Tab Browser</title></head>
      <body>
        <h1>Multi Tab Browser</h1>
        <div>
          <ul id="tabs">
            <li class="tab" data-tab="tab1">Google</li>
            <li class="tab" data-tab="tab2">Yahoo</li>
            <li class="tab" data-tab="tab3">GitHub</li>
          </ul>
          <div id="tab1" class="tab-content">
            <iframe src="/go?url=https://www.google.com" style="width:100%; height:80vh;"></iframe>
          </div>
          <div id="tab2" class="tab-content" style="display:none;">
            <iframe src="/go?url=https://www.yahoo.co.jp" style="width:100%; height:80vh;"></iframe>
          </div>
          <div id="tab3" class="tab-content" style="display:none;">
            <iframe src="/go?url=https://github.com" style="width:100%; height:80vh;"></iframe>
          </div>
        </div>
      </body>
      <script>
        const tabs = document.querySelectorAll('.tab');
        const tabContents = document.querySelectorAll('.tab-content');

        tabs.forEach(tab => {
          tab.addEventListener('click', () => {
            const targetTab = tab.getAttribute('data-tab');
            
            tabContents.forEach(content => {
              if(content.id === targetTab) {
                content.style.display = 'block';
              } else {
                content.style.display = 'none';
              }
            });
          });
        });
      </script>
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
    // axiosでリダイレクトを無視する設定を追加
    const response = await axios.get(cleanedUrl, {
      maxRedirects: 0, // リダイレクトを追跡しない
      validateStatus: (status) => status < 400, // 400番台はエラーと判定
    });

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
