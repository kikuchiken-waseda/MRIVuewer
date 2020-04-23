const SEX_CHOICE = [
  { text: "男性", text_en: "Male", val: "M" },
  { text: "女性", text_en: "Female", val: "F" }
];
const LNAG_COICE = [
  { text: "日本語", text_en: "Japanese", val: "JP" },
  { text: "モンゴル語", text_en: "Mongolian", val: "MO" }
];

const DIALECT_COICE = [
  { text: "不明", text_en: "Unknown", val: "UN" },
  { text: "関東方言", text_en: "Standard", val: "ST" },
  { text: "近畿方言", text_en: "Kinki", val: "KI" }
];

const DIRS = [
  {
    id: 1,
    path: "20170323/Kagomiya/MP4/luminance_numbered_JM",
    dialect: "ST",
    language: "JP",
    sex: "M",
    subject: "02",
    day: "2017-03-23"
  },
  {
    id: 2,
    path: "20170323/Maekawa/MP4/luminance_numbered_JM",
    dialect: "ST",
    language: "JP",
    sex: "M",
    subject: "01",
    day: "2017-03-23"
  },
  {
    id: 3,
    path: "20170714/Fujimoto/MP4/luminance_numbered_JM",
    dialect: "KI",
    language: "JP",
    sex: "F",
    subject: "03",
    day: "2017-07-14"
  },
  {
    id: 4,
    path: "20170714/Kikuchi2/MP4/luminance_numbered_JM",
    dialect: "ST",
    language: "JP",
    sex: "M",
    subject: "04",
    day: "2017-07-14"
  },
  {
    id: 5,
    path: "20170714/Kikuchi/MP4/luminance_numbered_JM",
    dialect: "ST",
    language: "JP",
    sex: "M",
    subject: "04",
    day: "2017-07-14"
  },
  {
    id: 6,
    path: "20170802/Maekawa/MP4/luminance_numbered_JM",
    dialect: "ST",
    language: "JP",
    sex: "M",
    subject: "01",
    day: "2017-08-02"
  },
  {
    id: 7,
    path: "20170802/Saito/MP4/luminance_numbered_JM",
    dialect: "ST",
    language: "JP",
    sex: "M",
    subject: "05",
    day: "2017-08-02"
  },
  {
    id: 8,
    path: "20170802/Yurong/MP4/luminance_numbered_JM",
    dialect: "UN",
    language: "MO",
    sex: "F",
    subject: "06",
    day: "2017-08-02"
  },
  {
    id: 9,
    path: "20171110/Maekawa/MP4/luminance_numbered_JM",
    dialect: "ST",
    language: "JP",
    sex: "M",
    subject: "01",
    day: "2017-11-10"
  },
  {
    id: 10,
    path: "20171110/Masaki/MP4/luminance_numbered_JM",
    dialect: "ST",
    language: "JP",
    sex: "M",
    subject: "07",
    day: "2017-11-10"
  },
  {
    id: 11,
    path: "20171110/Nota/MP4/luminance_numbered_JM",
    dialect: "KI",
    language: "JP",
    sex: "F",
    subject: "08",
    day: "2017-11-10"
  },
  {
    id: 12,
    path: "20171225/Asai/MP4/luminance_numbered_JM",
    dialect: "ST",
    language: "JP",
    sex: "M",
    subject: "09",
    day: "2017-12-25"
  },
  {
    id: 13,
    path: "20171225/Kagomiya/MP4/luminance_numbered_JM",
    dialect: "ST",
    language: "JP",
    sex: "M",
    subject: "02",
    day: "2017-12-25"
  },
  {
    id: 14,
    path: "20171225/Saito/MP4/luminance_numbered_JM",
    dialect: "ST",
    language: "JP",
    sex: "M",
    subject: "05",
    day: "2017-12-25"
  },
  {
    id: 15,
    path: "20180305/Koiso/MP4/luminance_numbered_JM",
    dialect: "ST",
    language: "JP",
    sex: "F",
    subject: "11",
    day: "2018-03-05"
  },
  {
    id: 16,
    path: "20180305/Morimoto/MP4/luminance_numbered_JM",
    dialect: "ST",
    language: "JP",
    sex: "F",
    subject: "10",
    day: "2018-03-05"
  },
  {
    id: 17,
    path: "20180720/Enomoto/MP4/luminance_numbered_JM",
    dialect: "KI",
    language: "JP",
    sex: "M",
    subject: "13",
    day: "2018-07-20"
  },
  {
    id: 18,
    path: "20180720/Kato/MP4/luminance_numbered_JM",
    dialect: "KI",
    language: "JP",
    sex: "M",
    subject: "12",
    day: "2018-07-20"
  },
  {
    id: 19,
    path: "20180808/Honda/MP4/luminance_numbered_JM",
    dialect: "ST",
    language: "JP",
    sex: "M",
    subject: "14",
    day: "2018-08-08"
  },
  {
    id: 20,
    path: "20181029/Yurong/MP4/luminance_numbered_JM",
    dialect: "UN",
    language: "MO",
    sex: "F",
    subject: "06",
    day: "2018-10-29"
  },
  {
    id: 21,
    path: "20181106/Kikuchi/MP4/luminance_numbered_JM",
    dialect: "ST",
    language: "JP",
    sex: "M",
    subject: "04",
    day: "2018-11-06"
  },
  {
    id: 22,
    path: "20181119/Fujimoto/MP4/luminance_numbered_JM",
    dialect: "KI",
    language: "JP",
    sex: "F",
    subject: "03",
    day: "2018-11-19"
  },
  {
    id: 23,
    path: "20181120/Asahara/MP4/luminance_numbered_JM",
    dialect: "ST",
    language: "JP",
    sex: "M",
    subject: "15",
    day: "2018-11-20"
  },
  {
    id: 24,
    path: "20190111/Kashino/MP4/luminance_numbered_JM",
    dialect: "ST",
    language: "JP",
    sex: "F",
    subject: "17",
    day: "2019-01-11"
  },
  {
    id: 25,
    path: "20190111/Yoneyama/MP4/luminance_numbered_JM",
    dialect: "ST",
    language: "JP",
    sex: "F",
    subject: "16",
    day: "2019-01-11"
  },
  {
    id: 26,
    path: "20190208/Matsuda/MP4/luminance_numbered_JM",
    dialect: "ST",
    language: "JP",
    sex: "M",
    subject: "19",
    day: "2019-02-08"
  },
  {
    id: 27,
    path: "20190208/Sukegawa/MP4/luminance_numbered_JM",
    dialect: "ST",
    language: "JP",
    sex: "M",
    subject: "18",
    day: "2019-02-08"
  },
  {
    id: 28,
    path: "20190527/Mori/MP4/luminance_numbered_JM",
    dialect: "ST",
    language: "JP",
    sex: "M",
    subject: "20",
    day: "2019-05-27"
  },
  {
    id: 29,
    path: "20190527/Okahisa/MP4/luminance_numbered_JM",
    dialect: "ST",
    language: "JP",
    sex: "M",
    subject: "21",
    day: "2019-05-27"
  },
  {
    id: 30,
    path: "20190820/ShuLon/MP4/luminance_numbered_JM",
    dialect: "UN",
    language: "MO",
    sex: "F",
    subject: "22",
    day: "2019-08-20"
  }
];

const SUBJECTS = DIRS.filter((x, index, self) => {
  return self.indexOf(x.subject) === index;
});

const HEADERS = [
  {
    text: "被験者ID",
    sortable: true,
    value: "subject"
  },
  {
    text: "収録日",
    value: "day"
  },
  {
    text: "性別",
    value: "sex"
  },
  {
    text: "言語",
    value: "language"
  },
  {
    text: "方言",
    value: "dialect"
  }
];

const DAYS = DIRS.filter((x, index, self) => {
  return self.indexOf(x.day) === index;
});

export default {
  ui: {
    headers: HEADERS,
    sex: SEX_CHOICE,
    lang: LNAG_COICE,
    dialect: DIALECT_COICE,
    subject: SUBJECTS,
    days: DAYS
  },
  dirs: DIRS
};
