import React, { useEffect } from 'react';

import { MonitorOutlined, PhoneIphoneOutlined } from '@mui/icons-material';
import { Box, Stack, SxProps, ToggleButton, ToggleButtonGroup, Tooltip } from '@mui/material';

import EditorBlock from '../../documents/editor/EditorBlock';
import { setSelectedScreenSize, useDocument, useSelectedMainTab, useSelectedScreenSize, resetDocument } from '../../documents/editor/EditorContext';
import ToggleInspectorPanelButton from '../InspectorDrawer/ToggleInspectorPanelButton';
import ToggleSamplesPanelButton from '../SamplesDrawer/ToggleSamplesPanelButton';
import DownloadJson from './DownloadJson';
import HtmlPanel from './HtmlPanel';
import ImportJson from './ImportJson';
import JsonPanel from './JsonPanel';
import MainTabsGroup from './MainTabsGroup';
import ShareButton from './ShareButton';
import { Reader } from '@usewaypoint/email-builder';

export default function TemplatePanel() {
  const document = useDocument();
  const selectedMainTab = useSelectedMainTab();
  const selectedScreenSize = useSelectedScreenSize();
  const queryParams = new URLSearchParams(location.search);
  const template_id = queryParams.get('template_id');

  let mainBoxSx: SxProps = {
    height: '100%',
    ...(selectedScreenSize === 'mobile' && {
      margin: '32px auto',
      width: 370,
      height: 800,
      boxShadow: 'rgba(33, 36, 67, 0.04) 0px 10px 20px, rgba(33, 36, 67, 0.04) 0px 2px 6px, rgba(33, 36, 67, 0.04) 0px 0px 1px',
    }),
  };

  const handleScreenSizeChange = (_: any, value: 'mobile' | 'desktop') => {
    setSelectedScreenSize(value || 'desktop');
  };

  const renderMainPanel = () => {
    switch (selectedMainTab) {
      case 'editor':
        return <Box sx={mainBoxSx}><EditorBlock id="root" /></Box>;
      case 'preview':
        return <Box sx={mainBoxSx}><Reader document={document} rootBlockId="root" /></Box>;
      case 'html':
        return <HtmlPanel />;
      case 'json':
        return <JsonPanel />;
      default:
        return null;
    }
  };

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch(`https://staging-api.train321.com/api/email-template-json/${template_id}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        resetDocument(data);
      } catch (error) {
        console.error('Error fetching email template:', error);
        // Optionally update state to show an error message or UI feedback
      }
    }

    fetchData();

    return () => {
      // Cleanup if needed
    };
  }, [template_id]);  // Ensuring fetchData runs when template_id changes

  return (
    <>
      <Stack
        sx={{
          height: 49,
          borderBottom: 1,
          borderColor: 'divider',
          backgroundColor: 'white',
          position: 'sticky',
          top: 0,
          zIndex: 'appBar',
          px: 1,
        }}
        direction="row"
        justifyContent="space-between"
        alignItems="center"
      >
        <ToggleSamplesPanelButton />
        <Stack px={2} direction="row" gap={2} width="100%" justifyContent="space-between" alignItems="center">
          <Stack direction="row" spacing={2}>
            <MainTabsGroup />
          </Stack>
          <Stack direction="row" spacing={2}>
            <DownloadJson />
            <ImportJson />
            <ToggleButtonGroup value={selectedScreenSize} exclusive size="small" onChange={handleScreenSizeChange}>
              <ToggleButton value="desktop">
                <Tooltip title="Desktop view"><MonitorOutlined fontSize="small" /></Tooltip>
              </ToggleButton>
              <ToggleButton value="mobile">
                <Tooltip title="Mobile view"><PhoneIphoneOutlined fontSize="small" /></Tooltip>
              </ToggleButton>
            </ToggleButtonGroup>
            <ShareButton />
          </Stack>
        </Stack>
        <ToggleInspectorPanelButton />
      </Stack>
      <Box sx={{ height: 'calc(100vh - 49px)', overflow: 'auto', minWidth: 370 }}>{renderMainPanel()}</Box>
    </>
  );
}
