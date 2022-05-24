import { pxToRem } from "@/ions/utils/unit";
import { focus } from "@dekk-ui/focus-ring";
import { css } from "@emotion/react";
import styled from "@emotion/styled";

export const StyledLink = styled.a`
	color: currentColor;
	text-decoration: none;
`;
interface StyledNavLinkProps {
	isActive?: boolean;
}
export const StyledNavLink = styled(StyledLink)<StyledNavLinkProps>`
	display: block;
	width: 100%;
	border: none;
	background: none;
	color: inherit;
	font: inherit;
	text-align: left;

	&:focus {
		outline: 0;
	}

	&:focus-visible {
		${focus};
	}

	&:hover {
		background-image: linear-gradient(rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.1));
	}

	&:active {
		background-image: linear-gradient(rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.2));
	}

	${({ theme, isActive }) => css`
		padding: ${pxToRem(theme.space.s)};
		${isActive &&
		css`
			background-image: linear-gradient(rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.2));
		`}
	`};
`;

export const StyledListLink = styled(StyledNavLink)`
	${({ theme }) => css`
		margin: ${pxToRem(-theme.space.s)};
	`};
`;
