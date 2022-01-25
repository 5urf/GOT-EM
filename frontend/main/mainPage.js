const mainPageUrl =
  'http://elice-kdt-sw-1st-vm07.koreacentral.cloudapp.azure.com:3306';

const allItem = document.querySelector('.allProduct');
const eachItemBtn = document.querySelector('.eachItemBtn');

fetch(`${mainPageUrl}/products?perPage=15`,{
  headers:{
    authorization : `Bearer ${localStorage.getItem('token')}`
  }
})
  .then((res) => res.json())
  .then((data) => {
    jsonAll(data);
  });

fetch(`${mainPageUrl}/products?perPage=7&like=desc`,
  {
    headers:{
      authorization : `Bearer ${localStorage.getItem('token')}`
    }
  })
  .then((res) => res.json())
  .then((data) => {
    
    renderTop(data);
  });

function renderTop(data) {
  // 탑 상품 렌더링
  const $TopGallery = document.querySelector('.TopGallery');
  let innerAllItem = ``;
  let json = data.products;
  json.forEach((element) => {
    let isLike = `<span><i class="far fa-heart"></i></span>`;

    if (element.isLike === true) {
      isLike = `<span class="active"><i class="fas fa-heart"></i></span>`;
    }
    innerAllItem += `
        
            <div class="item" onclick="location.href='../detail/detailPage.html?productId=${element.shortId}'">
                <div class="imageWrapper">
                    <img src=${element.imageUrl}>
                </div>
                <p class="name">
                ${element.modelName}
                
                ${isLike}
                </p>
                
            </div>
        
        `;
  });
  $TopGallery.innerHTML = innerAllItem;
}

function jsonAll(data) {
  const totalProduct = document.querySelector('#totalProduct');
  totalProduct.innerHTML = `Dropped <strong>${data.totalData}</strong><br><span class="releaseTitle">발매제품</span> `;

  let innerAllItem = ``;
  let json = data.products;

  json.forEach((element) => {
    let isLike = `<span><i class="far fa-heart"></i></span>`;

    if (element.isLike === true) {
      isLike = `<span class="active"><i class="fas fa-heart"></i></span>`;
    }
    innerAllItem += `
        <div class="eachItem">
            <div class="eachItemImg">
                <button class="eachItemBtn" onclick="location.href='../detail/detailPage.html?productId=${element.shortId}'"><img src=${element.imageUrl} class="eachItemImgDetail"></button>
            </div>
            <div class="eachItemSeries">
                ${element.series}
            </div>
            <div class="eachItemName">
                ${element.modelName}
            </div>
            <div class="eachItemPrice">
                발매가 : ${element.price.toLocaleString('ko-KR')}원 
            </div>
            <div class="eachItemBottom">
                나의 관심 ${isLike}
            </div>
            <p class="likeStatus">
                    ${element.likeCount}명의 좋아요
            </p>
            
        </div>
        `;
  });
  allItem.innerHTML = innerAllItem;
}
