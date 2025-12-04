const extensionName = 'cozy-cat';

// =========================================================
// 🧠 PART 1: MODEL (สมอง)
// =========================================================
const CatModel = {
  breeds: [
    { id: 'orange', name: 'แมวส้ม', icon: '🐱' },
    { id: 'siamese', name: 'วิเชียรมาศ', icon: '💎' },
    { id: 'persian', name: 'เปอร์เซีย', icon: '🦁' },
    { id: 'black', name: 'แมวดำ', icon: '🐈‍⬛' },
    { id: 'calico', name: 'สามสี', icon: '🎨' },
    { id: 'scottish', name: 'สก็อตติช', icon: '👂' },
  ],

  defaultStats: { hunger: 50, happiness: 50, hygiene: 80, energy: 60 },

  state: {
    isVisible: true,
    scene: 'name',
    position: { top: 100, left: 100 }, // จำตำแหน่ง
    history: [],
    currentCat: {
      name: '',
      breed: null,
      age: 1,
      personality: 'Unknown',
      health: 'แข็งแรง',
      stats: { hunger: 50, happiness: 50, hygiene: 80, energy: 60 },
    },
    tempBreedSelection: null,
  },

  utils: {
    getRandomInt: (min, max) => Math.floor(Math.random() * (max - min + 1)) + min,
    generatePersonality: () => {
      const traits = ['ขี้อ้อน', 'ขี้เซา', 'ซุกซน', 'หยิ่ง', 'ตะกละ', 'บ้าพลัง', 'โลกส่วนตัวสูง'];
      return traits[Math.floor(Math.random() * traits.length)];
    },
  },

  adoptCat: function (breedId) {
    const breed = this.breeds.find(b => b.id === breedId) || this.breeds[0];
    this.state.currentCat.breed = breed;
    this.state.currentCat.personality = this.utils.generatePersonality();
    this.state.scene = 'main';
  },

  retireCurrentCat: function () {
    if (this.state.currentCat.name) {
      this.state.history.push({
        ...this.state.currentCat,
        date: new Date().toLocaleDateString(),
      });
    }
    this.state.scene = 'name';
    this.state.currentCat = {
      name: '',
      breed: null,
      age: 1,
      personality: 'Unknown',
      health: 'แข็งแรง',
      stats: { ...this.defaultStats },
    };
    this.state.tempBreedSelection = null;
  },

  processChatText: function (text) {
    if (!this.state.currentCat.name || this.state.scene !== 'main') return null;
    const lowerText = text.toLowerCase();
    let msg = '';
    let stats = this.state.currentCat.stats;

    // Trigger Words Logic
    if (lowerText.match(/(feed|อาหาร|กิน|หิว|ปลา)/)) {
      stats.hunger = Math.min(100, stats.hunger + 20);
      msg = 'Yummy! อิ่มแล้วเหมียว 🐟';
    } else if (lowerText.match(/(play|เล่น|กอด|รัก|ลูบหัว)/)) {
      stats.happiness = Math.min(100, stats.happiness + 15);
      stats.energy = Math.max(0, stats.energy - 10);
      msg = 'Purr... มีความสุขจัง ❤️';
    } else if (lowerText.match(/(clean|อาบน้ำ|สกปรก|ล้าง)/)) {
      stats.hygiene = 100;
      stats.happiness = Math.max(0, stats.happiness - 10);
      msg = 'แง๊ว! (ตัวเปียกหมดแล้ว แต่ก็สะอาดนะ) 🚿';
    } else if (lowerText.match(/(sleep|นอน|พัก|ง่วง)/)) {
      stats.energy = 100;
      msg = 'Zzz... คร่อกฟี้ 💤';
    }
    return msg;
  },
};

