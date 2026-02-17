const state = {
  cost: 33,
  risk: 33,
  performance: 34,
};

const keys = ["cost", "risk", "performance"];
const sliders = Object.fromEntries(
  keys.map((key) => [key, document.getElementById(key)])
);
const labels = Object.fromEntries(
  keys.map((key) => [key, document.getElementById(`${key}-value`)])
);

const point = document.getElementById("decision-point");
const dominantDriver = document.getElementById("dominant-driver");
const balanceScore = document.getElementById("balance-score");
const guidance = document.getElementById("guidance");

const scenarios = {
  balanced: { cost: 33, risk: 33, performance: 34 },
  cost: { cost: 62, risk: 20, performance: 18 },
  risk: { cost: 26, risk: 56, performance: 18 },
  performance: { cost: 18, risk: 25, performance: 57 },
};

const vertices = {
  performance: { x: 50, y: 10 },
  risk: { x: 10, y: 90 },
  cost: { x: 90, y: 90 },
};

function normalizeToHundred(values) {
  const floors = {};
  const fractions = [];
  let floorSum = 0;

  for (const key of keys) {
    const floorValue = Math.floor(values[key]);
    floors[key] = floorValue;
    floorSum += floorValue;
    fractions.push({
      key,
      fraction: values[key] - floorValue,
    });
  }

  fractions.sort((a, b) => b.fraction - a.fraction);
  let remainder = 100 - floorSum;

  for (let i = 0; i < remainder; i += 1) {
    floors[fractions[i % fractions.length].key] += 1;
  }

  return floors;
}

function updatePoint() {
  const p = state.performance / 100;
  const r = state.risk / 100;
  const c = state.cost / 100;

  const x = p * vertices.performance.x + r * vertices.risk.x + c * vertices.cost.x;
  const y = p * vertices.performance.y + r * vertices.risk.y + c * vertices.cost.y;

  point.setAttribute("cx", x.toFixed(2));
  point.setAttribute("cy", y.toFixed(2));
}

function getDominantKey() {
  return keys.reduce((maxKey, key) => (state[key] > state[maxKey] ? key : maxKey), keys[0]);
}

function buildGuidance() {
  const dominant = getDominantKey();
  const max = state[dominant];
  const min = Math.min(state.cost, state.risk, state.performance);

  if (max - min <= 12) {
    return "You are near equilibrium. This is strong for steady delivery and predictable outcomes.";
  }

  if (dominant === "cost") {
    return "Cost is leading. Tighten scope and use staged rollouts so budget pressure does not degrade critical quality.";
  }

  if (dominant === "risk") {
    return "Risk control is leading. Great for reliability. Protect timeline by defining exit criteria for each mitigation step.";
  }

  return "Performance is leading. Ideal for ambitious goals. Counterbalance with explicit cost ceilings and risk checkpoints.";
}

function updateInsights() {
  const weights = keys.map((key) => state[key] / 100);
  const entropy = -weights.reduce((sum, w) => sum + (w > 0 ? w * Math.log(w) : 0), 0);
  const normalizedEntropy = entropy / Math.log(3);
  const balance = Math.round(normalizedEntropy * 100);

  const dominant = getDominantKey();
  dominantDriver.textContent = dominant.charAt(0).toUpperCase() + dominant.slice(1);
  balanceScore.textContent = String(balance);
  guidance.textContent = buildGuidance();
}

function render() {
  for (const key of keys) {
    sliders[key].value = state[key];
    labels[key].textContent = `${state[key]}%`;
  }

  updatePoint();
  updateInsights();
}

function rebalance(activeKey, activeValue) {
  const others = keys.filter((key) => key !== activeKey);
  const previous = { ...state };
  const remaining = 100 - activeValue;
  const othersPreviousTotal = previous[others[0]] + previous[others[1]];

  const floats = { ...previous, [activeKey]: activeValue };

  if (othersPreviousTotal === 0) {
    floats[others[0]] = remaining / 2;
    floats[others[1]] = remaining / 2;
  } else {
    floats[others[0]] = remaining * (previous[others[0]] / othersPreviousTotal);
    floats[others[1]] = remaining * (previous[others[1]] / othersPreviousTotal);
  }

  const normalized = normalizeToHundred(floats);
  for (const key of keys) {
    state[key] = normalized[key];
  }
}

function setScenario(values) {
  for (const key of keys) {
    state[key] = values[key];
  }
  render();
}

function randomScenario() {
  const a = Math.random();
  const b = Math.random();
  const c = Math.random();
  const sum = a + b + c;

  const normalized = normalizeToHundred({
    cost: (a / sum) * 100,
    risk: (b / sum) * 100,
    performance: (c / sum) * 100,
  });

  setScenario(normalized);
}

for (const key of keys) {
  sliders[key].addEventListener("input", (event) => {
    const value = Number(event.target.value);
    rebalance(key, value);
    render();
  });
}

document.querySelectorAll(".scenario").forEach((button) => {
  button.addEventListener("click", () => {
    const id = button.getAttribute("data-scenario");
    const scenario = scenarios[id];
    setScenario(scenario);
  });
});

document.getElementById("randomize").addEventListener("click", randomScenario);

render();
