const extensionName = 'cozy-cat';

// ==========================================
// PART 1: MODEL & STATE
// ==========================================

const catBreeds = [
  { id: 'orange', name: 'แมวส้ม', icon: '🐱' },
  { id: 'siamese', name: 'วิเชียรมาศ', icon: '💎' },
  { id: 'persian', name: 'เปอร์เซีย', icon: '🦁' },
  { id: 'black', name: 'แมวดำ', icon: '🐈‍⬛' },
  { id: 'calico', name: 'สามสี', icon: '🎨' },
  { id: 'scottish', name: 'สก็อตติช', icon: '👂' },
];

const defaultStats = {
  hunger: 50,
  happiness: 50,
  hygiene: 80,
  energy: 60,
};

// State หลักของระบบ
let appState = {
  isVisible: true,
  scene: 'name', // name, breed, main
  position: { top: 100, left: 100 }, // จำตำแหน่ง (Default)
  history: [], // เก็บ Log แมวตัวเก่า

  // ข้อมูลแมวปัจจุบัน
  currentCat: {
    name: '',
    breed: null, // object จาก catBreeds
    age: 1,
    personality: 'Unknown',
    health: 'แข็งแรง',
    stats: { ...defaultStats },
  },

  // Temp data สำหรับหน้าเลือก
  tempBreedSelection: null,
};

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generatePersonality() {
  const traits = ['ขี้อ้อน', 'ขี้เซา', 'ซุกซน', 'หยิ่ง', 'ตะกละ', 'บ้าพลัง', 'โลกส่วนตัวสูง'];
  return traits[getRandomInt(0, traits.length - 1)];
}

// ฟังก์ชันจบการเลี้ยง (ส่งเข้า Log แล้วเริ่มใหม่)
function retireCurrentCat() {
  if (appState.currentCat.name) {
    appState.history.push({ ...appState.currentCat, date: new Date().toLocaleDateString() });
  }

  // Reset State
  appState.scene = 'name';
  appState.currentCat = {
    name: '',
    breed: null,
    age: 1,
    personality: 'Unknown',
    health: 'แข็งแรง',
    stats: { ...defaultStats },
  };
  appState.tempBreedSelection = null;

  renderOverlay();
  renderSettingsPanel(); // อัปเดต Log ในหน้า Setting
}

// ==========================================
// PART 2: VIEW (Overlay Scenes)
// ==========================================

// Scene 1: ตั้งชื่อ
function renderSceneName() {
  return `
        <div style="text-align:center; padding: 10px;">
            <h3>ยินดีต้อนรับ! 🐾</h3>
            <p style="color:#ccc; margin-bottom:10px;">ตั้งชื่อให้น้องแมวตัวใหม่ของคุณ</p>
            <input type="text" id="input-cat-name" placeholder="ชื่อน้องแมว..." 
                style="width:90%; padding:8px; border-radius:10px; border:1px solid #f48fb1; background:#222; color:white; margin-bottom:15px;">
            <button id="btn-next-breed" class="cozy-btn">ถัดไป <i class="fa-solid fa-arrow-right"></i></button>
        </div>
    `;
}

// Scene 2: เลือกสายพันธุ์
function renderSceneBreed() {
  let gridHTML = `<div class="breed-grid">`;
  catBreeds.forEach(breed => {
    const isSelected = appState.tempBreedSelection?.id === breed.id ? 'selected' : '';
    gridHTML += `
            <div class="breed-item ${isSelected}" onclick="selectBreed('${breed.id}')">
                <div style="font-size:1.5em;">${breed.icon}</div>
                <div>${breed.name}</div>
            </div>
        `;
  });
  gridHTML += `</div>`;

  return `
        <div style="padding: 5px;">
            <div style="text-align:center; margin-bottom:10px;">เลือกสายพันธุ์ของ <b>${
              appState.currentCat.name
            }</b></div>
            ${gridHTML}
            <div style="display:flex; gap:5px; margin-top:10px;">
                <button id="btn-back-name" class="cozy-btn secondary" style="flex:1;">กลับ</button>
                <button id="btn-confirm-adopt" class="cozy-btn" style="flex:2;" ${
                  appState.tempBreedSelection ? '' : 'disabled'
                }>
                    รับเลี้ยงเลย! <i class="fa-solid fa-heart"></i>
                </button>
            </div>
            <button id="btn-random-adopt" class="cozy-btn secondary" style="margin-top:5px; background:#4caf50; border-color:#81c784;">
                <i class="fa-solid fa-dice"></i> สุ่มให้หน่อย
            </button>
        </div>
    `;
}

