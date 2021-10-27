import { DarkModeListener } from "@/canvas/dark-mode";
import { Slice } from "@/canvas/slice";
import { useEditor } from "@/ions/store/editor";
import { useSpace } from "@/ions/store/space";
import { pxToRem } from "@/ions/utils/unit";
import { StyledPressable } from "@/organisms/layout/styled";
import { Icon } from "@dekk-ui/icon";
import styled from "@emotion/styled";
import { Canvas } from "@react-three/fiber";
import { useTranslation } from "next-i18next";
import React, { Suspense } from "react";

const StyledList = styled.ul`
	flex: 1;
	margin: 0;
	padding: 0;
	overflow: auto;
	list-style: none;
`;

const StyledListItem = styled.li`
	margin: 0;
	padding: 0;
	list-style: none;
`;

export const SidebarLeft = () => {
	const { t } = useTranslation(["editor"]);
	const addSlice = useSpace(state => state.addSlice);
	const slices = useSpace(state => state.slices);
	const activeSlice = useEditor(state => state.activeSlice);
	const activeEntity = useEditor(state => state.activeEntity);
	const setActiveEntity = useEditor(state => state.setActiveEntity);
	const setActiveSlice = useEditor(state => state.setActiveSlice);

	return (
		<>
			<StyledPressable
				onClick={() => {
					addSlice({});
				}}
			>
				<div>{t("editor:add-slide")}</div>
				<Icon icon="plus" />
			</StyledPressable>
			<StyledList>
				{slices.map((slice, sliceIndex) => {
					return (
						<StyledListItem key={slice.id}>
							<StyledPressable
								selected={slice.id === activeSlice}
								onClick={() => {
									setActiveSlice(slice.id);
									setActiveEntity(null);
								}}
							>
								Slide {sliceIndex + 1}
								<div
									style={{
										height: 45,
										width: 80,
										pointerEvents: "none",
										borderRadius: pxToRem(4),
										overflow: "hidden",
										boxShadow:
											"0 3px 6px rgba(0,0,0,0.1), 0 1px 4px rgba(0,0,0,0.2)",
									}}
								>
									<Canvas
										flat
										orthographic
										camera={{
											position: [0, 0, 1000],
											zoom: 0.05,
										}}
										onCreated={({ gl, setDpr }) => {
											gl.localClippingEnabled = true;
											setDpr(window.devicePixelRatio);
										}}
									>
										<Suspense fallback={null}>
											<DarkModeListener />
											<Slice key={slice.id} {...slice} x={0} y={0} z={0} />
										</Suspense>
									</Canvas>
								</div>
							</StyledPressable>
							<StyledList>
								{slice.entities.map((entity, entityIndex) => {
									return (
										<StyledListItem key={`${slice.id}_${entity.id}`}>
											<StyledPressable
												indentLevel={1}
												selected={entity.id === activeEntity}
												onClick={() => {
													setActiveSlice(slice.id);
													setActiveEntity(entity.id);
												}}
											>
												Layer {entityIndex + 1}
												<Icon
													icon={
														entity.type === "text"
															? "editorText"
															: "editorImage"
													}
												/>
											</StyledPressable>
										</StyledListItem>
									);
								})}
							</StyledList>
						</StyledListItem>
					);
				})}
			</StyledList>
		</>
	);
};
