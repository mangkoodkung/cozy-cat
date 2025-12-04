// cat-view.js

function createProgressBar(label, value, color) {
  return `
        <div style="margin-bottom: 5px;">
            <div style="display:flex; justify-content:space-between; font-size:0.8em; margin-bottom:2px;">
                <span>${label}</span>
                <span>${value}%</span>
            </div>
            <div style="background: rgba(0,0,0,0.3); height: 8px; border-radius: 4px; overflow: hidden;">
                <div style="width: ${value}%; height: 100%; background: ${color}; transition: width 0.3s;"></div>
            </div>
        </div>
    `;
}

export function getCatPanelHTML(catData) {
  const catImageUrl = `https://robohash.org/${catData.name}?set=set4&size=100x100`;

  return `
        <div style="display:flex; gap: 10px; align-items: center; margin-bottom: 15px;">
            <div style="background: #fff; padding: 5px; border-radius: 50%; width: 70px; height: 70px; overflow: hidden;">
                <img src="${catImageUrl}" style="width:100%; height:100%;">
            </div>
            <div style="flex: 1;">
                <label style="font-size: 0.8em; opacity: 0.7;">ชื่อน้องแมว:</label>
                <input type="text" id="cat-name-input" class="text_pole" value="${
                  catData.name
                }" style="width: 100%; padding: 2px;">
                <div style="font-size: 0.85em; margin-top: 4px; color: #aaa;">
                    อายุ: <span style="color:#fff;">${catData.age} ปี</span> | 
                    สุขภาพ: <span style="color:#4caf50;">${catData.health}</span>
                </div>
            </div>
        </div>

        <div style="background: rgba(255,255,255,0.1); padding: 8px; border-radius: 5px; margin-bottom: 15px; font-size: 0.9em;">
            <div><b>ลักษณะ:</b> ${catData.appearance}</div>
            <div><b>นิสัย:</b> ${catData.personality}</div>
        </div>

        <div style="margin-bottom: 15px;">
            ${createProgressBar('ความหิว 🍗', catData.stats.hunger, '#ff9800')}
            ${createProgressBar('ความสุข 💖', catData.stats.happiness, '#e91e63')}
            ${createProgressBar('ความสะอาด ✨', catData.stats.hygiene, '#2196f3')}
            ${createProgressBar('พลังงาน 💤', catData.stats.energy, '#4caf50')}
        </div>

        <button id="btn-random-cat" class="menu_button" style="width:100%;">
            <i class="fa-solid fa-dice"></i> สุ่มแมวตัวใหม่
        </button>
    `;
}