// Scene 3: หน้าหลัก (Main Stats)
function renderSceneMain() {
  const cat = appState.currentCat;
  // รูปแมว (ใช้ seed เดิมเพื่อให้หน้าตาเหมือนเดิมตลอด)
  const catImageUrl = `https://robohash.org/${cat.name}${cat.breed.id}?set=set4&size=120x120`;

  const bar = (icon, color, val, label) => `
        <div style="margin-bottom: 8px;">
            <div style="display:flex; justify-content:space-between; font-size:0.85em; margin-bottom:2px; color: ${color};">
                <span><i class="fa-solid ${icon}"></i> ${label}</span>
                <span>${val}%</span>
            </div>
            <div style="background: rgba(255,255,255,0.1); height:8px; border-radius:4px; overflow:hidden;">
                <div style="width:${val}%; height:100%; background:${color}; border-radius:4px; transition:width 0.5s;"></div>
            </div>
        </div>
    `;

  return `
        <div style="display:flex; gap:15px; margin-bottom:15px; align-items:center;">
            <img src="${catImageUrl}" style="background:#fff; border-radius:50%; width:60px; height:60px; border: 3px solid #ec407a; box-shadow:0 0 10px rgba(236,64,122,0.4);">
            <div style="font-size:0.85em; color:#ddd; flex:1;">
                <div style="font-size:1.1em; font-weight:bold; color:#f8bbd0;">${cat.breed.icon} ${cat.breed.name}</div>
                <div>นิสัย: <span style="color:#ffcc80;">${cat.personality}</span></div>
                <div>สุขภาพ: <span style="color:#81c784;">${cat.health}</span></div>
            </div>
        </div>

        <div style="background:rgba(0,0,0,0.2); padding:10px; border-radius:10px;">
            ${bar('fa-fish', '#ffab91', cat.stats.hunger, 'ความหิว')}     
            ${bar('fa-heart', '#f48fb1', cat.stats.happiness, 'ความสุข')} 
            ${bar('fa-shower', '#64b5f6', cat.stats.hygiene, 'ความสะอาด')}
            ${bar('fa-bed', '#80cbc4', cat.stats.energy, 'พลังงาน')}      
        </div>
    `;
}

// Master Render Overlay
function getOverlayHTML() {
  let content = '';
  if (appState.scene === 'name') content = renderSceneName();
  else if (appState.scene === 'breed') content = renderSceneBreed();
  else if (appState.scene === 'main') content = renderSceneMain();

  // ใช้ style จาก appState.position
  return `
        <div id="cozy-cat-overlay-card" class="cozy-card" style="
            position: fixed; 
            top: ${appState.position.top}px; 
            left: ${appState.position.left}px; 
            width: 280px; 
            z-index: 20000; 
            display: ${appState.isVisible ? 'block' : 'none'};
        ">
            <div id="cozy-cat-header" class="cozy-header cozy-cursor">
                <div style="display:flex; align-items:center; gap:8px; pointer-events: none;">
                    <i class="fa-solid fa-paw"></i>
                    <span>${appState.currentCat.name || 'Cozy Cat'}</span>
                </div>
                <div id="btn-close-overlay" style="cursor:pointer; opacity:0.8;">&times;</div>
            </div>

            <div class="cozy-content">
                ${content}
            </div>
        </div>
    `;
}

// ==========================================
// PART 3: SETTINGS & MOCK UI
// ==========================================

