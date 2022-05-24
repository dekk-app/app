import React, { FC, memo } from "react";
import { StyledLayoutWithLeft } from "./styled";

const Layout: FC = ({ children }) => <StyledLayoutWithLeft>{children}</StyledLayoutWithLeft>;

export default memo<FC>(Layout);
