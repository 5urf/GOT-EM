// image, input DOM
const $image = document.querySelector('.product_image');
const inputProductImage = document.querySelector('#input_product_image');
const confirmProductImageBtn = document.querySelector(
  '#confirm_product_image_btn',
);
const imageCheckIcon = document.querySelector('#check_icon');
// button DOM
const prevButton = document.getElementById('prev_button');
const nextButton = document.getElementById('next_button');

// image index
let previewImageIndex = 0;
// imageURL Save Variable
let savedImageUrl;

// image preview function
const postImageRendering = (index) => {
  const reader = new FileReader();
  const imageFile = inputProductImage.files[index];

  if (!imageFile) {
    return;
  }

  reader.readAsDataURL(imageFile);
  reader.onloadend = () => {
    $image.src = reader.result;
    $image.classList.remove('hidden');
    imageCheckIcon.classList.add('success');
  };
};

const checkProdcutImage = (e) => {
  const fileForm = /(.*?)\.(jpg|jpeg|png|gif|pdf)$/i;
  let files = e.target.files;

  for (let file of files) {
    if (file === '') {
      alert('첨부하세요');
      return;
    }
    if (!file.name.match(fileForm)) {
      alert('이미지 파일만 선택하세요');
      $image.src = '';
      e.target.value = '';
      return;
    }
  }
};

const getImageUrl = () => {
  let imageFiles = inputProductImage.files;
  let formData = new FormData();

  for (let image of imageFiles) {
    formData.append('image', image);
  }

  const url =
    'http://elice-kdt-sw-1st-vm07.koreacentral.cloudapp.azure.com:3306/images/upload';
  const reqConfig = {
    method: 'POST',
    body: formData,
    headers: {
      authorization: `Bearer ${accessToken}`,
    },
    mode: 'cors',
    credentials: 'include',
  };

  fetch(url, reqConfig)
    .then((res) => res.json())
    .then((images) => {
      if (savedImageUrl) {
        images.forEach((image) => {
          savedImageUrl.push(image);
        });
        return;
      }
      savedImageUrl = images;
    })
    // .then((response) => console.log(`Success:`, response))
    .then(() => changeImageGuideLine())
    .catch((err) => console.error(err));
};

const patchImageUrl = () => {
  const removeImageList = document.querySelectorAll('.remove_select');
  const removeImageIndex = [];

  removeImageList.forEach((ele) => {
    removeImageIndex.push(ele.dataset.imageIndex);
  });

  const sortList = removeImageIndex.sort((a, b) => b - a);

  sortList.forEach((index) => {
    savedImageUrl.splice(index, 1);
  });
};

const prevPreviewImage = () => {
  const currentIndex = previewImageIndex;
  if (currentIndex > 0) {
    previewImageIndex--;
    postImageRendering(previewImageIndex);
  }
};
const nextPreviewImage = () => {
  const currentIndex = previewImageIndex;
  if (currentIndex < inputProductImage.files.length - 1) {
    previewImageIndex++;
    postImageRendering(previewImageIndex);
  }
};

const changeImageGuideLine = () => {
  if (savedImageUrl) {
    imageCheckIcon.classList.remove('hidden');
  }
};
// event handler
inputProductImage.addEventListener('change', (e) => {
  checkProdcutImage(e);
  postImageRendering(previewImageIndex);
});

if (patchButton) {
  confirmProductImageBtn.addEventListener('click', getImageUrl);
  confirmProductImageBtn.addEventListener('click', patchImageUrl);
  confirmProductImageBtn.addEventListener('click', changeImageGuideLine);
}

if (postButton) {
  confirmProductImageBtn.addEventListener('click', getImageUrl);
  confirmProductImageBtn.addEventListener('click', changeImageGuideLine);
  prevButton.addEventListener('click', prevPreviewImage);
  nextButton.addEventListener('click', nextPreviewImage);
}
