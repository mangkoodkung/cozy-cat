const extensionName = 'cozy-cat';

// ==========================================
// PART 1: MODEL (ข้อมูลน้องแมว)
// ==========================================

const defaultStats = {
  hunger: 50,
  happiness: 50,
  hygiene: 80,
  energy: 60,
};

let catData = {
  isVisible: true,
  name: 'Mochi',
  age: 1,
  appearance: 'แมวส้ม',
  personality: 'ขี้อ้อน',
  stats: { ...defaultStats },
};

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function resetCatData() {
  catData.name = 'New Cat';
  catData.stats = { ...defaultStats };
  randomizeCat();
  toastr.info('ทำความสะอาดกระบะทรายเรียบร้อย!', 'Meow~');
}

function randomizeCat() {
  const breeds = ['แมวส้ม', 'วิเชียรมาศ', 'เปอร์เซีย', 'สามสี', 'สีดำ', 'สก็อตติช', 'เมนคูน'];
  const traits = ['ขี้อ้อน', 'ขี้เซา', 'ซุกซน', 'หยิ่ง', 'ตะกละ', 'บ้าพลัง'];

  catData.age = getRandomInt(1, 15);
  catData.appearance = breeds[getRandomInt(0, breeds.length - 1)];
  catData.personality = traits[getRandomInt(0, traits.length - 1)];

  catData.stats.hunger = getRandomInt(20, 90);
  catData.stats.happiness = getRandomInt(30, 100);
  catData.stats.hygiene = getRandomInt(40, 100);
  catData.stats.energy = getRandomInt(10, 100);
}

// ==========================================
// PART 2: VIEW (หน้าตาธีมแมว)
// ==========================================

function getOverlayHTML() {
  const catImageUrl = `https://robohash.org/${catData.name}?set=set4&size=80x80`;

  const bar = (icon, color, val) => `
        <div style="margin-bottom: 6px;">
            <div style="display:flex; align-items:center; gap:5px; font-size:0.8em; margin-bottom:2px; color: ${color};">
                <i class="fa-solid ${icon}"></i> 
                <div style="flex:1; background: rgba(255,255,255,0.1); height:6px; border-radius:3px; overflow:hidden;">
                    <div style="width:${val}%; height:100%; background:${color}; border-radius:3px;"></div>
                </div>
            </div>
        </div>
    `;

  // สังเกตว่า Class: cozy-card, cozy-header, cozy-cursor จะไปดึงจาก style.css เองอัตโนมัติ
  return `
        <div id="cozy-cat-overlay-card" class="cozy-card" style="
            position: fixed; 
            top: 50px; left: 50px; 
            width: 200px; 
            z-index: 20000; 
            display: ${catData.isVisible ? 'block' : 'none'};
        ">
            <div id="cozy-cat-header" class="cozy-header cozy-cursor">
                <div style="display:flex; align-items:center; gap:8px; pointer-events: none;">
                    <i class="fa-solid fa-paw" style="font-size: 1.2em;"></i>
                    <span>${catData.name}</span>
                </div>
                <div id="btn-close-overlay" style="cursor:pointer; opacity:0.8;">&times;</div>
            </div>

            <div style="padding: 10px;">
                <div style="display:flex; gap:10px; margin-bottom:10px; align-items:center;">
                    <img src="${catImageUrl}" style="background:#fff; border-radius:50%; width:45px; height:45px; border: 2px solid #ec407a;">
                    <div style="font-size:0.75em; color:#ddd;">
                        <div>พันธุ์: <span style="color:#f48fb1;">${catData.appearance}</span></div>
                        <div>นิสัย: <span style="color:#f48fb1;">${catData.personality}</span></div>
                    </div>
                </div>

                ${bar('fa-fish', '#ffab91', catData.stats.hunger)}     
                ${bar('fa-heart', '#f48fb1', catData.stats.happiness)} 
                ${bar('fa-bed', '#80cbc4', catData.stats.energy)}      

                 <div style="margin-top:12px; display:flex; gap:5px;">
                    <button id="btn-overlay-random" class="cozy-btn" style="flex:1;">
                        <i class="fa-solid fa-wand-magic-sparkles"></i> สุ่ม
                    </button>
                </div>
            </div>
        </div>
    `;
}

