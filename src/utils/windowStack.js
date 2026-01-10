let windowZIndex = 2100;
let windowMinZIndex = 1999;

export const getNextWindowZIndex = () => {
	windowZIndex += 1;
	return windowZIndex;
};

export const getPrevWindowZIndex = () => {
	windowMinZIndex -= 1;
	return windowMinZIndex;
};
