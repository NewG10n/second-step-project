"use strict";
console.log('Hello');


let menuBtn = document.querySelector('.header__dropdown-burger');
let menu = document.querySelector('.header__dropdown-menu');

menuBtn.addEventListener('click', function(e){
    e.preventDefault();
    menuBtn.classList.toggle('active');
    menu.classList.toggle('active');
});


