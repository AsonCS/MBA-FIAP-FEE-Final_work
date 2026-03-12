'use client'

import { Card, CardContent, Typography, Box, Chip } from '@mui/material'
import { VocabularyItem } from '@/core/domain/VocabularyItem'

interface VocabularyCardProps {
  item: VocabularyItem
  index: number
}

/**
 * VocabularyCard Component
 * Displays a vocabulary item with the English word, Portuguese description, and usage example.
 */
export function VocabularyCard({ item, index }: VocabularyCardProps) {
  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: 4,
        },
      }}
      data-testid={`vocabulary-card-${index}`}
    >
      <CardContent sx={{ flexGrow: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          <Chip
            label={`#${index + 1}`}
            size="small"
            color="primary"
            sx={{ fontWeight: 600 }}
          />
        </Box>
        
        <Typography
          variant="h4"
          component="h2"
          color="primary"
          gutterBottom
          sx={{ fontWeight: 700 }}
          data-testid={`word-${index}`}
        >
          {item.word}
        </Typography>
        
        <Typography
          variant="body1"
          color="text.secondary"
          paragraph
          data-testid={`description-${index}`}
        >
          <strong>Significado:</strong> {item.description}
        </Typography>
        
        <Box
          sx={{
            bgcolor: 'grey.100',
            p: 2,
            borderRadius: 1,
            borderLeft: 3,
            borderColor: 'primary.main',
          }}
        >
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ fontStyle: 'italic' }}
            data-testid={`usecase-${index}`}
          >
            <strong>Exemplo:</strong> {item.useCase}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  )
}
