import { WithSnapOptions } from "@/canvas/group/types";

export const withSnap = (
	n: number,
	{ key, id, siblings, threshold = 100, step = 1 }: WithSnapOptions
) => {
	const snapped = siblings.find(sibling => {
		if (sibling.id === id) {
			return false;
		}

		return sibling[key] <= n + threshold && sibling[key] >= n - threshold;
	});
	return {
		guide: snapped ? key : false,
		value: snapped ? snapped[key] : Math.round(n / step) * step,
	};
};
