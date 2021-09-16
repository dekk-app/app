import { pxToRem } from "@/ions/utils/unit";
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
	grid-template-columns: repeat(auto-fit, ${pxToRem(32)});
	flex-grow: 1;
	align-content: center;
	align-items: center;
	justify-content: center;
	${({ theme }) => css`
		grid-gap: ${pxToRem(theme.space.xs)};
	`};
`;

export const StyledBox = styled.div`
	${({ theme }) => css`
		padding: ${pxToRem(theme.space.s)};
	`};
`;

export const StyledFieldRow = styled.div`
	display: grid;
	grid-template-columns: 30% 1fr;
	flex-grow: 1;
	${({ theme }) => css`
		grid-gap: ${pxToRem(theme.space.xs)};
		padding: ${pxToRem(theme.space.xxs)} ${pxToRem(theme.space.s)};
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
	grid-template-columns: ${pxToRem(250)} 1fr ${pxToRem(250)};
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
	flex-wrap: wrap;
	align-content: flex-start;
	align-items: flex-start;
	${({ theme }) => css`
		background: ${theme.ui.background["1"]};
		color: ${theme.ui.text["1"]};
	`};
`;

export const StyledRight = styled.aside`
	display: flex;
	grid-area: Right;
	flex-wrap: wrap;
	align-content: flex-start;
	align-items: flex-start;
	${({ theme }) => css`
		background: ${theme.ui.background["1"]};
		color: ${theme.ui.text["1"]};
	`};
`;

export const StyledMain = styled.main`
	grid-area: Main;
`;
