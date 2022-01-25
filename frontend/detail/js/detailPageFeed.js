// 뒤로 가기
let back = document.querySelector('#backMain');
function toMain() {
  location.href = `../detail/detailPage.html?productId=${productId}`;
}
back.addEventListener('click', toMain);

// 메인 페이지 렌더링
const title = document.querySelector('#title');
const author = document.querySelector('#author');
const time = document.querySelector('#time');
const feedDetail = document.querySelector('.feedDetail');

const controlPost = document.querySelector('.controlPost');

const repliesFeed = document.querySelector('.repliesFeed');
const repliesAll = document.querySelector('#repliesAll');

fetch(`${url}/posts/${shortId}`)
  .then((res) => res.json())
  .then((data) => {
    jsonFeed(data);
    reviewsCheck(data);
  });

const reviewsFit = document.querySelector('#reviewsFit');
const reviewsFeeling = document.querySelector('#reviewsFeeling');
const reviewsColor = document.querySelector('#reviewsColor');

function reviewsCheck(data) {
  const fitCheck = data.reviews.fit;
  const colorCheck = data.reviews.color;
  const feelingCheck = data.reviews.feeling;

  let changeKor = '';

  for (let key in fitCheck) {
    if (fitCheck[key] === 1) {
      if (key == 'small') {
        changeKor = '작아요';
      } else if (key == 'normal') {
        changeKor = '딱 맞아요';
      } else if (key == 'big') {
        changeKor = '커요';
      }
      reviewsFit.innerHTML = `사이즈 &nbsp: &nbsp<strong>${changeKor}</strong>`;
    }
  }

  for (let key in colorCheck) {
    if (colorCheck[key] === 1) {
      if (key == 'blur') {
        changeKor = '흐려요';
      } else if (key == 'normal') {
        changeKor = '적당해요';
      } else if (key == 'clear') {
        changeKor = '선명해요';
      }
      reviewsColor.innerHTML = `색감 &nbsp: &nbsp<strong>${changeKor}</strong>`;
    }
  }

  for (let key in feelingCheck) {
    if (feelingCheck[key] === 1) {
      if (key == 'bad') {
        changeKor = '나빠요';
      } else if (key == 'moderate') {
        changeKor = '적당해요';
      } else if (key == 'good') {
        changeKor = '좋아요';
      }
      reviewsFeeling.innerHTML = `착화감 &nbsp: &nbsp<strong>${changeKor}</strong>`;
    }
  }
}

function jsonFeed(data) {
  title.innerHTML = data.title;
  author.innerHTML = data.author.nickName;
  time.innerHTML = moment(data.createdAt).format('YYYY-MM-DD HH:mm:ss');
  feedDetail.innerHTML = data.content;

  //수정하기 삭제하기 나타내는 부분
  if (
    data.author.email === localStorage.email ||
    localStorage.isAdmin === true
  ) {
    controlPost.style.display = '';
  } else {
    controlPost.style.display = 'none';
  }
}
// 글 삭제

const deleteBtn = document.querySelector('#deletePost');

function deletePost() {
  fetch(`${url}/posts/${shortId}`, {
    method: 'DELETE',
    headers: {
      authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  })
    .then((res) => res.json())
    .then((data) => {
      location.href = `../detail/detailPage.html?productId=${productId}`;
      
    });
}

deleteBtn.addEventListener('click', deletePost);

//댓글 렌더링
fetch(`${url}/posts/${shortId}/comments`)
  .then((res) => res.json())
  .then((data) => jsonComment(data));

function jsonComment(data) {
  let innerCommentCount = `<p>전체 댓글 ( ${data.length} )</p>`;
  repliesAll.innerHTML = innerCommentCount;

  let innerComments = ``;
  let count = 0;
  data.forEach((element) => {
    innerComments += `
        <div>
            <div class="repliesDetail">
                <div class="repliesFeedAuthor">
                    ${element.author.nickName}
                </div>
                <div class="repliesFeedTime">
                    ${moment(element.createdAt).format('YYYY-MM-DD HH:mm:ss')}
                </div>
            </div>
            <div class="repliesControl">
            <div class="repliesFeedContent">
                ${element.content}
            </div>`;
    count++;

    if (
      element.author.email === localStorage.email ||
      localStorage.isAdmin === true
    ) {
      
      innerComments += `<button id=${element.shortId} onclick = deleteComment(this.id);>삭제</button>`;
    }

    innerComments += '</div>    </div>';
  });
  repliesFeed.innerHTML = innerComments;
}
// 댓글 등록
const repliesWrite = document.querySelector('#repliesWrite');
const repliesSubmit = document.querySelector('#repliesSubmit');

repliesSubmit.addEventListener('click', function () {
  fetch(`${url}/posts/${shortId}/comments`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      authorization: `Bearer ${localStorage.getItem('token')}`,
    },
    body: JSON.stringify({
      content: repliesWrite.value,
    }),
  })
    .then((res) => res.json())
    .then((data) => {
      location.href = `../detail/detailPageFeed.html?productId=${productId}&shortId=${shortId}`;

    });
});

// 댓글 삭제
function deleteComment(id) {
    
    fetch(`${url}/posts/${shortId}/comments/${id}`, {
        method: 'DELETE',
        headers: {
          authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      })
    .then((res) => res.json())
    .then((data) => {
      location.href = `../detail/detailPageFeed.html?productId=${productId}&shortId=${shortId}`;
      
    });
  
}

let change = document.querySelector('#changePost');

function toChange() {
  location.href = `../detail/detailPageChange.html?productId=${productId}&shortId=${shortId}`;
}

change.addEventListener('click', toChange);

//댓글 토글하기
const showHide = document.querySelector('#showHide > button');
showHide.innerHTML = '숨기기';

showHide.addEventListener('click', function () {
  if (showHide.textContent == '숨기기') {
    showHide.innerHTML = '보기';
    repliesFeed.style.display = 'none';
  } else {
    showHide.innerHTML = '숨기기';
    repliesFeed.style.display = '';
  }
});
