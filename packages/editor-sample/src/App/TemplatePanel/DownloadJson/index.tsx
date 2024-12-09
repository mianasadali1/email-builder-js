import React, { useCallback } from 'react';
import axios from 'axios';

import { FileDownloadOutlined } from '@mui/icons-material';
import { IconButton, Tooltip } from '@mui/material';

import { useDocument } from '../../../documents/editor/EditorContext';



export default function DownloadJson() {
  
  const doc = useDocument();

  const saveTemplate = useCallback(async () => {
    try {
      const queryParams = new URLSearchParams(location.search);
const template_id = queryParams.get('template_id');

const response = await axios.post(`http://127.0.0.1:8000/api/save-template-json/${template_id}`, {
  content: JSON.stringify(doc, null, '  '), // send the document as a stringified JSON
});
      console.log('Response:', response.data); // handle response based on your API specification
    } catch (error) {
      console.error('Failed to save template:', error);
    }
  }, [doc]);

  return (
    <Tooltip title="Save Template">
      <IconButton onClick={saveTemplate}>
        <FileDownloadOutlined fontSize="small" />
      </IconButton>
    </Tooltip>
  );
}
