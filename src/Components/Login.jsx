import React, { useState } from "react";
import {
  ChakraProvider,
  Box,
  Flex,
  Heading,
  Input,
  Button,
  Alert,
  AlertIcon,
  CloseButton,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
const Login = ({settoken}) => {

  const [logindata, setLoginData] = useState({
    email: "",
    password: "",
  });
  const navigate = useNavigate();

  function handleloginval(e) {
    setLoginData({ ...logindata, [e.target.name]: e.target.value });
  }
  const [error, setError] = useState(null);

  async function handleLogin(e) {
    e.preventDefault();

    try {
      let res = await fetch("https://reqres.in/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(logindata),
      });
      if (res.ok) {
        const data = await res.json();
        localStorage.setItem("token", data.token);
        settoken(true);
        navigate("/dashboard");
      }else {
        
        setError("Invalid email or password. Please try again.");
      }
    } catch (error) {

      console.log("error", error);
      setError("Invalid email or password. Please try again.");
    }
  }

  return (
    <Flex align="center" justify="center" minH="100vh">
      <Box p={8} width="400px" borderWidth={1} borderRadius={12} boxShadow="lg">
        <Heading mb={6} textAlign="center" fontSize="2xl">
          Login
        </Heading>
        {error && (
          <Alert status="error" mb={4}>
            <AlertIcon />
            {error}
            <CloseButton
              position="absolute"
              right="8px"
              top="8px"
              onClick={() => setError(null)}
            />
          </Alert>
        )}
        <form>
          <Box mb={4}>
            <Input
              type="email"
              placeholder="Email"
              name="email"
              size="lg"
              borderRadius={8}
              onChange={handleloginval}
            />
          </Box>
          <Box mb={4}>
            <Input
              type="password"
              placeholder="Password"
              name="password"
              size="lg"
              borderRadius={8}
              onChange={handleloginval}
            />
          </Box>
          <Button
            colorScheme="teal"
            type="submit"
            width="full"
            mt={6}
            borderRadius={8}
            onClick={handleLogin}
          >
            Log in
          </Button>
        </form>
      </Box>
    </Flex>
  );
};

export default Login;
