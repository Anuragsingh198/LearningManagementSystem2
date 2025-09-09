import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  IconButton,
  InputAdornment,
  Paper,
  TextField,
  Typography,

  styled
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useAuth } from "../../context/contextFiles/AuthContext";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { userLogin } from "../../context/Actions/AuthActions";
import { toast } from "react-toastify";
import landingImg from '../../assets/landing.jpg'
import axios from 'axios'



const GradientBackground = styled(Box)({
  background: 'linear-gradient(135deg, #f0f4ff 0%, #e0e8ff 100%)',
  minHeight: '100vh',
  width: '100vw',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '16px',
  position: 'absolute',
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
    backgroundImage: `url(${landingImg})`,

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
  const { state: { isAuthenticated, user, isPasswordCorrect }, dispatch } = useAuth();
  const [loading, setLoading] = useState(false)
  const [countdown, setCountdown] = useState(0);
  const location = useLocation();
  const [emailError, setEmailError] = useState("");
  const [disableSendOtp, setDisableSendOtp] = useState(false)
    const serverurl = import.meta.env.VITE_SERVER_URL;

  
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    userType: "student",
    otp: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [otp, setOtp] = useState("")

  useEffect(() => {
    console.log('the isPasswordCorrect is: ', isPasswordCorrect)
  }, [isPasswordCorrect])


  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  
      useEffect(() => {
          let timer;
          if (disableSendOtp && countdown > 0) {
              timer = setTimeout(() => {
                  setCountdown((prev) => prev - 1);
              }, 1000);
          } else if (countdown === 0) {
              setDisableSendOtp(false);
          }
  
          return () => clearTimeout(timer);
      }, [countdown, disableSendOtp]);
  

  useEffect(() => {
    if (isAuthenticated) {
      const role = user?.role === 'student' ? 'student' : 'teacher';
      navigate(`/${role}/dashboard`);
    }
  }, [isAuthenticated, user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true)
    try {
      await userLogin(formData, dispatch);
      // toast.success("OTP Sent! Please verify your account")
      setLoading(false)
      // here if the password is correct then send otp
      handleSendOtp()
    } catch (error) {
      toast.error("Invalid email or password. Please try again.")
      setLoading(false)
    }
  };

  const handleSendOtp = async () => {
        const email = formData.email;
        if (!email) {
            // alert('Please enter email to receive OTP');
            toast.error("Please enter email to receive OTP")
            return;
        }

        setDisableSendOtp(true);
        setCountdown(60); // 20 seconds
        setLoading(true);
        try {

            const response = await axios.post(
                `${serverurl}/api/users/generate-otp`,
                {
                    email: email
                }
            )
            // console.log('the response is: ', response)
            setLoading(false);
            toast.success("OTP send! Please verify your account")
        } catch (error) {
            console.error("OTP send error:", error);
            const errorMessage = error.response?.data?.message || "Failed to send OTP.";
            toast.error(errorMessage);
            setLoading(false);
        }

    };

    const handleVerifyOtp = async () => {

        // if (!formData.email) {
        //     // alert('Please provide email address for OTP verification')
        //     toast.error("Please provide email address for OTP verification")
        //     return;
        // }
        // if (formData.email && !formData.email.endsWith("@ielektron.com")) {
        //     setEmailError("Please use an @ielektron.com email address");
        //     return;
        // }
        if (!formData.  otp) {
            // alert('Please enter otp')
            toast.error("Please enter otp")

            return
        }

        setLoading(true);

        try {

            const response = await axios.post(
                `${serverurl}/api/users/verify-signup-otp`,
                {
                    email: formData.email,
                    otp: formData.otp
                },

            )

            if (response.data.success) {
                // setIsOtpVerified((prev) => !prev)
                // console.log('user is: ', response.data.user)
                toast.success("Login successful!")
                dispatch({ type: 'OTP_LOGIN', payload: response.data.user})
                localStorage.setItem('user', JSON.stringify(response.data.user));

            } else {
                toast.error("OTP not valid, verification failed")
            }
            setLoading(false);
        } catch (error) {
            console.error("OTP send error:", error);
            const errorMessage = error.response?.data?.message || "Failed to send OTP.";
            toast.error(errorMessage);
            setLoading(false);
        }
    }

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
              DigiVidya
            </Typography>
            <Typography sx={{ color: '#4b5563', marginTop: '0.5rem' }}>
              Sign in to your account
            </Typography>
          </Box>

          {/* Form */}
          {!isPasswordCorrect && <Box component="form" onSubmit={handleSubmit} sx={{ '& > :not(style)': { marginBottom: '1.5rem' } }}>
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
                placeholder="you@ielektron.com"
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
                to="/reset-password"
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
                {/* Sign in as {formData.userType === 'student' ? 'Student' : 'Teacher'} */}
                {loading ? "Loading..." : "Continue"}
              </Button>
            </Box>
          </Box>}

          {isPasswordCorrect && <Box> 
            <FormControl fullWidth  sx={{
            marginBottom: '0.5rem',
            '& .MuiFormHelperText-root': {
              height: '20px',
              display: 'flex',
              alignItems: 'center',
              // visibility: emailError ? 'visible' : 'hidden',
              marginLeft: 0,
              fontSize: '0.75rem'
            }
          }}>
            <Typography variant="body2" sx={{ fontWeight: 'medium', color: '#374151', marginBottom: '0.5rem' }}>
              Email Address
            </Typography>
            <TextField
              name="email"
              value={formData.email}
              onChange={handleChange}
              type="email"
              variant="outlined"
              disabled
              // error={!!emailError}
              // helperText={emailError || ' '} // Empty space when no error
              sx={{
                '& .MuiOutlinedInput-root': {
                  backgroundColor: '#f9fafb',
                  borderRadius: '0.5rem',
                  // '& fieldset': {
                  //   borderColor: emailError ? '#ef4444' : '#d1d5db'
                  // },
                  // '&:hover fieldset': {
                  //   borderColor: emailError ? '#ef4444' : '#d1d5db'
                  // },
                  // '&.Mui-focused fieldset': {
                  //   borderColor: emailError ? '#ef4444' : '#6366f1',
                  //   boxShadow: emailError ? '0 0 0 2px rgba(239, 68, 68, 0.25)' : '0 0 0 2px rgba(99, 102, 241, 0.25)'
                  // }
                }
              }}
            />

          </FormControl>
            <Button
              variant="contained"
              color="primary"
              onClick={handleSendOtp}
              disabled={disableSendOtp}

              sx={{
                borderRadius: '0.5rem',
                textTransform: 'none',
                fontWeight: 500,
                backgroundColor: '#6366f1',
                '&:hover': {
                  backgroundColor: '#4f46e5'
                },
                marginBottom: '1.5rem'
              }}
            >
              {disableSendOtp ? `Resend OTP in ${countdown}s` : 'Re-send OTP'}
            </Button>

            <FormControl fullWidth sx={{
              marginBottom: '1.5rem', // Keep consistent spacing
              '& .MuiFormHelperText-root': {
                height: '20px', // Fixed height for error message
                display: 'flex',
                alignItems: 'center',
                marginLeft: 0,
                fontSize: '0.75rem'
              }
            }}>
              <Typography variant="body2" sx={{ fontWeight: 'medium', color: '#374151', marginBottom: '0.5rem' }}>
                OTP
              </Typography>
              <TextField
                name="otp"
                value={formData.otp}
                onChange={handleChange}
                required

                variant="outlined"
                placeholder="X X X X X X"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: '#f9fafb',
                    borderRadius: '0.5rem',
                    '& fieldset': {
                      borderColor: emailError ? '#ef4444' : '#d1d5db'
                    },
                    '&:hover fieldset': {
                      borderColor: emailError ? '#ef4444' : '#d1d5db'
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: emailError ? '#ef4444' : '#6366f1',
                      boxShadow: emailError ? '0 0 0 2px rgba(239, 68, 68, 0.25)' : '0 0 0 2px rgba(99, 102, 241, 0.25)'
                    }
                  }
                }}
              />
            </FormControl>
              <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={handleVerifyOtp}
                                    sx={{
                                        borderRadius: '0.5rem',
                                        textTransform: 'none',
                                        fontWeight: 500,
                                        backgroundColor: '#6366f1',
                                        '&:hover': {
                                            backgroundColor: '#4f46e5'
                                        },
                                        marginBottom: '1.5rem'
                                    }}
                                >
                                    {loading ? "Verifying..." : "Verify OTP"}
                                </Button>
          </Box>
          
          }

          <Box sx={{ marginTop: '1.5rem', textAlign: 'center' }}>
            <Typography variant="body2" sx={{ color: '#4b5563' }}>
              Don't have an account?{" "}
              <Link
                to="/signup"
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