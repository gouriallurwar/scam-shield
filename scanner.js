document.addEventListener("DOMContentLoaded", () => {
  const messageInput = document.getElementById("messageInput");
  const messageCount = document.getElementById("messageCount");
  const messageBtn = document.getElementById("messageBtn");
  const urlBtn = document.getElementById("urlBtn");
  if (messageInput) messageInput.addEventListener("input", () => {
    messageCount.textContent = `${messageInput.value.length} / 5000`;
  });

  function showResult(element, title, label, findings, tone, advice) {
    element.hidden = false;
    element.className = `result-box result-${tone}`;
    const list = findings.length
      ? `<ul>${findings.map(item => `<li>${escapeHTML(item)}</li>`).join("")}</ul>`
      : "<p>No matching patterns from this demo's small rule list were found.</p>";
    element.innerHTML = `<span class="result-label">${label}</span><h3>${title}</h3>${list}<p>${advice}</p>`;
  }
  function escapeHTML(value) {
    return String(value).replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
  }

  if (messageBtn) messageBtn.addEventListener("click", () => {
    const text = messageInput.value.trim().toLowerCase();
    const output = document.getElementById("messageResult");
    if (!text) { showResult(output,"Add a message to begin","INPUT NEEDED",[],"caution","Paste a sample message to analyse."); return; }
    const rules = [
      ["urgent language",/\b(urgent|immediately|act now|within \d+ minutes|limited time|final warning)\b/i],
      ["unexpected prize or reward",/\b(won|winner|prize|lottery|cash reward|free gift)\b/i],
      ["request to verify an account",/\b(verify your account|account suspended|account blocked|update your details)\b/i],
      ["sensitive information request",/\b(otp|password|pin|cvv|bank details|card number)\b/i],
      ["payment or fee request",/\b(pay a fee|processing fee|send money|transfer now)\b/i],
      ["link included in the message",/(https?:\/\/|www\.)/i],
      ["pressure or threat",/\b(blocked|suspended|cancelled|cancelled|penalty|legal action)\b/i]
    ];
    const findings = rules.filter(([,pattern]) => pattern.test(text)).map(([name]) => name);
    const tone = findings.length >= 3 ? "warning" : findings.length ? "caution" : "clear";
    const label = findings.length >= 3 ? "SEVERAL RED FLAGS" : findings.length ? "CHECK CAREFULLY" : "NO MATCH FOUND";
    const title = findings.length >= 3 ? "Several warning signs detected" : findings.length ? "Some warning signs detected" : "No common warning signs detected";
    const advice = "This is a basic educational pattern check, not a scam verdict. Verify the sender using contact details from an official source. Never share an OTP, password or PIN.";
    showResult(output,title,label,findings,tone,advice);
    ScamShield.saveScan("Message scan",label,findings.length);
  });

  if (urlBtn) urlBtn.addEventListener("click", () => {
    const raw = document.getElementById("urlInput").value.trim();
    const output = document.getElementById("urlResult");
    if (!raw) { showResult(output,"Enter a website address","INPUT NEEDED",[],"caution","Type a URL to inspect its basic structure."); return; }
    let parsed;
    try {
      parsed = new URL(/^https?:\/\//i.test(raw) ? raw : `https://${raw}`);
      if (!parsed.hostname.includes(".") || /\s/.test(parsed.hostname)) throw new Error("Invalid host");
    } catch {
      showResult(output,"This does not look like a valid web address","INVALID URL",["The address could not be parsed as a normal website URL."],"warning","Check the spelling. Do not visit a link just because it passes this check.");
      return;
    }
    const host = parsed.hostname.toLowerCase();
    const findings = [];
    if (parsed.protocol !== "https:") findings.push("The address does not use HTTPS.");
    if (host.includes("xn--")) findings.push("The domain contains encoded characters (punycode).");
    if (host.split(".").length > 3) findings.push("The domain has several subdomain levels.");
    if (parsed.username || parsed.password) findings.push("The URL contains user-information fields before the host.");
    if (host.match(/\d{4,}/)) findings.push("The domain contains a long sequence of digits.");
    if (host.includes("-") && host.length > 20) findings.push("The domain is long and contains hyphens.");
    const bait = ["verify","secure","account","login","gift","prize","claim","support","bank"];
    const matched = bait.filter(word => host.includes(word));
    if (matched.length) findings.push(`The domain contains attention-grabbing terms: ${matched.join(", ")}.`);
    const tone = findings.length >= 2 ? "warning" : findings.length ? "caution" : "clear";
    const label = findings.length >= 2 ? "MULTIPLE URL FLAGS" : findings.length ? "REVIEW URL" : "NO BASIC FLAGS";
    const title = findings.length >= 2 ? "Review this address carefully" : findings.length ? "Some URL patterns deserve attention" : "No basic URL warning signs found";
    const advice = "This check does not look up domain reputation, ownership or malware reports. HTTPS does not prove a site is genuine. Visit important services by typing their official address yourself.";
    showResult(output,title,label,findings,tone,advice);
    ScamShield.saveScan("URL scan",label,findings.length);
  });
});