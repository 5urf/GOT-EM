const ACCESS_TOKEN = 'token';
const SHORT_ID = 'shortId';
const IS_ADMIN = 'isAdmin';

const accessToken = localStorage.getItem(ACCESS_TOKEN);
const isAdmin = localStorage.getItem(IS_ADMIN);
const userShortId = localStorage.getItem(SHORT_ID);

const LOGIN_PAGE_URL = '../login/login.html';
const ADMIN_PAGE_URL = '../admin/adminPage.html';

function redirectLoginPage() {
  if (!accessToken) location.href = LOGIN_PAGE_URL;
  if (isAdmin === 'true') location.href = ADMIN_PAGE_URL;
}

redirectLoginPage();
