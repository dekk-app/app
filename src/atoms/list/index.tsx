import styled from "@emotion/styled";
import React, { FC } from "react";

export const StyledList = styled.ul`
	display: block;
	width: 100%;
	margin: 0;
	padding: 0;
	list-style: none;
`;

const List: FC = ({ children }) => {
	return <StyledList>{children}</StyledList>;
};

export default List;
