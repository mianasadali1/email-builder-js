import React, { useState } from 'react';

import {
  VerticalAlignBottomOutlined,
  VerticalAlignCenterOutlined,
  VerticalAlignTopOutlined,
} from '@mui/icons-material';
import { Stack, ToggleButton, Button, CircularProgress, Typography } from '@mui/material';
import { ImageProps, ImagePropsSchema } from '@usewaypoint/block-image';

import BaseSidebarPanel from './helpers/BaseSidebarPanel';
import RadioGroupInput from './helpers/inputs/RadioGroupInput';
import TextDimensionInput from './helpers/inputs/TextDimensionInput';
import TextInput from './helpers/inputs/TextInput';
import MultiStylePropertyPanel from './helpers/style-inputs/MultiStylePropertyPanel';

type ImageSidebarPanelProps = {
  data: ImageProps;
  setData: (v: ImageProps) => void;
};

export default function ImageSidebarPanel({ data, setData }: ImageSidebarPanelProps) {
  const [, setErrors] = useState<Zod.ZodError | null>(null);

  // Track upload state
  const [isUploading, setIsUploading] = useState(false);

  const updateData = (d: unknown) => {
    const res = ImagePropsSchema.safeParse(d);
    if (res.success) {
      setData(res.data);
      setErrors(null);
    } else {
      setErrors(res.error);
    }
  };

  // --------- NEW FUNCTION TO HANDLE FILE UPLOAD ---------
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;

    setIsUploading(true);
    const file = e.target.files[0];

    try {
      const formData = new FormData();
      // Make sure the field name here matches what your Laravel controller expects, 
      // e.g., 'image' or 'file' or similar.
      formData.append('image', file);

      // POST the formData to your Laravel endpoint.
      // Adjust this URL to your actual backend route.
      const response = await fetch('https://staging-api.train321.com/api/upload-image-for-email', {
        method: 'POST',
        body: formData,
        // If you need authentication or headers:
        // headers: {
        //   'Authorization': 'Bearer <token>',
        // },
      });

      if (!response.ok) {
        throw new Error('File upload failed.');
      }

      // Assuming your Laravel backend returns a JSON object with { "url": "https://..." }
      const responseData = await response.json();
      if (!responseData.url) {
        throw new Error('No URL returned from upload.');
      }

      // Update the image 'url' with the returned URL from the backend
      updateData({
        ...data,
        props: {
          ...data.props,
          url: responseData.url, // The new uploaded image URL
        },
      });
    } catch (error) {
      console.error('Error uploading file:', error);
      // You might want to show an error message to the user here
    } finally {
      setIsUploading(false);
    }
  };
  // -------------------------------------------------------

  return (
    <BaseSidebarPanel title="Image block">
      <TextInput
        label="Source URL"
        defaultValue={data.props?.url ?? ''}
        onChange={(v) => {
          const url = v.trim().length === 0 ? null : v.trim();
          updateData({ ...data, props: { ...data.props, url } });
        }}
      />

      {/* --------- NEW UPLOAD SECTION --------- */}
      {isUploading ? (
        <Stack direction="row" alignItems="center" spacing={1} sx={{ mt: 1, mb: 2 }}>
          <CircularProgress size={20} />
          <Typography variant="body2">Uploading...</Typography>
        </Stack>
      ) : (
        <Button variant="contained" component="label" sx={{ mt: 1, mb: 2 }}>
          Upload Image
          <input
            type="file"
            hidden
            accept="image/*"
            onChange={handleFileChange}
          />
        </Button>
      )}
      {/* ------------------------------------ */}

      <TextInput
        label="Alt text"
        defaultValue={data.props?.alt ?? ''}
        onChange={(alt) =>
          updateData({ ...data, props: { ...data.props, alt } })
        }
      />
      <TextInput
        label="Click through URL"
        defaultValue={data.props?.linkHref ?? ''}
        onChange={(v) => {
          const linkHref = v.trim().length === 0 ? null : v.trim();
          updateData({ ...data, props: { ...data.props, linkHref } });
        }}
      />
      <Stack direction="row" spacing={2}>
        <TextDimensionInput
          label="Width"
          defaultValue={data.props?.width}
          onChange={(width) =>
            updateData({ ...data, props: { ...data.props, width } })
          }
        />
        <TextDimensionInput
          label="Height"
          defaultValue={data.props?.height}
          onChange={(height) =>
            updateData({ ...data, props: { ...data.props, height } })
          }
        />
      </Stack>

      <RadioGroupInput
        label="Alignment"
        defaultValue={data.props?.contentAlignment ?? 'middle'}
        onChange={(contentAlignment) =>
          updateData({ ...data, props: { ...data.props, contentAlignment } })
        }
      >
        <ToggleButton value="top">
          <VerticalAlignTopOutlined fontSize="small" />
        </ToggleButton>
        <ToggleButton value="middle">
          <VerticalAlignCenterOutlined fontSize="small" />
        </ToggleButton>
        <ToggleButton value="bottom">
          <VerticalAlignBottomOutlined fontSize="small" />
        </ToggleButton>
      </RadioGroupInput>

      <MultiStylePropertyPanel
        names={['backgroundColor', 'textAlign', 'padding']}
        value={data.style}
        onChange={(style) => updateData({ ...data, style })}
      />
    </BaseSidebarPanel>
  );
}
