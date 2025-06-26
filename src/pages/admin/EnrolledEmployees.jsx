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
} from '@mui/material';
import { useAuth } from '../../context/contextFiles/AuthContext';
import { enrolledStudentsAction } from '../../context/Actions/AuthActions';
import BlurLoading from '../common/BlurLoading';

const EnrolledEmployees = () => {
  const [enrolledEmployees, setEnrolledEmployees] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

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
        setIsLoading(false)
      }
    };
    if (courseId) {
      fetchEnrolledEmployees();
    }
  }, [courseId, dispatch]);



  const filteredEmployees = enrolledEmployees?.students?.filter((emp) => {
    if (activeTab === 'all') return true;
    return emp.status.toLowerCase() === activeTab;
  });


  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" sx={{ color: 'black' }} gutterBottom>
        Enrolled Employees for Course: {enrolledEmployees?.title || 'N/A'}
      </Typography>

      <Typography variant="h6" sx={{ color: 'black' }} mb={2}>
        Total Employees Enrolled: {enrolledEmployees?.studentCount || 0}
      </Typography>

      <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
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