// =========================================================
// 🎨 PART 2: VIEW (หน้าตา)
// =========================================================
const CatView = {
  renderNameScene: () => `
        <div style="text-align:center; padding: 5px;">
            <h3 style="color:#5d4037; margin-top:0;">ยินดีต้อนรับ! 🐾</h3>
            <p style="color:#795548; margin-bottom:10px; font-size:0.9em;">ตั้งชื่อให้น้องแมวตัวใหม่ของคุณ</p>
            <input type="text" id="input-cat-name" placeholder="เช่น Mochi, ถุงทอง..." 
                style="width:90%; padding:8px; border-radius:8px; border:2px solid #a1887f; background:#fff; color:#3e2723; margin-bottom:15px; text-align:center;">
            <button id="btn-next-breed" class="cozy-btn">ถัดไป <i class="fa-solid fa-arrow-right"></i></button>
        </div>
    `,

  renderBreedScene: tempSelection => {
    let gridHTML = `<div class="breed-grid">`;
    CatModel.breeds.forEach(breed => {
      const isSelected = tempSelection?.id === breed.id ? 'selected' : '';
      gridHTML += `
                <div class="breed-item ${isSelected}" onclick="window.cozyCatSelectBreed('${breed.id}')">
                    <div style="font-size:1.8em;">${breed.icon}</div>
                    <div style="font-weight:bold;">${breed.name}</div>
                </div>
            `;
    });
    gridHTML += `</div>`;

    return `
            <div style="padding: 5px;">
                <div style="text-align:center; margin-bottom:10px; color:#5d4037; font-weight:bold;">เลือกสายพันธุ์</div>
                ${gridHTML}
                <div style="display:flex; gap:5px; margin-top:10px;">
                    <button id="btn-back-name" class="cozy-btn secondary" style="flex:1;">กลับ</button>
                    <button id="btn-confirm-adopt" class="cozy-btn" style="flex:2; background:#8d6e63; color:#fff; border-color:#5d4037;" ${
                      tempSelection ? '' : 'disabled'
                    }>
                        รับเลี้ยงเลย! <i class="fa-solid fa-heart"></i>
                    </button>
                </div>
                <button id="btn-random-adopt" class="cozy-btn secondary" style="margin-top:5px;">
                    <i class="fa-solid fa-dice"></i> สุ่มให้หน่อย
                </button>
            </div>
        `;
  },

  renderMainScene: cat => {
    // ใช้ robohash set 4 (แมว)
    const catImageUrl = `https://robohash.org/${cat.name}${cat.breed.id}?set=set4&size=120x120`;

    const bar = (icon, color, val, label) => `
            <div style="margin-bottom: 8px;">
                <div style="display:flex; justify-content:space-between; font-size:0.85em; margin-bottom:2px; color: #4e342e; font-weight:bold;">
                    <span><i class="fa-solid ${icon}"></i> ${label}</span>
                    <span>${val}%</span>
                </div>
                <div style="background: rgba(141, 110, 99, 0.2); height:10px; border-radius:5px; overflow:hidden; border:1px solid rgba(141, 110, 99, 0.3);">
                    <div style="width:${val}%; height:100%; background:${color}; border-radius:4px; transition:width 0.5s;"></div>
                </div>
            </div>
        `;

    return `
            <div style="display:flex; gap:15px; margin-bottom:15px; align-items:center;">
                <img src="${catImageUrl}" style="background:#fff; border-radius:50%; width:70px; height:70px; border: 3px solid #8d6e63; box-shadow: 2px 2px 5px rgba(0,0,0,0.1);">
                <div style="font-size:0.9em; color:#4e342e; flex:1;">
                    <div style="font-size:1.2em; font-weight:bold; color:#5d4037;">${cat.breed.icon} ${
      cat.breed.name
    }</div>
                    <div>นิสัย: <span style="color:#d84315;">${cat.personality}</span></div>
                    <div>สุขภาพ: <span style="color:#388e3c;">${cat.health}</span></div>
                </div>
            </div>

            <div style="background:rgba(255,255,255,0.6); padding:10px; border-radius:10px; border:1px dashed #a1887f;">
                ${bar('fa-fish', '#ffab91', cat.stats.hunger, 'ความหิว')}     
                ${bar('fa-heart', '#ef9a9a', cat.stats.happiness, 'ความสุข')} 
                ${bar('fa-shower', '#90caf9', cat.stats.hygiene, 'ความสะอาด')}
                ${bar('fa-bed', '#a5d6a7', cat.stats.energy, 'พลังงาน')}      
            </div>
        `;
  },

  getOverlayHTML: state => {
    let content = '';
    if (state.scene === 'name') content = CatView.renderNameScene();
    else if (state.scene === 'breed') content = CatView.renderBreedScene(state.tempBreedSelection);
    else if (state.scene === 'main') content = CatView.renderMainScene(state.currentCat);

    return `
            <div id="cozy-cat-overlay-card" class="cozy-card" style="
                position: fixed; 
                top: ${state.position.top}px; 
                left: ${state.position.left}px; 
                width: 300px; 
                z-index: 20000; 
                display: ${state.isVisible ? 'block' : 'none'};
            ">
                <div id="cozy-cat-header" class="cozy-header cozy-cursor">
                    <div style="display:flex; align-items:center; gap:8px; pointer-events: none;">
                        <i class="fa-solid fa-paw"></i>
                        <span>${state.currentCat.name || 'Cozy Cat Adoption'}</span>
                    </div>
                    <div id="btn-close-overlay" style="cursor:pointer; opacity:0.8;">&times;</div>
                </div>
                <div class="cozy-content">${content}</div>
            </div>
        `;
  },

  getSettingsPanelHTML: history => {
    let logHTML =
      history.length === 0
        ? `<div style="color:#795548; text-align:center; font-style:italic;">ยังไม่มีประวัติการรับเลี้ยง</div>`
        : '';

    history.forEach(cat => {
      logHTML += `
                <div class="log-item">
                    <span>${cat.breed?.icon || '❓'} <b>${cat.name}</b></span>
                    <span style="opacity:0.8; font-size:0.8em;">${cat.date}</span>
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
                        
                        <div class="styled_description_block" style="background:#5d4037; color:#fff8e1;">
                            <b>🛠️ Mock / Tester</b><br>
                            <small>ทดสอบพิมพ์คำสั่ง เช่น: feed, play, clean</small>
                            <div style="display:flex; gap:5px; margin-top:5px;">
                                <input type="text" id="mock-chat-input" class="text_pole" placeholder="Try: feed, play, sleep" style="width:100%; color:#000;">
                                <div id="btn-mock-send" class="menu_button">Send</div>
                            </div>
                        </div>
                        <hr>
                        
                        <div style="margin-bottom:10px;">
                            <b>📜 Adoption Log</b>
                            <div class="log-list">${logHTML}</div>
                        </div>

                        <div style="display:flex; flex-direction:column; gap:5px;">
                            <button id="btn-toggle-visibility" class="menu_button">
                                <i class="fa-solid fa-eye"></i> ซ่อน/แสดง Overlay
                            </button>
                            <button id="btn-retire-cat" class="menu_button" style="background-color: #d81b60; color: white;">
                                <i class="fa-solid fa-box-archive"></i> จบการเลี้ยงตัวนี้
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
  },
};

// =========================================================
// 🎮 PART 3: CONTROLLER (ผู้จัดการ + แก้บั๊กลาก)
// =========================================================

window.cozyCatSelectBreed = id => {
  CatModel.state.tempBreedSelection = CatModel.breeds.find(b => b.id === id);
  renderOverlay();
};

function renderOverlay() {
  $('#cozy-cat-overlay-container').remove();
  $('body').append(`<div id="cozy-cat-overlay-container">${CatView.getOverlayHTML(CatModel.state)}</div>`);

  // Attach Drag
  const card = document.getElementById('cozy-cat-overlay-card');
  if (card) makeDraggable(card);

  // Bind Events
  const state = CatModel.state;
  if (state.scene === 'name') {
    $('#btn-next-breed').on('click', () => {
      const name = $('#input-cat-name').val().trim();
      if (!name) return toastr.warning('ตั้งชื่อน้องก่อนสิ!');
      state.currentCat.name = name;
      state.scene = 'breed';
      renderOverlay();
    });
  } else if (state.scene === 'breed') {
    $('#btn-back-name').on('click', () => {
      state.scene = 'name';
      renderOverlay();
    });
    $('#btn-confirm-adopt').on('click', () => {
      CatModel.adoptCat(state.tempBreedSelection.id);
      renderOverlay();
      toastr.success(`รับเลี้ยงน้อง ${state.currentCat.name} แล้ว!`);
    });
    $('#btn-random-adopt').on('click', () => {
      const randomBreed = CatModel.breeds[CatModel.utils.getRandomInt(0, CatModel.breeds.length - 1)];
      CatModel.adoptCat(randomBreed.id);
      renderOverlay();
      toastr.success(`สุ่มได้น้อง ${state.currentCat.breed.name}!`);
    });
  } else if (state.scene === 'main') {
    $('#btn-close-overlay').on('click', () => {
      state.isVisible = false;
      renderOverlay();
    });
  }
}

// -----------------------------------------------------
// 🛠️ FIX: New Robust Drag Logic (แก้บั๊กลากหาย)
// -----------------------------------------------------
function makeDraggable(element) {
  const header = document.getElementById('cozy-cat-header');
  if (!header) return;

  let startX = 0,
    startY = 0,
    initialLeft = 0,
    initialTop = 0;

  header.onmousedown = dragMouseDown;

  function dragMouseDown(e) {
    e = e || window.event;
    e.preventDefault();

    // 1. จำจุดเริ่มต้นของเมาส์
    startX = e.clientX;
    startY = e.clientY;

    // 2. จำตำแหน่งเริ่มต้นของกล่อง (แปลงเป็น Int ให้ชัวร์)
    initialLeft = element.offsetLeft;
    initialTop = element.offsetTop;

    document.onmouseup = closeDragElement;
    document.onmousemove = elementDrag;
  }

  function elementDrag(e) {
    e = e || window.event;
    e.preventDefault();

    // 3. คำนวณระยะห่างที่เมาส์ขยับ (Delta)
    const deltaX = e.clientX - startX;
    const deltaY = e.clientY - startY;

    // 4. เอาตำแหน่งเดิม + ระยะที่ขยับ = ตำแหน่งใหม่
    // วิธีนี้จะไม่เพี้ยนเพราะอิงจากจุด Start เสมอ
    element.style.top = initialTop + deltaY + 'px';
    element.style.left = initialLeft + deltaX + 'px';
  }

  function closeDragElement() {
    document.onmouseup = null;
    document.onmousemove = null;

    // 5. บันทึกตำแหน่งล่าสุดลง State (กันเด้งกลับตอน render ใหม่)
    CatModel.state.position.top = parseInt(element.style.top);
    CatModel.state.position.left = parseInt(element.style.left);
  }
}
// -----------------------------------------------------

function renderSettings() {
  $('.cozy-cat-settings').remove();
  $('#extensions_settings').append(CatView.getSettingsPanelHTML(CatModel.state.history));

  $('#btn-toggle-visibility').on('click', () => {
    CatModel.state.isVisible = !CatModel.state.isVisible;
    renderOverlay();
  });

  $('#btn-retire-cat').on('click', () => {
    if (confirm('แน่ใจนะว่าจะจบน้องตัวนี้?')) {
      CatModel.retireCurrentCat();
      renderOverlay();
      renderSettings();
    }
  });

  $('#btn-mock-send').on('click', () => {
    const text = $('#mock-chat-input').val();
    const resultMsg = CatModel.processChatText(text);
    if (resultMsg) {
      toastr.success(resultMsg, CatModel.state.currentCat.name + ' Says:');
      renderOverlay();
    }
    $('#mock-chat-input').val('');
  });
}

jQuery(async () => {
  renderSettings();
  renderOverlay();
  console.log(`[${extensionName}] Cozy Theme + Fixed Drag Loaded.`);
});
