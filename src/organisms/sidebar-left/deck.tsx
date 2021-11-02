import { DarkModeListener } from "@/canvas/dark-mode";
import { PreviewSlice } from "@/canvas/slice/preview-slice";
import { useEditor } from "@/ions/store/editor";
import { PictureEntity, Slice, TextEntity, useSpace } from "@/ions/store/space";
import { pxToRem } from "@/ions/utils/unit";
import {
	StyledBackgroundPressable,
	StyledPressable,
	StyledTreeItem,
} from "@/organisms/layout/styled";
import {
	StyledHandle,
	StyledIconWrapper,
	StyledList,
	StyledListItem,
	StyledPressableLabel,
	StyledPreviewPressable,
} from "@/organisms/sidebar-left/styled";
import { Icon } from "@dekk-ui/icon";
import { IconButton } from "@dekk-ui/icon-button";
import {
	closestCenter,
	DndContext,
	KeyboardSensor,
	PointerSensor,
	useSensor,
	useSensors,
} from "@dnd-kit/core";
import { DragEndEvent } from "@dnd-kit/core/dist/types";
import {
	SortableContext,
	sortableKeyboardCoordinates,
	useSortable,
	verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import styled from "@emotion/styled";
import { Canvas } from "@react-three/fiber";
import { useTranslation } from "next-i18next";
import React, {
	CSSProperties,
	FC,
	MouseEventHandler,
	Suspense,
	useCallback,
	useState,
} from "react";

const StyledListItemContent = styled.div`
	overflow: hidden;
`;
export const Sortable: FC<{ id: string }> = ({ children, id }) => {
	const {
		attributes: { tabIndex, ...attributes },
		listeners,
		setNodeRef,
		transform,
		transition,
		active,
	} = useSortable({
		id,
	});
	const isActive = active?.id === id;
	const style: CSSProperties = {
		transform: transform ? `translate3d(0,${pxToRem(transform.y)},0)` : `translate3d(0,0,0)`,
		transition,
	};

	return (
		<StyledListItem ref={setNodeRef} style={style} {...attributes}>
			<StyledHandle>
				<IconButton icon="dragVertical" {...listeners} isSelected={isActive} />
			</StyledHandle>
			<StyledListItemContent>{children}</StyledListItemContent>
		</StyledListItem>
	);
};

export const useSlice = () => {
	const slices = useSpace(state => state.slices);
	const activeSlice = useEditor(state => state.activeSlice);

	return slices.find(({ id }) => id === activeSlice);
};

export const useMoveToSlice = () => {
	const controls = useEditor(state => state.controls);

	return useCallback(
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
};

const Preview = ({ slice }: { slice: Slice }) => {
	const setActiveEntity = useEditor(state => state.setActiveEntity);
	const setActiveSlice = useEditor(state => state.setActiveSlice);
	const moveToSlice = useMoveToSlice();

	return (
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
	);
};

const SortableEntity: FC<{ entity: TextEntity | PictureEntity; sliceId: Slice["id"] }> = ({
	entity,
	sliceId,
}) => {
	const deleteEntity = useSpace(state => state.deleteEntity);
	const setActiveEntity = useEditor(state => state.setActiveEntity);
	const setActiveSlice = useEditor(state => state.setActiveSlice);
	const activeEntity = useEditor(state => state.activeEntity);
	const isActive = entity.id === activeEntity;
	return (
		<Sortable key={entity.id} id={entity.id}>
			<StyledTreeItem isSelected={isActive} indentLevel={2}>
				<StyledBackgroundPressable
					isSelected={isActive}
					onClick={event_ => {
						event_.stopPropagation();
						setActiveSlice(sliceId);
						setActiveEntity(entity.id);
					}}
				/>
				<StyledIconWrapper>
					<Icon icon={entity.type === "text" ? "formatText" : "imageOutline"} />
				</StyledIconWrapper>
				<StyledPressableLabel>{entity.id}</StyledPressableLabel>
				<IconButton
					icon="dotsVertical"
					onClick={event_ => {
						event_.stopPropagation();
						deleteEntity(entity.id, sliceId);
					}}
				/>
			</StyledTreeItem>
		</Sortable>
	);
};

export const SortableSlice: FC<{
	isActive?: boolean;
	isExpanded?: boolean;
	slice: Slice;
	onExpand?: MouseEventHandler<HTMLButtonElement>;
}> = ({ isActive, isExpanded, slice, onExpand }) => {
	const deleteSlice = useSpace(state => state.deleteSlice);
	const setActiveEntity = useEditor(state => state.setActiveEntity);
	const setActiveSlice = useEditor(state => state.setActiveSlice);
	return (
		<Sortable key={slice.id} id={slice.id}>
			<StyledTreeItem isSelected={isActive}>
				<StyledBackgroundPressable
					isSelected={isActive}
					onClick={event_ => {
						event_.stopPropagation();
						setActiveSlice(slice.id);
						setActiveEntity(null);
					}}
				/>
				<IconButton icon={isExpanded ? "chevronUp" : "chevronDown"} onClick={onExpand} />
				<Preview slice={slice} />
				<StyledPressableLabel>{slice.id}</StyledPressableLabel>
				<IconButton
					icon="dotsVertical"
					onClick={event_ => {
						event_.stopPropagation();
						deleteSlice(slice.id);
					}}
				/>
			</StyledTreeItem>
			{isExpanded && (
				<StyledList>
					<SortableContext
						items={slice.entityIds}
						id="sortable:entities"
						strategy={verticalListSortingStrategy}
					>
						{slice.entities.map(entity => {
							return (
								<SortableEntity
									key={entity.id}
									entity={entity}
									sliceId={slice.id}
								/>
							);
						})}
					</SortableContext>
				</StyledList>
			)}
		</Sortable>
	);
};

export const SidebarLeft = () => {
	const { t } = useTranslation(["editor"]);
	const addSlice = useSpace(state => state.addSlice);
	const slices = useSpace(state => state.slices);
	const moveSlice = useSpace(state => state.moveSlice);
	const moveEntity = useSpace(state => state.moveEntity);
	const activeSlice = useEditor(state => state.activeSlice);
	const setActiveEntity = useEditor(state => state.setActiveEntity);
	const setActiveSlice = useEditor(state => state.setActiveSlice);
	const moveToSlice = useMoveToSlice();
	const [expandedSlices, setExpandedSlices] = useState(
		Object.fromEntries(slices.map(currentValue => [currentValue.id, false]))
	);

	const sensors = useSensors(
		useSensor(PointerSensor),
		useSensor(KeyboardSensor, {
			coordinateGetter: sortableKeyboardCoordinates,
		})
	);

	const handleDragEnd = useCallback(
		(event_: DragEndEvent) => {
			const { active, over } = event_;

			if (active.id !== over.id) {
				switch (active.data.current.sortable.containerId) {
					case "sortable:slices":
						moveSlice(active.id, over.id);
						break;
					case "sortable:entities":
						moveEntity(active.id, over.id);
						break;
					default:
						break;
				}
			}
		},
		[moveSlice, moveEntity]
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
				<DndContext
					id="sortable:context"
					sensors={sensors}
					collisionDetection={closestCenter}
					onDragEnd={handleDragEnd}
				>
					<SortableContext
						items={slices.map(({ id }) => id)}
						id="sortable:slices"
						strategy={verticalListSortingStrategy}
					>
						{slices.map(slice => {
							return (
								<SortableSlice
									key={slice.id}
									isExpanded={Boolean(expandedSlices[slice.id])}
									isActive={slice.id === activeSlice}
									slice={slice}
									onExpand={event_ => {
										event_.stopPropagation();
										setExpandedSlices(previousState => ({
											...previousState,
											[slice.id]: !previousState[slice.id],
										}));
									}}
								/>
							);
						})}
					</SortableContext>
				</DndContext>
			</StyledList>
		</>
	);
};
