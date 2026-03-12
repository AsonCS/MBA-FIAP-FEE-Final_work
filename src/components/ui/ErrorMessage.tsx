'use client'

import { Box, Typography, Button, Paper } from '@mui/material'

interface ErrorMessageProps {
  message: string
  onRetry?: () => void
}

/**
 * ErrorMessage Component
 * Displays an error message with an optional retry button.
 */
export function ErrorMessage({ message, onRetry }: ErrorMessageProps) {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '50vh',
      }}
      data-testid="error-message"
    >
      <Paper
        sx={{
          p: 4,
          textAlign: 'center',
          maxWidth: 400,
        }}
      >
        <Typography variant="h5" color="error" gutterBottom>
          Oops! Something went wrong
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          {message}
        </Typography>
        {onRetry && (
          <Button
            variant="contained"
            color="primary"
            onClick={onRetry}
            data-testid="retry-button"
          >
            Try Again
          </Button>
        )}
      </Paper>
    </Box>
  )
}
