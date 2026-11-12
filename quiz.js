document.addEventListener("DOMContentLoaded", () => {
  const questions = [
    {q:"A message says your bank account will be blocked unless you share an OTP. What should you do?",o:["Reply with the OTP","Do not share it; contact your bank using its official channel","Forward it to friends"],a:1,e:"Banks and legitimate support teams should not ask you to disclose your OTP. Contact your bank independently."},
    {q:"A stranger sends you a payment request and says you must enter your UPI PIN to receive money. What is the safest response?",o:["Enter the PIN quickly","Approve it if the person sounds helpful","Do not approve it; verify the request"],a:2,e:"A UPI PIN is used to authorise a payment. Do not enter it to receive money."},
    {q:"You receive a job offer promising a high salary but asking for a registration fee before an interview. What is a warning sign?",o:["The upfront fee and unverified offer","The company uses email","The message has a greeting"],a:0,e:"Be cautious of jobs that demand money before a genuine, verifiable recruitment process."},
    {q:"A website address looks almost like your bank's official domain but has extra words. What should you do?",o:["Log in to check","Avoid the link and type the official address yourself","Share the link in a group"],a:1,e:"Lookalike domains can imitate trusted organisations. Use an official app or type the known address yourself."},
    {q:"You are told you won a lottery you never entered and must pay a fee to claim it. What is the sensible action?",o:["Pay the fee","Share your bank details","Treat it as suspicious and verify independently"],a:2,e:"Unexpected prizes combined with fees and urgency are common scam warning signs."},
    {q:"A message has no obvious spelling mistakes and uses a familiar logo. Does that prove it is genuine?",o:["Yes, logos prove authenticity","No, verify the sender and request independently","Yes, if it looks professional"],a:1,e:"Scammers can copy logos and write polished messages. Verify through a trusted channel."}
  ];
  let index=0, score=0, answered=false;
  const qText=document.getElementById("questionText"), options=document.getElementById("options");
  const feedback=document.getElementById("feedback"), next=document.getElementById("nextBtn");
  const area=document.getElementById("quizArea"), end=document.getElementById("quizEnd");
  const progress=document.getElementById("quizProgress"), progressText=document.getElementById("quizProgressText");
  function render(){
    answered=false; feedback.hidden=true; next.disabled=true; next.textContent=index===questions.length-1?"See my result →":"Next question →";
    const item=questions[index]; document.getElementById("questionNumber").textContent=`QUESTION ${index+1} OF ${questions.length}`;
    progress.style.width=`${index/questions.length*100}%`; progressText.textContent=`${Math.round(index/questions.length*100)}% completed`;
    qText.textContent=item.q; options.innerHTML="";
    item.o.forEach((choice,i)=>{const b=document.createElement("button");b.className="option-btn";b.textContent=String.fromCharCode(65+i)+". "+choice;b.addEventListener("click",()=>choose(i));options.appendChild(b);});
  }
  function choose(selected){
    if(answered)return; answered=true; const item=questions[index]; const buttons=[...options.children];
    buttons.forEach((b,i)=>{b.disabled=true;if(i===item.a)b.classList.add("correct");if(i===selected&&i!==item.a)b.classList.add("incorrect");});
    if(selected===item.a)score++;
    feedback.hidden=false; feedback.innerHTML=`<strong>${selected===item.a?"Correct!":"Not quite."}</strong> ${item.e}`;
    next.disabled=false;
  }
  next.addEventListener("click",()=>{
    if(!answered)return;
    if(index<questions.length-1){index++;render();return;}
    progress.style.width="100%";progressText.textContent="100% completed";area.hidden=true;end.hidden=false;
    const percent=Math.round(score/questions.length*100);
    end.innerHTML=`<div class="quiz-end"><span class="eyebrow">QUIZ COMPLETE</span><div class="score-big">${score}/${questions.length}</div><h2>${percent>=80?"Great awareness!":percent>=50?"Good effort. Keep learning.":"Keep practising."}</h2><p class="muted">You answered ${score} out of ${questions.length} questions correctly.</p><a class="btn btn-primary" href="quiz.html">Try again ↻</a> <a class="btn btn-quiet" href="learn.html">Review safety guides</a></div>`;
    const history=ScamShield.read("ss_quizzes",[]);history.unshift({score,total:questions.length,date:new Date().toISOString()});ScamShield.write("ss_quizzes",history.slice(0,20));
  });
  render();
});