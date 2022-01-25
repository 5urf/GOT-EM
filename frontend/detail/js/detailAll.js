// url
const url = 'http://elice-kdt-sw-1st-vm07.koreacentral.cloudapp.azure.com:3306';

// 상품 정보 렌더링
const shoesImg = document.querySelector('#shoesImg');
const shoesBrand = document.querySelector('#shoesBrand');
const shoesName = document.querySelector('#shoesName');
const shoesPrice = document.querySelector('#shoesPrice');

const reviewsAllGraph = document.querySelector('.reviewsAllGraph');
const reviewsAllPeople = document.querySelector('.reviewsAllPeople');

const likes = document.querySelector('.likes');
const like = document.querySelector('#like');

const productQuery = new URL(document.location).searchParams;
const productId = productQuery.get('productId');
const shortId = productQuery.get('shortId');

fetch(`${url}/products/${productId}`,
        {
            headers:{
                authorization : `Bearer ${localStorage.getItem('token')}`
              }
        }
    )
    .then(res => res.json())
    .then(data => jsonProduct(data));

function jsonProduct(data) {
    shoesImg.innerHTML = `<img src=${data.imageUrl}>`;
    shoesName.innerHTML = `[${data.series}] ${data.modelName}`;
    shoesPrice.innerHTML = `${data.price.toLocaleString('ko-KR')}원`;
    likes.innerHTML = data.likeCount;

    if(data.isLike === true){
        like.innerHTML = '❤';
    } else {
        like.innerHTML = '♡'
    }

    console.log(data);
    let innerReviews = '';
    let innerPeople = '';

    const reviewCount = data.reviewsCount;

    const reviews = data.reviews;

    for(let key in reviews) {
        for(let detail in reviews[key]){
            innerReviews += `<progress value=${reviews[key][detail]} max=${reviewCount}></progress>`;
            innerPeople += `<div class="rap">${reviews[key][detail]}명</div>`;
        }
    }

    reviewsAllGraph.innerHTML = innerReviews;
    reviewsAllPeople.innerHTML = innerPeople;
}

like.addEventListener('click', likesToggle);

function likesToggle() {

    const likesCount = likes.textContent;
    if(like.textContent === '❤') {
        like.innerHTML = '♡';
        likes.innerHTML = Number(likesCount)- 1;

        fetch(`${url}/products/${productId}/like`,{
            headers:{
                authorization : `Bearer ${localStorage.getItem('token')}`
                }
        })
            .then(res => res.json())
            .then(data => console.log(data))
        

    } else {
        like.innerHTML = '❤';
        likes.innerHTML = Number(likesCount) + 1;

        fetch(`${url}/products/${productId}/like`,{
            headers:{
                authorization : `Bearer ${localStorage.getItem('token')}`
              }
        })
            .then(res => res.json())
            .then(data => console.log(data));
    }
}

// token

