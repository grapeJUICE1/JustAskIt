import React, { useState, useEffect } from 'react';
import DOMPurify from 'dompurify';
import { Container } from 'react-bootstrap';
import { EditorState } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import { convertToHTML } from 'draft-convert';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import './Editor.css';

const MainEditor = () => {
  const [editorState, setEditorState] = useState(() =>
    EditorState.createEmpty()
  );
  const [convertedContent, setConvertedContent] = useState(null);
  const handleEditorChange = (state) => {
    setEditorState(state);
  };
  useEffect(() => {
    let currentContentAsHTML = convertToHTML(editorState.getCurrentContent());
    setConvertedContent(currentContentAsHTML);
  }, [editorState]);
  const createMarkup = (html) => {
    return DOMPurify.sanitize(html);
  };
  return (
    <Container className="d-flex flex-column justify-content-between pt-5 mt-5 px-5">
      <Editor
        editorState={editorState}
        onEditorStateChange={handleEditorChange}
        wrapperClassName="wrapper-class"
        editorClassName="editor-class"
        toolbarClassName="toolbar-class"
        toolbar={{
          options: [
            'inline',
            'blockType',
            'list',
            'colorPicker',
            'textAlign',
            'link',
            'embedded',
            'emoji',
            'image',
            'remove',
            'history',
          ],
          colorPicker: { className: 'colorPicker' },
          blockType: {
            options: [
              'Normal',
              'Heading 2',
              'H3',
              'H4',
              'H5',
              'H6',
              'Blockquote',
              'Code',
            ],
          },
        }}
      />
    </Container>
  );
};
export default MainEditor;
