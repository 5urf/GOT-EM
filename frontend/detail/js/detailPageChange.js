// 뒤로 가기
let back = document.querySelector('#backMain');

function toFeed() {
  location.href = `../detail/detailPageFeed.html?productId=${productId}&shortId=${shortId}`;
}
back.addEventListener('click', toFeed);

// 기존 글 불러오기
const titleVal = document.querySelector('#postingTitle');
const textVal = document.querySelector('#postingText');

fetch(`${url}/posts/${shortId}`)
  .then((res) => res.json())
  .then((data) => jsonBasic(data));

function jsonBasic(data) {
  titleVal.value = data.title;
  textVal.innerHTML = data.content;

  let review = data.reviews;

  let reviewColorOrigin = review.color;
  let reviewFitOrigin = review.fit;
  let reviewFeelingOrigin = review.feeling;

  const fit = document.querySelector('.fit');
  const feeling = document.querySelector('.feeling');
  const color = document.querySelector('.color');

  let innerFit = '';
  let innerColor = '';
  let innerFeeling = '';

  for (let key in reviewColorOrigin) {
    if (reviewColorOrigin[key] == 1) {
      if (key == 'blur') {
        innerColor +=
          '흐려요 <input type="radio" name="color" value="blur" checked=true>';
      } else {
        innerColor += '흐려요 <input type="radio" name="color" value="blur">';
      }

      if (key == 'normal') {
        innerColor += `적당해요 <input type="radio" name="color" value="normal" checked=true>`;
      } else {
        innerColor +=
          '적당해요 <input type="radio" name="color" value="normal">';
      }

      if (key == 'clear') {
        innerColor +=
          '선명해요 <input type="radio" name="color" value="clear" checked=true>';
      } else {
        innerColor +=
          '선명해요 <input type="radio" name="color" value="clear" >';
      }
    }
  }
  color.innerHTML = innerColor;

  for (let key in reviewFitOrigin) {
    if (reviewFitOrigin[key] == 1) {
      if (key == 'small') {
        innerFit +=
          '작아요 <input type="radio" name="fit" value="small" checked=true>';
      } else {
        innerFit += '작아요 <input type="radio" name="fit" value="small">';
      }
      if (key == 'normal') {
        innerFit +=
          '딱 맞아요 <input type="radio" name="fit" value="normal" checked=true>';
      } else {
        innerFit += '딱 맞아요 <input type="radio" name="fit" value="normal">';
      }
      if (key == 'big') {
        innerFit +=
          '커요 <input type="radio" name="fit" value="big" checked=true>';
      } else {
        innerFit += '커요 <input type="radio" name="fit" value="big">';
      }
    }
  }
  fit.innerHTML = innerFit;

  for (let key in reviewFeelingOrigin) {
    if (reviewFeelingOrigin[key] == 1) {
      if (key == 'bad') {
        innerFeeling +=
          '나빠요 <input type="radio" name="feeling" value="bad" checked=true>';
      } else {
        innerFeeling +=
          '나빠요 <input type="radio" name="feeling" value="bad">';
      }
      if (key == 'moderate') {
        innerFeeling +=
          '적당해요 <input type="radio" name="feeling" value="moderate" checked=true>';
      } else {
        innerFeeling +=
          '적당해요 <input type="radio" name="feeling" value="moderate">';
      }
      if (key == 'good') {
        innerFeeling +=
          '좋아요 <input type="radio" name="feeling" value="good" checked=true>';
      } else {
        innerFeeling +=
          '좋아요 <input type="radio" name="feeling" value="good">';
      }
    }
  }
  feeling.innerHTML = innerFeeling;
}

// 수정하기
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

  fetch(`${url}/posts/write/${shortId}`, {
    method: 'PATCH',
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
      location.href = `../detail/detailPageFeed.html?productId=${productId}&shortId=${shortId}`;
      console.log(data);
    });
});
