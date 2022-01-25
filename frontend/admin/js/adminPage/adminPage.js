const query = new URL(document.location).searchParams;
let page = parseInt(query.get('page'));

const tableBody = document.querySelector('.product_list_wrap>table>tbody');
const paginationWrap = document.querySelector('.pagination_wrap');

// 등록 상품 렌더링
const renderProducts = (products) => {
  tableBody.innerHTML = '';
  products.map((post) => {
    let {
      shortId,
      imageUrl,
      modelName,
      modelNumber,
      color,
      price,
      releaseDate,
      likeCount,
    } = post;

    tableBody.innerHTML += `
      <tr>
        <td>
          <img src=${imageUrl[0]}>
        </td>
        <td>
          <a href='../detail/detailPage.html?productId=${shortId}'>${modelName}</a>
        </td>
        <td>${modelNumber}</td>
        <td>${color}</td>
        <td>${price.toLocaleString()}원</td>
        <td>${releaseDate.substr(0, 10)}</td>
        <td>${likeCount}</td>
        <td>
          <input class="product_detail_router_button ${shortId}" 
            type="button" 
            value="수정"
          >
        </td>
      </tr>
      `;
  });

  const routerEventAdd = () => {
    const routerButtons = document.querySelectorAll(
      '.product_detail_router_button',
    );
    // event 추가
    routerButtons.forEach((ele) => {
      ele.addEventListener('click', (e) => {
        location.href = `./adminPageModify.html?shortId=${e.target.classList[1]}&page=${page}`;
      });
    });
  };
  routerEventAdd();
};

// pagenation setting
const settingPagination = (postDataArray) => {
  const { page, totalPage, totalData, perPage } = postDataArray;

  // 보여줄 페이지네이션 제한
  const pageLimit = 5;
  const pageGroup = Math.ceil(page / pageLimit);

  // last 구하기
  let last = pageGroup * pageLimit;
  if (last > totalPage) {
    last = totalPage;
  }
  // first 구하기
  let first = last - (pageLimit - 1);
  if (first <= 0) {
    first = 1;
  }
  return { first, last };
};

// pagenation redering
const renderPagination = (first, last, totalPage, parentDOM) => {
  const pageList = [];
  const classId = ['prevBtn', 'nextBtn'];
  const className = [
    'pagination_nav',
    'pagination_ul',
    'pagination_li',
    'pagination_a',
  ];

  const redirectURL = './adminPage.html?perPage=5&page=';
  if (!page) page = 1;

  let template = `
    <nav class=${className[0]}>
      <ul class=${className[1]}>
        <li class="pagination_prev_button">
          <a id=${classId[0]} class="" href="${redirectURL}${
    page - 1
  }"><이전</a>
        </li>
        {{__li>a__}}
        <li class="pagination_next_button">
          <a id=${classId[1]} class="" href="${redirectURL}${
    page + 1
  }">다음></a>
        </li>
      </ul>
    </nav>`;

  for (let i = first; i < last + 1; i++) {
    if (i == page) {
      pageList.push(
        `<li class="pagination_li selected"}>
          <a class=${className[3]} href="${redirectURL}${i}">${i}</a>
        </li>
        `,
      );
    } else {
      pageList.push(
        `<li class=${className[2]}>
          <a class=${className[3]} href="${redirectURL}${i}">${i}</a>
        </li>
        `,
      );
    }
  }

  template = template.replace('{{__li>a__}}', pageList.join(''));
  parentDOM.innerHTML = template;

  // 이전, 다음버튼 클래스 추가
  if (first <= 1) {
    prevBtn.classList.add('hidden');
  }
  if (last >= totalPage) {
    nextBtn.classList.add('hidden');
  }
};

// posts GET method
const adminProductsGet = (pageNum) => {
  // GET method
  if (!pageNum) pageNum = 1;

  const getPosts = async (pageNum) => {
    try {
      const reqConfig = {
        headers: {
          authorization: `Bearer ${accessToken}`,
        },
        mode: 'cors',
        credentials: 'include',
      };
      const response = await fetch(
        `${url}/products/admin/${userShortId}?perPage=5&page=${pageNum}`,
        reqConfig,
      );
      const posts = response.json();

      return posts;
    } catch (err) {
      console.error('Error:', err);
    }
  };

  getPosts(pageNum)
    .then((response) => {
      const { products, ...list } = response;
      const { first, last } = settingPagination(list);

      renderPagination(first, last, response.totalPage, paginationWrap);
      return response;
    })
    .then((response) => {
      renderProducts(response.products);
      return response;
    })
    .catch((err) => console.error(err));

  window.scrollTo(0, 0);
};

// 호출
adminProductsGet(page);
