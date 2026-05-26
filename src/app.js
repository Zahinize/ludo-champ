import DiceRoller from './js/dice';
import {
  colorSequence,
  colorMap,
  isTabletWidth,
  defaultGameState,
  userDiceRolledEvent,
  computerDiceRolledEvent,
  userTurnActiveEvent,
  computerTurnActiveEvent,
  LS_USER_INFO_KEY,
  userStateDesktop,
  computerStateDesktop,
  userStateMobile,
  computerStateMobile,
} from './js/constants';
import {
  $q,
  $qall,
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
} from './js/domRefs';

/** Set Global variables **/
const ls = window.localStorage;
/** Onboarding: Selected token color **/
let _selectedColor = '';
let _computerColor = '';
/** Onboarding: User name and avatar info **/
let _personalData = getStorage(LS_USER_INFO_KEY);
let _userName = _personalData?.userName || '';
let _userAvatar = _personalData?.userAvatar || '';
let _userAvatarURL = _personalData?.userAvatarURL || '';
let _isBgPlayStarted = false;
/** Main Gameplay **/
let gameState = structuredClone(defaultGameState);
const gs = gameState;
let _userDice = null;
let _computerDice = null;

/** User & Computer avatars **/
const userAvatars = [
  {
    name: 'Boy',
    gender: 'male',
    url_48: new URL('assets/icon-avatar-boy.png', import.meta.url).pathname,
    url_96: new URL('assets/icon-avatar-boy-96.png', import.meta.url).pathname,
  },
  {
    name: 'Girl',
    gender: 'female',
    url_48: new URL('assets/icon-avatar-girl.png', import.meta.url).pathname,
    url_96: new URL('assets/icon-avatar-girl-96.png', import.meta.url).pathname,
  },
];
const computerAvatars = [
  {
    name: 'Alien',
    url_48: new URL('assets/icon-avatar-alien.png', import.meta.url).pathname,
    url_96: new URL('assets/icon-avatar-alien-96.png', import.meta.url).pathname,
  },
  {
    name: 'Anonymous',
    url_48: new URL('assets/icon-avatar-anonymous.png', import.meta.url).pathname,
    url_96: new URL('assets/icon-avatar-anonymous-96.png', import.meta.url).pathname,
  },
  {
    name: 'Iron Man',
    url_48: new URL('assets/icon-avatar-ironman.png', import.meta.url).pathname,
    url_96: new URL('assets/icon-avatar-ironman-96.png', import.meta.url).pathname,
  },
  {
    name: 'Snowball',
    url_48: new URL('assets/icon-avatar-snowball.png', import.meta.url).pathname,
    url_96: new URL('assets/icon-avatar-snowball-96.png', import.meta.url).pathname,
  },
  {
    name: 'Walter White',
    url_48: new URL('assets/icon-avatar-walter-white.png', import.meta.url).pathname,
    url_96: new URL('assets/icon-avatar-walter-white-96.png', import.meta.url).pathname,
  },
];
/** Image and Audio Refs **/
const bgPlayIconPath = new URL('assets/icon-video-play.png', import.meta.url);
const bgPauseIconPath = new URL('assets/icon-video-pause.png', import.meta.url);
const gameMusicPath = new URL('assets/game-music.mp3', import.meta.url);
const interactionMusicPath = new URL('assets/button-tap-sound.mp3', import.meta.url);
const gameStartMusicPath = new URL('assets/game-start-sound.mp3', import.meta.url);
const gameAudio = new Audio(gameMusicPath);
const interactionAudio = new Audio(interactionMusicPath);
const gameStartAudio = new Audio(gameStartMusicPath);

/** Miscellaneous functions **/
function getStorage(key) {
  return JSON.parse(ls.getItem(key));
}
function setStorage(key, value) {
  ls.setItem(key, value);
}
function setUserInfoInStorage(key, _userName, _userAvatar, _userAvatarURL) {
  const data = {
    userName: _userName,
    userAvatar: _userAvatar,
    userAvatarURL: _userAvatarURL,
  };

  setStorage(key, JSON.stringify(data));
}
function getActiveColors(color) {
  if (color == '') return null;
  color = color.toLowerCase();

  const userColorIdx = colorSequence.indexOf(color);
  // In our game, the computer will appear diagonally to the end user.
  // Thus, we can get computer color index by adding 2 to the user color index.
  let computerColorIdx =
    userColorIdx + 2 >= colorSequence.length ? userColorIdx - 2 : userColorIdx + 2;

  return [color, colorSequence[computerColorIdx]];
}
function togglePINextVisibility() {
  if (_userName && _userAvatar && _userAvatarURL) {
    enablePINextBtn();
    return;
  }

  disablePINextBtn();
}
function disablePINextBtn() {
  piNextBtn.disabled = true;
  piNextBtn.classList.remove('ani-bounce');
}
function enablePINextBtn() {
  piNextBtn.disabled = false;
  piNextBtn.classList.add('ani-bounce');
}
function disablePlayBtn() {
  playBtnEl.disabled = true;
  playBtnEl.classList.remove('ani-bounce');
}
function enablePlayBtn() {
  playBtnEl.disabled = false;
  playBtnEl.classList.add('ani-bounce');
}
function showPulseAnim(el) {
  el.classList.add('ani-pulse');
}
function hidePulseAnim(el) {
  el.classList.remove('ani-pulse');
}
function addClassToEl(el, clsName) {
  el.classList.add(clsName);
}
function removeClassFromEl(el, clsName) {
  el.classList.remove(clsName);
}

