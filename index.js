const extensionName = 'cozy-cat';

// 1. ตั้งค่าพื้นฐาน
const authorConfig = {
  name: 'Popko',
  avatarUrl: '',
};

// 2. ฟังก์ชันสร้างหน้าเมนู
function loadSettings() {
  // ลบของเก่าทิ้งก่อน (ป้องกันเมนูซ้อน)
  $('.cozy-cat-settings').remove();

  // HTML ของหน้าเมนู (โครงสร้างมาตรฐาน SillyTavern)
  const settingsHtml = `
        <div class="cozy-cat-settings">
            <div class="inline-drawer">
                
                <div class="inline-drawer-toggle inline-drawer-header">
                    <b>✨ Cozy Cat ✨</b>
                    <div class="inline-drawer-icon fa-solid fa-circle-chevron-down down"></div>
                </div>

                <div class="inline-drawer-content">
                    
                    <div class="styled_description_block">
                        Extension by ${authorConfig.name} <br>
                        <small>สถานะ: พร้อมทำงาน</small>
                    </div>

                    <hr>
                    
                    <div style="text-align: center; color: #aaa; padding: 20px;">
                        (พื้นที่ว่างสำหรับใส่ปุ่มต่างๆ)
                    </div>

                </div>
            </div>
        </div>
    `;

  // สั่งแปะ HTML ลงไปใน SillyTavern
  $('#extensions_settings').append(settingsHtml);
}

// 3. สั่งรันเมื่อโหลดเสร็จ
jQuery(async () => {
  loadSettings();
  console.log(`[${extensionName}] Panel Loaded.`);
});
