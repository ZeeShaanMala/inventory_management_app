import { Dimensions } from "react-native";

const { width, height } = Dimensions.get("window");

export const wp = (percent) => (width * percent) / 100;
export const hp = (percent) => (height * percent) / 100;

// scale font
export const scale = (size) => (width / 375) * size;

// detect device
export const isTablet = width >= 768;