import moment from "moment";
import DFILE from "@/api/dfiles";

const get_text = function(array, val) {
  const choice = array.filter(x => {
    return x.val === val;
  });
  if (choice.length > 0) {
    return choice[0].text;
  }
  return "NO DATA";
};

const get_val = function(array, text) {
  const choice = array.filter(x => {
    return ~x.text.indexOf(text);
  });
  if (choice.length > 0) {
    return choice[0].val;
  }
  return null;
};

export default {
  moment: val => {
    return moment(val, "YYYY-MM-DD").format("YYYY年MM月DD日");
  },
  dialect: val => {
    return get_text(DFILE.ui.dialect, val);
  },
  lang: val => {
    return get_text(DFILE.ui.lang, val);
  },
  sex: val => {
    return get_text(DFILE.ui.sex, val);
  },
  reverse: {
    moment: val => {
      return moment(val, "YYYY年MM月DD日").format("YYYY-MM-DD");
    },
    dialect: val => {
      return get_val(DFILE.ui.dialect, val);
    },
    lang: val => {
      return get_val(DFILE.ui.lang, val);
    },
    sex: val => {
      return get_val(DFILE.ui.sex, val);
    }
  }
};
