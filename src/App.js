import React, { useState } from 'react';
import { Button, Typography, Container, Paper, TextField, Box, IconButton } from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import { CustomThemeProvider, useThemeToggle } from './ThemeContext'; // Adjust the import path as needed
import './App.css';

function ThemeToggleButton() {
  const toggleTheme = useThemeToggle();
  const [darkMode, setDarkMode] = useState(false);

  const handleToggle = () => {
    setDarkMode(!darkMode);
    toggleTheme();
  };

  return (
    <IconButton onClick={handleToggle} style={{ position: 'absolute', top: 10, right: 10 }}>
      {darkMode ? <LightModeIcon /> : <DarkModeIcon />}
    </IconButton>
  );
}

function App() {
  const [file, setFile] = useState(null);
  const [validationResult, setValidationResult] = useState(null);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
    setValidationResult(null); // Reset validation result on new file selection
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!file) {
      alert("Please select a file first!");
      return;
    }

    let formData = new FormData();
    formData.append('file', file);

    fetch('https://excel-upload-app.azurewebsites.net/api/ValidateFile', {
      method: 'POST',
      body: formData
    })
      .then(response => response.json())
      .then(data => {
        setValidationResult(data.isValid); // Assuming the response includes a boolean isValid field
      })
      .catch(error => {
        console.error('Error:', error);
        setValidationResult(false); // Assume invalid on error
      });
  };

  return (
    <CustomThemeProvider>
      <ThemeToggleButton />
      <Container maxWidth="sm">
        <Paper style={{ padding: "20px", marginTop: "50px" }}>
          <Typography variant="h4" style={{ marginBottom: "20px" }}>
            Upload Excel File
          </Typography>
          <form onSubmit={handleSubmit}>
            <input
              accept=".xlsx, .xls"
              style={{ display: 'none' }}
              id="raised-button-file"
              type="file"
              onChange={handleFileChange}
            />
            <label htmlFor="raised-button-file">
              <Button variant="contained" component="span">
                Choose File
              </Button>
            </label>
            <TextField
              disabled
              fullWidth
              style={{ marginTop: "10px" }}
              value={file ? file.name : ''}
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              style={{ marginTop: "20px" }}
            >
              Upload
            </Button>
          </form>
          {validationResult !== null && (
            <Box display="flex" alignItems="center" marginTop="20px">
              {validationResult ? (
                <CheckCircleOutlineIcon style={{ color: 'green', marginRight: '10px' }} />
              ) : (
                <HighlightOffIcon style={{ color: 'red', marginRight: '10px' }} />
              )}
              <Typography>
                {validationResult ? 'Valid File' : 'Invalid File'}
              </Typography>
            </Box>
          )}
        </Paper>

        {/* <Modal
        open={openModal}
        onClose={handleCloseModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Message
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            {message}
          </Typography>
        </Box>
      </Modal> */}
      </Container>
    </CustomThemeProvider>
  );
}

export default App;
