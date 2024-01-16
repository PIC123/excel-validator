import React, { useState } from 'react';
import './App.css';

function App() {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!file) {
      alert("Please select a file first!");
      return;
    }

    let formData = new FormData();
    formData.append('file', file);

    // for(var val of formData.values()){
      // console.log(val);
    // }
    // console.log(formData.values().next());

    fetch('https://excel-upload-app.azurewebsites.net/api/ValidateFile', { // Replace '/upload' with your backend URL
      method: 'POST',
      body: formData
    })
    .then(response => response.json())
    .then(data => setMessage(data.status))
    .catch(error => console.error('Error:', error));
  };

  return (
    <div className="App">
      <h2>Upload Excel File</h2>
      <form onSubmit={handleSubmit}>
        <input type="file" onChange={handleFileChange} accept=".xlsx, .xls" />
        <button type="submit">Upload</button>
      </form>
      {message && <div>{message}</div>}
    </div>
  );
}

export default App;