/** Populate PI Screen if localstorage data exists **/
function populatePIScreen() {
  let piData = _personalData;
  if (!piData?.userName || !piData?.userAvatar || !piData?.userAvatarURL) {
    console.log('No personal data found in storage to populate PI screen.');
    return false;
  }

  userNameInputEl.value = piData.userName;
  const avatarEl = $q(`.js-avatar[data-avatar="${piData.userAvatar}"]`);
  avatarEl
    ? avatarEl.classList.add('avatar-active')
    : console.log('No avatar element found to set active state.');
  enablePINextBtn();
}

/** Reset UI screens - State and UI **/
function resetPIScreen() {
  // Reset state
  _userName = '';
  _userAvatar = '';
  _userAvatarURL = '';
  // Reset UI
  userNameInputEl.value = '';
  $qall('.js-avatar').forEach((node) => {
    node.classList.remove('avatar-active');
  });
  disablePINextBtn();
}
function resetColorSelectScreen() {
  // Reset state
  disablePlayBtn();
  _selectedColor = '';
  // Reset all color selection nodes
  colorSelectionList.forEach((selectionEl) => (selectionEl.dataset['flag'] = '0'));
}

/** Event Handlers **/
function handleSelectionClick(e) {
  const el = e.currentTarget;
  // Toggle checkbox flag
  const toggledFlag = Number(!Number(el.dataset['flag']));

  el.dataset['flag'] = toggledFlag;
  if (toggledFlag) {
    enablePlayBtn();
    _selectedColor = el.dataset['color'];
  } else {
    disablePlayBtn();
    _selectedColor = '';
  }
  // Reset flags of other color selection nodes
  colorSelectionList.forEach((selectionEl) => {
    if (selectionEl.dataset['color'] === _selectedColor) {
      return;
    }
    selectionEl.dataset['flag'] = '0';
  });
}
function handleVSComputerClick() {
  heroBtnContainerEl.classList.add('d-none');
  piWrapper.classList.remove('d-none');
}
function handlePIBackBtnClick() {
  // resetPIScreen();
  // Toggle containers visibility
  piWrapper.classList.add('d-none');
  heroBtnContainerEl.classList.remove('d-none');
}
function setUserNameInputError() {
  _userName = '';
  userNameInputEl.classList.add('bx-red');
  userNameInputEl.focus();
}
function handlePINextBtnClick() {
  // User name state validation
  if (
    !_userName ||
    userNameInputEl.value.trim() === '' ||
    _userName.length < 3 ||
    _userName.length > 12
  ) {
    alert('Please enter your user name between 3-12 characters.');
    setUserNameInputError();
    piNextBtn.classList.remove('ani-bounce');
    return false;
  }

  userNameInputEl.classList.remove('bx-red');
  piWrapper.classList.add('d-none');
  /** Color Selection Screen: Prepare this screen for the end user with a state and UI reset **/
  resetColorSelectScreen();
  csContainerEl.classList.remove('d-none');
}
function handleBackBtnClick() {
  resetColorSelectScreen();
  piWrapper.classList.remove('d-none');
  csContainerEl.classList.add('d-none');
}
function handlePlayBtnClick() {
  if (!_selectedColor) {
    return false;
  }

  initGamePlay();
}
function handleAppBackBtnClick() {
  const isAppLogout = window.confirm('Do you wish to exit this game?');

  if (!isAppLogout) {
    return false;
  }

  // Reset Game State
  gameState = structuredClone(defaultGameState);
  // Reset user dice refs and UI
  _userDice.destroy();
  _userDice = null;
  // Reset computer dice refs and UI
  _computerDice.destroy();
  _computerDice = null;
  // Hide App screen and show user onboarding screen
  appEl.classList.add('d-none');
  splashScreenEl.classList.remove('d-none');
  // Reset user onboarding
  csContainerEl.classList.add('d-none');
  heroBtnContainerEl.classList.remove('d-none');
  // Show all color tokens
  $qall('.js-token').forEach((node) => {
    node.classList.remove('d-none');
    const computerClsName = Array.from(node.classList).find((item) =>
      item.includes('game-token-computer-'),
    );
    const userClsName = Array.from(node.classList).find((item) =>
      item.includes('game-token-user-'),
    );

    // Reset current computer tokens
    if (computerClsName) {
      node.classList.remove(computerClsName);
    }
    // Reset current user tokens
    if (userClsName) {
      node.classList.remove(userClsName);
    }
  });
  // Reset onboarding screens
  resetColorSelectScreen();
  // resetPIScreen();
  _computerColor = '';
}
function handleBgPlayClick(e) {
  const el = e.currentTarget;
  const img = el.querySelector('.icon-bg-play');

  _isBgPlayStarted = !_isBgPlayStarted;
  if (!_isBgPlayStarted) {
    img.src = bgPlayIconPath;
    pauseAudio(gameAudio);
    return;
  }

  img.src = bgPauseIconPath;
  playAudio(gameAudio, true);
  console.log('background play click:');
}
function handlePageInteractionClick(e) {
  const excludeClassNames = [
    'game-token-computer-1',
    'game-token-computer-2',
    'game-token-computer-3',
    'game-token-computer-4',
  ];
  const elClassList = e.target.classList;
  const isExcludedClassName = excludeClassNames.reduce((flag, clsName) => {
    elClassList.contains(clsName) || e.target.parentNode.classList.contains(clsName)
      ? (flag = true)
      : null;
    return flag;
  }, false);
  const isSoundEl = elClassList.contains('js-sound') || e.target.closest('.js-sound');

  if (isExcludedClassName || !isSoundEl) return false;
  playAudio(interactionAudio);
}
function handleUserNameInteraction(e) {
  _userName = e.target.value;
  /** TODO: Implement a debounce function (~ 250 ms) to properly check the PI next button visibility */
  togglePINextVisibility();
}
function handleUserAvatarClick(e) {
  const el = e.currentTarget;

  // Reset 'avatar-active' classname
  $qall('.js-avatar').forEach((node) => {
    node.classList.remove('avatar-active');
  });
  el.classList.add('avatar-active');
  // Set user avatar
  _userAvatar = el.dataset['avatar'];
  // Set user avatar URL
  _userAvatarURL = el.querySelector('img').getAttribute('src');
  togglePINextVisibility();
}
function handleUserTokenClick(e) {
  const isUserTurn =
    gs.activeTurn === 'user' && gs.playerTurns && (gs.userDice.first || gs.userDice.second);

  if (!isUserTurn) {
    console.log('No user turn left: ', gs.playerTurns);
    return false;
  }

  const el = e.target;
  const userToken = getTokenById(el, gs.userTokens);
  const eligibleToken = gs.tokenEligibleArr.find((token) => token.id === userToken.id);
  if (!eligibleToken) {
    console.log('[UserTokenClick]: Current DOM el is not eligible.');
    return false;
  }

  const dice = gs.userDice.first || gs.userDice.second;
  const isTokenEligibleToOpen =
    eligibleToken &&
    gs.tokenOpenArr.indexOf(dice) > -1 &&
    userToken.index === 0 &&
    userToken.isAtHome &&
    !userToken.isOpen &&
    !userToken.isSafe &&
    !userToken.isAtFort;
  const pathIndex = isTokenEligibleToOpen ? 0 : userToken.index + dice;
  const currentState = isTabletWidth ? userStateMobile[pathIndex] : userStateDesktop[pathIndex];

  if (isTokenEligibleToOpen) {
    userToken.isOpen = true;
    userToken.isAtHome = false;
  }

  // Update user index to new path location
  userToken.index = pathIndex;
  // Move the user token to new path location
  userToken.el.style.left = currentState.left;
  userToken.el.style.top = currentState.top;
  // Decrement player turn by one
  gs.playerTurns -= 1;
  // Reset eligible token className from all tokens
  gs.tokenEligibleArr.forEach((token) => {
    token.el.classList.remove('token-eligible');
  });

  if (gs.userDice.first) {
    gs.userDice.first = null;

    // Set Eligible tokens for Dice2
    gs.tokenEligibleArr = getEligibleTokens(gs.userDice.second, gs.userTokens);
    // Set eligible tokens active
    gs.tokenEligibleArr.forEach((token) => {
      token.el.classList.add('token-eligible');
    });
    // Hide pulse animation for first user dice
    hidePulseAnim(userDiceOneEl);
    // Show pulse animation for second user dice
    showPulseAnim(userDiceTwoEl);
  } else if (gs.userDice.second) {
    gs.userDice.second = null;
    gs.tokenEligibleArr = [];
    // Hide pulse animations for first and second user dice
    hidePulseAnim(userDiceOneEl);
    hidePulseAnim(userDiceTwoEl);
    dispatchComputerTurnEvent();
  }

  console.log('[UserTokenClick] Current gameState: ', gameState);
}
function pauseAudio(audioRef) {
  audioRef.pause();
}
function playAudio(audioRef, isLoop = false) {
  audioRef.loop = isLoop;

  audioRef.play().catch((err) => {
    console.log('Audio is not played ', err);
  });
}
function setDOMEvents() {
  document.addEventListener('click', handlePageInteractionClick);
  colorSelectionList.forEach((el) => el.addEventListener('click', handleSelectionClick, false));
  vsComputerEl.addEventListener('click', handleVSComputerClick, false);
  backBtnEl.addEventListener('click', handleBackBtnClick, false);
  appBackBtnEl.addEventListener('click', handleAppBackBtnClick, false);
  playBtnEl.addEventListener('click', handlePlayBtnClick, false);
  backgroundPlayEl.addEventListener('click', handleBgPlayClick, false);
  // Onboarding: Personal Info (user name and avatar) screen
  piBackBtn.addEventListener('click', handlePIBackBtnClick, false);
  piNextBtn.addEventListener('click', handlePINextBtnClick, false);
  userNameInputEl.addEventListener('keypress', handleUserNameInteraction, false);
  userNameInputEl.addEventListener('change', handleUserNameInteraction, false);
  userAvatarList.forEach((el) => el.addEventListener('click', handleUserAvatarClick, false));
}

