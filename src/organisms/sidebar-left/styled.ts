import { pxToRem } from "@/ions/utils/unit";
import { StyledPressable } from "@/organisms/layout/styled";
import { focus } from "@dekk-ui/focus-ring";
import { css } from "@emotion/react";
import styled from "@emotion/styled";

export const StyledList = styled.ul`
	flex: 1;
	margin: 0;
	padding: 0;
	overflow-x: hidden;
	overflow-y: auto;
	list-style: none;
`;
export const StyledListItem = styled.li`
	display: grid;
	grid-template-columns: ${pxToRem(40)} 1fr;
	margin: 0;
	padding: 0;
	list-style: none;
`;

export const StyledHandle = styled.div`
	display: flex;
	align-content: center;
	align-items: center;
	justify-content: center;
	padding: 0;
	border: 0;
	box-shadow: inset 0 -1px 0 rgba(0, 0, 0, 0.1), inset -1px 0 0 rgba(0, 0, 0, 0.1);
	font-size: 1em;
	${({ theme }) => css`
		background: ${theme.ui.fill["1"]};
		color: ${theme.ui.text["1"]};
	`};
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
export const StyledIconWrapper = styled.div`
	position: relative;
`;
