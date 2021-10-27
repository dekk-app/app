export const findImageAspect = async (
	src: string
): Promise<{
	width: number;
	height: number;
	aspectRatio: number;
}> => {
	const img = new Image();

	img.src = src;
	return new Promise((resolve, reject) => {
		const handleLoad = () => {
			resolve({
				width: img.width,
				height: img.height,
				aspectRatio: img.width / img.height,
			});
		};

		const handleError = error_ => {
			reject(error_);
		};

		img.addEventListener("load", handleLoad);
		img.addEventListener("error", handleError);
	});
};
