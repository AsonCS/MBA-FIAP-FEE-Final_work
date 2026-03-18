'use client'

import { Box, Typography, Button, Grid2 as Grid, Container, Paper } from '@mui/material'
import { VocabularyItem } from '@/core/domain/VocabularyItem'
import { VocabularyCard } from './VocabularyCard'

interface MemorizationPhaseProps {
  vocabularyItems: VocabularyItem[]
  onStartQuiz: () => void
}

/**
 * MemorizationPhase Component
 * Displays vocabulary cards for memorization before the quiz.
 */
export function MemorizationPhase({
  vocabularyItems,
  onStartQuiz,
}: MemorizationPhaseProps) {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper sx={{ p: 4, mb: 4, textAlign: 'center', bgcolor: 'primary.main', color: 'white' }}>
        <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 700 }}>
          Aprendendo Vocabulário em Inglês
        </Typography>
        <Typography variant="h6" sx={{ opacity: 0.9 }}>
          Memorise estas 5 palavras antes de começar o quiz
        </Typography>
      </Paper>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        {vocabularyItems.map((item, index) => (
          <Grid key={item.word} size={{ xs: 12, sm: 6, md: 4 }}>
            <VocabularyCard item={item} index={index} />
          </Grid>
        ))}
      </Grid>

      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
        <Button
          variant="contained"
          color="primary"
          size="large"
          onClick={onStartQuiz}
          sx={{ px: 6, py: 1.5, fontSize: '1.1rem' }}
          data-testid="start-quiz-button"
        >
          Começar Quiz
        </Button>
      </Box>
    </Container>
  )
}
