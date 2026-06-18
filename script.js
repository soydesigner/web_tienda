(function(){
  "use strict";
  /* ----- Menú móvil ----- */
  var burger=document.getElementById('burger');
  burger.addEventListener('click',function(){
    var open=document.body.classList.toggle('menu-open');
    burger.setAttribute('aria-expanded',open?'true':'false');
  });
  document.querySelectorAll('.nav-links a').forEach(function(a){
    a.addEventListener('click',function(){document.body.classList.remove('menu-open');burger.setAttribute('aria-expanded','false');});
  });

  /* ----- Header borde al hacer scroll ----- */
  var header=document.getElementById('top');
  var onScroll=function(){header.classList.toggle('scrolled',window.scrollY>10);};
  onScroll();window.addEventListener('scroll',onScroll,{passive:true});

  /* ----- Reveal al hacer scroll ----- */
  var io=new IntersectionObserver(function(entries){
    entries.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target);}});
  },{threshold:.12});
  document.querySelectorAll('.reveal').forEach(function(el){io.observe(el);});

  /* El carrusel antes/después y sus comparadores se gestionan en content.js */

  /* ----- Subida de archivos ----- */
  var dz=document.getElementById('dropzone'),
      input=document.getElementById('fileInput'),
      list=document.getElementById('fileList'),
      MAXSIZE=10*1024*1024, MAXFILES=8,
      store=[];
  function fmt(b){return b<1024?b+' B':b<1048576?(b/1024).toFixed(0)+' KB':(b/1048576).toFixed(1)+' MB';}
  function render(){
    list.innerHTML='';
    store.forEach(function(f,i){
      var li=document.createElement('li');li.className='file-chip';
      var thumb;
      if(f.type.indexOf('image/')===0){thumb=document.createElement('img');thumb.className='thumb';thumb.alt='';thumb.src=URL.createObjectURL(f);}
      else{thumb=document.createElement('span');thumb.className='thumb';thumb.textContent='PDF';}
      var meta=document.createElement('div');meta.className='meta';
      var b=document.createElement('b');b.textContent=f.name;
      var s=document.createElement('small');s.textContent=fmt(f.size);
      meta.appendChild(b);meta.appendChild(s);
      var rm=document.createElement('button');rm.type='button';rm.className='rm';rm.setAttribute('aria-label','Quitar '+f.name);rm.innerHTML='&times;';
      rm.addEventListener('click',function(){store.splice(i,1);render();});
      li.appendChild(thumb);li.appendChild(meta);li.appendChild(rm);
      list.appendChild(li);
    });
  }
  function add(files){
    Array.prototype.forEach.call(files,function(f){
      if(store.length>=MAXFILES){return;}
      if(f.size>MAXSIZE){alert('"'+f.name+'" supera los 10 MB y no se ha añadido.');return;}
      store.push(f);
    });
    render();
  }
  dz.addEventListener('click',function(){input.click();});
  dz.addEventListener('keydown',function(e){if(e.key==='Enter'||e.key===' '){e.preventDefault();input.click();}});
  input.addEventListener('change',function(){add(input.files);input.value='';});
  ['dragenter','dragover'].forEach(function(ev){dz.addEventListener(ev,function(e){e.preventDefault();dz.classList.add('drag');});});
  ['dragleave','drop'].forEach(function(ev){dz.addEventListener(ev,function(e){e.preventDefault();dz.classList.remove('drag');});});
  dz.addEventListener('drop',function(e){if(e.dataTransfer&&e.dataTransfer.files)add(e.dataTransfer.files);});

  /* ----- Envío (maqueta: sin backend) ----- */
  var form=document.getElementById('presupuesto'),
      ok=document.getElementById('okMsg'),
      okFiles=document.getElementById('okFiles');
  form.addEventListener('submit',function(e){
    e.preventDefault();
    var req=['nombre','tel','email'];var valid=true;
    req.forEach(function(id){var el=document.getElementById(id);if(!el.value.trim()){el.style.borderColor='var(--rojo)';valid=false;}else{el.style.borderColor='';}});
    if(!valid){return;}
    okFiles.textContent=store.length?('Adjuntos: '+store.length+' archivo'+(store.length>1?'s':'')+'.'):'';
    ok.classList.add('show');
    form.querySelector('button[type=submit]').textContent='Enviado ✓';
    ok.scrollIntoView({behavior:'smooth',block:'center'});
    setTimeout(function(){form.reset();store=[];render();},400);
  });
})();
