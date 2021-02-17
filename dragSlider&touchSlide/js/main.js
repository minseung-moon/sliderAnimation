// 슬라이드를 감싸고 있는 태그
const slides = document.querySelector("#slides");
// 슬라이드안의 아이템 태그
const allSlides = document.querySelectorAll('.slide');
// 슬라이더 아이템의 개수
const slidesLength = allSlides.length;
// 슬라이더 아이템에 지정된 가로 사이즈
const slideWidth = allSlides[0].offsetWidth;

// 슬라이드 index
let index = 0;
// 터치 했을 때 시작 된 X 위치
let posX1;
// 터치 끝 났을 때 X 위치
let posX2;
// slides 태그의 시작 위치
let initalPosition;
// slides 태그의 변경 위치
let finalPosition;
// slide movement 제한
let canISlide = true;

// left 버튼
const prev = document.querySelector("#prev");
// rifght 버튼
const next = document.querySelector("#next");

// 슬라이드 양쪽에 추가할 슬라이드 아이템
const firstSlide = allSlides[0];
const lastSlide = allSlides[allSlides.length-1];
const cloneFirstSlide = firstSlide.cloneNode(true);
const cloneLastSlide = lastSlide.cloneNode(true);
// 
slides.appendChild(cloneFirstSlide);
slides.insertBefore(cloneLastSlide,firstSlide);

prev.addEventListener('click', ()=> switchSlide("prev"));
next.addEventListener('click', ()=>switchSlide("next"));

slides.addEventListener('transitionend', checkIndex);

slides.addEventListener('mousedown', dragStart);

slides.addEventListener('touchstart', dragStart);
slides.addEventListener('touchmove', dragMove);
slides.addEventListener('touchend', dragEnd);

function dragStart(e) {
    e.preventDefault();
    initalPosition = slides.offsetLeft;

    if(e.type == 'touchstart') {
        posX1 = e.touches[0].clientX;
    } else {
        posX1 = e.clientX;

        document.onmouseup = dragEnd;
        document.onmousemove = dragMove;
    }
}

function dragMove(e) {
    if(e.type == 'touchmove') {
        // x1에서 x2까지의 거리
        posX2 = posX1 - e.touches[0].clientX;
        posX1 = e.touches[0].clientX;
    }else {
        posX2 = posX1 - e.clientX;
        posX1 = e.clientX;
    }
    slides.style.left = `${slides.offsetLeft - posX2}px`;
}

function dragEnd(e) {
    /*three possibilities 
        1. next slide
        2. prev slide
        3. stay still
    */
//    992 / 2 = 496
   finalPosition = slides.offsetLeft;
   if(finalPosition - initalPosition < -496) {
       switchSlide("next", "dragging");
   } else if(finalPosition - initalPosition > 400) {
    switchSlide("prev", "dragging");
   }else {
       slides.style.left = `${initalPosition}px`;
   }

   document.onmouseup = null;
   document.onmousemove = null;
}

function switchSlide(arg, arg2){
    slides.classList.add("transition");

    if(canISlide) {
        if (!arg2) {
            initalPosition = slides.offsetLeft;
        }
        if(arg == 'next') {
            slides.style.left = `${initalPosition - slideWidth}px`
            index++;
        } else {
            slides.style.left = `${initalPosition + slideWidth}px`
            index--;
        }
    }

    canISlide = false;

}

function checkIndex() {
    slides.classList.remove("transition");
    if(index == -1) {
        slides.style.left = `-${slidesLength * slideWidth}px`
        index = slidesLength - 1;
    }
    if(index == slidesLength) {
        slides.style.left = `-${1 * slideWidth}px`
        index = 0;
    }
    canISlide = true;
}