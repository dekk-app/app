import { PreviewPictureEntity } from "@/canvas/entities/preview-picture";
import { PreviewTextEntity } from "@/canvas/entities/preview-text";
import { GradientTexture } from "@/canvas/gradient";
import { Slice as SliceType, useSpace } from "@/ions/store/space";
import React from "react";

export const PreviewSlice = (slice: SliceType) => {
	const { backgroundColor, color, gradient, showGradient, entities } = slice;
	const { width, height, ...space } = useSpace(state => state.space);

	return (
		<group>
			<mesh>
				<planeBufferGeometry attach="geometry" args={[width, height]} />
				<meshBasicMaterial attach="material" depthWrite={!showGradient}>
					<GradientTexture
						stops={showGradient ? gradient.map(({ stop }) => stop) : [0, 1]}
						x1={0}
						x2={width}
						y1={0}
						y2={height}
						height={height}
						width={width}
						colors={
							showGradient
								? gradient.map(({ color }) => color)
								: [
										backgroundColor ?? space.backgroundColor,
										backgroundColor ?? space.backgroundColor,
								  ]
						}
					/>
				</meshBasicMaterial>
			</mesh>

			{entities.map((entity, index) => {
				switch (entity.__typename) {
					case "text":
						return (
							<PreviewTextEntity
								key={entity.id}
								color={color ?? space.color}
								{...entity}
								z={index + 10}
							/>
						);
					case "picture":
						return <PreviewPictureEntity key={entity.id} {...entity} z={index + 10} />;
					default:
						return null;
				}
			})}
		</group>
	);
};
