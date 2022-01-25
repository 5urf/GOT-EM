window.onload = () => {
  const navUserImg = document.querySelector('#navUserImg');
  const navUserBtn = document.querySelector('.navUserBtn');
  navUserImg.src = localStorage.getItem('profileUrl');
  navUserBtn.innerHTML = localStorage.getItem('nickName');
};
// const URL = 'http://elice-kdt-sw-1st-vm07.koreacentral.cloudapp.azure.com:3306';
const accessTokenhd = localStorage.getItem('token');
const logoutBtn = document.querySelector('#logoutBtn');
logoutBtn.addEventListener('click', function () {
  if (confirm('로그아웃 하시겠습니까?') == true) {
    fetch(`${URL}/logout`, {
      method: 'GET',
      headers: {
        authorization: `Bearer ${accessTokenhd}`,
      },
      mode: 'cors',
      credentials: 'include',
    }).then(() => {
      alert('로그아웃 되었습니다.');
      localStorage.clear();
      window.location.href = '../beforeMainPage/beforMainPage.html';
    });
  }
});
