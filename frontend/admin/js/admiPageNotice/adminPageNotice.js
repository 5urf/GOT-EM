const mypost = `${url}/users/${userShortId}/posts`;

const tableBody = document.querySelector('.product_list_wrap>table>tbody');
const paginationWrap = document.querySelector('.pagination_wrap');

// 공지 렌더링
const renderProducts = (posts) => {
  tableBody.innerHTML = '';

  let postNumber = posts.length;

  posts.map((post) => {
    const {
      author,
      createdAt,
      notice,
      title,
      commentCount,
      viewCount,
      product,
      shortId,
    } = post;

    if (product) {
      let { modelName, imageUrl, modelNumber, color } = product;

      const postType = notice ? '공지' : '후기';

      tableBody.innerHTML += `
      <tr>
      <td>${postNumber--}</td>
        <td>
          <div class="table_product_info">
            <img src="${imageUrl}">
            <ul>
              <li>${modelName}</li>
              <li>${modelNumber}</li>
              <li>${color}</li>
            </ul>
          </div>
        </td>
        <td>${postType}</td>
        <td>
          <strong>
            <a href='../detail/detailPageFeed.html?productId=${
              product.shortId
            }&shortId=${shortId}'>
              ${title}
            </a>
          </strong>
        </td>
        <td>${author.name}</td>
        <td>${createdAt.substr(0, 10)}</td>
        <td>${commentCount}</td>
        <td>${viewCount}</td>
        <td>
          <input class="post_enter ${product.shortId} ${shortId}"
            type="button"
            value="수정"
          >
        </td>
      </tr>
      `;
    }
  });

  const routerEventAdd = () => {
    const routerButtons = document.querySelectorAll('.post_enter');
    // event 추가
    routerButtons.forEach((ele) => {
      ele.addEventListener('click', (e) => {
        const productId = e.target.classList[1];
        const shortId = e.target.classList[2];

        location.href = `../detail/detailPageFeed.html?productId=${productId}&shortId=${shortId}`;
      });
    });
  };
  routerEventAdd();
};

// posts GET method
const adminProductsGet = () => {
  // GET method
  const getPosts = async () => {
    try {
      const reqConfig = {
        headers: {
          authorization: `Bearer ${accessToken}`,
        },
        mode: 'cors',
        credentials: 'include',
      };

      const response = await fetch(mypost, reqConfig);
      const posts = response.json();

      return posts;
    } catch (err) {
      console.error('Error:', err);
    }
  };

  getPosts()
    .then((response) => {
      renderProducts(response.products);
    })
    .catch((err) => console.error(err));
};

adminProductsGet(userShortId);
