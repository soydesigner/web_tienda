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

  /* ----- Subida de archivos (se mantienen en el input para enviarse de verdad) ----- */
  var dz=document.getElementById('dropzone'),
      input=document.getElementById('fileInput'),
      list=document.getElementById('fileList'),
      MAXTOTAL=10*1024*1024,            /* 10 MB en total (límite de FormSubmit) */
      dt=(window.DataTransfer?new DataTransfer():null);
  function fmt(b){return b<1024?b+' B':b<1048576?(b/1024).toFixed(0)+' KB':(b/1048576).toFixed(1)+' MB';}
  function totalSize(){var t=0;if(dt){Array.prototype.forEach.call(dt.files,function(f){t+=f.size;});}return t;}
  function sync(){ if(dt){ input.files=dt.files; } }
  function render(){
    list.innerHTML='';
    if(!dt) return;
    Array.prototype.forEach.call(dt.files,function(f,i){
      var li=document.createElement('li');li.className='file-chip';
      var thumb;
      if(f.type.indexOf('image/')===0){thumb=document.createElement('img');thumb.className='thumb';thumb.alt='';thumb.src=URL.createObjectURL(f);}
      else{thumb=document.createElement('span');thumb.className='thumb';thumb.textContent='PDF';}
      var meta=document.createElement('div');meta.className='meta';
      var b=document.createElement('b');b.textContent=f.name;
      var s=document.createElement('small');s.textContent=fmt(f.size);
      meta.appendChild(b);meta.appendChild(s);
      var rm=document.createElement('button');rm.type='button';rm.className='rm';rm.setAttribute('aria-label','Quitar '+f.name);rm.innerHTML='&times;';
      rm.addEventListener('click',function(){
        var keep=new DataTransfer();
        Array.prototype.forEach.call(dt.files,function(file,j){if(j!==i)keep.items.add(file);});
        dt=keep;sync();render();
      });
      li.appendChild(thumb);li.appendChild(meta);li.appendChild(rm);
      list.appendChild(li);
    });
  }
  function add(files){
    if(!dt){return;} /* navegador muy antiguo: el input nativo se encarga */
    Array.prototype.forEach.call(files,function(f){
      if(totalSize()+f.size>MAXTOTAL){
        alert('El total de fotos supera los 10 MB. "'+f.name+'" no se ha añadido.\nQuita alguna o reduce su tamaño.');
        return;
      }
      dt.items.add(f);
    });
    sync();render();
  }
  if(dz){
    dz.addEventListener('click',function(){input.click();});
    dz.addEventListener('keydown',function(e){if(e.key==='Enter'||e.key===' '){e.preventDefault();input.click();}});
    input.addEventListener('change',function(){if(dt){add(input.files);}});
    ['dragenter','dragover'].forEach(function(ev){dz.addEventListener(ev,function(e){e.preventDefault();dz.classList.add('drag');});});
    ['dragleave','drop'].forEach(function(ev){dz.addEventListener(ev,function(e){e.preventDefault();dz.classList.remove('drag');});});
    dz.addEventListener('drop',function(e){if(e.dataTransfer&&e.dataTransfer.files)add(e.dataTransfer.files);});
  }

  /* ----- Envío real: valida y deja que el formulario se envíe a FormSubmit ----- */
  var form=document.getElementById('presupuesto');
  if(form){
    form.addEventListener('submit',function(e){
      var req=['nombre','tel','email'];var valid=true;
      req.forEach(function(id){var el=document.getElementById(id);if(!el.value.trim()){el.style.borderColor='var(--rojo)';valid=false;}else{el.style.borderColor='';}});
      if(!valid){e.preventDefault();return;}
      if(totalSize()>MAXTOTAL){e.preventDefault();alert('El total de fotos supera los 10 MB. Quita alguna antes de enviar.');return;}
      var btn=form.querySelector('button[type=submit]');
      if(btn){btn.textContent='Enviando…';btn.disabled=true;}
      /* sin preventDefault: el navegador envía el formulario a FormSubmit */
    });
  }
})();
