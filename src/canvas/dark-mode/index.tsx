import { useThree } from "@react-three/fiber";
import { useEffect } from "react";
import useDarkMode from "use-dark-mode";

export const DarkModeListener = () => {
	const { value: darkMode } = useDarkMode();
	const gl = useThree(state => state.gl);
	useEffect(() => {
		if (gl) {
			gl.setClearColor(darkMode ? "#1d1d1d" : "#f7f7f8");
		}
	}, [gl, darkMode]);
	return null;
};
