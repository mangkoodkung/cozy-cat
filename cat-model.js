// cat-model.js

export const catData = {
  name: 'Mochi',
  age: 1,
  appearance: 'Unknown',
  personality: 'Unknown',
  health: 'แข็งแรง',
  stats: {
    hunger: 50,
    happiness: 50,
    hygiene: 80,
    energy: 60,
  },
};

const catBreeds = ['แมวส้มลายสลิด', 'วิเชียรมาศ', 'เปอร์เซียสีขาว', 'สามสี (Calico)', 'สีดำปลอด', 'สก็อตติชโฟลด์'];
const catTraits = ['ขี้อ้อนชอบนวด', 'นอนทั้งวัน', 'ซุกซนชอบทำของตก', 'หยิ่งๆ แต่รักนะ', 'ตะกละกินเก่ง'];

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function generateRandomCat() {
  const randomBreed = catBreeds[getRandomInt(0, catBreeds.length - 1)];
  const randomTrait = catTraits[getRandomInt(0, catTraits.length - 1)];

  catData.age = getRandomInt(1, 15);
  catData.appearance = randomBreed;
  catData.personality = randomTrait;

  catData.stats.hunger = getRandomInt(20, 90);
  catData.stats.happiness = getRandomInt(30, 100);
  catData.stats.hygiene = getRandomInt(40, 100);
  catData.stats.energy = getRandomInt(10, 100);

  return catData; // ส่งข้อมูลที่อัปเดตแล้วกลับไป
}

export function updateCatName(newName) {
  catData.name = newName;
}
