import { useLocation, useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { useAuth } from '../../context/contextFiles/AuthContext';
import { userRegister } from "../../context/Actions/AuthActions";
import { 
  Box, 
  Button, 
  Container, 
  FormControl, 
  IconButton, 
  InputAdornment, 
  Paper, 
  TextField, 
  Typography,
  ToggleButton,
  ToggleButtonGroup,
  styled
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";

const GradientBackground = styled(Box)({
  background: 'linear-gradient(135deg, #f0f4ff 0%, #e0e8ff 100%)',
  Height: '100vh',
  width: '100vw',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '16px', 
  top: 0,
  left: 0,
});

const FormContainer = styled(Paper)({
  display: 'flex',
  borderRadius: '12px',
  overflow: 'hidden',
  boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
  maxWidth: '1000px',
});

const LeftSection = styled(Box)(({ theme }) => ({
  display: 'none',
  [theme.breakpoints.up('lg')]: {
    display: 'flex',
    width: '50%',
    backgroundImage: 'url(https://images.unsplash.com/photo-1465433045946-ba6506ce5a59?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NzR8fHN0dWR5fGVufDB8fDB8fHww)',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    color: 'white',
    fontSize: '1.875rem',
    fontWeight: 'bold',
    textAlign: 'center',
    padding: '1.5rem'
  }
}));

const Overlay = styled(Box)({
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(49, 46, 129, 0.7)'
});

const RightSection = styled(Box)(({ theme }) => ({
  width: '100%',
  padding: '2rem',
  [theme.breakpoints.up('lg')]: {
    width: '50%'
  }
}));

const UserTypeToggle = styled(ToggleButtonGroup)({
  display: 'inline-flex',
  backgroundColor: '#f3f4f6',
  borderRadius: '0.5rem',
  padding: '0.25rem',
  marginBottom: '2rem',
  justifyContent: 'center'
});

const UserTypeButton = styled(ToggleButton)({
  padding: '0.5rem 1.5rem',
  borderRadius: '0.375rem',
  fontWeight: '500',
  '&.Mui-selected': {
    backgroundColor: '#4f46e5',
    color: 'white',
    '&:hover': {
      backgroundColor: '#4338ca'
    }
  },
  '&:not(.Mui-selected)': {
    color: '#374151',
    '&:hover': {
      backgroundColor: '#e5e7eb'
    }
  }
});

const RegisterPage = () => {
    const { state:{isAuthenticated , user}, dispatch } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        email: "",
        password: "",
        confirmPassword: "",
        userType: "employee", 
        name: ""
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleUserTypeChange = (event, newUserType) => {
        if (newUserType !== null) {
            setFormData({ ...formData, userType: newUserType });
        }
    };

    useEffect(() => {
        if (isAuthenticated) {
            const role = user?.role === 'employee' ? 'student' : 'teacher';
            navigate(`/${role}/dashboard`);
        }
    }, [isAuthenticated, user, navigate]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            alert("Passwords do not match.");
            return;
        }
        console.log("Form Data:", formData);

        try {
            userRegister(formData, dispatch);
            // alert(`Account created successfully as ${formData.userType === 'employee' ? 'student' : 'teacher'}!`);
        } catch (error) {
            alert("Registration failed: " + error.message);
        }
    };

    return (
        <GradientBackground>
            <FormContainer>
                {/* Left Section */}
                <LeftSection>
                    <Overlay />
                    <Box sx={{ position: 'relative', zIndex: 10 }}>
                        <Typography variant="h3" sx={{ lineHeight: '1.375', marginBottom: '1rem' }}>
                            {formData.userType === 'employee'
                                ? "Start Your Learning Journey Today!"
                                : "Share Your Knowledge with the World!"}
                        </Typography>
                        <Typography sx={{ fontSize: '1.125rem', fontWeight: 'normal', marginTop: '1rem' }}>
                            {formData.userType === 'employee'
                                ? "Join thousands of students expanding their skills with our courses."
                                : "Connect with eager learners and build your teaching portfolio."}
                        </Typography>
                    </Box>
                </LeftSection>

                {/* Right Section */}
                <RightSection>
                    <Box sx={{ textAlign: 'center', marginBottom: '2rem' }}>
                        <Typography variant="h3" sx={{ fontWeight: 'bold', color: '#3730a3' }}>
                            EduHub
                        </Typography>
                        <Typography sx={{ color: '#4b5563', marginTop: '0.5rem' }}>
                            Create your {formData.userType === 'employee' ? 'student' : 'teacher'} account
                        </Typography>
                    </Box>

                    {/* User Type Toggle */}
                    <Box sx={{ display: 'flex', justifyContent: 'center', marginBottom: '2rem' }}>
                        <UserTypeToggle
                            value={formData.userType}
                            onChange={handleUserTypeChange}
                            exclusive
                        >
                            <UserTypeButton value="employee">
                                Employee
                            </UserTypeButton>
                            <UserTypeButton value="instructor">
                                Teacher
                            </UserTypeButton>
                        </UserTypeToggle>
                    </Box>

                    {/* Form */}
                    <Box component="form" onSubmit={handleSubmit} sx={{ '& > :not(style)': { marginBottom: '1.5rem' } }}>
                        <FormControl fullWidth>
                            <Typography variant="body2" sx={{ fontWeight: 'medium', color: '#374151', marginBottom: '0.5rem' }}>
                                Full Name
                            </Typography>
                            <TextField
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                variant="outlined"
                                placeholder="John Doe"
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        backgroundColor: '#f9fafb',
                                        borderRadius: '0.5rem',
                                        '& fieldset': {
                                            borderColor: '#d1d5db'
                                        },
                                        '&:hover fieldset': {
                                            borderColor: '#d1d5db'
                                        },
                                        '&.Mui-focused fieldset': {
                                            borderColor: '#6366f1',
                                            boxShadow: '0 0 0 2px rgba(99, 102, 241, 0.25)'
                                        }
                                    }
                                }}
                            />
                        </FormControl>

                        <FormControl fullWidth>
                            <Typography variant="body2" sx={{ fontWeight: 'medium', color: '#374151', marginBottom: '0.5rem' }}>
                                Email Address
                            </Typography>
                            <TextField
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                type="email"
                                variant="outlined"
                                placeholder="you@example.com"
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        backgroundColor: '#f9fafb',
                                        borderRadius: '0.5rem',
                                        '& fieldset': {
                                            borderColor: '#d1d5db'
                                        },
                                        '&:hover fieldset': {
                                            borderColor: '#d1d5db'
                                        },
                                        '&.Mui-focused fieldset': {
                                            borderColor: '#6366f1',
                                            boxShadow: '0 0 0 2px rgba(99, 102, 241, 0.25)'
                                        }
                                    }
                                }}
                            />
                        </FormControl>

                        <FormControl fullWidth>
                            <Typography variant="body2" sx={{ fontWeight: 'medium', color: '#374151', marginBottom: '0.5rem' }}>
                                Password
                            </Typography>
                            <TextField
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                                type={showPassword ? "text" : "password"}
                                variant="outlined"
                                placeholder="••••••••"
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton
                                                onClick={() => setShowPassword((prev) => !prev)}
                                                edge="end"
                                            >
                                                {showPassword ? <VisibilityOff /> : <Visibility />}
                                            </IconButton>
                                        </InputAdornment>
                                    )
                                }}
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        backgroundColor: '#f9fafb',
                                        borderRadius: '0.5rem',
                                        '& fieldset': {
                                            borderColor: '#d1d5db'
                                        },
                                        '&:hover fieldset': {
                                            borderColor: '#d1d5db'
                                        },
                                        '&.Mui-focused fieldset': {
                                            borderColor: '#6366f1',
                                            boxShadow: '0 0 0 2px rgba(99, 102, 241, 0.25)'
                                        }
                                    }
                                }}
                            />
                        </FormControl>

                        <FormControl fullWidth>
                            <Typography variant="body2" sx={{ fontWeight: 'medium', color: '#374151', marginBottom: '0.5rem' }}>
                                Confirm Password
                            </Typography>
                            <TextField
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                required
                                type={showConfirm ? "text" : "password"}
                                variant="outlined"
                                placeholder="••••••••"
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton
                                                onClick={() => setShowConfirm((prev) => !prev)}
                                                edge="end"
                                            >
                                                {showConfirm ? <VisibilityOff /> : <Visibility />}
                                            </IconButton>
                                        </InputAdornment>
                                    )
                                }}
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        backgroundColor: '#f9fafb',
                                        borderRadius: '0.5rem',
                                        '& fieldset': {
                                            borderColor: '#d1d5db'
                                        },
                                        '&:hover fieldset': {
                                            borderColor: '#d1d5db'
                                        },
                                        '&.Mui-focused fieldset': {
                                            borderColor: '#6366f1',
                                            boxShadow: '0 0 0 2px rgba(99, 102, 241, 0.25)'
                                        }
                                    }
                                }}
                            />
                        </FormControl>

                        <Box sx={{ marginTop: '2rem' }}>
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                sx={{
                                    backgroundColor: '#4f46e5',
                                    padding: '0.75rem 1rem',
                                    borderRadius: '0.5rem',
                                    fontWeight: 'medium',
                                    '&:hover': {
                                        backgroundColor: '#4338ca'
                                    }
                                }}
                            >
                                Create {formData.userType === 'employee' ? 'Employee' : 'Instructor'} Account
                            </Button>
                        </Box>
                    </Box>

                    <Box sx={{ marginTop: '1.5rem', textAlign: 'center' }}>
                        <Typography variant="body2" sx={{ color: '#4b5563' }}>
                            Already have an account?{" "}
                            <a href="/login" style={{ color: '#4f46e5', fontWeight: 'medium', textDecoration: 'none', '&:hover': { color: '#3730a3' } }}>
                                Sign in
                            </a>
                        </Typography>
                    </Box>
                </RightSection>
            </FormContainer>
        </GradientBackground>
    );
};

export default RegisterPage;