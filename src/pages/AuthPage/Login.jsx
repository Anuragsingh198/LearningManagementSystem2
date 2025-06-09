import React, { useEffect, useState } from "react";
import { 
  Box, 
  Button, 
  Checkbox, 
  FormControlLabel, 
  IconButton, 
  InputAdornment, 
  Paper, 
  TextField, 
  Typography,
  Link,
  styled
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useAuth } from "../../context/contextFiles/AuthContext";
import { useLocation, useNavigate } from "react-router-dom";
import { userLogin } from "../../context/Actions/AuthActions";

const GradientBackground = styled(Box)({
  background: 'linear-gradient(135deg, #f0f4ff 0%, #e0e8ff 100%)',
  minHeight: '100vh',
  width: '100vw',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '16px',
  position: 'absolute', // Fixed by adding quotes
  top: 0,
  left: 0,
});


const FormContainer = styled(Paper)({
  display: 'flex',
  borderRadius: '12px',
  overflow: 'hidden',
  boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
  maxWidth: '1000px',
  width: '100%'
});

const LeftSection = styled(Box)(({ theme }) => ({
  display: 'none',
  [theme.breakpoints.up('lg')]: {
    display: 'flex',
    width: '60%',
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
  width: '100%',
  backgroundColor: 'rgba(56, 54, 123, 0.7)'
});

const RightSection = styled(Box)(({ theme }) => ({
  width: '100%',
  padding: '2rem',
  [theme.breakpoints.up('lg')]: {
    width: '50%'
  }
}));

const LoginPage = () => {
  const { state: { isAuthenticated, user }, dispatch } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    userType: "student", 
  });

  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  useEffect(() => {
    if (isAuthenticated) {
      const role = user?.role === 'student' ? 'student' : 'teacher';
      navigate(`/${role}/dashboard`);
    }
  }, [isAuthenticated, user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await userLogin(formData, dispatch);
      alert(`Login successful!`);
    } catch (error) {
      alert("Login failed: " + error.message);
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
              {formData.userType === 'student'
                ? "Continue Your Learning Journey"
                : "Welcome Back, Educator!"}
            </Typography>
            <Typography sx={{ fontSize: '1.125rem', fontWeight: 'normal', marginTop: '1rem' }}>
              {formData.userType === 'student'
                ? "Pick up where you left off and achieve your learning goals."
                : "Manage your courses and connect with your students."}
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
              Sign in to your account
            </Typography>
          </Box>

          {/* Form */}
          <Box component="form" onSubmit={handleSubmit} sx={{ '& > :not(style)': { marginBottom: '1.5rem' } }}>
            <Box>
              <Typography variant="body2" sx={{ fontWeight: 'medium', color: '#374151', marginBottom: '0.5rem' }}>
                Email Address
              </Typography>
              <TextField
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                fullWidth
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
            </Box>

            <Box>
              <Typography variant="body2" sx={{ fontWeight: 'medium', color: '#374151', marginBottom: '0.5rem' }}>
                Password
              </Typography>
              <TextField
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                fullWidth
                variant="outlined"
                type={showPassword ? "text" : "password"}
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
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <FormControlLabel
                control={
                  <Checkbox 
                    color="primary" 
                    sx={{
                      color: '#6366f1',
                      '&.Mui-checked': {
                        color: '#6366f1',
                      },
                    }}
                  />
                }
                label={
                  <Typography variant="body2" sx={{ color: '#374151' }}>
                    Remember me
                  </Typography>
                }
              />
              <Link 
                href="#" 
                sx={{ 
                  fontSize: '0.875rem', 
                  fontWeight: 'medium', 
                  color: '#4f46e5',
                  '&:hover': {
                    color: '#4338ca'
                  }
                }}
              >
                Forgot password?
              </Link>
            </Box>

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
                Sign in as {formData.userType === 'student' ? 'Student' : 'Teacher'}
              </Button>
            </Box>
          </Box>

          <Box sx={{ marginTop: '1.5rem', textAlign: 'center' }}>
            <Typography variant="body2" sx={{ color: '#4b5563' }}>
              Don't have an account?{" "}
              <Link 
                href="/auth/signup" 
                sx={{ 
                  color: '#4f46e5', 
                  fontWeight: 'medium',
                  '&:hover': {
                    color: '#3730a3'
                  }
                }}
              >
                Sign up
              </Link>
            </Typography>
          </Box>
        </RightSection>
      </FormContainer>
    </GradientBackground>
  );
};

export default LoginPage;