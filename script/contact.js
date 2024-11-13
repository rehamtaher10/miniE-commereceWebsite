import {
    openMenu,
    closeMenu,
    updateNotificationCounts
  } from "./functions.js";

const menuIcon=document.querySelector('.menuIcon');
const menuBar =document.querySelector('.menuBar');
const closeIcon = document.querySelector('.closeIcon');

// Menu Functionality
menuIcon.onclick = () => openMenu(menuBar);
closeIcon.onclick = () => closeMenu(menuBar);

updateNotificationCounts();