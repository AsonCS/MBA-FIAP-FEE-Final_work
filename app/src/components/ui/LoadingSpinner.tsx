'use client'

import { Box, CircularProgress, Typography } from '@mui/material'

interface LoadingSpinnerProps {
  message?: string
}

/**
 * LoadingSpinner Component
 * Displays a centered loading spinner with an optional message.
 */
export function LoadingSpinner({ message = 'Loading...' }: LoadingSpinnerProps) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '50vh',
        gap: 2,
      }}
      data-testid="loading-spinner"
    >
      <CircularProgress size={48} />
      <Typography variant="body1" color="text.secondary">
        {message}
      </Typography>
    </Box>
  )
}
