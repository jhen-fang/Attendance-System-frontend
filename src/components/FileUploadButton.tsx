import { Button, Typography, Stack } from '@mui/material';
import React from 'react';

interface Props {
  file: File | null;
  fileName: string;
  onFileChange: (f: File | null) => void;
}

export default function FileUploadButton({ file, fileName, onFileChange }: Props) {
  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0] || null;
    onFileChange(selected);
  };

  return (
    <Stack direction="row" alignItems="center" spacing={1}>
      <label>
        <input type="file" hidden onChange={handleFileInput} />
        <Button variant="outlined" component="span" size="small">
          上傳附件
        </Button>
      </label>
      <Typography variant="body2" color="text.secondary">
        {fileName || '未選擇檔案'}
      </Typography>
    </Stack>
  );
}
