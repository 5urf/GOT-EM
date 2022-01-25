// 토스트 부분
function toastHandler(state, message) {
  if (state === 'success') {
    const layer = document.createElement('div');
    layer.id = 'toast-wrapper';
    const toast = document.createElement('div');
    toast.id = 'toast';
    toast.classList.add(state);
    layer.appendChild(toast);
    document.body.appendChild(layer);
    return toastStart([layer, toast], message);
  }
  if (state === 'error') {
    const layer = document.createElement('div');
    layer.id = 'toast-wrapper';
    const toast = document.createElement('div');
    toast.id = 'toast';
    toast.classList.add(state);
    layer.appendChild(toast);
    document.body.appendChild(layer);
    return toastStart([layer, toast], message);
  }
}

let removeToast;
function toastStart(array, message) {
  array[0].classList.add('reveal');
  array[1].classList.add('reveal');
  array[1].innerText = message;
  array.forEach((item) => {
    removeToast = setTimeout(() => {
      item.classList.remove('reveal');
    }, 1000);
  });

  setTimeout(() => {
    document.querySelector('#toast').remove();
    document.querySelector('#toast-wrapper').remove();
  }, 2000);
}
