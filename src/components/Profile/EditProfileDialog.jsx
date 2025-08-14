import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Stack,
  Avatar,
  Box,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { Eye, EyeOff } from "lucide-react";

const emptyValues = {
  name: "",
  email: "",
  avatar: "",
};

const EditProfileDialog = ({ open, onClose, initialValues, onSave, onChangePassword }) => {
  const [values, setValues] = useState(emptyValues);
  const [activeSection, setActiveSection] = useState("profile");
  const [passwordValues, setPasswordValues] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
  const [showPassword, setShowPassword] = useState({ current: false, new: false, confirm: false });

  useEffect(() => {
    if (open) {
      setValues({
        ...emptyValues,
        ...initialValues,
      });
      setActiveSection("profile");
      setPasswordValues({ currentPassword: "", newPassword: "", confirmPassword: "" });
    }
  }, [open, initialValues]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setValues((prev) => ({ ...prev, avatar: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    const payload = {
      name: values.name?.trim(),
      avatar: values.avatar,
    };
    onSave && onSave(payload);
  };

  const handlePasswordChange = () => {
    const { currentPassword, newPassword, confirmPassword } = passwordValues;
    if (!currentPassword || !newPassword || newPassword !== confirmPassword) {
      return;
    }
    onChangePassword && onChangePassword({ currentPassword, newPassword });
  };

  const SidebarItem = ({ id, label }) => (
    <Box
      onClick={() => setActiveSection(id)}
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 1.5,
        py: 1.2,
        px: 2,
        cursor: "pointer",
        position: "relative",
        background:
          activeSection === id
            ? "linear-gradient(to right, rgba(255,255,255,0.95) 0%, rgba(25,118,210,0.05) 40%, rgba(25,118,210,0.15) 100%)"
            : "transparent",
        "&:hover": {
          background:
            "linear-gradient(to right, rgba(255,255,255,0.95) 0%, rgba(25,118,210,0.05) 40%, rgba(25,118,210,0.15) 100%)",
        },
        borderRadius: 0,
        "&::before": {
          content: '""',
          position: "absolute",
          left: 0,
          top: 0,
          bottom: 0,
          width: "4px",
          backgroundColor: activeSection === id ? "#1976d2" : "transparent",
        },
      }}
    >
      <Box sx={{ color: activeSection === id ? "#1976d2" : "#333", fontWeight: activeSection === id ? 600 : 400 }}>
        {label}
      </Box>
    </Box>
  );

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="md"
      PaperProps={{ sx: { mx: 2, my: 3, borderRadius: 2 } }}
    >
      <DialogTitle sx={{ px: 3, pt: 3 }}>Edit Profile</DialogTitle>
      <DialogContent sx={{ p: 3 }}>
        <Box sx={{ display: "flex", gap: 3, minHeight: 320 }}>
          <Box sx={{ width: "16rem", flex: "0 0 16rem" }}>
            <SidebarItem id="profile" label="Edit Profile" />
            <SidebarItem id="password" label="Change Password" />
          </Box>
          <Box sx={{ flex: 1 }}>
            {activeSection === "profile" ? (
              <Stack spacing={2} sx={{ mt: 0 }}>
                <Box display="flex" alignItems="center" gap={2}>
                  <Avatar src={values.avatar} sx={{ width: 56, height: 56 }} />
                  <Button component="label" variant="outlined" size="small">
                    Upload Avatar
                    <input hidden type="file" accept="image/*" onChange={handleFileChange} />
                  </Button>
                </Box>
                <TextField
                  label="Name"
                  name="name"
                  value={values.name}
                  onChange={handleChange}
                  fullWidth
                />
                <TextField
                  label="Email"
                  name="email"
                  type="email"
                  value={values.email}
                  onChange={handleChange}
                  disabled
                  fullWidth
                />
              </Stack>
            ) : (
              <Stack spacing={2} sx={{ mt: 2 }}>
                <TextField
                  label="Current Password"
                  name="currentPassword"
                  type={showPassword.current ? "text" : "password"}
                  value={passwordValues.currentPassword}
                  onChange={(e) => setPasswordValues({ ...passwordValues, currentPassword: e.target.value })}
                  fullWidth
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPassword((s) => ({ ...s, current: !s.current }))}
                          edge="end"
                          aria-label="toggle current password visibility"
                        >
                          {showPassword.current ? <EyeOff size={18} /> : <Eye size={18} />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
                <TextField
                  label="New Password"
                  name="newPassword"
                  type={showPassword.new ? "text" : "password"}
                  value={passwordValues.newPassword}
                  onChange={(e) => setPasswordValues({ ...passwordValues, newPassword: e.target.value })}
                  fullWidth
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPassword((s) => ({ ...s, new: !s.new }))}
                          edge="end"
                          aria-label="toggle new password visibility"
                        >
                          {showPassword.new ? <EyeOff size={18} /> : <Eye size={18} />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
                <TextField
                  label="Confirm New Password"
                  name="confirmPassword"
                  type={showPassword.confirm ? "text" : "password"}
                  value={passwordValues.confirmPassword}
                  onChange={(e) => setPasswordValues({ ...passwordValues, confirmPassword: e.target.value })}
                  fullWidth
                  error={Boolean(passwordValues.confirmPassword) && passwordValues.confirmPassword !== passwordValues.newPassword}
                  helperText={
                    passwordValues.confirmPassword && passwordValues.confirmPassword !== passwordValues.newPassword
                      ? "Passwords do not match"
                      : ""
                  }
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPassword((s) => ({ ...s, confirm: !s.confirm }))}
                          edge="end"
                          aria-label="toggle confirm password visibility"
                        >
                          {showPassword.confirm ? <EyeOff size={18} /> : <Eye size={18} />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Stack>
            )}
          </Box>
        </Box>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button onClick={onClose}>Cancel</Button>
        {activeSection === "profile" ? (
          <Button variant="contained" onClick={handleSave}>Save</Button>
        ) : (
          <Button
            variant="contained"
            onClick={handlePasswordChange}
            disabled={
              !passwordValues.currentPassword ||
              !passwordValues.newPassword ||
              passwordValues.newPassword !== passwordValues.confirmPassword
            }
          >
            Update Password
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default EditProfileDialog;


