// 뒤로 가기
let back = document.querySelector('#backMain');
function toMain() {
  location.href = `../detail/detailPage.html?productId=${productId}`;
}
back.addEventListener('click', toMain);

let submit = document.querySelector('#submit');

submit.addEventListener('click', function () {
  const fit = document.querySelector('input[name=fit]:checked').value;
  const feeling = document.querySelector('input[name=feeling]:checked').value;
  const color = document.querySelector('input[name=color]:checked').value;

  const fitObject = {
    small: 0,
    normal: 0,
    big: 0,
  };

  const feelingObject = {
    good: 0,
    moderate: 0,
    bad: 0,
  };
  const colorObject = {
    clear: 0,
    normal: 0,
    blur: 0,
  };
  fitObject[fit] = 1;
  feelingObject[feeling] = 1;
  colorObject[color] = 1;

  let reviews = {
    color: colorObject,
    feeling: feelingObject,
    fit: fitObject,
  };

  const titleVal = document.querySelector('#postingTitle');
  const textVal = document.querySelector('#postingText');

  if(titleVal.value !== '' || textVal.value !== '')
  {
    fetch(`${url}/posts/write/${productId}`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      authorization: `Bearer ${localStorage.getItem('token')}`,
    },
    body: JSON.stringify({
      reviews,
      title: titleVal.value,
      content: textVal.value,
    }),
  })
    .then((res) => res.json())
    .then((data) => {
      console.log(data);
      location.href = `../detail/detailPage.html?productId=${productId}`;
    });
  }
  else {
    alert('제목과 내용을 확인해주세요 !');
  }
});
