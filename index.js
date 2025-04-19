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
            <iframe src="https://www.google.com" style="width:100%; height:80vh;"></iframe>
          </div>
          <div id="tab2" class="tab-content" style="display:none;">
            <iframe src="https://www.yahoo.co.jp" style="width:100%; height:80vh;"></iframe>
          </div>
          <div id="tab3" class="tab-content" style="display:none;">
            <iframe src="https://github.com" style="width:100%; height:80vh;"></iframe>
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

// サーバーを起動
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Proxy起動中：http://localhost:${PORT}`);
});
