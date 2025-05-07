import { Box, CircularProgress, Typography } from '@mui/material';

export default function LoadingFallback({ text = '載入中...' }: { text?: string }) {
  return (
    <Box
      sx={{ minHeight: '50vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}
    >
      <CircularProgress />
      <Typography sx={{ ml: 2 }}>{text}</Typography>
    </Box>
  );
}
