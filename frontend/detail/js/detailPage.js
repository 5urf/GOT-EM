// 페이지네이션
const navigation = document.querySelector('.navigation');

fetch(`${url}/posts/product/${productId}`)
  .then((res) => res.json())
  .then((data) => jsonNavigate(data));

function jsonNavigate(data) {
  let totalData = Number(data.totalData);
  let totalPage = data.totalPage;
  let innerNavigation = ``;

  for (let i = 0; i < Number(totalPage); i++) {
    innerNavigation += `<button onclick='paging(${i + 1}, ${totalData})'>${
      i + 1
    }</button>`;
  }
  navigation.innerHTML = innerNavigation;

  paging(1, totalData);
}

// 게시글 페이지 구현
const feed = document.querySelector('.feedList');

function paging(page, totalData) {
  fetch(`${url}/posts/product/${productId}?perPage=10&page=${page}&created=desc`)
    .then((res) => res.json())
    .then((data) => {
      
      let json = data.posts;
      let innerPage = ``;
      totalData = totalData - (page - 1) * 10;

      json.forEach((element) => {
        if (element.notice === true) {
          innerPage += `
                    <tr>
                        <th>공지</th>
                        <th><a href='../detail/detailPageFeed.html?productId=${productId}&shortId=${
            element.shortId
          }'>${element.title}</a></th>
                        <th>${element.author.nickName}</th>
                        <th>${moment(element.createdAt).format(
                          'YYYY-MM-DD HH:mm:ss',
                        )}</th>
                        <th>${element.viewCount}</th>
                    </tr>`;
        } else {
          innerPage += `
                    <tr>
                        <td>${totalData}</td>
                        <td><a href='../detail/detailPageFeed.html?productId=${productId}&shortId=${
            element.shortId
          }'>${element.title}</a></td>
                        <td>${element.author.nickName}</td>
                        <td>${moment(element.createdAt).format(
                          'YYYY-MM-DD HH:mm:ss',
                        )}</td>
                        <td>${element.viewCount}</td>
                    </tr>`;
        }

        totalData--;
      });

      feed.innerHTML = innerPage;
    });
}

// 글쓰기
let postBtn = document.querySelector('#posting');

function toPost() {
  location.href = `../detail/detailPagePost.html?productId=${productId}`;
}

postBtn.addEventListener('click', toPost);