/*** Initialise Main Gameplay ***/
function hideUnusedColorTokens(colorsArr) {
  if (!colorsArr.length) return false;

  colorsArr.forEach((color) => {
    $q(`.js-token-${color}-1`).classList.add('d-none');
    $q(`.js-token-${color}-2`).classList.add('d-none');
    $q(`.js-token-${color}-3`).classList.add('d-none');
    $q(`.js-token-${color}-4`).classList.add('d-none');
  });
}
function updateGameTokenStyles(_selectedColor = '', _computerColor = '') {
  // Update game token positions for computer player
  $q(`.js-token.js-token-${_computerColor}-1`).classList.add('game-token-computer-1');
  $q(`.js-token.js-token-${_computerColor}-2`).classList.add('game-token-computer-2');
  $q(`.js-token.js-token-${_computerColor}-3`).classList.add('game-token-computer-3');
  $q(`.js-token.js-token-${_computerColor}-4`).classList.add('game-token-computer-4');
  // Update game token positions for user player
  $q(`.js-token.js-token-${_selectedColor}-1`).classList.add('game-token-user-1');
  $q(`.js-token.js-token-${_selectedColor}-2`).classList.add('game-token-user-2');
  $q(`.js-token.js-token-${_selectedColor}-3`).classList.add('game-token-user-3');
  $q(`.js-token.js-token-${_selectedColor}-4`).classList.add('game-token-user-4');
}
function updateGameFortStyles(_selectedColor = '', _computerColor = '', unusedColorsArr = []) {
  const gameFortEl = $q('.js-game-fort');
  const borderTopColor = colorMap[_computerColor];
  const borderRightColor = colorMap[unusedColorsArr[1]];
  const borderBottomColor = colorMap[_selectedColor];
  const borderLeftColor = colorMap[unusedColorsArr[0]];
  const borderWidth = isTabletWidth ? '36px' : '75px';

  gameFortEl.style.setProperty('--game-fort-br-top', `${borderWidth} solid ${borderTopColor}`);
  gameFortEl.style.setProperty('--game-fort-br-right', `${borderWidth} solid ${borderRightColor}`);
  gameFortEl.style.setProperty(
    '--game-fort-br-bottom',
    `${borderWidth} solid ${borderBottomColor}`,
  );
  gameFortEl.style.setProperty('--game-fort-br-left', `${borderWidth} solid ${borderLeftColor}`);
}
function updateGameHouseStyles(selector, newColor) {
  const el = $q(selector);
  const newColorClsName = `bgcolor-${newColor}`;
  const currentColorClsName = Array.from(el.classList).find((item) => item.includes('bgcolor-'));

  el.classList.replace(currentColorClsName, newColorClsName);
  el.querySelectorAll('.token').forEach((node) => {
    node.classList.replace(currentColorClsName, newColorClsName);
  });
}
function updateGameTrackStyles(selector, newColor) {
  const el = $q(selector).querySelector('.track-dots');
  const newColorClsName = `bgcolor-${newColor}`;
  const currentColorClsName = Array.from(el.classList).find((item) => item.includes('bgcolor-'));

  // Update game track colors for all players
  el.classList.replace(currentColorClsName, newColorClsName);
}
function setupLayout(_selectedColor = '', _computerColor = '', unusedColorsArr = []) {
  // Update game house colors for computer player
  updateGameHouseStyles('.game-house:nth-of-type(2)', _computerColor);
  // Update game house colors for user player
  updateGameHouseStyles('.game-house:nth-of-type(3)', _selectedColor);
  // Update game house colors for unused top-left player
  updateGameHouseStyles('.game-house:nth-of-type(1)', unusedColorsArr[0]);
  // Update game house colors for unused bottom-right player
  updateGameHouseStyles('.game-house:nth-of-type(4)', unusedColorsArr[1]);

  // Update game track colors for computer player
  updateGameTrackStyles('.game-track.game-track-top', _computerColor);
  // Update game track colors for user player
  updateGameTrackStyles('.game-track.game-track-bottom', _selectedColor);
  // Update game track colors for unused top-left player
  updateGameTrackStyles('.game-track.game-track-left', unusedColorsArr[0]);
  // Update game track colors for unused bottom-right player
  updateGameTrackStyles('.game-track.game-track-right', unusedColorsArr[1]);

  // Update game token styles
  updateGameTokenStyles(_selectedColor, _computerColor);
  // Update game fort styles
  updateGameFortStyles(_selectedColor, _computerColor, unusedColorsArr);
}
function setupUserAvatar(name, gender) {
  const {
    name: avatarName = '',
    url_48 = '',
    url_96 = '',
  } = userAvatars.find((avatar) => avatar.gender === gender);
  const srcset = `${url_48} 48w, ${url_96} 96w`;
  const imgAlt = `Avatar ${avatarName}`;

  userAvatarImgEl.setAttribute('srcset', srcset);
  userAvatarImgEl.setAttribute('src', url_96);
  userAvatarImgEl.setAttribute('alt', imgAlt);
  userAvatarTxtEl.textContent = name;
}
function setupComputerAvatar(name, url_48, url_96) {
  const srcset = `${url_48} 48w, ${url_96} 96w`;
  const imgAlt = `Avatar ${name}`;

  computerAvatarImgEl.setAttribute('srcset', srcset);
  computerAvatarImgEl.setAttribute('src', url_96);
  computerAvatarImgEl.setAttribute('alt', imgAlt);
  computerAvatarTxtEl.textContent = name;
}
function getTokenById(el, obj) {
  return Object.values(obj).find(
    (token) => el.classList.contains(token.id) || el.parentNode.classList.contains(token.id),
  );
}
function setUserTokens() {
  const firstToken = $q('.game-token.game-token-user-1');
  const secondToken = $q('.game-token.game-token-user-2');
  const thirdToken = $q('.game-token.game-token-user-3');
  const fourthToken = $q('.game-token.game-token-user-4');

  gameState.userTokens = {
    first: {
      el: firstToken,
      id: 'game-token-user-1',
      // Current index on the ludo path
      index: 0,
      baseX: firstToken.getBoundingClientRect().left,
      baseY: firstToken.getBoundingClientRect().top,
      left: firstToken.getBoundingClientRect().left,
      top: firstToken.getBoundingClientRect().top,
      isAtHome: true,
      isOpen: false,
      isSafe: false,
      isAtFort: false,
    },
    second: {
      el: secondToken,
      id: 'game-token-user-2',
      index: 0,
      baseX: secondToken.getBoundingClientRect().left,
      baseY: secondToken.getBoundingClientRect().top,
      left: secondToken.getBoundingClientRect().left,
      top: secondToken.getBoundingClientRect().top,
      isAtHome: true,
      isOpen: false,
      isSafe: false,
      isAtFort: false,
    },
    third: {
      el: thirdToken,
      id: 'game-token-user-3',
      index: 0,
      baseX: thirdToken.getBoundingClientRect().left,
      baseY: thirdToken.getBoundingClientRect().top,
      left: thirdToken.getBoundingClientRect().left,
      top: thirdToken.getBoundingClientRect().top,
      isAtHome: true,
      isOpen: false,
      isSafe: false,
      isAtFort: false,
    },
    fourth: {
      el: fourthToken,
      id: 'game-token-user-4',
      index: 0,
      baseX: fourthToken.getBoundingClientRect().left,
      baseY: fourthToken.getBoundingClientRect().top,
      left: fourthToken.getBoundingClientRect().left,
      top: fourthToken.getBoundingClientRect().top,
      isAtHome: true,
      isOpen: false,
      isSafe: false,
      isAtFort: false,
    },
  };

  firstToken.addEventListener('click', handleUserTokenClick, false);
  secondToken.addEventListener('click', handleUserTokenClick, false);
  thirdToken.addEventListener('click', handleUserTokenClick, false);
  fourthToken.addEventListener('click', handleUserTokenClick, false);
}
function setComputerTokens() {
  const firstToken = $q('.game-token.game-token-computer-1');
  const secondToken = $q('.game-token.game-token-computer-2');
  const thirdToken = $q('.game-token.game-token-computer-3');
  const fourthToken = $q('.game-token.game-token-computer-4');

  gameState.computerTokens = {
    first: {
      el: firstToken,
      id: 'game-token-computer-1',
      index: 0,
      baseX: firstToken.getBoundingClientRect().left,
      baseY: firstToken.getBoundingClientRect().top,
      left: firstToken.getBoundingClientRect().left,
      top: firstToken.getBoundingClientRect().top,
      isAtHome: true,
      isOpen: false,
      isSafe: false,
      isAtFort: false,
    },
    second: {
      el: secondToken,
      id: 'game-token-computer-2',
      index: 0,
      baseX: secondToken.getBoundingClientRect().left,
      baseY: secondToken.getBoundingClientRect().top,
      left: secondToken.getBoundingClientRect().left,
      top: secondToken.getBoundingClientRect().top,
      isAtHome: true,
      isOpen: false,
      isSafe: false,
      isAtFort: false,
    },
    third: {
      el: thirdToken,
      id: 'game-token-computer-3',
      index: 0,
      baseX: thirdToken.getBoundingClientRect().left,
      baseY: thirdToken.getBoundingClientRect().top,
      left: thirdToken.getBoundingClientRect().left,
      top: thirdToken.getBoundingClientRect().top,
      isAtHome: true,
      isOpen: false,
      isSafe: false,
      isAtFort: false,
    },
    fourth: {
      el: fourthToken,
      id: 'game-token-computer-4',
      index: 0,
      baseX: fourthToken.getBoundingClientRect().left,
      baseY: fourthToken.getBoundingClientRect().top,
      left: fourthToken.getBoundingClientRect().left,
      top: fourthToken.getBoundingClientRect().top,
      isAtHome: true,
      isOpen: false,
      isSafe: false,
      isAtFort: false,
    },
  };
}
function setupUserDice() {
  // Create the user dice instance with selectors
  _userDice = new DiceRoller(
    'User Dice',
    'dice1',
    'dice2',
    'dice-roll-btn',
    'dice-roll-audio',
    userDiceRolledEvent,
  );
  _userDice.buildDice(_userDice.dice1);
  _userDice.buildDice(_userDice.dice2);
  _userDice.setDiceValue(_userDice.dice1);
  _userDice.setDiceValue(_userDice.dice2);
  _userDice.attachRollBtn();
  // Make user player active as it will start the game
  userDiceRollBtnEl.disabled = false;
  // Show dice roll button arrow indicator
  removeClassFromEl(userDiceRollArrowEl, 'd-none');
  setUserActiveTurn();
  showPulseAnim(userAvatarEl);
}
function setupComputerDice() {
  // Create the computer dice instance with selectors
  _computerDice = new DiceRoller(
    'Computer Dice',
    'dice3',
    'dice4',
    'dice-roll-btn-2',
    'dice-roll-audio-2',
    computerDiceRolledEvent,
  );
  _computerDice.buildDice(_computerDice.dice1);
  _computerDice.buildDice(_computerDice.dice2);
  _computerDice.setDiceValue(_computerDice.dice1);
  _computerDice.setDiceValue(_computerDice.dice2);
  _computerDice.attachRollBtn();
}
function setUserActiveTurn() {
  gameState.activeTurn = 'user';
}
function setActiveTurnComputer() {
  gameState.activeTurn = 'computer';
}
function setupCustomEvents() {
  // Detach custom events first to prevent redundant calls
  document.removeEventListener(userDiceRolledEvent, handleUserDiceRoll, false);
  document.removeEventListener(computerDiceRolledEvent, handleComputerDiceRoll, false);
  document.removeEventListener(userTurnActiveEvent, handleUserTurnActive, false);
  document.removeEventListener(computerTurnActiveEvent, handleComputerTurnActive, false);

  // Attach user and computer custom events
  document.addEventListener(userDiceRolledEvent, handleUserDiceRoll, false);
  document.addEventListener(computerDiceRolledEvent, handleComputerDiceRoll, false);
  document.addEventListener(userTurnActiveEvent, handleUserTurnActive, false);
  document.addEventListener(computerTurnActiveEvent, handleComputerTurnActive, false);
}
function dispatchUserTurnEvent() {
  // Dispatch custom event to set active turn for user
  setTimeout(() => {
    document.dispatchEvent(
      new CustomEvent(userTurnActiveEvent, { detail: { activeTurn: 'user' } }),
    );
  }, 500);
}
function dispatchComputerTurnEvent() {
  // Dispatch custom event to set active turn for computer
  setTimeout(() => {
    document.dispatchEvent(
      new CustomEvent(computerTurnActiveEvent, { detail: { activeTurn: 'computer' } }),
    );
  }, 500);
}
/**
 * Shows the "GAME START" animation once.
 * Call this after onboarding is complete.
 */
