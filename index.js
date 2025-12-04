// 1. ตั้งค่าชื่อ Extension และ ผู้สร้าง
const extensionName = 'cozy-cat';
const authorName = 'Popko';

// 2. ฟังก์ชันสร้างหน้าต่างตั้งค่า (Settings Panel)
function loadSettings() {
  // ลบ Panel เก่าออกก่อน (ป้องกันการซ้อนทับเวลา Reload)
  $('.cozy-cat-settings').remove();

  // สร้าง HTML ของ Panel
  const settingsHtml = `
        <div class="cozy-cat-settings">
            <div class="inline-drawer">
                
                <div class="inline-drawer-toggle inline-drawer-header">
                    <b>✨ Cozy Cat ✨</b>
                    <div class="inline-drawer-icon fa-solid fa-circle-chevron-down down"></div>
                </div>

                <div class="inline-drawer-content">
                    
                    <div class="styled_description_block">
                        cat cat cat cat<br>
                        <small>Created by ${authorName} (v2.0.0)</small>
                    </div>

                    <hr>

                    <div style="text-align: center; color: #aaa; padding: 10px;">
                        <i>(พื้นที่สำหรับวางปุ่มควบคุมในอนาคต)</i>
                    </div>

                </div>
            </div>
        </div>
    `;

  // นำ HTML ไปแปะใส่ในหน้า Settings ของ SillyTavern
  $('#extensions_settings').append(settingsHtml);
}

// 3. สั่งให้ทำงานเมื่อ SillyTavern โหลดเสร็จ
jQuery(async () => {
  loadSettings();
  console.log(`[${extensionName}] Extension Loaded!`);
});
