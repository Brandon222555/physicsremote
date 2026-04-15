/* PhysicsRemote - dashboard logic */
(async function(){
  const $ = (s,el=document)=>el.querySelector(s);
  const $$ = (s,el=document)=>[...el.querySelectorAll(s)];
  const grid=$('#grid'),empty=$('#empty'),feedsEl=$('#feeds');
  let data;
  try{
    const res=await fetch('assets/jobs.json',{cache:'no-store'});
    data=await res.json();
  }catch(e){
    grid.innerHTML='<div class="empty">Could not load jobs.json. Run a local server or deploy to GitHub Pages.</div>';
    return;
  }
  const JOBS=data.jobs||[], FEEDS=data.feeds||[];
  const lu=$('#lastUpdated');
  if(lu&&data.lastUpdated){
    const d=new Date(data.lastUpdated+'T12:00:00');
    lu.textContent=d.toLocaleDateString(undefined,{year:'numeric',month:'long',day:'numeric'});
  }
  const cats=[...new Set(JOBS.map(j=>j.cat))].sort();
  const catSel=$('#cat');
  cats.forEach(c=>{const o=document.createElement('option');o.value=c;o.textContent=c;catSel.appendChild(o);});
  const tagbar=$('#tagbar');
  ['All',...cats].forEach(t=>{
    const b=document.createElement('button');
    b.className='tagbtn'+(t==='All'?' active':'');
    b.textContent=t; b.dataset.cat=(t==='All')?'':t;
    b.onclick=()=>{$$('.tagbtn',tagbar).forEach(x=>x.classList.remove('active'));b.classList.add('active');catSel.value=b.dataset.cat;render();};
    tagbar.appendChild(b);
  });
  function escapeHtml(s){return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
  function card(j){
    const el=document.createElement('div');el.className='card';
    const stars='★'.repeat(j.fit)+'☆'.repeat(5-j.fit);
    const slug=j.co.toLowerCase().replace(/[^a-z0-9]+/g,'-');
    el.innerHTML=`<div class="co">${escapeHtml(j.co)}</div><h3>${escapeHtml(j.role)}</h3>
      <div class="salary">$${j.min}k&ndash;$${j.max}k base</div>
      <div class="why">${escapeHtml(j.why)}</div>
      <div class="tags"><span class="tag">${escapeHtml(j.cat)}</span>
        ${j.tags.map(t=>`<span class="tag">${escapeHtml(t)}</span>`).join('')}
        <span class="tag">fit ${stars}</span></div>
      <div class="cta">
        <a class="btn" href="${j.url}" target="_blank" rel="noopener">Apply &rarr;</a>
        <a class="btn sec" href="https://www.levels.fyi/companies/${slug}" target="_blank" rel="noopener">Check comp</a>
      </div>`;
    return el;
  }
  function render(){
    const q=$('#q').value.trim().toLowerCase();
    const cat=$('#cat').value, minsal=parseInt($('#minsal').value,10), sort=$('#sort').value;
    let rows=JOBS.filter(j=>{
      if(cat&&j.cat!==cat)return false;
      if(j.max<Math.max(100,minsal))return false;
      if(!q)return true;
      return (j.co+' '+j.role+' '+j.cat+' '+j.why+' '+j.tags.join(' ')).toLowerCase().includes(q);
    });
    if(sort==='salary')rows.sort((a,b)=>b.max-a.max);
    if(sort==='fit')rows.sort((a,b)=>b.fit-a.fit||b.max-a.max);
    if(sort==='company')rows.sort((a,b)=>a.co.localeCompare(b.co));
    grid.innerHTML='';
    rows.forEach(j=>grid.appendChild(card(j)));
    empty.style.display=rows.length?'none':'block';
    $('#stCount').textContent=rows.length;
    $('#stCats').textContent=new Set(rows.map(r=>r.cat)).size;
    if(rows.length){const mids=rows.map(r=>(r.min+r.max)/2).sort((a,b)=>a-b);$('#stMedian').textContent='$'+Math.round(mids[Math.floor(mids.length/2)])+'k';}
    else $('#stMedian').textContent='\u2014';
  }
  FEEDS.forEach(f=>{const d=document.createElement('div');d.className='feed';
    d.innerHTML=`<h4>${escapeHtml(f.title)}</h4><p>${escapeHtml(f.note)}</p><a class="btn sec" href="${f.url}" target="_blank" rel="noopener">Open feed &rarr;</a>`;
    feedsEl.appendChild(d);});
  ['q','cat','minsal','sort'].forEach(id=>$('#'+id).addEventListener('input',render));
  render();
})();
