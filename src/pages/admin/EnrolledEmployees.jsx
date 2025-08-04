import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  Box,
  Button,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Chip,
  Paper,
  TableContainer,
  TextField,
  InputAdornment,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { useAuth } from '../../context/contextFiles/AuthContext';
import { enrolledStudentsAction } from '../../context/Actions/AuthActions';
import BlurLoading from '../common/BlurLoading';

const EnrolledEmployees = () => {
  const [enrolledEmployees, setEnrolledEmployees] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const { courseId } = useParams();
  const {
    dispatch,
  } = useAuth();

  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    setIsLoading(true);
    const fetchEnrolledEmployees = async () => {
      const data = await enrolledStudentsAction(courseId, dispatch);
      if (data) {
        setEnrolledEmployees(data);
        setIsLoading(false);
      }
    };
    if (courseId) {
      fetchEnrolledEmployees();
    }
  }, [courseId, dispatch]);

  console.log('enrolled employees are: ', enrolledEmployees)

  const filteredEmployees = enrolledEmployees?.students?.filter((emp) => {
    // Filter by status tab
    if (activeTab !== 'all' && emp.status.toLowerCase() !== activeTab) {
      return false;
    }
    
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      return (
        emp.name.toLowerCase().includes(searchLower) ||
        emp.empId.toLowerCase().includes(searchLower)
      );
    }
    
    return true;
  });

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" sx={{ color: 'black' }} gutterBottom>
        Enrolled Employees for Course: {enrolledEmployees?.title || 'N/A'}
      </Typography>

      <Typography variant="h6" sx={{ color: 'black' }} mb={2}>
        Total Employees Enrolled: {enrolledEmployees?.studentCount || 0}
      </Typography>

      <Box sx={{ display: 'flex', justifyContent: 'start', mb: 3 }}>
        <Box sx={{ display: 'flex', gap: 2 }}>
          {['all', 'completed', 'pending'].map((status) => (
            <Button
              key={status}
              variant={activeTab === status ? 'contained' : 'outlined'}
              onClick={() => setActiveTab(status)}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </Button>
          ))}
        </Box>
        
<TextField
  placeholder="Search by name or ID"
  variant="outlined"
  size="small"
  value={searchTerm}
  onChange={(e) => setSearchTerm(e.target.value)}
  InputProps={{
    startAdornment: (
      <InputAdornment position="start">
        <SearchIcon sx={{ color: '#1976d2' }} /> {/* MUI default primary blue */}
      </InputAdornment>
    ),
  }}
  sx={{
    width: 300,
    ml: 2,
    '& .MuiOutlinedInput-root': {
      borderRadius: '8px',
      '& fieldset': {
        borderColor: '#1976d2',
      },
      '&:hover fieldset': {
        borderColor: '#1565c0',
      },
      '&.Mui-focused fieldset': {
        borderColor: '#1565c0',
        borderWidth: '2px',
      },
    },
    '& .MuiInputBase-input': {
      color: '#0d47a1', // deeper blue for text
    },
  }}
/>

      </Box>

      {isLoading ? (
        <BlurLoading />
      ) : filteredEmployees?.length > 0 ? (
        <TableContainer component={Paper} sx={{ borderRadius: 3, boxShadow: 3 }}>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                <TableCell><strong>Name</strong></TableCell>
                <TableCell><strong>Employee ID</strong></TableCell>
                <TableCell><strong>Status</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredEmployees.map((emp, index) => (
                <TableRow key={index}>
                  <TableCell>{emp.name}</TableCell>
                  <TableCell>{emp.empId}</TableCell>
                  <TableCell>
                    <Chip
                      label={emp.status}
                      color={
                        emp.status === 'completed'
                          ? 'success'
                          : emp.status === 'pending'
                            ? 'warning'
                            : 'info'
                      }
                      sx={{
                        width: 100,
                        display: 'flex',
                        justifyContent: 'center',
                      }}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <Typography mt={2} color="gray">
          No employees found!
        </Typography>
      )}
    </Box>
  );
};

export default EnrolledEmployees;