'use client'

import {
  Box,
  Typography,
  Container,
  Paper,
  Button,
  CircularProgress,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import CancelIcon from '@mui/icons-material/Cancel'
import { QuizSession, calculateScorePercentage } from '@/core/domain/QuizSession'

interface ResultsPhaseProps {
  session: QuizSession
  resultMessage: string
  onTryAgain: () => void
  isLoading?: boolean
}

/**
 * ResultsPhase Component
 * Displays the final quiz results and score.
 */
export function ResultsPhase({
  session,
  resultMessage,
  onTryAgain,
  isLoading = false,
}: ResultsPhaseProps) {
  const percentage = calculateScorePercentage(session)
  const isPassing = percentage >= 60

  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      <Paper sx={{ p: 4, textAlign: 'center' }}>
        <Box sx={{ position: 'relative', display: 'inline-flex', mb: 3 }}>
          <CircularProgress
            variant="determinate"
            value={percentage}
            size={120}
            thickness={4}
            color={isPassing ? 'success' : 'error'}
          />
          <Box
            sx={{
              top: 0,
              left: 0,
              bottom: 0,
              right: 0,
              position: 'absolute',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Typography
              variant="h4"
              component="div"
              color={isPassing ? 'success.main' : 'error.main'}
              sx={{ fontWeight: 700 }}
            >
              {Math.round(percentage)}%
            </Typography>
          </Box>
        </Box>

        <Typography
          variant="h4"
          component="h1"
          gutterBottom
          data-testid="score-text"
        >
          Você acertou {session.score} de {session.vocabularyItems.length}
        </Typography>

        <Typography
          variant="h6"
          color="text.secondary"
          paragraph
          data-testid="result-message"
        >
          {resultMessage}
        </Typography>

        <List sx={{ mb: 3 }}>
          {session.vocabularyItems.map((item, index) => (
            <ListItem key={item.word} sx={{ py: 0.5 }}>
              <ListItemIcon sx={{ minWidth: 36 }}>
                {session.answers[index] ? (
                  <CheckCircleIcon color="success" />
                ) : (
                  <CancelIcon color="error" />
                )}
              </ListItemIcon>
              <ListItemText
                primary={item.word}
                secondary={item.description}
                primaryTypographyProps={{
                  fontWeight: 600,
                  color: session.answers[index] ? 'success.main' : 'error.main',
                }}
              />
            </ListItem>
          ))}
        </List>

        <Button
          variant="contained"
          color="primary"
          size="large"
          onClick={onTryAgain}
          disabled={isLoading}
          sx={{ px: 6, py: 1.5, fontSize: '1.1rem' }}
          data-testid="try-again-button"
        >
          {isLoading ? 'Carregando novas palavras...' : 'Tentar Novamente'}
        </Button>
      </Paper>
    </Container>
  )
}
