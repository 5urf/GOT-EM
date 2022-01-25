const tableBody = document.querySelector('.product_list_wrap>table>tbody');
const url = 'http://elice-kdt-sw-1st-vm07.koreacentral.cloudapp.azure.com:3306';

fetch(`${url}/users/${userShortId}/like`, {
  headers: {
    authorization: `Bearer ${accessToken}`,
  },
  mode: 'cors',
  credentials: 'include',
})
  .then((res) => res.json())
  // .then((res) => console.log(res))
  .then((data) => jsonAll(data))
  .catch((err) => console.error(err));

function jsonAll(data) {
  const itemList = [];
  let json = data;

  let template = `
  <ul class="wish_list">
    {{__list__}}
  <ul>
  `;

  json.forEach((product, index) => {
    // limit 50
    if (index > 49) return;
    const {
      shortId,
      modelName,
      modelNumber,
      price,
      color,
      releaseDate,
      imageUrl,
      likeCount,
    } = product;

    itemList.push(`
      <tr>
      <td>
        <img src=${imageUrl[0]}>
      </td>
      <td>
        <strong>
          <a href='../detail/detailPage.html?productId=${shortId}'>
            ${modelName}
          </a>
        </strong>
      </td>
      <td>${modelNumber}</td>
      <td>${color}</td>
      <td>${price.toLocaleString()}원</td>
      <td>${releaseDate.substr(0, 10)}</td>
      <td>${likeCount}</td>
      <td>
        <input class="product_enter ${shortId}"
          type="button"
          value="상세보기"
        >
      </td>
    </tr>
      `);
  });

  template = template.replace('{{__list__}}', itemList.join(''));

  tableBody.innerHTML = template;

  // event add
  const routerEventAdd = () => {
    const enterButtons = document.querySelectorAll('.product_enter');

    // event 추가
    enterButtons.forEach((ele) => {
      ele.addEventListener('click', (e) => {
        location.href = `../detail/detailPage.html?productId=${e.target.classList[1]}`;
      });
    });
  };

  routerEventAdd();
}
