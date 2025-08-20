import React from 'react';
import { Book, Code, CheckCircle, AlertCircle } from 'lucide-react';
import {
  Box,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemIcon,
  Chip,
  Divider,
  Grid
} from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledExampleBox = styled(Paper)(({ theme }) => ({
  borderLeft: `4px solid ${theme.palette.primary.main}`,
  padding: theme.spacing(2),
  backgroundColor: theme.palette.grey[50],
  marginBottom: theme.spacing(2)
}));

const StyledConstraintBox = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.warning.light,
  border: `1px solid ${theme.palette.warning.main}`,
  borderRadius: theme.shape.borderRadius,
  padding: theme.spacing(2)
}));

const StyledCodeBlock = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.grey[100],
  padding: theme.spacing(1),
  borderRadius: theme.shape.borderRadius,
  fontFamily: 'Fira Code, ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
  fontSize: '0.875rem'
}));

const CodingQuestionViewer = ({
  title,
  description,
  examples,
  constraints
}) => {
  return (
    <Box sx={{ height: '100%', overflowY: 'auto', bgcolor: 'background.paper' }}>
      <Box sx={{ p: 3, display: 'flex', flexDirection: 'column', gap: 3 }}>
        {/* Title */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Code style={{ width: 24, height: 24, color: '#2563eb' }} />
          <Typography variant="h4" component="h2" sx={{ fontWeight: 'bold' }}>
            {title}
          </Typography>
        </Box>

        {/* Description */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Book style={{ width: 20, height: 20, color: '#4b5563' }} />
            <Typography variant="h6" component="h3" sx={{ fontWeight: 'semibold' }}>
              Problem Description
            </Typography>
          </Box>
          <StyledExampleBox>
            <Typography variant="body1" sx={{ color: 'text.secondary', lineHeight: 1.75 }}>
              {description}
            </Typography>
          </StyledExampleBox>
        </Box>

        {/* Examples */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <CheckCircle style={{ width: 20, height: 20, color: '#16a34a' }} />
            <Typography variant="h6" component="h3" sx={{ fontWeight: 'semibold' }}>
              Examples
            </Typography>
          </Box>

          {examples.map((example, index) => (
            <Paper key={index} elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 1, p: 2 }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Chip
                    label={`Example ${index + 1}`}
                    size="small"
                    sx={{ bgcolor: 'primary.light', color: 'primary.dark' }}
                  />
                </Box>

                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <Typography variant="caption" sx={{ fontWeight: 'medium', color: 'text.secondary' }}>
                      Input:
                    </Typography>
                    <StyledCodeBlock>
                      {example.input}
                    </StyledCodeBlock>
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <Typography variant="caption" sx={{ fontWeight: 'medium', color: 'text.secondary' }}>
                      Output:
                    </Typography>
                    <StyledCodeBlock>
                      {example.output}
                    </StyledCodeBlock>
                  </Grid>
                </Grid>

                <Box>
                  <Typography variant="caption" sx={{ fontWeight: 'medium', color: 'text.secondary' }}>
                    Explanation:
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    {example.explanation}
                  </Typography>
                </Box>
              </Box>
            </Paper>
          ))}
        </Box>

        {/* Constraints */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <AlertCircle style={{ width: 20, height: 20, color: '#ea580c' }} />
            <Typography variant="h6" component="h3" sx={{ fontWeight: 'semibold' }}>
              Constraints
            </Typography>
          </Box>

          <StyledConstraintBox>
            <List dense sx={{ py: 0 }}>
              {(Array.isArray(constraints) ? constraints : [constraints])?.map((constraint, index) => (
                <ListItem key={index} sx={{ py: 0.5, px: 0 }}>
                  <ListItemIcon sx={{ minWidth: 24 }}>
                    <Box
                      sx={{
                        width: 8,
                        height: 8,
                        bgcolor: 'warning.main',
                        borderRadius: '50%',
                        mt: '8px'
                      }}
                    />
                  </ListItemIcon>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    {constraint}
                  </Typography>
                </ListItem>
              ))}
            </List>
          </StyledConstraintBox>

        </Box>
      </Box>
    </Box>
  );
};

export default CodingQuestionViewer;