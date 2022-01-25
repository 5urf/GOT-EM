const query = new URL(document.location).searchParams;
const productShortId = query.get('shortId');
const page = query.get('page');

const getDetailProduct = async () => {
  const response = await fetch(`${url}/products/${productShortId}`, {
    headers: {
      'Content-Type': 'application/json',
      authorization: `Bearer ${accessToken}`,
    },
    mode: 'cors',
    credentials: 'include',
  });

  const posts = response.json();
  return posts;
};

const insertInputValue = (data) => {
  const {
    imageUrl,
    modelName,
    modelNumber,
    series,
    price,
    releaseDate,
    color,
  } = data;

  savedImageUrl = imageUrl;
  inputProductImage.filelist = imageUrl;
  inputProductName.value = modelName;
  inputProductNumber.value = modelNumber;
  inputProductSeries.value = series;
  inputProductPrice.value = price;
  inputProductYear.value = releaseDate.slice(0, 10);
  inputProductColor.value = color;
  return imageUrl;
};

const renderGetImage = (imageUrl) => {
  const $image = document.querySelector('.product_image');
  $image.src = imageUrl[0];

  return imageUrl;
};

// rednerButton
const renderImageRemoveButton = (images) => {
  const imageRemoveButtonWrap = document.querySelector(
    '.image_remove_button_wrap',
  );

  const removeButtonList = [];

  // 등록된 이미지 수만큼 생성
  function createRemoveButton(images) {
    images.forEach((image, index) => {
      const imageRemoveButton = document.createElement('input');
      imageRemoveButton.type = 'button';
      imageRemoveButton.classList.add('detail_image_remove_button');
      imageRemoveButton.value = `사진${index + 1}`;
      imageRemoveButton.dataset.imageIndex = index;
      imageRemoveButton.disabled = false;

      removeButtonList.push(imageRemoveButton);
    });
  }

  function renderRemoveButton(removeButtonList) {
    removeButtonList.forEach((button) => {
      imageRemoveButtonWrap.appendChild(button);
    });
  }

  createRemoveButton(images);
  renderRemoveButton(removeButtonList);
  return removeButtonList;
};

const addEventRemoveButton = (removeButtonList) => {
  // 생성 된 버튼에 이벤트 바인딩
  function addEventRemoveButton(buttons, callback) {
    buttons.forEach((button) => {
      button.addEventListener('click', callback);
    });
  }

  // 클릭했을 때 일어날 이벤트
  function deleteRemoveButton(e) {
    if (savedImageUrl.length === 1) {
      alert('이미지가 한개인 경우에는 지울 수 없습니다.');
      return;
    }

    const REMOVE_SELECT = 'remove_select';
    e.target.classList.toggle(REMOVE_SELECT);
    $image.src = savedImageUrl[e.target.dataset.imageIndex];
  }

  addEventRemoveButton(removeButtonList, deleteRemoveButton);
  return '버튼생성, 이벤트추가 완료';
};

getDetailProduct(productShortId)
  .then((res) => insertInputValue(res))
  .then((res) => renderGetImage(res))
  .then((res) => renderImageRemoveButton(res))
  .then((res) => addEventRemoveButton(res))
  // .then((res) => console.log('Success:', res))
  .catch((err) => console.error(err));
