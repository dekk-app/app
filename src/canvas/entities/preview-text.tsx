import { useFontStore } from "@/ions/hooks/fonts";
import { TextEntity as TextEntityType } from "@/ions/store/space";
import { Text } from "@react-three/drei";
import React from "react";

export const PreviewTextEntity = ({
	color,
	font,
	text,
	width,
	textAlign,
	lineHeight,
	letterSpacing,
	x,
	y,
	z,
	anchorX,
	anchorY,
}: TextEntityType) => {
	const fonts = useFontStore(state => state.fonts);
	const fontObject = fonts?.find(({ family }) => family === font.family);
	const fontFile = fontObject?.files[font.variant].replace(/^http:/, "https:");

	return (
		<group position={[x, y, z]}>
			<Text
				overflowWrap="break-word"
				maxWidth={width ?? 1600}
				font={fontFile}
				fontSize={font.size}
				textAlign={textAlign}
				lineHeight={lineHeight}
				letterSpacing={letterSpacing}
				anchorX={anchorX}
				anchorY={anchorY}
			>
				<meshBasicMaterial attach="material" color={color} />
				{text}
			</Text>
		</group>
	);
};
