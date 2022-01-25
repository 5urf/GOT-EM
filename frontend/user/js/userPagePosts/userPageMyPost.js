const url = 'http://elice-kdt-sw-1st-vm07.koreacentral.cloudapp.azure.com:3306';
const mypost = `${url}/users/${userShortId}/posts`;

const query = new URL(document.location).searchParams;
let page = parseInt(query.get('page'));

const tableBody = document.querySelector('.product_list_wrap>table>tbody');
const paginationWrap = document.querySelector('.pagination_wrap');

// posts GET method
const userProductsGet = (userId) => {
  // GET method
  const getPosts = async (userId) => {
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

// 등록 상품 렌더링
const renderProducts = (posts) => {
  tableBody.innerHTML = '';

  posts.map((post) => {
    const { createdAt, title, commentCount, viewCount, product, shortId } =
      post;

    let { imageUrl, modelName, modelNumber, series, color } = product;
    tableBody.innerHTML += `
      <tr>
        <td>   
          <div class="table_product_info">    
            <img src="${imageUrl[0]}">
            <ul>
              <li><b>${series}</b></li>
              <li>${modelName}</li>
              <li>${modelNumber}</li>
              <li>${color}</li>
            </ul>
          </div>
        </td>
        <td>
          <strong>  
            <a href='../detail/detailPageFeed.html?productId=${
              product.shortId
            }&shortId=${shortId}'>
              ${title}
            </a>
          </strong>
        </td>
        <td>${createdAt.substr(0, 10)}</td>
        <td>${commentCount}</td>
        <td>${viewCount}</td>
        <td>
          <input class="post_enter ${product.shortId} ${shortId}"
            type="button"
            value="상세보기"
          >
        </td>
      </tr>
      `;
  });

  const routerEventAdd = () => {
    const routerButtons = document.querySelectorAll('.post_enter');
    // event 추가
    routerButtons.forEach((ele) => {
      ele.addEventListener('click', (e) => {
        const productId = e.target.classList[1];
        const shrotId = e.target.classList[2];

        location.href = `../detail/detailPageFeed.html?productId=${productId}&shortId=${shrotId}`;
      });
    });
  };
  routerEventAdd();
};

userProductsGet();