function showGameStartAnimation() {
  const overlay = document.getElementById('game-start-overlay');

  // Show overlay
  overlay.classList.remove('hidden');

  // Restart animation if called multiple times
  overlay.classList.remove('show');
  void overlay.offsetWidth; // Force reflow
  overlay.classList.add('show');

  // Hide overlay after animation completes
  const DURATION = 2800; // Must match CSS animation duration
  setTimeout(() => {
    overlay.classList.remove('show');
    overlay.classList.add('hidden');
  }, DURATION);
}

function getEligibleTokens(dice, tokenObj) {
  const { tokenOpenArr } = gameState;
  const canOpenToken = tokenOpenArr.includes(dice);

  return Object.values(tokenObj).filter((token) => {
    const isTokenAtHome =
      token.index === 0 && token.isAtHome && !token.isOpen && !token.isSafe && !token.isAtFort;
    const isTokenOnBoard = token.index >= 0 && !token.isAtHome && token.isOpen && !token.isAtFort;

    if (canOpenToken) {
      // Tokens still at home and eligible to be opened
      return isTokenAtHome || isTokenOnBoard;
    }

    // Tokens already on the board and eligible to move
    return isTokenOnBoard;
  });
}
/** User dice roll custom event handler **/
function handleUserDiceRoll(e) {
  console.log('User dice rolled: ', e.detail);
  let { dice1, dice2 } = e.detail;

  if (!dice1 || !dice2) {
    console.log('Invalid dice values rolled.');
    return;
  }

  dice1 = Number(dice1);
  dice2 = Number(dice2);
  gs.userDice.first = dice1;
  gs.userDice.second = dice2;

  // Disable user dice roll button
  userDiceRollBtnEl.disabled = true;
  // Hide dice roll button arrow indicator
  addClassToEl(userDiceRollArrowEl, 'd-none');

  if (getEligibleTokens(dice1, gs.userTokens).length) {
    // Set Eligible tokens for Dice1
    gs.tokenEligibleArr = getEligibleTokens(dice1, gs.userTokens);
    // Set eligible tokens active
    gs.tokenEligibleArr.forEach((token) => {
      token.el.classList.add('token-eligible');
    });
    gs.playerTurns = 2;
    // Show pulse animation on first user dice
    showPulseAnim(userDiceOneEl);
    console.log('Eligible tokens for dice1: ', gs.tokenEligibleArr);
  } else if (getEligibleTokens(dice2, gs.userTokens).length) {
    // Set Eligible tokens for Dice2
    gs.tokenEligibleArr = getEligibleTokens(dice2, gs.userTokens);
    // Set eligible tokens active
    gs.tokenEligibleArr.forEach((token) => {
      token.el.classList.add('token-eligible');
    });
    gs.playerTurns = 1;
    gs.userDice.first = null;
    // Hide pulse animation on first user dice
    hidePulseAnim(userDiceOneEl);
    // Show pulse animation on second user dice
    showPulseAnim(userDiceTwoEl);
    console.log('Eligible tokens for dice2: ', gs.tokenEligibleArr);
  } else {
    gs.playerTurns = 0;
    gs.userDice.first = null;
    gs.userDice.second = null;

    console.log('No eligible tokens for the user: ', gs.tokenEligibleArr);
    // Hide pulse animations for first and second user dice
    hidePulseAnim(userDiceOneEl);
    hidePulseAnim(userDiceTwoEl);
    dispatchComputerTurnEvent();
  }

  console.log('current game state: ', gameState);
}
function moveComputerToken(dice, tokenObj) {
  const isTokenEligibleToOpen =
    gs.tokenOpenArr.indexOf(dice) > -1 &&
    tokenObj.el &&
    tokenObj.index === 0 &&
    tokenObj.isAtHome &&
    !tokenObj.isOpen &&
    !tokenObj.isSafe &&
    !tokenObj.isAtFort;
  const pathIndex = isTokenEligibleToOpen ? 0 : tokenObj.index + dice;
  const currentState = isTabletWidth
    ? computerStateMobile[pathIndex]
    : computerStateDesktop[pathIndex];

  if (isTokenEligibleToOpen) {
    tokenObj.isOpen = true;
    tokenObj.isAtHome = false;
  }

  // Update user index to new path location
  tokenObj.index = pathIndex;
  // Move the user token to new path location
  tokenObj.el.style.left = currentState.left;
  tokenObj.el.style.top = currentState.top;
  // Decrement player turn by one
  gs.playerTurns -= 1;
  // Reset eligible token className from all tokens
  gs.tokenEligibleArr.forEach((token) => {
    token.el.classList.remove('token-eligible');
  });
}
function playComputerTurn(diceNum, dice, tokenCollection, diceElOne, diceElTwo) {
  return new Promise((resolve, reject) => {
    const eligibleTokens = getEligibleTokens(dice, tokenCollection);
    if (!eligibleTokens.length) {
      console.log(`No eligible tokens for the computer dice: ${dice}`, eligibleTokens);
      return resolve(true);
    }

    // Set Eligible tokens for Dice
    gs.tokenEligibleArr = eligibleTokens;
    // Set eligible tokens active
    gs.tokenEligibleArr.forEach((token) => {
      token.el.classList.add('token-eligible');
    });

    console.log(`Eligible tokens for computer dice: ${dice}: `, eligibleTokens);
    const tokenObj = eligibleTokens[0];
    moveComputerToken(dice, tokenObj);

    if (diceNum === 1) {
      console.log('Computer token selected for dice 1: ', tokenObj);
      // Show pulse animation on first user dice
      showPulseAnim(diceElOne);
    } else if (diceNum === 2) {
      // Show pulse animation on first user dice
      hidePulseAnim(diceElOne);
      showPulseAnim(diceElTwo);
    }

    setTimeout(() => {
      console.log(`[ComputerTurn]: Played dice ${diceNum} turn: `, dice);
      resolve(true);
    }, 500);
  });
}
/** Computer dice roll custom event handler **/
function handleComputerDiceRoll(e) {
  console.log('Computer dice rolled: ', e.detail);
  let { dice1, dice2 } = e.detail;

  if (!dice1 || !dice2) {
    console.log('Computer Dice: Invalid dice values rolled.');
    return;
  }

  dice1 = Number(dice1);
  dice2 = Number(dice2);
  gs.computerDice.first = dice1;
  gs.computerDice.second = dice2;
  gs.playerTurns = 2;

  playComputerTurn(1, dice1, gs.computerTokens, computerDiceOneEl, computerDiceTwoEl)
    .then(() => playComputerTurn(2, dice2, gs.computerTokens, computerDiceOneEl, computerDiceTwoEl))
    .then(() => {
      gs.computerDice.first = null;
      gs.computerDice.second = null;
      gs.tokenEligibleArr = [];
      // Hide pulse animations for first and second computer dice
      hidePulseAnim(computerDiceOneEl);
      hidePulseAnim(computerDiceTwoEl);
      dispatchUserTurnEvent();
      console.log('[ComputerDiceRoll]: Played both turns');
    })
    .catch((err) => console.log('Error in playing computer turn: ', err));
}
/** User turn active custom event handler **/
function handleUserTurnActive(e) {
  console.log('User turn is active: ', e.detail);
  // Set user avatar as active
  hidePulseAnim(computerAvatarEl);
  showPulseAnim(userAvatarEl);
  setUserActiveTurn();
  userDiceRollBtnEl.disabled = false;
  // Show dice roll button arrow indicator
  removeClassFromEl(userDiceRollArrowEl, 'd-none');
}
/** Computer turn active custom event handler **/
function handleComputerTurnActive(e) {
  console.log('Computer turn is active: ', e.detail);
  // Set computer avatar as active
  hidePulseAnim(userAvatarEl);
  showPulseAnim(computerAvatarEl);
  setActiveTurnComputer();
  computerDiceRollBtnEl.click();
}

