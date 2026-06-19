// Main UI Controls and Async Media Engine for Pindeco
async function loadContent() {
    try {
        const response = await fetch('images.json');
        if (!response.ok) throw new Error('Error de red al cargar configuraciones de imagen.');
        const data = await response.json();
        
        // Workshop image inject
        if(data.workshop && data.workshop.main) {
            document.getElementById('workshopImg').src = data.workshop.main;
        }

        // Before/After Slides Generator
        const track = document.getElementById('carouselTrack');
        if (data.gallery && data.gallery.length > 0) {
            track.innerHTML = ''; // clear original placeholders
            data.gallery.forEach((item) => {
                const slide = document.createElement('div');
                slide.className = 'carousel-slide';
                slide.innerHTML = `
                    <div class="compare-container" id="comp-${item.id}">
                        <span class="label-tag tag-before">Antes</span>
                        <span class="label-tag tag-after">Después</span>
                        <img class="compare-img img-before" src="${item.before}" alt="${item.title} antes">
                        <img class="compare-img img-after" src="${item.after}" alt="${item.title} después" style="clip-path: inset(0 0 0 50%);">
                        <div class="slider-handle" style="left: 50%;">
                            <div class="slider-button">↔</div>
                        </div>
                        <div class="slide-caption">
                            <h3>${item.title}</h3>
                            <p>${item.desc}</p>
                        </div>
                    </div>
                `;
                track.appendChild(slide);
                setTimeout(() => initSlider(`comp-${item.id}`), 50);
            });
        }
    } catch (err) {
        console.warn("Utilizando redundancia local por falta de servidor JSON (CORS).", err);
        injectFallbackSliders();
    }
}

function injectFallbackSliders() {
    const track = document.getElementById('carouselTrack');
    track.innerHTML = `
        <div class="carousel-slide">
            <div class="compare-container" id="comp-fallback">
                <span class="label-tag tag-before">Antes</span><span class="label-tag tag-after">Después</span>
                <img class="compare-img img-before" src="https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&w=800&q=80">
                <img class="compare-img img-after" src="https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=800&q=80" style="clip-path: inset(0 0 0 50%);">
                <div class="slider-handle" style="left: 50%;"><div class="slider-button">↔</div></div>
                <div class="slide-caption"><h3>Mueble Recibidor Clásico</h3><p>Restauración total con esmalte continuo satinado.</p></div>
            </div>
        </div>
    `;
    initSlider('comp-fallback');
}

function initSlider(containerId) {
    const container = document.getElementById(containerId);
    if(!container) return;
    const afterImg = container.querySelector('.img-after');
    const handle = container.querySelector('.slider-handle');
    
    function move(x) {
        const rect = container.getBoundingClientRect();
        let position = ((x - rect.left) / rect.width) * 100;
        if (position < 0) position = 0;
        if (position > 100) position = 100;
        
        handle.style.left = position + '%';
        afterImg.style.clipPath = `inset(0 0 0 ${position}%)`;
    }

    function onMouseMove(e) { move(e.clientX); }
    function onTouchMove(e) { if(e.touches[0]) move(e.touches[0].clientX); }

    handle.addEventListener('mousedown', () => {
        window.addEventListener('mousemove', onMouseMove);
        window.addEventListener('mouseup', () => window.removeEventListener('mousemove', onMouseMove));
    });

    handle.addEventListener('touchstart', () => {
        window.addEventListener('touchmove', onTouchMove);
        window.addEventListener('touchend', () => window.removeEventListener('touchmove', onTouchMove));
    });
}

// Carousel Controls Tracker
let currentSlide = 0;
const track = document.getElementById('carouselTrack');

document.getElementById('carNext').addEventListener('click', () => {
    const totalSlides = document.querySelectorAll('.carousel-slide').length;
    if (currentSlide < totalSlides - 1) currentSlide++;
    else currentSlide = 0;
    track.style.transform = `translateX(-${currentSlide * 100}%)`;
});

document.getElementById('carPrev').addEventListener('click', () => {
    if (currentSlide > 0) currentSlide--;
    else {
        const totalSlides = document.querySelectorAll('.carousel-slide').length;
        currentSlide = totalSlides - 1;
    }
    track.style.transform = `translateX(-${currentSlide * 100}%)`;
});

// Scroll Observers
const revealElements = document.querySelectorAll('.reveal');
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if(entry.isIntersecting) {
            entry.target.classList.add('active');
        }
    });
}, { threshold: 0.1 });

revealElements.forEach(el => observer.observe(el));

// Drag and Drop Zone Engine
const dropZone = document.getElementById('dropZone');
const fileInput = document.getElementById('fileInput');
const thumbArea = document.getElementById('thumbPreviewArea');

if(dropZone) {
    dropZone.addEventListener('click', () => fileInput.click());
    dropZone.addEventListener('dragover', (e) => { e.preventDefault(); dropZone.classList.add('dragover'); });
    dropZone.addEventListener('dragleave', () => dropZone.classList.remove('dragover'));
    dropZone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropZone.classList.remove('dragover');
        if(e.dataTransfer.files.length > 0) {
            fileInput.files = e.dataTransfer.files;
            handleThumbnails(e.dataTransfer.files);
        }
    });
}

if(fileInput) {
    fileInput.addEventListener('change', () => handleThumbnails(fileInput.files));
}

function handleThumbnails(files) {
    thumbArea.innerHTML = '';
    Array.from(files).forEach(file => {
        if (file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const img = document.createElement('img');
                img.src = e.target.result;
                img.className = 'thumb-preview';
                thumbArea.appendChild(img);
            };
            reader.readAsDataURL(file);
        } else {
            const docBlob = document.createElement('span');
            docBlob.textContent = '📄 PDF';
            docBlob.style.fontSize = '0.8rem';
            docBlob.style.background = '#ddd';
            docBlob.style.padding = '4px 8px';
            docBlob.style.borderRadius = '4px';
            thumbArea.appendChild(docBlob);
        }
    });
}

window.addEventListener('DOMContentLoaded', loadContent);
