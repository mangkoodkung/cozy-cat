// index.js

import { catData, generateRandomCat, updateCatName } from './cat-model.js';
import { getCatPanelHTML } from './cat-view.js';

const extensionName = 'cozy-cat';

// ฟังก์ชันวาดหน้าจอ (Controller Logic)
function render() {
  // 1. สร้าง HTML จาก View
  const html = getCatPanelHTML(catData);

  // 2. แปะลงไปใน DOM
  $('#cozy-cat-content').html(html);

  // 3. ผูก Event Listeners (Logic การกดปุ่ม)
  $('#cat-name-input').on('input', function () {
    const newName = $(this).val();
    updateCatName(newName);

    // อัปเดตรูปแบบ Real-time
    const newImg = `https://robohash.org/${newName}?set=set4&size=100x100`;
    $('img[src*="robohash"]').attr('src', newImg);
  });

  $('#btn-random-cat').on('click', () => {
    generateRandomCat(); // อัปเดตข้อมูลใน Model
    render(); // วาดหน้าจอใหม่
  });
}

function loadSettings() {
  $('.cozy-cat-settings').remove();

  const settingsHtml = `
        <div class="cozy-cat-settings">
            <div class="inline-drawer">
                <div class="inline-drawer-toggle inline-drawer-header">
                    <b>✨ Cozy Cat ✨</b>
                    <div class="inline-drawer-icon fa-solid fa-circle-chevron-down down"></div>
                </div>
                <div class="inline-drawer-content">
                    <div id="cozy-cat-content"></div>
                </div>
            </div>
        </div>
    `;

  $('#extensions_settings').append(settingsHtml);

  // เริ่มต้นทำงาน
  if (catData.appearance === 'Unknown') {
    generateRandomCat();
  }
  render();
}

jQuery(async () => {
  // หมายเหตุ: SillyTavern บางเวอร์ชันอาจต้องโหลด Module แบบพิเศษ
  // แต่ลองแบบนี้ดูก่อนครับ เป็นมาตรฐาน ES6
  loadSettings();
  console.log(`[${extensionName}] MVC Loaded.`);
});
