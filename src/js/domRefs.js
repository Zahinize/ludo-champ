/** DOM element Refs **/
const $q = (sel) => document.querySelector(sel);
const $qall = (sel) => document.querySelectorAll(sel);
const $id = (id) => document.getElementById(id);
/** Onboarding Splashscreen **/
const splashScreenEl = $q('.js-splashScreen');
const vsComputerEl = $id('vs-computer');
const heroBtnContainerEl = $q('.js-hero-buttons');
const backgroundPlayEl = $q('.js-icon-bg-play');
/** Onboarding screen: Color Selection **/
const colorSelectionList = $qall('.js-color-selection');
const csContainerEl = $q('.js-cs-wrapper');
const backBtnEl = $q('.js-back-btn');
const playBtnEl = $q('.js-play-btn');
/** Onboarding screen: Personal Information **/
const piWrapper = $q('.js-pi-wrapper');
const userNameInputEl = $q('.js-pi-name-input');
const userAvatarList = $qall('.js-avatar');
const piBackBtn = $q('.js-pi-back-btn');
const piNextBtn = $q('.js-pi-next');
/** Main App screen **/
const appBackBtnEl = $q('.js-app-back-btn');
const appEl = $q('.js-app');
const userAvatarEl = $q('.js-avatar-user');
const computerAvatarEl = $q('.js-avatar-computer');
const userAvatarImgEl = $q('.js-avatar-user-img');
const userAvatarTxtEl = $q('.js-avatar-user-text');
const computerAvatarImgEl = $q('.js-avatar-computer-img');
const computerAvatarTxtEl = $q('.js-avatar-computer-text');
const userDiceOneEl = $q('#dice-cover-user-1');
const userDiceTwoEl = $q('#dice-cover-user-2');
const computerDiceOneEl = $q('#dice-cover-computer-1');
const computerDiceTwoEl = $q('#dice-cover-computer-2');
const userDiceRollBtnEl = $q('.js-user-dice-btn');
const userDiceRollArrowEl = userDiceRollBtnEl.querySelector('.js-user-arrow-ind');
const computerDiceRollBtnEl = $q('.js-computer-dice-btn');

export {
  $q,
  $qall,
  $id,
  splashScreenEl,
  vsComputerEl,
  heroBtnContainerEl,
  backgroundPlayEl,
  colorSelectionList,
  csContainerEl,
  backBtnEl,
  playBtnEl,
  piWrapper,
  userNameInputEl,
  userAvatarList,
  piBackBtn,
  piNextBtn,
  appBackBtnEl,
  appEl,
  userAvatarEl,
  computerAvatarEl,
  userAvatarImgEl,
  userAvatarTxtEl,
  computerAvatarImgEl,
  computerAvatarTxtEl,
  userDiceOneEl,
  userDiceTwoEl,
  computerDiceOneEl,
  computerDiceTwoEl,
  userDiceRollBtnEl,
  userDiceRollArrowEl,
  computerDiceRollBtnEl,
};
