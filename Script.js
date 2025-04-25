document.addEventListener('DOMContentLoaded', () => {
  // DOM Elements
  const splashScreen = document.getElementById('splash-screen');
  const welcome = document.getElementById('welcome-screen');
  const setup = document.getElementById('tank-setup');
  const tank = document.getElementById('main-tank');
  const conditionerBtn = document.getElementById('add-conditioner');
  const cycleBtn = document.getElementById('cycle-tank');
  const testBtn = document.getElementById('test-water');
  const startBtn = document.getElementById('start-btn');
  const fishSelect = document.getElementById('add-fish-select');
  const tankDiv = document.getElementById('tank');
  const fishInfo = document.getElementById('fish-info');
  const feedBtn = document.getElementById('feed-btn');
  const cleanBtn = document.getElementById('clean-btn');
  const setupStatus = document.getElementById('setup-status');
  const tankSizeSelector = document.getElementById('tank-size');
  const soundToggle = document.getElementById('toggle-sound');
  const healthBar = document.getElementById('health-bar');
  const tankTempDisplay = document.getElementById('tank-temp');
  const tankCleanlinessDisplay = document.getElementById('tank-cleanliness');
  const cornerRock = document.getElementById('corner-rock');
  const bloopEgg = document.getElementById('bloop-egg');

  // State Variables
  let tankReady = false;
  let tankFish = [];
  let health = 100;
  let temperature = 25; // Celsius
  let cleanliness = 100; // Percentage
  let rockTaps = 0;
  let audio = null;

  // Fish Data (Petbarn Selection)
  const fishData = [
    { name: "Guppy", size: "Small", temperament: "Peaceful", compatibleWith: ["Molly", "Neon Tetra", "Platy", "Swordtail"], lifespan: "1-3 years", diet: "Omnivore", tempRange: [24, 28] },
    { name: "Molly", size: "Medium", temperament: "Peaceful", compatibleWith: ["Guppy", "Neon Tetra", "Platy", "Swordtail"], lifespan: "3-5 years", diet: "Omnivore", tempRange: [22, 28] },
    { name: "Neon Tetra", size: "Small", temperament: "Peaceful", compatibleWith: ["Guppy", "Molly", "Platy", "Danio"], lifespan: "5-10 years", diet: "Omnivore", tempRange: [20, 26] },
    { name: "Betta", size: "Medium", temperament: "Aggressive", compatibleWith: [], lifespan: "3-5 years", diet: "Carnivore", tempRange: [25, 30] },
    { name: "Platy", size: "Small", temperament: "Peaceful", compatibleWith: ["Guppy", "Molly", "Neon Tetra", "Swordtail"], lifespan: "2-3 years", diet: "Omnivore", tempRange: [20, 28] },
    { name: "Swordtail", size: "Medium", temperament: "Peaceful", compatibleWith: ["Guppy", "Molly", "Platy"], lifespan: "3-5 years", diet: "Omnivore", tempRange: [22, 28] },
    { name: "Angelfish", size: "Large", temperament: "Semi-Aggressive", compatibleWith: ["Cory Catfish"], lifespan: "10-12 years", diet: "Omnivore", tempRange: [24, 30] },
    { name: "Cory Catfish", size: "Small", temperament: "Peaceful", compatibleWith: ["Neon Tetra", "Angelfish"], lifespan: "5-7 years", diet: "Omnivore", tempRange: [22, 26] },
    { name: "Danio", size: "Small", temperament: "Peaceful", compatibleWith: ["Neon Tetra", "White Cloud Mountain Minnow"], lifespan: "3-5 years", diet: "Omnivore", tempRange: [18, 24] },
    { name: "Goldfish", size: "Medium", temperament: "Peaceful", compatibleWith: ["White Cloud Mountain Minnow"], lifespan: "10-15 years", diet: "Omnivore", tempRange: [18, 22] },
    { name: "White Cloud Mountain Minnow", size: "Small", temperament: "Peaceful", compatibleWith: ["Danio", "Goldfish"], lifespan: "5-7 years", diet: "Omnivore", tempRange: [16, 22] }
  ];

  // Initialize Audio
  try {
    audio = new Audio('bubble.mp3');
    audio.loop = true;
  } catch (error) {
    console.error('Failed to load audio:', error);
    soundToggle.disabled = true;
  }

  // Splash Screen Logic
  setTimeout(() => {
    splashScreen.classList.add('hidden');
    welcome.classList.remove('hidden');
  }, 2000);

  // Utility Functions
  function showTip(message) {
    const tipBox = document.createElement('div');
    tipBox.className = 'bloop-tip';
    tipBox.textContent = `Professor Bloop says: ${message}`;
    document.body.appendChild(tipBox);
    setTimeout(() => tipBox.remove(), 6000);
  }

  function adjustHealth(amount) {
    health = Math.max(0, Math.min(100, health + amount));
    healthBar.value = health;
    updateTankConditions();
  }

  function updateTankConditions() {
    temperature = Math.max(16, Math.min(30, temperature + (Math.random() - 0.5) * 2));
    cleanliness = Math.max(0, Math.min(100, cleanliness - 1));
    tankTempDisplay.textContent = `${temperature.toFixed(1)}°C`;
    tankCleanlinessDisplay.textContent = `${cleanliness.toFixed(0)}%`;
    
    // Check for critical conditions
    if (temperature < 18) {
      showTip("The tank is too cold! Some fish may get sick.");
      adjustHealth(-3);
    }
    if (cleanliness < 30) {
      showTip("The tank is too dirty! Clean it to keep your fish healthy.");
      adjustHealth(-3);
    }

    tankFish.forEach(fish => {
      if (temperature < fish.tempRange[0] || temperature > fish.tempRange[1]) {
        showTip(`${fish.customName} is uncomfortable! Ideal temp: ${fish.tempRange[0]}-${fish.tempRange[1]}°C`);
        adjustHealth(-2);
      }
    });
  }

  function animateFish(fishElement) {
    const tankWidth = tankDiv.offsetWidth - 40;
    const tankHeight = tankDiv.offsetHeight - 20;

    function move() {
      const x = Math.random() * tankWidth;
      const y = Math.random() * tankHeight;
      fishElement.style.transform = `translate(${x}px, ${y}px) scaleX(${Math.random() > 0.5 ? 1 : -1})`;
      setTimeout(move, 2000 + Math.random() * 3000);
    }
    move();
  }

  function updateFishInfo() {
    if (tankFish.length === 0) {
      fishInfo.textContent = 'No fish in the tank.';
      return;
    }
    fishInfo.innerHTML = tankFish.map(fish => `
      <p>
        <strong>${fish.customName}</strong> (${fish.name})<br>
        Size: ${fish.size}<br>
        Temperament: ${fish.temperament}<br>
        Lifespan: ${fish.lifespan}<br>
        Diet: ${fish.diet}<br>
        Ideal Temp: ${fish.tempRange[0]}-${fish.tempRange[1]}°C
      </p>
    `).join('');
  }

  // Event Listeners
  startBtn.addEventListener('click', () => {
    welcome.classList.add('hidden');
    setup.classList.remove('hidden');

    const size = tankSizeSelector.value;
    if (size === 'small') tankDiv.style.height = '30vh';
    else if (size === 'medium') tankDiv.style.height = '45vh';
    else tankDiv.style.height = '60vh';

    showTip("Add some conditioner to start preparing the tank!");
  });

  conditionerBtn.addEventListener('click', () => {
    setupStatus.textContent = 'Status: Conditioner added. Ready to cycle.';
    cycleBtn.disabled = false;
    showTip("Good job! Now cycle the tank.");
  });

  cycleBtn.addEventListener('click', () => {
    setupStatus.textContent = 'Status: Cycling...';
    showTip("Cycling tank... This simulates good bacteria growth.");
    setTimeout(() => {
      setupStatus.textContent = 'Status: Tank cycled. You can now test the water.';
      testBtn.disabled = false;
    }, 1500);
  });

  testBtn.addEventListener('click', () => {
    tankReady = true;
    setupStatus.textContent = 'Status: Water is perfect!';
    setup.classList.add('hidden');
    tank.classList.remove('hidden');
    showTip("Perfect water! Add your first fish.");
    setInterval(updateTankConditions, 30000);
  });

  fishSelect.addEventListener('change', () => {
    const value = fishSelect.value;
    if (!tankReady) {
      alert('Please prepare the tank first!');
      fishSelect.value = '';
      return;
    }
    if (value) {
      const fish = { ...fishData.find(f => f.name === value) };
      if (!fish) return;

      const incompatible = tankFish.find(tf => !fish.compatibleWith.includes(tf.name));
      if (incompatible) {
        let reason = fish.temperament === "Aggressive" ? `${fish.name} is too aggressive for ${incompatible.name}!` : `${incompatible.name} might not get along with ${fish.name} due to temperament or size differences.`;
        alert(reason);
        fishSelect.value = '';
        return;
      }

      if (health < 50) {
        showTip('Tank health is too low! Clean the tank before adding fish.');
        fishSelect.value = '';
        return;
      }

      const customName = prompt(`What would you like to name your ${value}?`) || value;
      fish.customName = customName;
      tankFish.push(fish);

      const fishElement = document.createElement('div');
      fishElement.className = 'fish';
      fishElement.dataset.name = value;
      fishElement.style.background = {
        'Guppy': '#ff5555',
        'Molly': '#55ff55',
        'Neon Tetra': '#00b7eb',
        'Betta': '#ff00ff',
        'Platy': '#ffaa00',
        'Swordtail': '#00ffaa',
        'Angelfish': '#aaaaaa',
        'Cory Catfish': '#8b4513',
        'Danio': '#ffcc00',
        'Goldfish': '#ffa500',
        'White Cloud Mountain Minnow': '#d3d3d3'
      }[value];
      tankDiv.appendChild(fishElement);
      animateFish(fishElement);
      updateFishInfo();
      fishSelect.value = '';
      adjustHealth(2);
      showTip(`${fish.customName} the ${value} was added to the tank!`);
    }
  });

  feedBtn.addEventListener('click', () => {
    if (!tankReady) {
      alert('Tank is not ready!');
      return;
    }
    for (let i = 0; i < 5; i++) {
      const particle = document.createElement('div');
      particle.classList.add('food-particle');
      particle.style.left = `${Math.random() * tankDiv.offsetWidth}px`;
      tankDiv.appendChild(particle);
      setTimeout(() => particle.remove(), 5000);
    }

    document.querySelectorAll('.fish').forEach(fish => {
      const x = Math.random() * (tankDiv.offsetWidth - 40);
      const y = Math.random() * (tankDiv.offsetHeight / 2);
      fish.style.transform = `translate(${x}px, ${y}px)`;
    });

    adjustHealth(-3);
    cleanliness -= 5;
    showTip("Don't overfeed! Fish can get sick!");
  });

  cleanBtn.addEventListener('click', () => {
    cleanliness = 100;
    adjustHealth(5);
    showTip("Tank cleaned! Your fish are happier.");
    updateTankConditions();
  });

  soundToggle.addEventListener('change', e => {
    if (audio) {
      e.target.checked ? audio.play().catch(err => console.error('Audio play failed:', err)) : audio.pause();
    }
  });

  cornerRock.addEventListener('click', () => {
    rockTaps++;
    if (rockTaps === 3) {
      showTip('You found a Bloop Egg! What could hatch from this?');
      bloopEgg.classList.remove('hidden');
      adjustHealth(5);
      rockTaps = 0;
    }
  });
});
