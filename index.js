// 1. ตั้งชื่อตัวแปรให้ตรงกับชื่อโฟลเดอร์ Extension ของคุณ (Case-sensitive ตัวเล็กตัวใหญ่ต้องเป๊ะ)
const extensionName = 'cozy cat';

// 2. สร้างตัวแปรชี้เป้าไปยัง ID ที่ SillyTavern เตรียมไว้ให้
const extensionSettingsId = `#extensions_settings_${extensionName}`;

// 3. ฟังก์ชันสร้างหน้าตา UI
function loadSettings() {
  // ล้างค่าเก่าออกก่อน (ป้องกันปุ่มซ้อนกันเวลาโหลดซ้ำ)
  $(extensionSettingsId).empty();

  // สร้าง HTML (สังเกตเครื่องหมาย ` ` ที่ครอบอยู่ เรียกว่า Backticks)
  const settingsHtml = `
        <div class="my-extension-settings">
            <div class="inline-drawer">
                <div class="inline-drawer-toggle inline-drawer-header">
                    <b>My Cool Extension Settings</b>
                    <div class="inline-drawer-icon fa-solid fa-circle-chevron-down down"></div>
                </div>
                
                <div class="inline-drawer-content">
                    <label class="checkbox_label">
                        <input type="checkbox" id="my-feature-toggle">
                        เปิดใช้งานฟีเจอร์ลับ
                    </label>
                    <br>
                    <label>ข้อความทักทาย:</label>
                    <textarea id="my-text-input" class="text_pole" rows="2"></textarea>
                    
                    <hr>
                    <button id="my-save-button" class="menu_button">บันทึกการตั้งค่า</button>
                </div>
            </div>
        </div>
    `;

  // 4. เอา HTML ไปแปะใส่ในกล่องที่ SillyTavern เตรียมไว้
  $(extensionSettingsId).append(settingsHtml);

  // 5. ใส่ลูกเล่นให้ปุ่ม (Event Listeners)
  $('#my-save-button').on('click', () => {
    // ดึงค่าจากช่อง Input
    const isChecked = $('#my-feature-toggle').is(':checked');
    const textValue = $('#my-text-input').val();

    console.log('บันทึกแล้ว!', isChecked, textValue);
    toastr.success('บันทึกการตั้งค่าเรียบร้อย!'); // แจ้งเตือนสวยๆ แบบ SillyTavern

    // ตรงนี้คุณต้องเขียนโค้ดเพื่อเซฟลงตัวแปร หรือ localStorage ต่อไป
  });
}

// 6. สั่งรันเมื่อโหลดเสร็จ
jQuery(async () => {
  loadSettings();
});
