window.CozyCat = window.CozyCat || {};

window.CozyCat.Model = {
  // Config
  breeds: [
    { id: 'orange', name: 'แมวส้ม', icon: '🐱' },
    { id: 'siamese', name: 'วิเชียรมาศ', icon: '💎' },
    { id: 'persian', name: 'เปอร์เซีย', icon: '🦁' },
    { id: 'black', name: 'แมวดำ', icon: '🐈‍⬛' },
  ],

  icons: [
    { id: 'paw', icon: '🐾' },
    { id: 'moon', icon: '🌙' },
    { id: 'heart', icon: '💖' },
    { id: 'star', icon: '⭐' },
    { id: 'fish', icon: '🐟' },
  ],

  defaultStats: { hunger: 50, happiness: 50, hygiene: 80, energy: 60 },

  // State หลัก
  state: {
    isMasterEnabled: true, // Master Switch
    isExpanded: true, // True = หน้าจอเต็ม, False = หดเหลือไอคอน
    currentIcon: 'paw', // ไอคอนที่เลือก
    scene: 'name', // name, breed, main, log
    position: { top: 100, left: 100 },
    history: [],

    currentCat: {
      name: '',
      breed: null,
      personality: 'Unknown',
      stats: { hunger: 50, happiness: 50, hygiene: 80, energy: 60 },
    },
    tempBreedSelection: null,
  },

  // Actions
  toggleExpand: function () {
    this.state.isExpanded = !this.state.isExpanded;
  },

  setIcon: function (iconId) {
    this.state.currentIcon = iconId;
  },

  petAnimal: function () {
    const stats = this.state.currentCat.stats;
    stats.happiness = Math.min(100, stats.happiness + 5);
    stats.energy = Math.max(0, stats.energy - 2);
    return '❤️ รักนะเหมียว~';
  },

  processChat: function (text) {
    const lower = text.toLowerCase();
    const stats = this.state.currentCat.stats;
    let msg = '';
    if (lower.match(/(feed|กิน|หิว)/)) {
      stats.hunger = Math.min(100, stats.hunger + 20);
      msg = 'Yummy! 🐟';
    } else if (lower.match(/(sleep|นอน)/)) {
      stats.energy = 100;
      msg = 'Zzz... 💤';
    }
    return msg;
  },

  adoptCat: function (breedId) {
    const breed = this.breeds.find(b => b.id === breedId);
    this.state.currentCat.breed = breed;
    this.state.currentCat.personality = ['ขี้อ้อน', 'ซน', 'หยิ่ง'][Math.floor(Math.random() * 3)];
    this.state.scene = 'main';
    this.state.isExpanded = true;
  },

  retireCat: function () {
    if (this.state.currentCat.name) {
      this.state.history.push({
        ...this.state.currentCat,
        date: new Date().toLocaleDateString(),
      });
    }
    // Reset
    this.state.scene = 'name';
    this.state.currentCat = {
      name: '',
      breed: null,
      personality: '',
      stats: { ...this.defaultStats },
    };
  },
};