function getSettingsPanelHTML() {
  // สร้างรายการ Log
  let logHTML =
    appState.history.length === 0
      ? `<div style="color:#aaa; text-align:center;">ยังไม่มีประวัติการรับเลี้ยง</div>`
      : '';

  appState.history.forEach(cat => {
    logHTML += `
            <div class="log-item">
                <span>${cat.breed.icon} <b>${cat.name}</b></span>
                <span style="opacity:0.6;">${cat.date}</span>
            </div>
        `;
  });

  return `
        <div class="cozy-cat-settings">
            <div class="inline-drawer">
                <div class="inline-drawer-toggle inline-drawer-header">
                    <b>🐈 Cozy Cat Control</b>
                    <div class="inline-drawer-icon fa-solid fa-circle-chevron-down down"></div>
                </div>
                <div class="inline-drawer-content">
                    
                    <div class="styled_description_block" style="background:#263238;">
                        <b>🛠️ Mock / Tester</b><br>
                        <small>จำลองการพิมพ์คุยกับ AI เพื่อดูผลลัพธ์</small>
                        <div style="display:flex; gap:5px; margin-top:5px;">
                            <input type="text" id="mock-chat-input" class="text_pole" placeholder="เช่น 'ให้อาหารแมว', 'เล่นกับแมว'..." style="width:100%;">
                            <div id="btn-mock-send" class="menu_button">Send</div>
                        </div>
                        <div style="margin-top:5px; font-size:0.8em; color:#aaa;">
                            Try: "feed", "play", "clean", "sleep"
                        </div>
                    </div>

                    <hr>

                    <div style="margin-bottom:10px;">
                        <b>📜 Adoption Log</b>
                        <div class="log-list">
                            ${logHTML}
                        </div>
                    </div>

                    <div style="display:flex; flex-direction:column; gap:5px;">
                        <button id="btn-toggle-visibility" class="menu_button">
                            <i class="fa-solid fa-eye"></i> ซ่อน/แสดง Overlay
                        </button>
                        <button id="btn-retire-cat" class="menu_button" style="background-color: #d81b60; color: white;">
                            <i class="fa-solid fa-box-archive"></i> จบการเลี้ยงตัวนี้ (Start New)
                        </button>
                    </div>

                </div>
            </div>
        </div>
    `;
}

// ==========================================
// PART 4: LOGIC & CONTROLLER
// ==========================================

// ฟังก์ชันจำลองการสแกนข้อความ (AI Scanner Mock)
function triggerAction(text) {
  if (!appState.currentCat.name || appState.scene !== 'main') return;

  const lowerText = text.toLowerCase();
  let msg = '';

  // Mock Logic ง่ายๆ (เดี๋ยวของจริงต้องใช้ Regex ที่ซับซ้อนกว่านี้)
  if (lowerText.includes('feed') || lowerText.includes('อาหาร') || lowerText.includes('กิน')) {
    appState.currentCat.stats.hunger = Math.min(100, appState.currentCat.stats.hunger + 20);
    msg = 'Yummy! ความหิวลดลง';
  } else if (lowerText.includes('play') || lowerText.includes('เล่น') || lowerText.includes('กอด')) {
    appState.currentCat.stats.happiness = Math.min(100, appState.currentCat.stats.happiness + 15);
    appState.currentCat.stats.energy = Math.max(0, appState.currentCat.stats.energy - 10);
    msg = 'Fun! แมวมีความสุข (แต่เหนื่อยนะ)';
  } else if (lowerText.includes('clean') || lowerText.includes('อาบน้ำ') || lowerText.includes('สะอาด')) {
    appState.currentCat.stats.hygiene = 100;
    appState.currentCat.stats.happiness = Math.max(0, appState.currentCat.stats.happiness - 5); // แมวไม่ชอบอาบน้ำ 555
    msg = 'Clean! ตัวหอมแล้ว';
  } else if (lowerText.includes('sleep') || lowerText.includes('นอน') || lowerText.includes('พัก')) {
    appState.currentCat.stats.energy = 100;
    msg = 'Zzz... พลังงานเต็มเปี่ยม';
  }

  if (msg) {
    toastr.success(msg, appState.currentCat.name + ' Says:');
    renderOverlay(); // รีเฟรชหลอด
  }
}

