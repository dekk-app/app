export const getPoints = (
	width: number,
	height: number,
	{ x = 4, y = 4 }: { x: number; y: number }
) => {
	const points: Array<{ id: string; x: number; y: number }> = [];
	const stepX = width / 4;
	const stepY = height / 4;

	for (let i = x / -2; i <= x / 2; i++) {
		for (let j = y / -2; j <= y / 2; j++) {
			points.push({ id: `__fixedGuide_${i}_${j}__`, x: i * stepX, y: i * stepY });
		}
	}

	return points;
};
