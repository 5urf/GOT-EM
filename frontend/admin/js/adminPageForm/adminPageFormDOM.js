// form 태그 input
const inputProductForm = document.getElementById('input_product_form');
const inputProductName = document.getElementById('input_product_name');
const inputProductSeries = document.getElementById('input_product_series');
const inputProductNumber = document.getElementById('input_product_number');
const inputProductPrice = document.getElementById('input_product_price');
const inputProductYear = document.getElementById('input_product_year');
const inputProductColor = document.getElementById('input_product_color');

// form 태그 button
const previewButton = document.querySelector('#preview_button');
const postButton = document.querySelector('#post_button')
  ? document.querySelector('#post_button')
  : null;
const patchButton = document.querySelector('#patch_button')
  ? document.querySelector('#patch_button')
  : null;
const removeButton = document.querySelector('#remove_button');
// 미리보기 tag
const productName = document.querySelector('.product_name');
const productNumber = document.querySelector('.product_number');
const productSeries = document.querySelector('.product_series');
const productPrice = document.querySelector('.product_price');
const productYear = document.querySelector('.product_year');
const productColor = document.querySelector('.product_color');
