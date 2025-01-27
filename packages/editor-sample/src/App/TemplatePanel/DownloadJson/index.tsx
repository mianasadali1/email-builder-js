import React, { useCallback, useMemo } from 'react';
import axios from 'axios';

import { FileDownloadOutlined } from '@mui/icons-material';
import { IconButton, Tooltip } from '@mui/material';

import { useDocument } from '../../../documents/editor/EditorContext';
import { renderToStaticMarkup } from '@usewaypoint/email-builder';

export default function DownloadJson() {
  const doc = useDocument();

  const html_code = useMemo(() => renderToStaticMarkup(doc, { rootBlockId: 'root' }), [doc]);    

  const saveTemplate = useCallback(async () => {
    try {
      const queryParams = new URLSearchParams(location.search);
      const template_id = queryParams.get('template_id');
      
      

      const response = await axios.post(`https://staging-api.train321.com/api/save-template-json/${template_id}`, {
        content: JSON.stringify(doc, null, '  '), // send the document as a stringified JSON
        html_code: html_code
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
