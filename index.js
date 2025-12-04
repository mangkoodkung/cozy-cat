// index.js

// รอจนกว่า Model และ View จะพร้อม (ป้องกัน Panel หาย)
function waitForCozyCat(callback) {
  const interval = setInterval(() => {
    if (window.CozyCat && window.CozyCat.Model && window.CozyCat.View) {
      clearInterval(interval);
      callback();
    }
  }, 100);
}

waitForCozyCat(() => {
  const C = window.CozyCat;

  C.Controller = {
    init: function () {
      console.log('[CozyCat] Initializing...');
      this.renderSettings(); // สร้าง Name Panel
      this.renderOverlay(); // สร้าง Overlay
      console.log('[CozyCat] Ready!');
    },

    renderOverlay: function () {
      $('#cozy-cat-overlay-container').remove();

      if (!C.Model.state.isMasterEnabled) return;

      const html = C.Model.state.isExpanded
        ? C.View.renderCard(C.Model.state)
        : C.View.renderIcon(C.Model.state.currentIcon);

      const $container = $(`<div id="cozy-cat-overlay-container">${html}</div>`);

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
      // เช็กว่า SillyTavern เตรียมกล่องไว้ให้หรือยัง
      if ($('#extensions_settings').length === 0) return;

      $('#extensions_settings').append(C.View.renderSettings(C.Model.state));

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
          this.renderSettings();
        }
      });
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

    changeIcon: function (id) {
      C.Model.setIcon(id);
      this.renderSettings();
      if (!C.Model.state.isExpanded) this.renderOverlay();
    },

    bindEvents: function () {
      $('#cozy-overlay-trigger').on('click', () => {
        C.Model.toggleExpand();
        this.renderOverlay();
      });
      $('#btn-shrink-overlay').on('click', () => {
        C.Model.toggleExpand();
        this.renderOverlay();
      });
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
        const dx = e.clientX - startX;
        const dy = e.clientY - startY;
        element.style.left = initLeft + dx + 'px';
        element.style.top = initTop + dy + 'px';
      }

      function closeDrag() {
        document.onmouseup = null;
        document.onmousemove = null;
        C.Model.state.position.left = element.offsetLeft;
        C.Model.state.position.top = element.offsetTop;
      }
    },
  };

  // Start
  C.Controller.init();
});
