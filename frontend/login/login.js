const $email = document.querySelector('#email');
const $password = document.querySelector('#password');
const $form = document.querySelector('#form');
const USER_PW_MIN_LENGTH = 6;
const USER_PW_MAX_LENGTH = 24;

function showError(input, message) {
  const $formControl = input.parentElement;
  $formControl.classList.add('error');
  $formControl.classList.remove('success');
  const small = $formControl.querySelector('small');
  small.innerText = message;
}
function showSuccess($input, message) {
  const $formControl = $input.parentElement;
  $formControl.classList.add('success');
  $formControl.classList.remove('error');
  const small = $formControl.querySelector('small');
  small.innerText = message;
}

// 라벨 이름 가져오기
function getLabelName($input) {
  return $input.nextElementSibling.innerText;
}
// 이메일 체크
function checkEmail($input) {
  const emailPattern =
    /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/i;
  if (!emailPattern.test($input.value)) {
    showError($input, 'email 형식이 유효하지 않습니다.');
    return;
  }
  showSuccess($input, `훌륭합니다.`);
  return true;
}
function checkPassword($input) {
  const pwPattern = /(?=.*[a-zA-ZS])(?=.*?[#?!@$%^&*-]).{6,24}/; // 문자와 특수문자 조합의 6~24 자리
  if (!pwPattern.test($input.value)) {
    showError(
      $input,
      '비밀번호는 영문자와 특수문자 조합의 6~24자리이어야 합니다.',
    );
    return;
  }
  showSuccess($input, `훌륭합니다.`);
  return true;
}

// 길이체크;
function checkLength($input, min, max) {
  if ($input.value.length < min) {
    showError(
      $input,
      `${getLabelName($input)}는 최소 ${min}자 이상이여야 합니다.`,
    );
  } else if ($input.value.length > max) {
    showError(
      $input,
      `${getLabelName($input)}는 최소 ${max}자 미만이여야 합니다.`,
    );
  } else {
    return true;
  }
}

function submitForm(event) {
  event.preventDefault();
  let chkEmail = checkEmail($email);
  let chkPsd = checkPassword($password);
  let chkLength = checkLength($password, USER_PW_MIN_LENGTH, USER_PW_MAX_LENGTH);
  if (chkEmail && chkPsd && chkLength) {
    fetch('http://elice-kdt-sw-1st-vm07.koreacentral.cloudapp.azure.com:3306/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: $email.value,
        password: $password.value,
      }),
    })
      .then((res) => {
        if (res.ok) {
          res.json().then((data) => {
            localStorage.setItem('email', data.user.email);
            localStorage.setItem('name', data.user.name);
            localStorage.setItem('nickName', data.user.nickName);
            localStorage.setItem('phoneNumber', data.user.phoneNumber);
            localStorage.setItem('isAdmin', data.user.isAdmin);
            localStorage.setItem('likes', data.user.likes);
            localStorage.setItem('shortId', data.user.shortId);
            localStorage.setItem('profileUrl', data.user.profileUrl);
            localStorage.setItem('token', data.token);
            window.location.href = "../main/mainPage.html";
          });
        } else {
          res.json().then((data) => {toastHandler('error', data.message)
        });
        }
      })
      .catch((err) => console.error(err));
  }
}

addEventListener('submit', submitForm);