function getSettingsPanelHTML() {
  return `
        <div class="cozy-cat-settings">
            <div class="inline-drawer">
                <div class="inline-drawer-toggle inline-drawer-header">
                    <b>🐈 Cozy Cat Settings</b>
                    <div class="inline-drawer-icon fa-solid fa-circle-chevron-down down"></div>
                </div>
                <div class="inline-drawer-content">
                    <div class="styled_description_block">
                        <i class="fa-solid fa-paw"></i> จัดการน้องแมวของคุณ
                    </div>
                    <hr>
                    <div style="display:flex; flex-direction:column; gap:8px;">
                        <button id="btn-toggle-visibility" class="menu_button" style="background-color: #263238;">
                            <i class="fa-solid fa-cat"></i> ซ่อน/แสดง น้องแมว
                        </button>
                        <button id="btn-reset-data" class="menu_button" style="background-color: #d81b60; color: white;">
                            <i class="fa-solid fa-broom"></i> ล้างกระบะทราย (Reset)
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// ==========================================
// PART 3: CONTROLLER
// ==========================================

function makeDraggable(element) {
  let pos1 = 0,
    pos2 = 0,
    pos3 = 0,
    pos4 = 0;
  const header = document.getElementById('cozy-cat-header');

  if (header) {
    header.onmousedown = dragMouseDown;
  }

  function dragMouseDown(e) {
    e = e || window.event;
    e.preventDefault();
    pos3 = e.clientX;
    pos4 = e.clientY;
    document.onmouseup = closeDragElement;
    document.onmousemove = elementDrag;
  }

  function elementDrag(e) {
    e = e || window.event;
    e.preventDefault();
    pos1 = pos3 - e.clientX;
    pos2 = pos4 - e.clientY;
    pos3 = e.clientX;
    pos4 = e.clientY;
    element.style.top = element.offsetTop - pos2 + 'px';
    element.style.left = element.offsetLeft - pos1 + 'px';
  }

  function closeDragElement() {
    document.onmouseup = null;
    document.onmousemove = null;
  }
}

function renderOverlay() {
  $('#cozy-cat-overlay-container').remove();
  $('body').append(`<div id="cozy-cat-overlay-container">${getOverlayHTML()}</div>`);

  const cardElement = document.getElementById('cozy-cat-overlay-card');
  if (cardElement) {
    makeDraggable(cardElement);
  }

  $('#btn-close-overlay').on('click', () => {
    catData.isVisible = false;
    renderOverlay();
  });

  $('#btn-overlay-random').on('click', () => {
    randomizeCat();
    renderOverlay();
  });
}

function loadSettings() {
  // ไม่ต้องเรียก injectCatStyles() แล้ว เพราะ SillyTavern โหลดไฟล์ css ให้เอง
  $('.cozy-cat-settings').remove();
  $('#extensions_settings').append(getSettingsPanelHTML());

  $('#btn-toggle-visibility').on('click', () => {
    catData.isVisible = !catData.isVisible;
    renderOverlay();
    toastr.info(catData.isVisible ? 'Meow! มาแล้วจ้า' : 'ไปนอนก่อนนะ Meow~');
  });

  $('#btn-reset-data').on('click', () => {
    if (confirm('จะล้างข้อมูลน้องแมวใหม่หมดเลยนะ?')) {
      resetCatData();
      renderOverlay();
    }
  });
}

jQuery(async () => {
  loadSettings();
  randomizeCat();
  renderOverlay();
  console.log(`[${extensionName}] 🐈 Ready to Purr.`);
});
