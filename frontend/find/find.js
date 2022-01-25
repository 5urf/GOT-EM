const $phoneNumber = document.querySelector('#phoneNumber');
const $emailForm = document.querySelector('#email-form'); // 이메일 찾기 폼
const $pwForm = document.querySelector('#pw-form'); // 비밀번호 찾기 폼
const $receiveEmail = document.querySelector('#receiveEmail'); // 아디 찾을때 받는 이메일
const $email = document.querySelector('#email'); // 비밀번호 찾기에 입력하는 이메일
// 연결 관련
const URL = 'http://elice-kdt-sw-1st-vm07.koreacentral.cloudapp.azure.com:3306';

// 공용으로 사용되는 함수
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
// 이메일 찾기 유효성 검사
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

function checkPhoneNumber($input) {
  const pnPattern = /(^02.{0}|^01.{1}|[0-9]{3})([0-9]+)([0-9]{4})/g;
  const phErrorTxt = document.querySelector('.phErrorTxt');
  if (!pnPattern.test($input.value)) {
    phErrorTxt.id = 'phError';
    phErrorTxt.innerText =
      '휴대폰 번호 형식이 유효하지 않습니다 ex)01000000000';
    return ;
  }
  phErrorTxt.id = 'phSuccess';
  phErrorTxt.innerText = '훌륭합니다.';
  return true;
}

// 이메일 찾기 폼 함수
function submitEmailForm(e) {
  e.preventDefault();
  let chkPn = checkPhoneNumber($phoneNumber);
  let chkReceiveEmail = checkEmail($receiveEmail);
  if(chkPn && chkReceiveEmail) {
    fetch(`${URL}/find-email`, {
      method : "POST",
      headers: {"Content-Type": "application/json"},
      body : JSON.stringify({
        phoneNumber : $phoneNumber.value,
        email : $receiveEmail.value
      })
    })
    .then(res => {
      if(res.ok){
        res.json().then(data => {
          toastHandler('success',data.success)
        })
      } else {
        res.json().then(data => {
          toastHandler('error',data.error)
        })
      }
    })
  }
}

// 비밀번호 찾기 폼 함수
function submitPwForm(e) {
  e.preventDefault();
  let chkEmail = checkEmail($email);
  if (chkEmail) {
    fetch("http://elice-kdt-sw-1st-vm07.koreacentral.cloudapp.azure.com:3306/reset-password", {
      method : "POST",
      headers: {"Content-Type": "application/json"},
      body : JSON.stringify({
        email : $email.value,
        
      })
    })
    .then(res => {
      if(res.ok){
        res.json().then(data => {
          toastHandler('success',data.success)
        })
      } else {
        res.json().then(data => {
          toastHandler('error',data.error)})
      }
    })
  }
}

$emailForm.addEventListener('submit', submitEmailForm);
$pwForm.addEventListener('submit', submitPwForm);
