const $form = document.querySelector('#form');
const $email = document.querySelector('#email');
const $name = document.querySelector('#name'); // 이름
const $nickName = document.querySelector('#nickName'); //닉네임
const $password = document.querySelector('#password'); // 비번 1
const $passwordChk = document.querySelector('#passwordChk'); // 비번 2
const $phoneNumber = document.querySelector('#phoneNumber');
const $checkAll = document.querySelector('#checkAll'); // 전체동의
const $checkBoxes = document.getElementsByName('agreement'); // 전체동의 제외 나머지 체크박스
// 연결
const URL = 'http://elice-kdt-sw-1st-vm07.koreacentral.cloudapp.azure.com:3306';
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

// 이메일 체크
function checkEmail($input) {
  const emailPattern =
    /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/i;
  if (!emailPattern.test($input.value)) {
    showError($input, 'email 형식이 유효하지 않습니다.');
    return;
  }
  showSuccess($input, '멋진 이메일입니다!');
  return true;
}
// 이름 체크
function checkName($input) {
  const namePattern = /^[가-힣]{2,4}|[a-zA-Z]{2,10}\s[a-zA-Z]{2,10}$/;
  if (!namePattern.test($input.value)) {
    showError($input, '올바른 이름을 작성해주세요.');
    return;
  }
  showSuccess($input, '멋진 이름입니다!');
  return true;
}

// 핸드폰번호
function checkPhoneNumber($input) {
  const pnPattern = /(^02.{0}|^01.{1}|[0-9]{3})([0-9]+)([0-9]{4})/g;

  if (!pnPattern.test($input.value)) {
    showError($input, '휴대폰 번호 형식이 유효하지 않습니다 ex)01000000000');
    return;
  }
  showSuccess($input, '멋진 휴대폰 번호입니다.');
  return true;
}
// 닉네임
function checkNickName($input) {
  const NnPattern = /^[ㄱ-ㅎ|가-힣|a-z|A-Z|0-9|\*]+$/;

  if (!NnPattern.test($input.value)) {
    showError($input, '닉네임은 한글,영문,숫자만 가능합니다.');
    return;
  }
  showSuccess($input, '멋진 닉네임입니다.');
  return true;
}

// pw 유효성
function checkPassword($input) {
  const pwPattern = /(?=.*[a-zA-ZS])(?=.*?[#?!@$%^&*-]).{6,24}/; // 문자와 특수문자 조합의 6~24 자리
  if (!pwPattern.test($input.value)) {
    showError(
      $input,
      '비밀번호는 영문자와 숫자,특수문자 조합의 6~24자리이어야 합니다.',
    );
    return;
  }
  showSuccess($input, '훌륭합니다.');
  return true;
}

function checkPasswordMatch($input1, $input2) {
  if ($input1.value !== $input2.value) {
    showError($input2, '비밀번호가 일치하지 않습니다');
    return;
  }
  showSuccess($input2, '일치합니다.');
  return true;
}

// 체크박스
$checkAll.addEventListener('click', function () {
  $checkBoxes.forEach((item) => {
    item.checked = $checkAll.checked;
  });
});
$checkBoxes.forEach((checkBox) => {
  checkBox.addEventListener('change', function (e) {
    if (e.target.checked == false) $checkAll.checked = false;
    if (
      document.querySelectorAll('.agreement:checked').length ==
      $checkBoxes.length
    )
      $checkAll.checked = true;
  });
});
// 체크박스 끝
function submitForm(event) {
  event.preventDefault();
  let chkEmail = checkEmail($email);
  let chkPsd = checkPassword($password);
  let chkPadMatch = checkPasswordMatch($password, $passwordChk);
  let chkName = checkName($name);
  let chkPn = checkPhoneNumber($phoneNumber);
  let chkNn = checkNickName($nickName);

  if (chkEmail && chkPsd && chkPadMatch && chkName && chkPn && chkNn) {
        fetch(`${URL}/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: $email.value,
          name: $name.value,
          password: $password.value,
          phoneNumber: $phoneNumber.value,
          nickName: $nickName.value,
        }),
      },
    )
      .then((res) => {
        if (res.ok) {
          res.json().then((data) => {
            toastHandler('success', '회원가입이 완료되었습니다.')
            localStorage.setItem('email', data.user.email);
            localStorage.setItem('name', data.user.name);
            localStorage.setItem('nickName', data.user.nickName);
            localStorage.setItem('phoneNumber', data.user.phoneNumber);
            localStorage.setItem('isAdmin', data.user.isAdmin);
            localStorage.setItem('likes', data.user.likes);
            localStorage.setItem('shortId', data.user.shortId);
            localStorage.setItem('profileUrl', data.user.profileUrl);
            localStorage.setItem('token', data.token);
          });
          setTimeout(() => {
            window.location.href = '../main/mainPage.html';
          }, 2000);
        } else {
          console.error(res.statusText);
          res.json().then((data) => toastHandler('error', data.error));
        }
      })
      .catch((err) => console.error(err));
  }
}

addEventListener('submit', submitForm);
