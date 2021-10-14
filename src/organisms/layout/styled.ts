import { pxToRem } from "@/ions/utils/unit";
import { focus } from "@dekk-ui/focus-ring";
import { css } from "@emotion/react";
import styled from "@emotion/styled";

export const StyledLayout = styled.div`
	display: grid;
	height: 100vh;
	${({ theme }) => css`
		background: ${theme.ui.fill["2"]};
		color: ${theme.ui.text["1"]};
	`};
`;

export const StyledCentered = styled.div`
	display: flex;
	flex-direction: column;
	flex-grow: 1;
	align-content: center;
	align-items: center;
	width: 100%;
	${({ theme }) => css`
		padding: ${pxToRem(theme.space.s)};
	`};
`;

export const StyledCenteredRow = styled.div`
	display: flex;
	flex-grow: 1;
	align-content: center;
	align-items: center;
	justify-content: center;
`;

export const StyledButtonRow = styled.div`
	display: grid;
	grid-template-columns: repeat(auto-fit, minmax(${pxToRem(32)}, max-content));
	flex-grow: 1;
	align-content: center;
	align-items: center;
	justify-content: center;
	${({ theme }) => css`
		grid-gap: ${pxToRem(theme.space.xs)};
	`};
`;

export const StyledPressable = styled.button<{ indentLevel?: number }>`
	display: flex;
	position: relative;
	align-content: center;
	align-items: center;
	justify-content: space-between;
	width: 100%;
	border: 0;
	background: none;
	color: inherit;
	font-family: inherit;
	font-size: 1em;
	text-align: left;

	&:focus {
		outline: 0;
	}

	&:focus-visible::before {
		content: "";
		position: absolute;
		top: 2px;
		right: 2px;
		bottom: 2px;
		left: 2px;
		${focus};
	}

	&:hover {
		background: rgba(0, 0, 0, 0.2);
	}

	&:active {
		background: rgba(0, 0, 0, 0.4);
	}

	${({ theme, indentLevel = 0 }) => css`
		padding: ${pxToRem(theme.space.s)};
		padding-left: ${pxToRem(theme.space.s * (indentLevel + 1))};
	`};
`;

export const StyledBox = styled.div<{ isScrollable?: boolean; noSpaces?: boolean }>`
	${({ theme, isScrollable, noSpaces }) => css`
		padding: 0 ${noSpaces ? 0 : pxToRem(theme.space.s)};
		${isScrollable &&
		css`
			overflow: auto;
		`};
	`};
`;

export const StyledFieldRow = styled.div`
	display: grid;
	grid-template-columns: 1fr 150px;
	flex-grow: 1;
	${({ theme }) => css`
		grid-gap: ${pxToRem(theme.space.xs)};
		padding: ${pxToRem(theme.space.xs)} ${pxToRem(theme.space.s)};
	`};
`;

export const StyledLayoutWithLeft = styled(StyledLayout)`
	grid-template-areas: "Header Header" "Left Main";
	grid-template-columns: ${pxToRem(250)} 1fr;
	grid-template-rows: ${pxToRem(48)} 1fr;
`;

export const StyledLayoutWithRight = styled(StyledLayout)`
	grid-template-areas: "Header Header" "Main Right";
	grid-template-columns: 1fr ${pxToRem(250)};
	grid-template-rows: ${pxToRem(48)} 1fr;
`;

export const StyledLayoutWithLeftRight = styled(StyledLayout)`
	grid-template-areas: "Header Header Header" "Left Main Right";
	grid-template-columns: ${pxToRem(250)} 1fr ${pxToRem(350)};
	grid-template-rows: ${pxToRem(48)} 1fr;
`;

export const StyledHeader = styled.header`
	display: flex;
	grid-area: Header;
	${({ theme }) => css`
		background: ${theme.ui.background["1"]};
		color: ${theme.ui.text["1"]};
	`};
`;

export const StyledLeft = styled.aside`
	display: flex;
	grid-area: Left;
	flex-direction: column;
	justify-content: flex-start;
	height: 100%;
	overflow: hidden;
	${({ theme }) => css`
		background: ${theme.ui.background["1"]};
		color: ${theme.ui.text["1"]};
	`};
`;

export const StyledRight = styled.aside`
	display: flex;
	grid-area: Right;
	flex-direction: column;
	justify-content: flex-start;
	height: 100%;
	overflow: hidden;
	${({ theme }) => css`
		background: ${theme.ui.background["1"]};
		color: ${theme.ui.text["1"]};
	`};
`;

export const StyledMain = styled.main`
	display: flex;
	position: relative;
	grid-area: Main;
	overflow: hidden;
	${({ theme }) => css`
		background: ${theme.ui.background["0"]};
		color: ${theme.ui.text["1"]};
	`};
`;
