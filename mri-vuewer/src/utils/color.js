import colors from "vuetify/lib/util/colors";

const getCode = text => {
  const args = text.split(" ");
  if (args.length == 1) {
    return colors[args[0]].base;
  } else {
    return colors[args[0]][args[1].replace("-", "")];
  }
};

const css2rgb = code => {
  if (code.length !== 7) {
    return "rgb(255,255,255)";
  } else {
    if (code.split("")[0] === "#") {
      code = code.substring(1);
    }
    if (code.length === 3) {
      var codeArr = code.split("");
      code =
        codeArr[0] +
        codeArr[0] +
        codeArr[1] +
        codeArr[1] +
        codeArr[2] +
        codeArr[2];
    }
    const r = parseInt(code.substring(0, 2), 16);
    const g = parseInt(code.substring(2, 4), 16);
    const b = parseInt(code.substring(4, 6), 16);
    return `rgb(${r},${g},${b})`;
  }
};

const getRgb = text => {
  const code = getCode(text);
  if (code) {
    return css2rgb(code);
  }
};

export default {
  getCode: getCode,
  getRgb: getRgb,
  css2rgb: css2rgb
};
