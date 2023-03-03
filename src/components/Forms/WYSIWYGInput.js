import PropTypes from 'prop-types';
import { useState } from 'react';

// next
import dynamic from 'next/dynamic';
// components
import draftToHtml from 'draftjs-to-html';
import { EditorState, ContentState, convertFromHTML, convertToRaw } from 'draft-js';

const Editor = dynamic(() => import('react-draft-wysiwyg').then((mod) => mod.Editor), {
    ssr: false,
});

// ----------------------------------------------------------------------

function WYSIWYGInput(props) {
    const [editorState, setEditorState] = useState(
        props.editorState
            ? EditorState.createWithContent(
                  ContentState.createFromBlockArray(convertFromHTML(props.editorState))
              )
            : EditorState.createEmpty()
    );

    const onEditorStateChange = (editorState) => {
        setEditorState(editorState);

        props.input.onChange(draftToHtml(convertToRaw(editorState.getCurrentContent())));
    };

    const getFileBase64 = (file, callback) => {
        var reader = new FileReader();
        reader.readAsDataURL(file);
        // Since FileReader is asynchronous,
        // we need to pass data back.
        reader.onload = () => callback(reader.result);
        // TODO: catch an error
        reader.onerror = (error) => {};
    };

    const imageUploadCallback = (file) =>
        new Promise((resolve, reject) =>
            getFileBase64(file, (data) => resolve({ data: { link: data } }))
        );

    return (
        <Editor
            editorState={editorState}
            onBlur={props.input.onBlur}
            onFocus={props.input.onFocus}
            onEditorStateChange={onEditorStateChange}
            toolbar={{
                image: {
                    uploadCallback: imageUploadCallback,
                    previewImage: true,
                },
            }}
            editorStyle={{
                height: 300,
            }}
        />
    );
}

WYSIWYGInput.propTypes = {
    input: PropTypes.object.isRequired,
    editorState: PropTypes.string,
};

// ----------------------------------------------------------------------

export default WYSIWYGInput;
