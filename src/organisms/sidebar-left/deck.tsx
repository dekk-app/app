import { DarkModeListener } from "@/canvas/dark-mode";
import { PreviewSlice } from "@/canvas/slice/preview-slice";
import { useEditor } from "@/ions/store/editor";
import { useSpace } from "@/ions/store/space";
import { pxToRem } from "@/ions/utils/unit";
import {
	StyledBackgroundPressable,
	StyledExpandable,
	StyledPressable,
} from "@/organisms/layout/styled";
import { focus } from "@dekk-ui/focus-ring";
import { Icon } from "@dekk-ui/icon";
import { IconButton } from "@dekk-ui/icon-button";
import { css } from "@emotion/react";
import styled from "@emotion/styled";
import { Canvas } from "@react-three/fiber";
import { useTranslation } from "next-i18next";
import React, { Suspense, useCallback, useState } from "react";

export const StyledList = styled.ul`
	flex: 1;
	margin: 0;
	padding: 0;
	overflow: auto;
	list-style: none;
`;

export const StyledListItem = styled.li`
	margin: 0;
	padding: 0;
	list-style: none;
`;

export const StyledPressableLabel = styled.div`
	position: relative;
	z-index: 1;
	flex: 1;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
	pointer-events: none;
	${({ theme }) => css`
		padding: 0 ${pxToRem(theme.space.xs)};
	`};
`;

export const StyledPreviewPressable = styled(StyledPressable)`
	width: ${pxToRem(80)};
	min-width: ${pxToRem(80)};
	max-width: ${pxToRem(80)};
	height: ${pxToRem(45)};
	padding: 0;
	border-bottom: 0;
	box-shadow: 0 0 0 1px currentColor;

	&:focus-visible::before {
		content: "";
		position: absolute;
		z-index: 2;
		top: 0;
		right: 0;
		bottom: 0;
		left: 0;
		border-radius: inherit;
		${focus};
	}

	${({ theme }) => css`
		margin-left: ${pxToRem(theme.space.xs)};
		border-radius: ${pxToRem(theme.radius.s)};
		canvas {
			border-radius: ${pxToRem(theme.radius.s)};
		}
	`};
`;

const StyledIconWrapper = styled.div`
	position: relative;
`;

export const SidebarLeft = () => {
	const { t } = useTranslation(["editor"]);
	const addSlice = useSpace(state => state.addSlice);
	const slices = useSpace(state => state.slices);
	const deleteEntity = useSpace(state => state.deleteEntity);
	const deleteSlice = useSpace(state => state.deleteSlice);
	const controls = useEditor(state => state.controls);
	const activeSlice = useEditor(state => state.activeSlice);
	const activeEntity = useEditor(state => state.activeEntity);
	const setActiveEntity = useEditor(state => state.setActiveEntity);
	const setActiveSlice = useEditor(state => state.setActiveSlice);
	const [expandedSlices, setExpandedSlices] = useState(
		Object.fromEntries(slices.map(currentValue => [currentValue.id, false]))
	);

	const moveToSlice = useCallback(
		(
			{ x, y, enableTransition }: { x: number; y: number; enableTransition?: boolean },
			padding = 100
		) => {
			const space = useSpace.getState().space;
			const viewport = useEditor.getState().viewport;
			void controls.moveTo(x, y, 0, enableTransition);
			void controls.zoomTo(
				(viewport.width * controls.camera.zoom - padding * 2) / space.width,
				enableTransition
			);
		},
		[controls]
	);

	return (
		<>
			<StyledPressable
				onClick={() => {
					const slice = addSlice({});
					moveToSlice({
						x: slice.x,
						y: slice.y,
					});
					setActiveSlice(slice.id);
					setActiveEntity(null);
				}}
			>
				<div>{t("editor:add-slide")}</div>
				<Icon icon="plus" />
			</StyledPressable>
			<StyledList>
				{slices.map((slice, sliceIndex) => {
					const isActiveSlice = slice.id === activeSlice;
					const isSliceExpanded = Boolean(expandedSlices[slice.id]);
					return (
						<StyledListItem key={slice.id}>
							<StyledExpandable isSelected={isActiveSlice}>
								<StyledBackgroundPressable
									isSelected={isActiveSlice}
									onClick={event_ => {
										event_.stopPropagation();
										setActiveSlice(slice.id);
										setActiveEntity(null);
									}}
								/>
								<IconButton
									icon={isSliceExpanded ? "chevronUp" : "chevronDown"}
									onClick={event_ => {
										event_.stopPropagation();
										setExpandedSlices(previousState => ({
											...previousState,
											[slice.id]: !previousState[slice.id],
										}));
									}}
								/>
								<StyledPreviewPressable
									onClick={event_ => {
										event_.stopPropagation();
										moveToSlice({
											x: slice.x,
											y: slice.y,
										});
										setActiveSlice(slice.id);
										setActiveEntity(null);
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
											<PreviewSlice key={slice.id} {...slice} />
										</Suspense>
									</Canvas>
								</StyledPreviewPressable>
								<StyledPressableLabel>Slide {sliceIndex + 1}</StyledPressableLabel>
								<IconButton
									icon="deleteOutline"
									onClick={event_ => {
										event_.stopPropagation();
										deleteSlice(slice.id);
									}}
								/>
							</StyledExpandable>
							{isSliceExpanded && (
								<StyledList>
									{slice.entities.map((entity, entityIndex) => {
										const isActiveEntity = entity.id === activeEntity;
										return (
											<StyledListItem key={`${slice.id}_${entity.id}`}>
												<StyledExpandable
													isSelected={isActiveEntity}
													indentLevel={2}
												>
													<StyledBackgroundPressable
														isSelected={isActiveEntity}
														onClick={event_ => {
															event_.stopPropagation();
															setActiveSlice(slice.id);
															setActiveEntity(entity.id);
														}}
													/>
													<StyledIconWrapper>
														<Icon
															icon={
																entity.type === "text"
																	? "formatText"
																	: "imageOutline"
															}
														/>
													</StyledIconWrapper>
													<StyledPressableLabel>
														Layer {entityIndex + 1}
													</StyledPressableLabel>
													<IconButton
														icon="deleteOutline"
														onClick={event_ => {
															event_.stopPropagation();
															deleteEntity(entity.id, slice.id);
														}}
													/>
												</StyledExpandable>
											</StyledListItem>
										);
									})}
								</StyledList>
							)}
						</StyledListItem>
					);
				})}
			</StyledList>
		</>
	);
};
