document.addEventListener("DOMContentLoaded", () => {
  const scans=ScamShield.read("ss_scans",[]), quizzes=ScamShield.read("ss_quizzes",[]);
  document.getElementById("totalScans").textContent=scans.length;
  document.getElementById("quizAttempts").textContent=quizzes.length;
  const best=quizzes.length?Math.max(...quizzes.map(q=>q.score)):"—";
  document.getElementById("bestScore").textContent=best==="—"?"—":`${best}/6`;
  const scanBox=document.getElementById("scanHistory"), quizBox=document.getElementById("quizHistory");
  function safeDate(value){const d=new Date(value);return Number.isNaN(d.getTime())?"Date unavailable":d.toLocaleString();}
  scanBox.innerHTML=scans.length?scans.map(item=>`<div class="history-item"><div><strong>${escapeHTML(item.type)}</strong><small>${safeDate(item.date)} · ${Number(item.findings)||0} indicator(s)</small></div><span class="history-badge">${escapeHTML(item.label)}</span></div>`).join(""):`<div class="empty-state">No scans yet. Visit the <a href="scan.html">scanner</a> to try your first check.</div>`;
  quizBox.innerHTML=quizzes.length?quizzes.map(item=>`<div class="history-item"><div><strong>Awareness quiz</strong><small>${safeDate(item.date)}</small></div><span class="history-badge">${item.score}/${item.total} correct</span></div>`).join(""):`<div class="empty-state">No quiz attempts yet. <a href="quiz.html">Take the quiz</a> to record your score.</div>`;
  document.getElementById("clearHistory").addEventListener("click",()=>{
    if(!confirm("Clear all saved ScamShield scan and quiz activity from this browser?"))return;
    localStorage.removeItem("ss_scans");localStorage.removeItem("ss_quizzes");location.reload();
  });
  function escapeHTML(value){return String(value).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));}
});