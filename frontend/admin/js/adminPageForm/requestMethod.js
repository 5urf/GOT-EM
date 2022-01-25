// 상품등록
const adminURL = './adminPage.html';

// POST
const productPOST = () => {
  const reqConfig = {
    method: 'POST',
    body: JSON.stringify({
      modelName: inputProductName.value,
      modelNumber: inputProductNumber.value,
      series: inputProductSeries.value,
      color: inputProductColor.value,
      price: inputProductPrice.value,
      releaseDate: inputProductYear.value,
      imageUrl: savedImageUrl,
    }),
    headers: {
      'Content-Type': 'application/json',
      authorization: `Bearer ${accessToken}`,
    },
    mode: 'cors',
    credentials: 'include',
  };

  fetch(`${url}/products/enroll`, reqConfig)
    .then((res) => res.json())
    // .then((response) => console.log('Success', JSON.stringify(response)))
    .then(() => (location.href = adminURL))
    .catch((err) => console.error('Error:', err));
};

// PATCH
const productPATCH = () => {
  const reqConfig = {
    method: 'PUT',
    body: JSON.stringify({
      modelName: inputProductName.value,
      modelNumber: inputProductNumber.value,
      series: inputProductSeries.value,
      color: inputProductColor.value,
      price: inputProductPrice.value,
      releaseDate: inputProductYear.value,
      imageUrl: savedImageUrl,
    }),
    headers: {
      'Content-Type': 'application/json',
      authorization: `Bearer ${accessToken}`,
    },
    mode: 'cors',
    credentials: 'include',
  };

  fetch(`${url}/products/enroll/?${productShortId}`, reqConfig)
    .then((res) => res.json())
    // .then((response) => console.log('Success', JSON.stringify(response)))
    .then(() => (location.href = adminURL))
    .catch((err) => console.error('Error:', err));
};

// DELETE
const productDELETE = (productShortId) => {
  const reqConfig = {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      authorization: `Bearer ${accessToken}`,
    },
    mode: 'cors',
    credentials: 'include',
  };

  fetch(`${url}/products/${productShortId}`, reqConfig)
    .then((res) => res.json())
    // .then((response) => console.log('Success', JSON.stringify(response)))
    .then(() => (location.href = adminURL + `?page=${page}`))
    .catch((err) => console.error('Error:', err));
};

// check function
const removeConfirm = () => {
  const check = confirm('해당 상품을 정말 삭제하시겠습니까?');
  if (check) productDELETE(productShortId);
};

// event
if (postButton) postButton.addEventListener('click', productPOST);
if (patchButton) patchButton.addEventListener('click', productPATCH);
removeButton.addEventListener('click', removeConfirm);

inputProductForm.addEventListener('submit', (e) => {
  e.preventDefault();
});
