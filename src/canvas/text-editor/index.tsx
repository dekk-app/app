import { TextEditorProps } from "@/canvas/text-editor/types";
import { useSpace } from "@/ions/store/space";
import { ContentState, Editor, EditorState } from "draft-js";
import React from "react";

export const TextEditor = ({ value, entityId }: TextEditorProps) => {
	const updateTextEntity = useSpace(state => state.updateTextEntity);
	const [editorState, setEditorState] = React.useState(() =>
		EditorState.createWithContent(ContentState.createFromText(value))
	);

	return (
		<Editor
			editorState={editorState}
			onChange={state => {
				const text = state.getCurrentContent().getPlainText();
				updateTextEntity({ text }, entityId);
				setEditorState(state);
			}}
		/>
	);
};