// Logic การลาก (Draggable) ที่อัปเดตค่า Position ลง State
function makeDraggable(element) {
  let pos1 = 0,
    pos2 = 0,
    pos3 = 0,
    pos4 = 0;
  const header = document.getElementById('cozy-cat-header');
  if (!header) return;

  header.onmousedown = dragMouseDown;

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

    // คำนวณตำแหน่งใหม่
    const newTop = element.offsetTop - pos2;
    const newLeft = element.offsetLeft - pos1;

    element.style.top = newTop + 'px';
    element.style.left = newLeft + 'px';
  }

  function closeDragElement() {
    document.onmouseup = null;
    document.onmousemove = null;

    // **สำคัญ:** บันทึกตำแหน่งล่าสุดลง State ทันทีที่ปล่อยเมาส์
    appState.position.top = element.offsetTop;
    appState.position.left = element.offsetLeft;
  }
}

// ตัวแปร Global สำหรับรับค่าจาก onclick ใน HTML string
window.selectBreed = id => {
  appState.tempBreedSelection = catBreeds.find(b => b.id === id);
  renderOverlay();
};

function renderOverlay() {
  $('#cozy-cat-overlay-container').remove();
  $('body').append(`<div id="cozy-cat-overlay-container">${getOverlayHTML()}</div>`);

  // Attach Draggable
  const card = document.getElementById('cozy-cat-overlay-card');
  if (card) makeDraggable(card);

  // Attach Events ตาม Scene
  if (appState.scene === 'name') {
    $('#btn-next-breed').on('click', () => {
      const name = $('#input-cat-name').val().trim();
      if (!name) return toastr.warning('ตั้งชื่อน้องก่อนสิ!');
      appState.currentCat.name = name;
      appState.scene = 'breed';
      renderOverlay();
    });
  } else if (appState.scene === 'breed') {
    $('#btn-back-name').on('click', () => {
      appState.scene = 'name';
      renderOverlay();
    });

    $('#btn-confirm-adopt').on('click', () => {
      appState.currentCat.breed = appState.tempBreedSelection;
      appState.currentCat.personality = generatePersonality();
      appState.scene = 'main';
      renderOverlay();
      toastr.success(`รับเลี้ยงน้อง ${appState.currentCat.name} แล้ว!`);
    });

    $('#btn-random-adopt').on('click', () => {
      appState.currentCat.breed = catBreeds[getRandomInt(0, catBreeds.length - 1)];
      appState.currentCat.personality = generatePersonality();
      appState.scene = 'main';
      renderOverlay();
      toastr.success(`สุ่มได้น้อง ${appState.currentCat.breed.name}!`);
    });
  } else if (appState.scene === 'main') {
    $('#btn-close-overlay').on('click', () => {
      appState.isVisible = false;
      renderOverlay();
    });
  }
}

function renderSettingsPanel() {
  $('.cozy-cat-settings').remove();
  $('#extensions_settings').append(getSettingsPanelHTML());

  // Toggle Overlay
  $('#btn-toggle-visibility').on('click', () => {
    appState.isVisible = !appState.isVisible;
    renderOverlay();
  });

  // Retire Cat
  $('#btn-retire-cat').on('click', () => {
    if (confirm('แน่ใจนะว่าจะจบน้องตัวนี้? (จะถูกย้ายไปเก็บใน Log)')) {
      retireCurrentCat();
    }
  });

  // Mock Send Logic
  $('#btn-mock-send').on('click', () => {
    const text = $('#mock-chat-input').val();
    triggerAction(text); // เรียกฟังก์ชันจำลอง
    $('#mock-chat-input').val(''); // ล้างช่อง
  });
}

jQuery(async () => {
  // Inject CSS ถ้าจำเป็น (แต่แนะนำให้ใช้ไฟล์ style.css แยกตามที่คุยกัน)
  // ถ้าแยกไฟล์แล้ว ตรงนี้ไม่ต้องทำอะไร

  renderSettingsPanel();
  renderOverlay();

  console.log(`[${extensionName}] V2 Loaded.`);
});
