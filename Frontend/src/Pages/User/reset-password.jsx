import React, { useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Typography,
  TextField,
  Button,
  Box,
  CircularProgress,
  Grid,
} from '@material-ui/core';
import Navbar from '../../Components/guest_header';

const ResetPasswordPage = () => {
  const { resetToken } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      await axios.post(`http://localhost:3002/user/reset-password/${resetToken}`, {
        password,
        confirmPassword,
      });
      setSuccess('Password has been successfully reset.');
      navigate('/login'); 
    } catch (err) {
      setError(err.response.data.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <Grid
        container
        justifyContent="center"
        alignItems="center"
        style={{
          backgroundImage: 'url("https://img.freepik.com/free-vector/black-floral-seamless-pattern-with-shadow_1284-42217.jpg")', // Replace with your actual background image URL
          backgroundSize: 'auto',
          backgroundPosition: 'center',
          minHeight: '80vh',
        }}
      >
        <Grid
          item
          xs={12}
          sm={8}
          md={6}
          style={{
            backgroundColor: 'white',
            borderRadius: 8,
            boxShadow: '0px 0px 10px rgba(0,0,0,0.1)',
            padding: '20px',
            display: 'flex',
            flexDirection: 'row',
          }}
        >
          <Box flex={1} p={2}>
            <Box textAlign="center" mb={2}>
              <Typography variant="h4" style={{ fontFamily: 'cursive', fontWeight: 'bold', color: 'purple' }}>
                Reset Password
              </Typography>
            </Box>

            {error && <p style={{ color: 'red' }}>{error}</p>}
            {success && <p style={{ color: 'green' }}>{success}</p>}

            <form onSubmit={handleSubmit}>
              <TextField
                fullWidth
                margin="normal"
                label="New Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                variant="outlined"
              />
              <TextField
                fullWidth
                margin="normal"
                label="Confirm Password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                variant="outlined"
              />
              <Button
                fullWidth
                variant="contained"
                color="primary"
                size="large"
                type="submit"
                style={{ marginTop: 16 }}
                disabled={loading}
              >
                {loading ? <CircularProgress size={24} /> : 'Reset Password'}
              </Button>
            </form>
          </Box>

          <Box flex={1} display="flex" justifyContent="center" alignItems="center">
            <img
              src="https://images.squarespace-cdn.com/content/v1/5d3d5921fa823600016c24ba/1e57279a-7d3a-4282-be00-234da5a68cc7/Pad+Thai.png" // Replace with your image link
              alt="Reset Password"
              style={{
                maxWidth: '100%',
                height: 'auto',
                borderRadius: 8,
              }}
            />
          </Box>
        </Grid>
      </Grid>
    </>
  );
};

export default ResetPasswordPage;
