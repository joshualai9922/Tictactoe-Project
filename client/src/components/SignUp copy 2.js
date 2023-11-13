// import React, { useState } from "react";
// import Axios from "axios";
// import Cookies from "universal-cookie";
// import Avatar from '@mui/material/Avatar';
// import Button from '@mui/material/Button';
// import CssBaseline from '@mui/material/CssBaseline';
// import TextField from '@mui/material/TextField';
// import FormControlLabel from '@mui/material/FormControlLabel';
// import Checkbox from '@mui/material/Checkbox';
// import Link from '@mui/material/Link';
// import Grid from '@mui/material/Grid';
// import Box from '@mui/material/Box';
// import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
// import Typography from '@mui/material/Typography';
// import Container from '@mui/material/Container';
// import { createTheme, ThemeProvider } from '@mui/material/styles';

// function SignUp({ setIsAuth }) {
//   const cookies = new Cookies();
//   const [user, setUser] = useState(null);
//   const defaultTheme = createTheme();

//   const signUp = () => {
//     Axios.post("http://localhost:3001/signup", user).then((res) => {
//       const { token, userId, firstName, lastName, username, hashedPassword } =
//         res.data;
//       cookies.set("token", token);
//       cookies.set("userId", userId);
//       cookies.set("username", username);
//       cookies.set("firstName", firstName);
//       cookies.set("lastName", lastName);
//       cookies.set("hashedPassword", hashedPassword);
//       setIsAuth(true);
//     });
//   };
  
//   return (

// <ThemeProvider theme={defaultTheme}>
// <CssBaseline />

//     <div className="signUp">

//       <Avatar sx={{ m: 1, bgcolor: 'secondary.main', marginLeft: "150px" }}>
//   <LockOutlinedIcon />
// </Avatar>
// <label> Sign Up</label>
//       <TextField
//       margin="normal"
//       required
//       fullWidth
//       autoFocus
//         placeholder="First Name"
//         onChange={(event) => {
//           setUser({ ...user, firstName: event.target.value });
//         }}
//       />
//       <TextField
//         placeholder="Last Name"
//         onChange={(event) => {
//           setUser({ ...user, lastName: event.target.value });
//         }}
//       />
//       <TextField
//         placeholder="Username"
//         onChange={(event) => {
//           setUser({ ...user, username: event.target.value });
//         }}
//       />
//       <TextField
//         placeholder="Password"
//         type="password"
//         onChange={(event) => {
//           setUser({ ...user, password: event.target.value });
//         }}
//       />
//       <Button type="submit"
//               fullWidth
//               variant="contained"
//               sx={{ mt: 3, mb: 2 }} onClick={signUp}> Sign Up </Button>
//     </div>

//     </ThemeProvider>
//   );
// }

// export default SignUp;
