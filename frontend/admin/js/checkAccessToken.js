const ACCESS_TOKEN = 'token';
const SHORT_ID = 'shortId';
const IS_ADMIN = 'isAdmin';

const accessToken = localStorage.getItem(ACCESS_TOKEN);
const isAdmin = localStorage.getItem(IS_ADMIN);
const userShortId = localStorage.getItem(SHORT_ID);

const LOGIN_PAGE_URL = '../login/login.html';
const USER_PAGE_URL = '../user/userPage.html';

function redirectPage() {
  if (!accessToken) location.href = LOGIN_PAGE_URL;
  if (isAdmin === 'false') location.href = USER_PAGE_URL;
}

redirectPage();
