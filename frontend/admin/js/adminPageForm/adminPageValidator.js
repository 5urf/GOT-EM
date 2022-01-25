// form validator 부분
const showError = (input, message) => {
  const guideline = input.nextElementSibling;
  guideline.classList.remove('success');
  guideline.innerHTML = message;
};

const showSuccess = (input, message) => {
  const guideline = input.nextElementSibling;
  guideline.classList.add('success');
  guideline.innerHTML = message;
};

const checkProductYear = (input) => {
  const yyyyMMDDPattern =
    /^(19|20)\d{2}-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])$/;

  if (!yyyyMMDDPattern.test(input.value)) {
    showError(input, '올바른 출시년도가 아닙니다.');
    return;
  }
  showSuccess(input, '올바른 출시년도입니다.');
  return true;
};

const checkProductName = (input) => {
  if (!input.value) {
    showError(input, '상품명을 입력하세요.');
    return;
  }
  showSuccess(input, '올바른 상품명입니다.');
  return true;
};

const checkProductModelNumber = (input) => {
  const modelNumberRegexr = /[^a-zA-Z0-9-]+/g;

  if (input.value === '') {
    showError(input, `모델번호를 입력하세요.`);
    return;
  }

  if (!modelNumberRegexr.test(input.value)) {
    showSuccess(input, '올바른 모델번호입니다.');
    return true;
  }

  showError(input, '영어 대소문자,숫자,"-"만 입력가능');
  return;
};

const checkProductModelSeries = (input) => {
  if (input.value === '') {
    showError(input, '시리즈를 입력하세요.');
    return;
  }
  showSuccess(input, '올바른 시리즈입니다.');
  return true;
};
const checkProductPrice = (input) => {
  const numberRegexr = /[^0-9]/g;
  const errList = input.value.match(numberRegexr);
  if (!errList && input.value) {
    showSuccess(input, '올바른 가격입니다.');
    return true;
  }
  showError(input, '숫자를 입력해주세요');
  return;
};

const checkProductColor = (input, min) => {
  const colorRegexr = /[^a-zA-Z]+/g;

  if (input.value === '') {
    showError(input, `색상을 ${min}개 이상 입력하세요.`);
    return;
  }

  if (colorRegexr.test(input.value)) {
    showError(input, '영어 대소문자만 입력가능');
    return;
  } else {
    showSuccess(input, '올바른 색상입니다.');
    return true;
  }
};

// Price type check and guideline class control function
const changePriceGuideLine = (event) => {
  const numberRegexr = /[^0-9]/g;
  const priceGuideLine = event.target.nextElementSibling;
  const errList = inputProductPrice.value.match(numberRegexr);

  if (!errList && inputProductPrice.value) {
    priceGuideLine.classList.add('success');
    priceGuideLine.innerHTML = '올바른 입력값입니다.';
    return;
  }

  priceGuideLine.classList.remove('success');
  priceGuideLine.innerHTML = '숫자만 입력해주세요';
};

// form validator function
const formValidator = () => {
  let nameResult = checkProductName(inputProductName);
  let numberResult = checkProductModelNumber(inputProductNumber);
  let seriesResult = checkProductModelSeries(inputProductSeries);
  let priceResult = checkProductPrice(inputProductPrice);
  let yearResult = checkProductYear(inputProductYear);
  let colorResult = checkProductColor(inputProductColor, 1);
  let imageResult = savedImageUrl;

  if (
    nameResult &&
    numberResult &&
    priceResult &&
    yearResult &&
    colorResult &&
    imageResult &&
    seriesResult
  ) {
    previewRender();
    const button = postButton ? postButton : patchButton;
    button.disabled = false;

    return;
  }
};

// preview section rendering
const previewRender = () => {
  productName.innerHTML = inputProductName.value;
  productNumber.innerHTML = inputProductNumber.value;
  productSeries.innerHTML = inputProductSeries.value;
  productPrice.innerHTML = `${parseInt(
    inputProductPrice.value,
  ).toLocaleString()}원`;
  productYear.innerHTML = inputProductYear.value;
  productColor.innerHTML = inputProductColor.value;
};

// event handler
previewButton.addEventListener('click', formValidator);
inputProductPrice.addEventListener('input', changePriceGuideLine);
