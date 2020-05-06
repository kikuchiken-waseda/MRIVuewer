const toBase64 = file =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });

const toBlob = dataUrl => {
  const byteString = atob(dataUrl.split(",")[1]);
  const mimeString = dataUrl
    .split(",")[0]
    .split(":")[1]
    .split(";")[0];
  const ab = new ArrayBuffer(byteString.length);
  const ia = new Uint8Array(ab);
  for (var i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }
  return new Blob([ab], { type: mimeString });
};

const toBuff = dataUrl => {
  const byteString = atob(dataUrl.split(",")[1]);
  const ab = new ArrayBuffer(byteString.length);
  const ia = new Uint8Array(ab);
  for (var i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }
  return ab;
};

const toUnit8Array = file =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () =>
      resolve(new Uint8Array(reader.result));
    reader.onerror = error => reject(error);
  });

const download = async function(url, filename, metadata) {
  const response = await fetch(url);
  const data = await response.blob();
  const file = new File([data], filename, metadata);
  return file;
};

export default {
  toBase64: toBase64,
  toBlob: toBlob,
  toBuff: toBuff,
  toUnit8Array: toUnit8Array,
  download: download
};