function initGamePlay() {
  const activeColorsArr = getActiveColors(_selectedColor);
  const unusedColorsArr = colorSequence.filter((item) => activeColorsArr.indexOf(item) === -1);
  const {
    name: computerAvatar = '',
    url_48: computerAvatarURL48 = '',
    url_96: computerAvatarURL96 = '',
  } = computerAvatars[Math.floor(Math.random() * 5)];

  hideUnusedColorTokens(unusedColorsArr);
  gameState.hasGameStarted = true;
  _computerColor = activeColorsArr[1];

  setupLayout(_selectedColor, _computerColor, unusedColorsArr);
  setUserInfoInStorage(LS_USER_INFO_KEY, _userName, _userAvatar, _userAvatarURL);
  setupUserAvatar(_userName, _userAvatar);
  setupComputerAvatar(computerAvatar, computerAvatarURL48, computerAvatarURL96);

  // Hide Onboarding screen and show main App screen
  splashScreenEl.classList.add('d-none');
  appEl.classList.remove('d-none');
  // Show Game start animation
  showGameStartAnimation();
  gameStartAudio.currentTime = 0;
  // Play "Game Start" audio
  playAudio(gameStartAudio);

  // Setup User & Computer dice UI
  setupUserDice();
  setupComputerDice();
  // Cache user and computer token details (DOM refs and states)
  setUserTokens();
  setComputerTokens();
  setupCustomEvents();

  // Show data logs for testing/debugging
  console.log('user color: ', _selectedColor);
  console.log('computer color: ', _computerColor);
  console.log('unused colors: ', unusedColorsArr);
  console.log('username: ', _userName, ', _userAvatar: ', _userAvatar);
  console.log('computer Avatar: ', computerAvatar, ', computer avatar URL: ', computerAvatarURL96);
  console.log(
    'user tokens: ',
    gameState.userTokens,
    ', computer tokens: ',
    gameState.computerTokens,
  );
}

console.log('Ludo game JS loaded.');
setDOMEvents();
populatePIScreen();
