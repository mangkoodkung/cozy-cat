const extensionName = 'cozy cat';

// 1. ตั้งค่าพื้นฐาน (อัปเดตชื่อผู้สร้าง)
const authorConfig = {
  name: 'Popko',
  avatarUrl: '', // ถ้ามีลิงก์รูปใส่ตรงนี้ได้ครับ
};

// 2. ฟังก์ชันสร้างหน้าเมนู
function loadSettings() {
  // ลบของเก่าทิ้งก่อน (ป้องกันเมนูซ้อน)
  $('.cozy-cat-settings').remove();

  // HTML ของหน้าเมนู
  const settingsHtml = `
        <div class="cozy-cat-settings">
            <div class="inline-drawer">
                <div class="inline-drawer-toggle inline-drawer-header">
                    <b>✨ Cozy Cat ✨ (Test Mode)</b>
                    <div class="inline-drawer-icon fa-solid fa-circle-chevron-down down"></div>
                </div>

                <div class="inline-drawer-content">
                    <div class="styled_description_block">
                        Extension by ${authorConfig.name} <br>
                        <small>สถานะ: ทดสอบ UI</small>
                    </div>
                    
                    <div style="display:flex; gap:5px; margin-top:10px;">
                        
                        <div id="test-btn-auto" class="menu_button" style="flex:1; background-color: #ffb7b2; color: #5d4037;">
                            <i class="fa-solid fa-paw"></i> Meow Auto
                        </div>

                        <div id="test-btn-editor" class="menu_button" style="flex:1;">
                            <i class="fa-solid fa-pen-nib"></i> Editor
                        </div>

                        <div id="test-btn-split" class="menu_button" style="flex:1;">
                            <i class="fa-solid fa-scissors"></i> Split
                        </div>

                    </div>
                </div>
            </div>
        </div>
    `;

  // สั่งแปะ HTML ลงไปใน SillyTavern
  $('#extensions_settings').append(settingsHtml);

  // --- โซนทดสอบปุ่ม ---

  $('#test-btn-auto').on('click', () => {
    toastr.success('Meow! ปุ่ม Auto ทำงานแล้ว', 'Popko Says:');
    console.log('Auto Clicked');
  });

  $('#test-btn-editor').on('click', () => {
    toastr.info('เปิดหน้า Editor...', 'Popko Says:');
    console.log('Editor Clicked');
  });

  $('#test-btn-split').on('click', () => {
    toastr.warning('เปิดโหมดตัดแบ่ง...', 'Popko Says:');
    console.log('Split Clicked');
  });
}

// 3. สั่งรันเมื่อ SillyTavern โหลดเสร็จ
jQuery(async () => {
  loadSettings();
  console.log(`[${extensionName}] by ${authorConfig.name} is Ready.`);
});
