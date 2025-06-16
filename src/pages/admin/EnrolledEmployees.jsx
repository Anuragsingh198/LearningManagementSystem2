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
import { useCourseContext } from '../../context/contextFiles/CourseContext';
import { getMyCoursesAction } from '../../context/Actions/courseActions';

const dummyEmployees = [
    {
        id: 'EMP001',
        name: 'John Doe',
        status: 'Completed',
        completedOn: '2025-06-10',
    },
    {
        id: 'EMP002',
        name: 'Jane Smith',
        status: 'Pending',
        completedOn: null,
    },
    {
        id: 'EMP003',
        name: 'Alice Johnson',
        status: 'Completed',
        completedOn: '2025-06-12',
    },
    {
        id: 'EMP004',
        name: 'Bob Brown',
        status: 'Pending',
        completedOn: null,
    },
];

const EnrolledEmployees = () => {
    const { courseId } = useParams();
    const { state: { courses, myCourses }, dispatch } = useCourseContext();
    
    const [activeTab, setActiveTab] = useState('all'); // all | completed | pending

      useEffect(() => {
        if (!courseId) return;
        const fetchMyCourses = async () => {
          try {
            await getMyCoursesAction(dispatch);
          } catch (error) {
            console.error('unable to fetch my courses', error);
          }
        };
    
        fetchMyCourses();
      }, [courseId, courses]);

    const filteredEmployees = dummyEmployees.filter((emp) => {
        if (activeTab === 'all') return true;
        return emp.status.toLowerCase() === activeTab;
    });

    const course = myCourses.find(c => c._id === courseId);
    console.log('Mycourse is: ', myCourses)
    
    console.log('course is: ', course)

     if (!courseId) {
    return <div>Loading...</div>;
  }


    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h5" color="black">
                Enrolled Employees for {course ? `Course: ${course.title}` : 'Course not found'}
            </Typography>

             <Typography variant="h6" mb={2} color="black">
                Total Employees Enrolled: 4
            </Typography>

            <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
                <Button
                    variant={activeTab === 'all' ? 'contained' : 'outlined'}
                    onClick={() => setActiveTab('all')}
                >
                    All
                </Button>
                <Button
                    variant={activeTab === 'completed' ? 'contained' : 'outlined'}
                    onClick={() => setActiveTab('completed')}
                >
                    Completed
                </Button>
                <Button
                    variant={activeTab === 'pending' ? 'contained' : 'outlined'}
                    onClick={() => setActiveTab('pending')}
                >
                    Pending
                </Button>
            </Box>

            {filteredEmployees.length > 0 ? (
                <TableContainer component={Paper} sx={{ borderRadius: 3, boxShadow: 3 }}>
                    <Table>
                        <TableHead>
                            <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                                <TableCell><strong>Name</strong></TableCell>
                                <TableCell><strong>Employee ID</strong></TableCell>
                                <TableCell><strong>Status</strong></TableCell>
                                <TableCell><strong>Completed On</strong></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filteredEmployees.map((emp) => (
                                <TableRow key={emp.id}>
                                    <TableCell>{emp.name}</TableCell>
                                    <TableCell>{emp.id}</TableCell>
                                    <TableCell>
                                        <Chip
                                            label={emp.status}
                                            color={emp.status === 'Completed' ? 'success' : 'warning'}
                                            sx={{
                                                width: 100, // Strict fixed width
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                '& .MuiChip-label': {
                                                    display: 'flex',
                                                    justifyContent: 'center',
                                                    alignItems: 'center',
                                                    width: '100%',
                                                    overflow: 'visible' // In case of longer text
                                                }
                                            }}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        {emp.status === 'Completed' ? emp.completedOn : 'Pending'}
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
