// index.js

// รอให้ Model/View โหลดเสร็จก่อน
function waitForCozyCat(callback) {
  const check = setInterval(() => {
    if (window.CozyCat && window.CozyCat.Model && window.CozyCat.View) {
      clearInterval(check);
      callback();
    }
  }, 100);
}

waitForCozyCat(() => {
  const C = window.CozyCat;

  C.Controller = {
    init: function () {
      console.log('[CozyCat] Initializing...');
      this.loadSettings(); // <--- เรียกฟังก์ชันสร้าง Panel ตรงนี้
      this.renderOverlay();
    },

    // ----------------------------------------------------------
    // 🔥 ฟังก์ชัน loadSettings ที่คุณต้องการ
    // ----------------------------------------------------------
    loadSettings: function () {
      // 1. ลบของเก่าก่อนเสมอ
      $('.cozy-cat-settings').remove();

      // 2. เช็กว่า SillyTavern มีกล่อง extension settings ไหม
      if ($('#extensions_settings').length === 0) {
        console.error('Extension settings container not found!');
        return;
      }

      // 3. ดึง HTML จาก View มาแปะ
      const html = C.View.getSettingsPanelHTML(C.Model.state);
      $('#extensions_settings').append(html);

      // 4. ผูก Events ของปุ่มใน Panel
      $('#btn-master-toggle').on('click', () => {
        C.Model.state.isMasterEnabled = !C.Model.state.isMasterEnabled;
        this.renderOverlay(); // อัปเดตตัว Overlay (ซ่อน/แสดง)
        this.loadSettings(); // อัปเดตตัว Panel เอง (เพื่อเปลี่ยนข้อความปุ่ม)
        toastr.info(C.Model.state.isMasterEnabled ? 'เปิด Overlay แล้ว' : 'ปิด Overlay แล้ว');
      });

      $('#btn-hard-reset').on('click', () => {
        if (confirm('ยืนยันล้างข้อมูลและประวัติทั้งหมด?')) {
          C.Model.state.history = [];
          C.Model.retireCat();
          this.renderOverlay();
          this.loadSettings(); // อัปเดต Panel (เพื่อเคลียร์สถานะอื่นๆ ถ้ามี)
          toastr.warning('ล้างข้อมูลเรียบร้อย');
        }
      });
    },

    // --- Render Overlay (ส่วนแสดงผลบนหน้าจอ) ---
    renderOverlay: function () {
      $('#cozy-cat-overlay-container').remove();

      // ถ้าปิด Master Switch อยู่ ไม่ต้องวาดอะไรเลย
      if (!C.Model.state.isMasterEnabled) return;

      // เลือกว่าจะวาดแบบ Card หรือ Icon
      const html = C.Model.state.isExpanded
        ? C.View.renderCard(C.Model.state)
        : C.View.renderIcon(C.Model.state.currentIcon);

      const $container = $(`<div id="cozy-cat-overlay-container">${html}</div>`);

      // คืนตำแหน่งเดิม
      $container.css({
        top: C.Model.state.position.top + 'px',
        left: C.Model.state.position.left + 'px',
      });

      $('body').append($container);
      this.bindEvents();
      this.makeDraggable($container[0]);
    },

    // --- Actions ---
    changeIcon: function (id) {
      C.Model.setIcon(id);
      this.loadSettings(); // รีโหลด Panel เพื่ออัปเดตกรอบสีที่เลือก
      if (!C.Model.state.isExpanded) {
        this.renderOverlay(); // ถ้าย่ออยู่ ให้อัปเดตไอคอนบนจอทันที
      }
    },

    nav: function (target) {
      if (target === 'retire') {
        if (confirm('จบการเลี้ยงน้องตัวนี้?')) C.Model.retireCat();
      } else {
        C.Model.state.scene = target;
      }
      this.renderOverlay();
    },

    selectBreed: function (id) {
      C.Model.state.tempBreedSelection = C.Model.breeds.find(b => b.id === id);
      this.renderOverlay();
    },

    // --- Event Binding ---
    bindEvents: function () {
      // ปุ่มย่อ/ขยาย
      $('#cozy-overlay-trigger, #btn-shrink-overlay').on('click', () => {
        C.Model.toggleExpand();
        this.renderOverlay();
      });

      // Flow การเลี้ยง
      $('#btn-next-breed').on('click', () => {
        const val = $('#input-cat-name').val();
        if (val) {
          C.Model.state.currentCat.name = val;
          C.Model.state.scene = 'breed';
          this.renderOverlay();
        }
      });
      $('#btn-adopt-confirm').on('click', () => {
        C.Model.adoptCat(C.Model.state.tempBreedSelection.id);
        this.renderOverlay();
      });

      // Interaction
      $('#pet-image-click').on('click', () => {
        const msg = C.Model.petAnimal();
        toastr.success(msg);
        this.renderOverlay();
      });
      $('#btn-pet-chat-send').on('click', () => {
        const txt = $('#pet-chat-input').val();
        const reply = C.Model.processChat(txt);
        if (reply) toastr.success(reply, C.Model.state.currentCat.name + ' Says:');
        this.renderOverlay();
      });
    },

    // --- Draggable ---
    makeDraggable: function (element) {
      const handle = C.Model.state.isExpanded ? document.getElementById('cozy-header-drag') : element;
      if (!handle) return;

      let startX, startY, initLeft, initTop;
      handle.onmousedown = e => {
        e.preventDefault();
        startX = e.clientX;
        startY = e.clientY;
        initLeft = element.offsetLeft;
        initTop = element.offsetTop;
        document.onmouseup = closeDrag;
        document.onmousemove = drag;
      };
      function drag(e) {
        e.preventDefault();
        element.style.left = initLeft + (e.clientX - startX) + 'px';
        element.style.top = initTop + (e.clientY - startY) + 'px';
      }
      function closeDrag() {
        document.onmouseup = null;
        document.onmousemove = null;
        C.Model.state.position.left = element.offsetLeft;
        C.Model.state.position.top = element.offsetTop;
      }
    },
  };

  // Run!
  C.Controller.init();
});
