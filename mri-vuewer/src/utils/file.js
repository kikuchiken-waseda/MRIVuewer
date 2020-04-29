const toBase64 = file =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
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
  download: download
};
