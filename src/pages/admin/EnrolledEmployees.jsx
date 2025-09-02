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
    const status = emp.status?.toLowerCase();

    if (activeTab === 'completed') {
      return status === 'completed';
    }

    if (activeTab === 'pending') {
      return status !== 'completed';
    }

    return true; // all
  }).filter((emp) => {
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
            boxShadow: 'none',
            width: '99%',
            overflowX: 'auto',
            border: '1px solid #e0e0e0',
          }}
        >
          <Table size="small" sx={{ minWidth: 800, borderCollapse: 'collapse' }}>
            <TableHead>
              <TableRow sx={{ backgroundColor: '#f3f4f6' }}>
                {[
                  "Name",
                  "Employee ID",
                  "Status",
                  "Remaining Days",
                  "Enrolled Date",
                  "Completed Modules",
                  "Total Modules",
                  "Completion Date",
                  "Overall %",
                ].map((header, i) => (
                  <TableCell
                    key={i}
                    sx={{
                      fontWeight: 600,
                      fontSize: "0.85rem",
                      padding: "8px 12px",
                      textAlign: 'center',
                      borderBottom: 'none',
                      color: "#1f2937",
                    }}
                  >
                    {header}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredEmployees.map((emp, index) => (
                <TableRow
                  key={index}
                  sx={{
                    backgroundColor: index % 2 === 0 ? '#fff' : '#fafafa',
                    '&:hover': { backgroundColor: '#f9fafb' },
                    transition: 'background-color 0.25s ease',
                  }}
                >
                  <TableCell sx={{ fontSize: "0.85rem", padding: "8px 12px", textAlign: 'center', borderBottom: 'none' }}>
                    {emp.name}
                  </TableCell>
                  <TableCell sx={{ fontSize: "0.85rem", padding: "8px 12px", textAlign: 'center', borderBottom: 'none' }}>
                    {emp.empId}
                  </TableCell>

                  {/* ✅ Status Chip */}
                  <TableCell sx={{ textAlign: 'center', borderBottom: 'none' }}>
                    <Box
                      sx={{
                        borderRadius: '4px',
                        border: '1px solid',
                        minWidth: '110px',
                        textAlign: 'center',
                        px: 1.5,
                        py: 0.5,
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        display: 'inline-block',
                        textTransform: 'capitalize',
                        cursor: 'default',
                        transition: 'background-color 0.2s ease',
                        ...(emp.status === 'completed'
                          ? {
                            background: '#ecfdf5',
                            borderColor: '#10b981',
                            color: '#065f46',
                          }
                          : emp.status === 'pending'
                            ? {
                              background: '#fffbeb',
                              borderColor: '#f59e0b',
                              color: '#92400e',
                            }
                            : {
                              background: '#eff6ff',
                              borderColor: '#3b82f6',
                              color: '#1e3a8a',
                            }),
                      }}
                    >
                      {emp.status}
                    </Box>
                  </TableCell>

                  <TableCell sx={{ fontSize: "0.85rem", padding: "8px 12px", textAlign: 'center', borderBottom: 'none' }}>
                    {emp.remainingDays}
                  </TableCell>
                  <TableCell sx={{ fontSize: "0.85rem", padding: "8px 12px", textAlign: 'center', borderBottom: 'none' }}>
                    {new Date(emp.enrolledDate).toLocaleDateString()}
                  </TableCell>
                  <TableCell sx={{ fontSize: "0.85rem", padding: "8px 12px", textAlign: 'center', borderBottom: 'none' }}>
                    {emp.completedModules}
                  </TableCell>
                  <TableCell sx={{ fontSize: "0.85rem", padding: "8px 12px", textAlign: 'center', borderBottom: 'none' }}>
                    {emp.totalModules}
                  </TableCell>

                  {/* ✅ Completion Date Chip */}
                  <TableCell sx={{ textAlign: 'center', borderBottom: 'none' }}>
                    {emp.isCompleted ? (
                      <Box
                        sx={{
                          borderRadius: '4px',
                          border: '1px solid #10b981',
                          background: '#ecfdf5',
                          color: '#065f46',
                          minWidth: '110px',
                          textAlign: 'center',
                          px: 1.5,
                          py: 0.5,
                          fontSize: '0.75rem',
                          fontWeight: 600,
                          display: 'inline-block',
                          cursor: 'default',
                          transition: 'background-color 0.2s ease',
                        }}
                      >
                        {new Date(emp.completionDate).toLocaleDateString()}
                      </Box>
                    ) : (
                      <Box
                        sx={{
                          borderRadius: '4px',
                          border: '1px solid #f59e0b',
                          background: '#fffbeb',
                          color: '#92400e',
                          minWidth: '110px',
                          textAlign: 'center',
                          px: 1.5,
                          py: 0.5,
                          fontSize: '0.75rem',
                          fontWeight: 600,
                          display: 'inline-block',
                          cursor: 'default',
                          transition: 'background-color 0.2s ease',
                        }}
                      >
                        Pending
                      </Box>
                    )}
                  </TableCell>

                  <TableCell
                    sx={{
                      fontSize: "0.85rem",
                      padding: "8px 12px",
                      textAlign: 'center',
                      borderBottom: 'none',
                      fontWeight: 600,
                      color: emp.overallPercentage >= 70 ? "#065f46" : "#92400e",
                    }}
                  >
                    {emp.overallPercentage}%
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
