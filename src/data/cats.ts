import catLatte from "@/assets/cat-latte.jpg";
import catPudding from "@/assets/cat-pudding.jpg";
import catOreo from "@/assets/cat-oreo.jpg";

export type Cat = {
  name: string;
  breed: string;
  age: string;
  personality: string;
  description: string;
  likes: string[];
  image: string;
};

export const cats: Cat[] = [
  {
    name: "拿鐵",
    breed: "米克斯長毛",
    age: "4 歲",
    personality: "撒嬌大王",
    description: "店裡的撒嬌大王，最喜歡被摸下巴。你一坐下，牠就會用毛茸茸的頭來蹭你的手。",
    likes: ["摸下巴", "曬太陽", "紙箱"],
    image: catLatte,
  },
  {
    name: "布丁",
    breed: "虎斑米克斯",
    age: "2 歲",
    personality: "好奇探險家",
    description: "好奇心旺盛的探險家，總在追逐雷射筆。全店的高處都是牠的觀景台。",
    likes: ["雷射筆", "逗貓棒", "爬貓跳台"],
    image: catPudding,
  },
  {
    name: "奧利歐",
    breed: "賓士貓",
    age: "6 歲",
    personality: "沉穩觀察家",
    description: "最資深的店長，喜歡待在窗邊看街景。安靜地陪著你，是牠表達喜歡的方式。",
    likes: ["窗邊位置", "安靜的客人", "午後小睡"],
    image: catOreo,
  },
];