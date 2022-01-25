// 이미지 관련
const $upload = document.querySelector('#upload');
const $image_container = document.querySelector('.image_container');
const $image = document.querySelector('.image');
// 비번 변경 관련
const $defaultPassword = document.querySelector('#defaultPassword'); // 원래 비번 인풋
const $changePwBtn = document.querySelector('.changePwBtn'); // 비번 변경하기 버튼
const $changePassword = document.querySelector('#changePassword'); // 변경할 비번 적는 인풋
const defaultPwArea = document.querySelector('.inner__inforArea__pw'); //기본 비번 div
const modifyPwArea = document.querySelector('.modify__area__pw'); // 토글되어 나오는 비번 div
const $pwModifyOkBtn = document.querySelector('.pw__modify__ok'); // 토글되어 나오는 비번 변경버튼
const $pwModifyNoBtn = document.querySelector('.pw__modify__no'); // 토글되어 나오는 비번변경 취소버튼

// 닉변 관련
const $defaultNickName = document.querySelector('#defaultNickName'); // 원래 닉네임 인풋
const $changeNicknameBtn = document.querySelector('.changeNicknameBtn'); // 닉네임 변경하기 버튼
const $changeNickName = document.querySelector('#changeNickName'); // 변경할 닉네임 적는 인풋
const defaultNickNameArea = document.querySelector('.inner__inforArea__nn') //기본 닉넴 인풋div
const modifyNickNameArea = document.querySelector('.modify__area__nn'); // 토글되어 나오는 닉네임 div
const $nickNameModifyOkBtn = document.querySelector('.nn__modify__ok'); // 토글되어 나오는 닉네임 변경 버튼
const $nickNameModifyNoBtn = document.querySelector('.nn__modify__no'); // 토글되어 나오는 닉네임 취소 버튼
const navUserBtn = document.querySelector('.navUserBtn'); // 헤더에 들어가는 닉네임 
// 인증 관련
const ACCESSTOKEN = localStorage.getItem('token');
const shortId = localStorage.getItem('shortId');
const URL = 'http://elice-kdt-sw-1st-vm07.koreacentral.cloudapp.azure.com:3306';

// 이미지 처리
function imageCheck (e) {
  const ImagePattern = /(.*?)\.(jpg|jpeg|png|gif|pdf)$/i;
  let file = e.target.files[0];

  if(!file.name.match(ImagePattern)){
    alert('이미지 파일만 선택가능합니다.');
    $image.src = localStorage.getItem('profileUrl');
    e.target.value = '';
    return
  }
}

function previewHandler() {
  const reader = new FileReader();
  const file = $upload.files[0];
  if (!file) {
    return;
  }
  reader.readAsDataURL(file);
  reader.onloadend = () => {
    $image.src = reader.result;
  };
}

function uploadhandler() {
  let formData = new FormData();
  const file = $upload.files[0];
  formData.append('image', file);
  fetch(
    `${URL}/images/upload`,
    {
      method: 'POST',
      headers: {
        authorization: `Bearer ${ACCESSTOKEN}`
      },
      mode: 'cors',
      credentials: 'include',
      body: formData,
    },
  )
    .then((res) => {
      res.json().then((data) => {
        localStorage.setItem('profileUrl',data[0]);
        navUserImg.src = localStorage.getItem('profileUrl');
        fetch(`${URL}/users/${shortId}/modify`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            authorization: `Bearer ${ACCESSTOKEN}`
          },
          mode: 'cors',
          credentials: 'include',
          body: JSON.stringify({
            profileUrl : data[0],
          })
        })
      })
      .then(alert('변경 되었습니다.'))
      .catch(error => console.error(error))
    })
}


$upload.addEventListener('change', (e) => {
  imageCheck (e);
  previewHandler();
});
// 이미지 끝

// 비번 변경
function changePwToggle(){
  defaultPwArea.style.display = 'none';
  modifyPwArea.style.display = 'block';
}
function NoChangePwToggle(){
  defaultPwArea.style.display = 'block';
  modifyPwArea.style.display = 'none';
}

function checkPassword($input) {
  const pwPattern = /(?=.*[a-zA-ZS])(?=.*?[#?!@$%^&*-]).{6,24}/; // 문자와 특수문자 조합의 6~24 자리
  if (!pwPattern.test($input.value)) {
    alert('비밀번호는 영문자와 숫자,특수문자 조합의 6~24자리이어야 합니다.')
    return;
  }
  return true;
}

function pwChange () {
  let chPw = checkPassword($changePassword);
  if(chPw) {
    fetch(`${URL}/users/${shortId}/change-password`,
          {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              authorization: `Bearer ${ACCESSTOKEN}`
            },
            mode: 'cors',
            credentials: 'include',
            body: JSON.stringify({
              password : $changePassword.value
            })
          })
          .then((res)=>{
            alert('변경이 완료되었습니다.');
            $changePassword.value = ''
            NoChangePwToggle();
          })

  }
}
$changePwBtn.addEventListener('click',changePwToggle);
$pwModifyNoBtn.addEventListener('click',NoChangePwToggle)
$pwModifyOkBtn.addEventListener('click',pwChange);
// 닉변 
// 닉네임
function changeNickNameToggle(){
  defaultNickNameArea.style.display = 'none';
  modifyNickNameArea.style.display = 'block';
}
function NoChangeNickNameToggle(){
  defaultNickNameArea.style.display = 'block';
  modifyNickNameArea.style.display = 'none';
}

$changeNicknameBtn.addEventListener('click',changeNickNameToggle);
$nickNameModifyNoBtn.addEventListener('click',NoChangeNickNameToggle)

function checkNickName($input) {
  const NnPattern = /^[ㄱ-ㅎ|가-힣|a-z|A-Z|0-9|\*]+$/;

  if (!NnPattern.test($input.value)) {
    alert('닉네임은 한글,영문,숫자만 가능합니다.')
    return;
  }
  return true;
}



function nickChange () {
  let chkNn = checkNickName($changeNickName);
  if(chkNn){
    fetch(`${URL}/users/${shortId}/modify`,
          {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
              authorization: `Bearer ${accessToken}`
            },
            mode: 'cors',
            credentials: 'include',
            body: JSON.stringify({
              nickName : $changeNickName.value
            })
          })
          .then((res)=>{
            alert('변경이 완료되었습니다.');
            localStorage.setItem('nickName',$changeNickName.value);
            $defaultNickName.value = localStorage.getItem('nickName');
            navUserBtn.innerHTML = localStorage.getItem('nickName');
            NoChangeNickNameToggle();
          })
  }
}
$nickNameModifyOkBtn.addEventListener('click',nickChange);

// 탈퇴
const $deleteBTN = document.querySelector('.deleteBTN');
function deleteUser () {
  if(confirm('정말 탈퇴하시겠습니까?') == true){
    fetch(`${URL}/delete-account`,{
        method: 'GET',
        headers: {
          authorization: `Bearer ${accessToken}`,
        },
        mode:'cors',
        credentials:'include'
      },
    )
      .then((res) => {
        alert('탈퇴 완료되었습니다.');
        localStorage.clear();
        return res.json();
      })
      .then((res) => {
        window.location.href = '../beforeMainPage/beforMainPage.html'
      });
  } else {
    return;
  }
}
$deleteBTN.addEventListener('click',deleteUser)