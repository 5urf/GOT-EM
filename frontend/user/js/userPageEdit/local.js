window.onload = function () {
    const $email = document.querySelector('#email'); // 이메일
    const $name = document.querySelector('#name');
    const $phoneNumber = document.querySelector('#phoneNumber');
    const $defaultNickName = document.querySelector('#defaultNickName');
    const $defaultPassword = document.querySelector('#defaultPassword');
    const navUserImg = document.querySelector('#navUserImg');
    const navUserBtn = document.querySelector('.navUserBtn');
    const $image = document.querySelector('.image');
    $email.value = localStorage.getItem('email');
    $name.value = localStorage.getItem('name');
    $defaultNickName.value = localStorage.getItem('nickName');
    $phoneNumber.value = localStorage.getItem('phoneNumber');
    $image.src = localStorage.getItem('profileUrl');
    $defaultPassword.value = 'abcdef'
    
    navUserImg.src = localStorage.getItem('profileUrl');
    navUserBtn.innerHTML = localStorage.getItem('nickName');
}