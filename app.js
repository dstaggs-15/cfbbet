// ...top of file unchanged...

function gameCard(g, idx) {
  const card = el("div", "card");
  // ...team blocks unchanged...

  const controls = el("div", "controls");

  const pickBtn1 = el("button", "pick-btn", g.team1);
  const pickBtn2 = el("button", "pick-btn", g.team2);
  const selectedBadge = el("span", "selected-badge");
  selectedBadge.style.display = "none";

  let choice = null;
  pickBtn1.addEventListener("click", () => {
    choice = "team1";
    pickBtn1.classList.add("selected");
    pickBtn2.classList.remove("selected");
    selectedBadge.textContent = `Selected: ${g.team1}`;
    selectedBadge.style.display = "inline-block";
  });
  pickBtn2.addEventListener("click", () => {
    choice = "team2";
    pickBtn2.classList.add("selected");
    pickBtn1.classList.remove("selected");
    selectedBadge.textContent = `Selected: ${g.team2}`;
    selectedBadge.style.display = "inline-block";
  });

  // BET amount (numeric keyboard on mobile)
  const amount = el("input", "amount");
  amount.placeholder = "$10";
  amount.type = "number";
  amount.min = "1";
  amount.step = "1";
  amount.inputMode = "numeric";           // mobile keypad
  amount.pattern = "[0-9]*";

  const lock = el("button", "lock-btn", "Lock");
  lock.addEventListener("click", () => {
    const amt = Math.max(1, Number(amount.value || 10));
    if (!choice) { alert("Pick a side first."); return; }
    const pick = {
      id: `${Date.now()}-${idx}`,
      when: new Date().toISOString(),
      teamPicked: choice === "team1" ? g.team1 : g.team2,
      team1: g.team1, team2: g.team2, side: choice,
      spreadPicked: choice === "team1" ? g.spread_team1 : g.spread_team2,
      overUnder: g.over_under, amount: amt, status: "pending", profit: 0
    };
    picks.unshift(pick);
    savePicks(); refreshStats();
  });

  // Final scores (numeric keyboards)
  const s1 = el("input", "score");
  s1.type = "number"; s1.placeholder = `${g.team1} pts`;
  s1.min = "0"; s1.step = "1"; s1.inputMode = "numeric"; s1.pattern = "[0-9]*";

  const s2 = el("input", "score");
  s2.type = "number"; s2.placeholder = `${g.team2} pts`;
  s2.min = "0"; s2.step = "1"; s2.inputMode = "numeric"; s2.pattern = "[0-9]*";

  const settle = el("button", "settle-btn", "Settle");
  settle.addEventListener("click", () => {
    const n1 = Number(s1.value), n2 = Number(s2.value);
    if (!Number.isFinite(n1) || !Number.isFinite(n2)) { alert("Enter both final scores."); return; }
    settleGame(g, n1, n2);
  });

  const settleGroup = el("div", "settle-group");
  settleGroup.append(s1, s2, settle);

  controls.append(pickBtn1, pickBtn2, selectedBadge, amount, lock, settleGroup);
  card.append(/* team1 */, /* mid */, /* team2 */, controls);  // (your existing nodes)
  return card;
}

// ...rest of app.js unchanged...
