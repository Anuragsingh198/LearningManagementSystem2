import { useLocation, useNavigate, Link } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { useAuth } from '../../context/contextFiles/AuthContext';
import { userRegister } from "../../context/Actions/AuthActions";
import axios from 'axios'
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
import { toast } from "react-toastify";
import landingImg from '../../assets/landing.jpg'

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
});

const LeftSection = styled(Box)(({ theme }) => ({
    display: 'none',
    [theme.breakpoints.up('lg')]: {
        display: 'flex',
        width: '50%',
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

const ForgotPasswordPage = () => {
    const { state: { isAuthenticated, user }, dispatch } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();
     const role = user?.role;
    const token = user?.token;
      const [loading, setLoading] = useState(false)
    

    const [formData, setFormData] = useState({
        email: "",
        password: "",
        confirmPassword: "",
        userType: "employee",
    });

    const [otp, setOtp] = useState("")
    const serverurl = import.meta.env.VITE_SERVER_URL;


    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [emailError, setEmailError] = useState("");
    const [isOtpVerified, setIsOtpVerified] = useState(false);
    const [countdown, setCountdown] = useState(0);
    const [disableSendOtp, setDisableSendOtp] = useState(false)
    
    

const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "otp") {
        setOtp(value);
        return; // prevent adding otp to formData
    }

    setFormData((prev) => ({
        ...prev,
        [name]: value,
    }));

    if (name === "email") {
        if (value && !value.endsWith("@ielektron.com")) {
            setEmailError("Please use an @ielektron.com email address");
        } else {
            setEmailError("");
        }
    }
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

        const handleSendOtp = async () => {
        const email = formData.email;
        if (!email) {
           toast.error("Please enter email to receive OTP")
            // alert('Please enter email to receive OTP');
            return;
        }

        setDisableSendOtp(true);
        setCountdown(60); // 20 seconds
        try {

            const response = await axios.post(
                `${serverurl}/api/users/generate-otp`,
                {
                    email: email, type: 'resetpassword'
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            )
            toast.success("OTP sent! Please check your mail")
        } catch (error) {
            toast.error("Error in OTP generation")
            console.error('could not send otp', error)
        }       
        
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

    const handleVerifyOtp = async () => {
        

        if(!formData.email){
            toast.error("Please provide email address for OTP verification")
            
            return;
        }
        if (formData.email && !formData.email.endsWith("@ielektron.com")) {
            setEmailError("Please use an @ielektron.com email address");
            return;
        }
        if(!otp){
            toast.error("Please Enter OTP")
            // alert('Please enter otp')
            return
        }

        setLoading(true)

        try {

            const response = await axios.post(
                `${serverurl}/api/users/verify-otp`,
                {
                    email: formData.email,
                    otp: otp
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            )

            if(response.data.success){
                toast.success("OTP verified!")
                setIsOtpVerified((prev) => !prev)

            } else {
                toast.error(" verification failed! OTP is not valid :(")
                console.error('otp not valid, verification failed')
            }

            setLoading(false)
        } catch (error) {
                toast.error(" verification failed! OTP is not valid :(")
            setLoading(false)

        }     

    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formData.email && !formData.email.endsWith("@ielektron.com")) {
            setEmailError("Please use an @ielektron.com email address");
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            alert("Passwords do not match.");
            return;
        }

        // console.log("Form Data for reset password is:", formData);

        try {

            const response = await axios.post(
                `${serverurl}/api/users/reset-password`,
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            )

            if(response.data.success){
                toast.success("Password reset completed! Pleae login.")
                navigate('/login')
                

            } else {
                toast.error(" verification failed! OTP is not valid :(")
                console.error('Failed to reset password')
            }
        } catch (error) {
            toast.error(" verification failed! OTP is not valid :(")
            console.error('could reset password', error)
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
                                ? "Start Learning Today!"
                                : "Share Your Knowledge with your Team!"}
                        </Typography>
                        <Typography sx={{ fontSize: '1.125rem', fontWeight: 'normal', marginTop: '1rem' }}>
                            {formData.userType === 'employee'
                                ? "Create account to expand your knowledge."
                                : "Explore all the courses and get certified"}
                        </Typography>
                    </Box>
                </LeftSection>

                {/* Right Section */}
                <RightSection>
                    <Box sx={{ textAlign: 'center', marginBottom: '1rem' }}>
                        <Typography variant="h3" sx={{ fontWeight: 'bold', color: '#3730a3' }}>
                            DigiVidya
                        </Typography>
                        <Typography sx={{ color: '#4b5563', marginTop: '0.5rem' }}>
                            Reset your password
                        </Typography>
                    </Box>

                    
{
                   !isOtpVerified && <Box> <FormControl fullWidth error={!!emailError} sx={{
                        marginBottom: '0.5rem', // Keep consistent spacing
                        '& .MuiFormHelperText-root': {
                            height: '20px', // Fixed height for error message
                            display: 'flex',
                            alignItems: 'center',
                            visibility: emailError ? 'visible' : 'hidden', // Hide but keep space
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
                            required
                            type="email"
                            variant="outlined"
                            placeholder="you@ielektron.com"
                            error={!!emailError}
                            helperText={emailError || ' '} // Empty space when no error
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
                                                    {disableSendOtp ? `Resend OTP in ${countdown}s` : 'Send OTP'}
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
                            value={otp}
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
                    </FormControl> </Box>}

                {  !isOtpVerified &&  <Button
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
                        {loading ? "Verifying...":"Verify OTP"}
                    </Button>}


                    {/* Form */}
                    { isOtpVerified && <Box component="form" onSubmit={handleSubmit} sx={{ '& > :not(style)': { marginBottom: '1.5rem' } }}>
                       

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
                               {loading ? "Loading...":"Reset Password"}
                            </Button>
                        </Box>
                    </Box>}

                 { !isOtpVerified &&  <Box sx={{ marginTop: '0.5rem', textAlign: 'center' }}>
                        <Typography variant="body2" sx={{ color: '#4b5563' }}>
                            Back to login?{" "}
                            <Link to="/login" style={{ color: '#4f46e5', fontWeight: 'medium', textDecoration: 'none', '&:hover': { color: '#3730a3' } }}>
                                Sign in
                            </Link>
                        </Typography>
                    </Box>}
                </RightSection>
            </FormContainer>
        </GradientBackground>
    );
};

export default ForgotPasswordPage;