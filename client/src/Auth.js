import { useState } from "react";
import { useCookies } from "react-cookie";
import "./App.css";
import Axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { Container, Form, Button } from "react-bootstrap";

const Auth = () => {
  const [cookies, setCookies] = useCookies("access_token");

  const removeCookies = () => {
    setCookies("access_token", "");
    window.localStorage.removeItem("adminID");
    window.location.reload(false);
  };

  return (
    <>
      {cookies.access_token ? (
        <Button variant="danger" onClick={removeCookies}>
          Logout
        </Button>
      ) : (
        <>
          <Register />
          <Login />
        </>
      )}
    </>
  );
};

const Register = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const onSubmit = async (e) => {
    console.log("add admin");
    e.preventDefault();
    await Axios.post("http://localhost:3001/register", {
      username,
      password,
    });
    alert("Admin created");
  };

  return (
    <AuthForm
      label="REGISTER"
      username={username}
      setUsername={setUsername}
      password={password}
      setPassword={setPassword}
      onSubmit={onSubmit}
    />
  );
};

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [cookies, setCookies] = useCookies(["access_token"]);
  const onSubmit = async (e) => {
    console.log("login");
    e.preventDefault();
    const response = await Axios.post("http://localhost:3001/login", {
      username,
      password,
    });
    setCookies("access_token", response.data.token);
    window.localStorage.setItem("userID", response.data.adminID);
    window.location.reload(false);
    console.log(response);
  };
  return (
    <AuthForm
      label="LOGIN"
      username={username}
      setUsername={setUsername}
      password={password}
      setPassword={setPassword}
      onSubmit={onSubmit}
    />
  );
};

const AuthForm = ({
  label,
  username,
  setUsername,
  password,
  setPassword,
  onSubmit,
}) => {
  return (
    <Container>
      <Form className="form" onSubmit={onSubmit}>
        <h2 className="text-white">{label}</h2>
        <Form.Control
          type="text"
          placeholder="name"
          id="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <Form.Control
          type="text"
          placeholder="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <Button varient="success" type="submit">
          {label}
        </Button>
      </Form>
    </Container>
  );
};

export default Auth;
