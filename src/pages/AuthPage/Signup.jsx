import { useLocation, useNavigate, Link } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { useAuth } from '../../context/contextFiles/AuthContext';
import { userRegister } from "../../context/Actions/AuthActions";
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogActions from '@mui/material/DialogActions';
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

const ConfirmationDialog = ({
    open,
    onCancel,
    onConfirm,
    title = "Confirm User Type",
    message = "Are you sure you are a Teacher?"
}) => {
    return (
        <Dialog
            open={open}
            onClose={onCancel}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
            // Centers the dialog on the screen
            sx={{
                '& .MuiDialog-paper': {
                    minWidth: '400px',
                    textAlign: 'center'
                }
            }}
        >
            <DialogTitle id="alert-dialog-title">
                {title}
            </DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    {message}
                </DialogContentText>
            </DialogContent>
            <DialogActions sx={{ justifyContent: 'center', padding: '16px 24px' }}>
                <Button onClick={onCancel} variant="outlined">
                    Cancel
                </Button>
                <Button onClick={onConfirm} variant="contained" autoFocus>
                    Confirm
                </Button>
            </DialogActions>
        </Dialog>
    );
};

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
    const { state: { isAuthenticated, user }, dispatch } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();
    const [confirmation, setConfirmation] = useState(false);

    const role = user?.role;
    const token = user?.token;
    const serverurl = import.meta.env.VITE_SERVER_URL;

    const [formData, setFormData] = useState({
        email: "",
        password: "",
        confirmPassword: "",
        userType: "employee",
        employeeId: "",
        name: ""
    });

    const [otp, setOtp] = useState("")
    const [countdown, setCountdown] = useState(0);


    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [emailError, setEmailError] = useState("");
    const [checkEmail, setCheckEmail] = useState(false);
    const [checkEmployeeId, setCheckEmployeeId] = useState(false)
    const [isOtpVerified, setIsOtpVerified] = useState(false)
    const [disableSendOtp, setDisableSendOtp] = useState(false)
    const [newUserType, setNewUserType] = useState("employee");


    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === "otp") {
            setOtp(value);
            return;
        }

  if (name === "employeeId") {
    const hasSpecialChar = /[^a-zA-Z0-9]/.test(value);
    setCheckEmployeeId(hasSpecialChar);
  }

  setFormData((prev) => ({
    ...prev,
    [name]: value,
  }));

        if (name === "email") {
            if (value && !value.endsWith("@ielektron.com")) {
                setEmailError("Please use an @ielektron.com email address");
                setCheckEmail(true);
            } else {
                setEmailError("");
                setCheckEmail(false);
            }
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


    const handleSendOtp = async () => {
        const email = formData.email;
        if (!email) {
            // alert('Please enter email to receive OTP');
            toast.error("Please enter email to receive OTP")

            return;
        }

        setDisableSendOtp(true);
        setCountdown(20); // 20 seconds
        try {

            const response = await axios.post(
                `${serverurl}/api/users/generate-otp`,
                {
                    email: email
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            )
        } catch (error) {
            console.error("OTP send error:", error);
            const errorMessage = error.response?.data?.message || "Failed to send OTP.";
            toast.error(errorMessage);
        }

    };

    const handleConfirm = () => {
        if (newUserType !== null) {
            setFormData({ ...formData, userType: newUserType });
        }
        setConfirmation(false);
    };

    const handleCancel = () => {
        console.log("User canceled");
        setConfirmation(false);
    };

    const handleUserTypeChange = (e) => {   
        const   currenSelection = e.target.value  ;
        console.log("selected type : " , currenSelection)
        if(formData.userType !== "instructor" && currenSelection === "instructor"){
            setNewUserType(currenSelection)
            setConfirmation(true)
        }
       if(currenSelection === "employee"){
            setFormData({ ...formData, userType: currenSelection });
       }
    };

    useEffect(() => {
        if (isAuthenticated) {
            const role = user?.role === 'employee' ? 'student' : 'teacher';
            navigate(`/${role}/dashboard`);
        }
    }, [isAuthenticated, user, navigate]);

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
        if (!otp) {
            // alert('Please enter otp')
            toast.error("Please enter otp")

            return
        }

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

            if (response.data.success) {

                setIsOtpVerified((prev) => !prev)
                toast.success("OTP verification successful")

            } else {
                toast.error("otp not valid, verification failed")
            }
        } catch (error) {
            console.error("OTP send error:", error);
            const errorMessage = error.response?.data?.message || "Failed to send OTP.";
            toast.error(errorMessage);
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault();

        if (formData.email && !formData.email.endsWith("@ielektron.com")) {
            setEmailError("Please use an @ielektron.com email address");
            return;
        }
        if (formData.password !== formData.confirmPassword) {
            // alert("Passwords do not match.");
            toast.error("password  do  not match")
            return;
        }
        if(checkEmployeeId){
            toast.error("Please remove specail characters from employee id")
            return;
        }
        console.log("Form Data:", formData);
        try {
            userRegister(formData, dispatch);
            toast.success('User registration successful')
        } catch (error) {
            console.error("OTP send error:", error);
            const errorMessage = error.response?.data?.message || "Failed to send OTP.";
            toast.error(errorMessage);
        }
    };

    return (
        <GradientBackground>
            {confirmation && (
                <ConfirmationDialog
                    open={confirmation}
                    onCancel={handleCancel}
                    onConfirm={handleConfirm}
                    title="Confirm User Type"
                    message="Are you sure you are a Teacher?"
                />
            )}

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
                    <Box sx={{ textAlign: 'center', marginBottom: '1rem' }}>
                        <Typography variant="h3" sx={{ fontWeight: 'bold', color: '#3730a3' }}>
                            DigiVidya
                        </Typography>
                        <Typography sx={{ color: '#4b5563', marginTop: '0.5rem' }}>
                            Create your {formData.userType === 'employee' ? 'student' : 'teacher'} account
                        </Typography>
                    </Box>

                    {/* User Type Toggle */}
                    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                        <UserTypeToggle
                            value={formData.userType}
                            onChange={handleUserTypeChange}
                            exclusive
                        >
                            <UserTypeButton value="employee">
                                Employee
                            </UserTypeButton>
                            <UserTypeButton value="instructor">
                                Admin
                            </UserTypeButton>
                        </UserTypeToggle>
                    </Box>
                    {
                        !isOtpVerified && <Box> <FormControl fullWidth error={!!emailError} sx={{
                            marginBottom: '0.5rem', 
                            '& .MuiFormHelperText-root': {
                                height: '20px', 
                                display: 'flex',
                                alignItems: 'center',
                                visibility: emailError ? 'visible' : 'hidden', 
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
                                disabled={disableSendOtp || checkEmail}

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
                            </FormControl>
                        </Box>
                    }

                    {!isOtpVerified && <Button
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
                        Verify OTP
                    </Button>}


                    {/* Form */}
                    {isOtpVerified && <Box component="form" onSubmit={handleSubmit} sx={{ '& > :not(style)': { marginBottom: '1.5rem' } }}>
                        <FormControl fullWidth sx={{ marginBottom: '1.5rem' }}>
                            <Typography variant="body2" sx={{ fontWeight: 'medium', color: '#374151', marginBottom: '0.5rem' }}>
                                Full Name
                            </Typography>
                            <TextField
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                variant="outlined"
                                placeholder="Please enter your full name"
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
                            <Typography variant="caption" sx={{
                                display: 'block',
                                color: '#6b7280',
                                fontStyle: 'italic',
                                marginTop: '4px'
                            }}>
                                Note: This name will appear on certificates and cannot be changed later
                            </Typography>
                        </FormControl>

                        <FormControl fullWidth sx={{ marginBottom: '1.5rem' }}>
                            <Typography
                                variant="body2"
                                sx={{ fontWeight: 'medium', color: '#374151', marginBottom: '0.5rem' }}
                            >
                                Employee ID
                            </Typography>

                            <TextField
                                name="employeeId"
                                value={formData.employeeId}
                                onChange={handleChange}
                                required
                                error={checkEmployeeId} // 👈 shows red outline
                                helperText={
                                    checkEmployeeId ? "Remove special characters from the Employee ID" : ""
                                }
                                variant="outlined"
                                placeholder="Employee ID"
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        backgroundColor: '#f9fafb',
                                        borderRadius: '0.5rem',
                                        '& fieldset': { borderColor: '#d1d5db' },
                                        '&:hover fieldset': { borderColor: '#d1d5db' },
                                        '&.Mui-focused fieldset': {
                                            borderColor: '#6366f1',
                                            boxShadow: '0 0 0 2px rgba(99, 102, 241, 0.25)',
                                        },
                                    },
                                }}
                            />

                            <Typography
                                variant="caption"
                                sx={{
                                    display: 'block',
                                    color: '#6b7280',
                                    fontStyle: 'italic',
                                    marginTop: '4px',
                                }}
                            >
                                Note: This Employee ID will appear on certificates and cannot be changed later
                            </Typography>
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
                    </Box>}

                    <Box sx={{ marginTop: '1.5rem', textAlign: 'center' }}>
                        <Typography variant="body2" sx={{ color: '#4b5563' }}>
                            Already have an account?{" "}
                            <Link to="/login" style={{ color: '#4f46e5', fontWeight: 'medium', textDecoration: 'none', '&:hover': { color: '#3730a3' } }}>
                                Sign in
                            </Link>
                        </Typography>
                    </Box>
                </RightSection>
            </FormContainer>
        </GradientBackground>
    );
};

export default RegisterPage;