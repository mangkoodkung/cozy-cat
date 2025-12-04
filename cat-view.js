// cozy-view.js
window.CozyCat = window.CozyCat || {};

window.CozyCat.View = {
  // ส่วน ICON (ตอนหด)
  renderIcon: iconId => {
    const iconObj = window.CozyCat.Model.icons.find(i => i.id === iconId) || window.CozyCat.Model.icons[0];
    return `
            <div id="cozy-overlay-trigger" class="cozy-icon-mode" title="Click to Expand">
                ${iconObj.icon}
            </div>
        `;
  },

  // ส่วน CARD (ตอนขยาย)
  renderCard: state => {
    let content = '';

    // Router ภายใน Card
    if (state.scene === 'name') content = window.CozyCat.View.sceneName();
    else if (state.scene === 'breed') content = window.CozyCat.View.sceneBreed(state.tempBreedSelection);
    else if (state.scene === 'main') content = window.CozyCat.View.sceneMain(state.currentCat);
    else if (state.scene === 'log') content = window.CozyCat.View.sceneLog(state.history);

    return `
            <div class="cozy-card">
                <div id="cozy-header-drag" class="cozy-header cozy-cursor">
                    <div style="display:flex; align-items:center; gap:5px;">
                        <span>${state.currentCat.name || 'Adoption Center'}</span>
                    </div>
                    <div id="btn-shrink-overlay" style="cursor:pointer;">
                        <i class="fa-solid fa-compress"></i>
                    </div>
                </div>
                <div style="padding:15px;">${content}</div>
            </div>
        `;
  },

  // --- Sub-Scenes ---

  sceneName: () => `
        <div style="text-align:center;">
            <h3>ยินดีต้อนรับ! 🏠</h3>
            <input type="text" id="input-cat-name" placeholder="ตั้งชื่อน้อง..." class="overlay-chat-input" style="text-align:center; margin-bottom:10px;">
            <button id="btn-next-breed" class="cozy-btn" style="width:100%">ถัดไป</button>
        </div>
    `,

  sceneBreed: selected => {
    let html = `<div style="display:grid; grid-template-columns:1fr 1fr; gap:5px; margin-bottom:10px;">`;
    window.CozyCat.Model.breeds.forEach(b => {
      const active = selected?.id === b.id ? 'background:#d7ccc8;' : '';
      html += `<div onclick="window.CozyCat.Controller.selectBreed('${b.id}')" style="padding:5px; border:1px solid #a1887f; border-radius:5px; cursor:pointer; text-align:center; ${active}">${b.icon} ${b.name}</div>`;
    });
    html += `</div>`;
    html += `<button id="btn-adopt-confirm" class="cozy-btn" style="width:100%" ${
      selected ? '' : 'disabled'
    }>รับเลี้ยงเลย ❤️</button>`;
    return html;
  },

  sceneMain: cat => {
    const imgUrl = `https://robohash.org/${cat.name}${cat.breed.id}?set=set4&size=100x100`;
    const bar = (color, val, icon) => `
            <div style="display:flex; align-items:center; gap:5px; margin-bottom:5px;">
                <span style="width:20px;">${icon}</span>
                <div style="flex:1; height:8px; background:rgba(0,0,0,0.1); border-radius:4px;">
                    <div style="width:${val}%; height:100%; background:${color}; border-radius:4px; transition:width 0.3s;"></div>
                </div>
            </div>`;

    return `
            <div style="display:flex; gap:10px; margin-bottom:10px;">
                <img src="${imgUrl}" class="pet-interaction-area" id="pet-image-click" 
                     style="width:70px; height:70px; border-radius:50%; border:3px solid #8d6e63; background:#fff;">
                <div style="font-size:0.9em;">
                    <div><b>${cat.breed.icon} ${cat.breed.name}</b></div>
                    <div style="color:#d84315;">นิสัย: ${cat.personality}</div>
                    <div style="font-size:0.8em; color:#aaa;">(คลิกที่รูปเพื่อลูบหัว)</div>
                </div>
            </div>

            ${bar('#ffab91', cat.stats.hunger, '🐟')}
            ${bar('#f48fb1', cat.stats.happiness, '❤️')}
            ${bar('#a5d6a7', cat.stats.energy, '💤')}

            <div style="margin-top:10px; display:flex; gap:5px;">
                <input type="text" id="pet-chat-input" class="overlay-chat-input" placeholder="คุยกับน้อง... (feed, play)">
                <button id="btn-pet-chat-send" class="cozy-btn"><i class="fa-solid fa-paper-plane"></i></button>
            </div>

            <div style="margin-top:10px; display:flex; justify-content:space-between; border-top:1px dashed #a1887f; padding-top:5px;">
                <span onclick="window.CozyCat.Controller.nav('log')" style="cursor:pointer; font-size:0.8em;"><i class="fa-solid fa-book"></i> สมุดบันทึก</span>
                <span onclick="window.CozyCat.Controller.nav('retire')" style="cursor:pointer; font-size:0.8em; color:#d32f2f;"><i class="fa-solid fa-door-open"></i> จบการเลี้ยง</span>
            </div>
        `;
  },

  sceneLog: history => {
    let html = `<div class="scroll-area" style="max-height:150px; overflow-y:auto; margin-bottom:10px;">`;
    if (history.length === 0) html += `<div style="text-align:center; color:#aaa;">ว่างเปล่า...</div>`;
    history.forEach(h => {
      html += `<div style="border-bottom:1px dashed #ccc; padding:5px;">${h.breed.icon} <b>${h.name}</b> <small>(${h.date})</small></div>`;
    });
    html += `</div>`;
    html += `<button onclick="window.CozyCat.Controller.nav('main')" class="cozy-btn" style="width:100%">กลับหน้าหลัก</button>`;
    return html;
  },

  // --- Name Panel (Settings) ---
  renderSettings: state => {
    let iconSelector = `<div style="display:flex; gap:5px; justify-content:center; margin-bottom:10px;">`;
    window.CozyCat.Model.icons.forEach(i => {
      const active =
        state.currentIcon === i.id ? 'border:2px solid #5d4037; background:#d7ccc8;' : 'border:1px solid #ccc;';
      iconSelector += `
                <div onclick="window.CozyCat.Controller.changeIcon('${i.id}')" 
                     style="width:30px; height:30px; border-radius:50%; display:flex; align-items:center; justify-content:center; cursor:pointer; ${active}">
                    ${i.icon}
                </div>`;
    });
    iconSelector += `</div>`;

    return `
            <div class="cozy-cat-settings">
                <div class="inline-drawer">
                    <div class="inline-drawer-toggle inline-drawer-header">
                        <b>🐈 Cozy Cat Panel</b>
                        <div class="inline-drawer-icon fa-solid fa-circle-chevron-down down"></div>
                    </div>
                    <div class="inline-drawer-content">
                        <div style="text-align:center; font-size:0.9em; margin-bottom:5px;">เลือกไอคอนปุ่มลอย</div>
                        ${iconSelector}
                        <hr>
                        <div style="display:flex; flex-direction:column; gap:5px;">
                            <button id="btn-master-toggle" class="menu_button">
                                <i class="fa-solid fa-power-off"></i> ${
                                  state.isMasterEnabled ? 'ซ่อน Overlay ทั้งหมด' : 'เปิด Overlay'
                                }
                            </button>
                            <button id="btn-hard-reset" class="menu_button" style="background:#d32f2f; color:white;">
                                <i class="fa-solid fa-trash"></i> ล้าง Log ทั้งหมด
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
  },
};
