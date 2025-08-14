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
  Paper,
  TableContainer,
  TextField,
  InputAdornment,
} from '@mui/material';
import { Search, Users, CheckCircle, Clock } from 'lucide-react';
import { useAuth } from '../../context/contextFiles/AuthContext';
import { enrolledStudentsAction } from '../../context/Actions/AuthActions';
import BlurLoading from '../common/BlurLoading';

// Custom alert styles
const statusStyles = {
  completed: {
    backgroundColor: '#EFE',
    border: '1px solid #DED',
    color: '#9A9',
  },
  pending: {
    backgroundColor: '#FDF7DF',
    border: '1px solid #FEEC6F',
    color: '#C9971C',
  },
  info: {
    backgroundColor: '#EFF',
    border: '1px solid #DEE',
    color: '#9AA',
  },
};

const EnrolledEmployees = () => {
  const [enrolledEmployees, setEnrolledEmployees] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all');

  const { courseId } = useParams();
  const { dispatch } = useAuth();

  useEffect(() => {
    document.body.style.fontFamily = "'Inter', sans-serif"; // Apply Inter font
    setIsLoading(true);
    const fetchEnrolledEmployees = async () => {
      const data = await enrolledStudentsAction(courseId, dispatch);
      if (data) {
        setEnrolledEmployees(data);
        setIsLoading(false);
      }
    };
    if (courseId) fetchEnrolledEmployees();
  }, [courseId, dispatch]);

  const filteredEmployees = enrolledEmployees?.students?.filter((emp) => {
    if (activeTab !== 'all' && emp.status.toLowerCase() !== activeTab) return false;

    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      return (
        emp.name.toLowerCase().includes(searchLower) ||
        emp.empId.toLowerCase().includes(searchLower)
      );
    }
    return true;
  });

  const statusIcons = {
    all: <Users size={16} style={{ marginRight: 6 }} />,
    completed: <CheckCircle size={16} style={{ marginRight: 6 }} />,
    pending: <Clock size={16} style={{ marginRight: 6 }} />,
  };

  return (
    <Box sx={{ p: 3, backgroundColor: '#fff', minHeight: '100vh' }}>
      <Typography
        variant="h5"
        sx={{ color: 'rgba(0, 0, 0, 0.87)', fontWeight: 600 }}
        gutterBottom
      >
        {statusIcons.all} Enrolled Employees for Course: {enrolledEmployees?.title || 'N/A'}
      </Typography>

      <Typography variant="subtitle1" sx={{ color: 'rgba(0, 0, 0, 0.87)', mb: 3 }}>
        Total Employees Enrolled: <strong>{enrolledEmployees?.studentCount || 0}</strong>
      </Typography>

      <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 2, mb: 3 }}>
        {['all', 'completed', 'pending'].map((status) => (
          <Button
            key={status}
            variant={activeTab === status ? 'contained' : 'outlined'}
            onClick={() => setActiveTab(status)}
            startIcon={statusIcons[status]}
            sx={{
              borderRadius: '4px',
              textTransform: 'capitalize',
              fontWeight: 500,
              color: activeTab === status ? '#fff' : '#1976d2',
              backgroundColor: activeTab === status ? '#1976d2' : '#fff',
              borderColor: '#1976d2',
              '&:hover': {
                backgroundColor: activeTab === status ? '#1565c0' : '#e3f2fd',
                borderColor: '#1565c0',
              },
            }}
          >
            {status}
          </Button>
        ))}

        <TextField
          placeholder="Search by name or ID"
          variant="outlined"
          size="small"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search size={18} color="#1976d2" />
              </InputAdornment>
            ),
          }}
          sx={{
            width: 300,
            '& .MuiOutlinedInput-root': {
              borderRadius: '4px',
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
              color: '#1976d2',
            },
          }}
        />
      </Box>

      {isLoading ? (
        <BlurLoading />
      ) : filteredEmployees?.length > 0 ? (
        <TableContainer
          component={Paper}
          sx={{
            borderRadius: '4px',
            backgroundColor: '#fff',
          }}
        >
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                <TableCell sx={{ fontWeight: 600 }}>Name</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Employee ID</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredEmployees.map((emp, index) => (
                <TableRow
                  key={index}
                  sx={{
                    '&:hover': { backgroundColor: '#f9f9f9' },
                    transition: 'background-color 0.2s ease',
                  }}
                >
                  <TableCell>{emp.name}</TableCell>
                  <TableCell>{emp.empId}</TableCell>
                  <TableCell>
                    <div
                      style={{
                        ...statusStyles[emp.status] || statusStyles.info,
                        padding: '6px 12px',
                        borderRadius: '4px',
                        display: 'inline-block',
                        fontSize: '14px',
                        fontWeight: 500,
                        textTransform: 'capitalize',
                      }}
                    >
                      {emp.status}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <Typography mt={2} color="gray" sx={{ fontStyle: 'italic' }}>
          No employees found!
        </Typography>
      )}
    </Box>
  );
};

export default EnrolledEmployees;
