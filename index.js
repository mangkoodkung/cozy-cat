// index.js

window.CozyCat = window.CozyCat || {};
const C = window.CozyCat; // Shortcut

C.Controller = {
  init: function () {
    this.renderOverlay();
    this.renderSettings();
    console.log('[CozyCat] V3 initialized.');
  },

  // --- Render Logic ---
  renderOverlay: function () {
    $('#cozy-cat-overlay-container').remove();

    if (!C.Model.state.isMasterEnabled) return; // ถ้าปิดจาก Name Panel ให้หยุด

    const html = C.Model.state.isExpanded
      ? C.View.renderCard(C.Model.state)
      : C.View.renderIcon(C.Model.state.currentIcon);

    // สร้าง Container และแปะ HTML
    const $container = $(`<div id="cozy-cat-overlay-container">${html}</div>`);

    // Restore Position
    $container.css({
      top: C.Model.state.position.top + 'px',
      left: C.Model.state.position.left + 'px',
    });

    $('body').append($container);
    this.bindEvents();
    this.makeDraggable($container[0]);
  },

  renderSettings: function () {
    $('.cozy-cat-settings').remove();
    $('#extensions_settings').append(C.View.renderSettings(C.Model.state));

    // Settings Events
    $('#btn-master-toggle').on('click', () => {
      C.Model.state.isMasterEnabled = !C.Model.state.isMasterEnabled;
      this.renderOverlay();
      this.renderSettings();
    });
    $('#btn-hard-reset').on('click', () => {
      if (confirm('ล้างข้อมูลทั้งหมด?')) {
        C.Model.state.history = [];
        C.Model.retireCat();
        this.renderOverlay();
      }
    });
  },

  // --- Actions ---
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

  changeIcon: function (id) {
    C.Model.setIcon(id);
    this.renderSettings();
    if (!C.Model.state.isExpanded) this.renderOverlay(); // อัปเดตทันทีถ้าหดอยู่
  },

  // --- Events ---
  bindEvents: function () {
    // 1. กดที่ไอคอนเพื่อขยาย
    $('#cozy-overlay-trigger').on('click', () => {
      C.Model.toggleExpand();
      this.renderOverlay();
    });

    // 2. กดปุ่มหด
    $('#btn-shrink-overlay').on('click', () => {
      C.Model.toggleExpand();
      this.renderOverlay();
    });

    // 3. Name Scene
    $('#btn-next-breed').on('click', () => {
      const val = $('#input-cat-name').val();
      if (val) {
        C.Model.state.currentCat.name = val;
        C.Model.state.scene = 'breed';
        this.renderOverlay();
      }
    });

    // 4. Breed Scene
    $('#btn-adopt-confirm').on('click', () => {
      C.Model.adoptCat(C.Model.state.tempBreedSelection.id);
      this.renderOverlay();
    });

    // 5. Main Scene - Petting
    $('#pet-image-click').on('click', () => {
      const msg = C.Model.petAnimal();
      toastr.success(msg);
      this.renderOverlay();
    });

    // 6. Main Scene - Chat Input
    $('#btn-pet-chat-send').on('click', () => {
      const txt = $('#pet-chat-input').val();
      const reply = C.Model.processChat(txt);
      if (reply) toastr.success(reply, C.Model.state.currentCat.name + ' Says:');
      this.renderOverlay();
    });
  },

  // --- Draggable Logic ---
  makeDraggable: function (element) {
    // ถ้าหดอยู่ให้จับที่ตัว Icon, ถ้าขยายให้จับที่ Header
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
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;
      element.style.left = initLeft + dx + 'px';
      element.style.top = initTop + dy + 'px';
    }

    function closeDrag() {
      document.onmouseup = null;
      document.onmousemove = null;
      // Save Position
      C.Model.state.position.left = element.offsetLeft;
      C.Model.state.position.top = element.offsetTop;
    }
  },
};

// Start
jQuery(async () => {
  // รอให้ไฟล์อื่นๆ โหลดเสร็จก่อน (เผื่อความชัวร์)
  setTimeout(() => {
    window.CozyCat.Controller.init();
  }, 500);
});
