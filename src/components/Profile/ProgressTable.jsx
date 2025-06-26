import React from 'react';
import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, LinearProgress } from '@mui/material';

const ProgressTable = () => {
  // Sample test data
  const tests = [
    { id: 1, name: 'React Fundamentals', date: '2023-05-15', score: 85, total: 100, status: 'Completed' },
    { id: 2, name: 'JavaScript Advanced', date: '2023-06-22', score: 72, total: 100, status: 'Completed' },
    { id: 3, name: 'CSS Mastery', date: '2023-07-10', score: 90, total: 100, status: 'Completed' },
    { id: 4, name: 'Node.js Basics', date: '2023-08-05', score: 68, total: 100, status: 'Completed' },
    { id: 5, name: 'Database Design', date: '2023-09-18', score: null, total: 100, status: 'Pending' },
  ];
  

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Test Progress
      </Typography>
      <Typography color="textSecondary" paragraph>
        Track your performance across all tests
      </Typography>
      
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Test Name</TableCell>
              <TableCell align="center">Date</TableCell>
              <TableCell align="center">Score</TableCell>
              <TableCell align="center">Progress</TableCell>
              <TableCell align="center">Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tests.map((test) => (
              <TableRow key={test.id}>
                <TableCell component="th" scope="row">
                  {test.name}
                </TableCell>
                <TableCell align="center">{test.date}</TableCell>
                <TableCell align="center">
                  {test.score !== null ? `${test.score}/${test.total}` : '--'}
                </TableCell>
                <TableCell>
                  {test.score !== null ? (
                    <LinearProgress 
                      variant="determinate" 
                      value={(test.score / test.total) * 100} 
                      color={
                        (test.score / test.total) >= 0.8 ? 'success' : 
                        (test.score / test.total) >= 0.6 ? 'warning' : 'error'
                      }
                    />
                  ) : (
                    <LinearProgress variant="indeterminate" />
                  )}
                </TableCell>
                <TableCell align="center">
                  <Box 
                    sx={{
                      display: 'inline-block',
                      p: 1,
                      borderRadius: 1,
                      backgroundColor: 
                        test.status === 'Completed' ? 'success.light' : 
                        test.status === 'Pending' ? 'warning.light' : 'error.light',
                      color: 'common.white'
                    }}
                  >
                    {test.status}
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      
      <Box mt={2}>
        <Typography variant="body2" color="text.secondary">
          Showing {tests.length} tests
        </Typography>
      </Box>
    </Box>
  );
};

export default ProgressTable;