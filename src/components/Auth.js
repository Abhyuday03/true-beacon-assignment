import { useState } from "react";
import * as Components from "../styler/Styles";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Auth = () => {
  const history = useNavigate();
  const [signIn, toggle] = useState(true);

  //sign up
  const [userName, setUserName] = useState();
  const [userType, setUserType] = useState();
  const [broker, setBroker] = useState();
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [loginError, setLoginError] = useState("");
  const [signupError, setSignupError] = useState("");
  const config = {
    headers: { "Content-type": "application/json" },
  };
  const handleSignUp = async (e) => {
    e.preventDefault();
    const config = {
      headers: { "Content-type": "application/json" },
    };
    const { data } = await axios.post(
      "api/v1/user/signUp",
      {
        user_name: userName,
        email: email,
        created_at: new Date(),
        broker: broker,
        user_type: userType,
        password: password,
      },
      config
    );

    if (data.status != "success") {
      setSignupError(data.status);
    } else {
      setSignupError("");
      console.log(data.data, data.data.token);
      localStorage.setItem("userInfo", JSON.stringify(data.data));
      localStorage.setItem("userToken", JSON.stringify(data.data.token));

      history("/dashboard");
    }
  };

  //sign in
  const [signInEmail, setSignInEmail] = useState();
  const [signInPassword, setSignInPassword] = useState();

  const handleSignIn = async (e) => {
    console.log(signInEmail, signInPassword);

    try {
      const config = {
        headers: { "Content-type": "application/json" },
      };
      const { data } = await axios.post(
        "api/v1/user/login",
        { email: signInEmail, password: signInPassword },
        config
      );
      if (data.status != "success") {
        setLoginError(data.status);
      } else {
        setLoginError("");
        console.log(data.data, data.data.token);
        localStorage.setItem("userInfo", JSON.stringify(data.data));
        localStorage.setItem("userToken", JSON.stringify(data.data.token));

        history("/dashboard");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <Components.Container>
        <Components.SignUpContainer signingIn={signIn}>
          <Components.Form>
            <Components.Title>Create Account</Components.Title>
            {signupError && <div style={{ color: "red" }}>{signupError}</div>}
            <Components.Input
              type="text"
              placeholder="Username"
              onChange={(e) => {
                setUserName(e.target.value);
              }}
            />
            <Components.Input
              type="text"
              placeholder="User Type"
              onChange={(e) => {
                setUserType(e.target.value);
              }}
            />
            <Components.Input
              type="text"
              placeholder="Broker"
              onChange={(e) => {
                setBroker(e.target.value);
              }}
            />
            <Components.Input
              type="email"
              placeholder="Email"
              onChange={(e) => {
                setEmail(e.target.value);
              }}
            />
            <Components.Input
              type="password"
              placeholder="Password"
              onChange={(e) => {
                setPassword(e.target.value);
              }}
            />

            <Components.Button onClick={handleSignUp}>
              Sign Up
            </Components.Button>
          </Components.Form>
        </Components.SignUpContainer>
        <Components.SignInContainer signingIn={signIn}>
          <Components.Form>
            <Components.Title>Sign in</Components.Title>
            {loginError && <div style={{ color: "red" }}>{loginError}</div>}
            <Components.Input
              type="email"
              placeholder="Email"
              onChange={(e) => setSignInEmail(e.target.value)}
            />
            <Components.Input
              type="password"
              placeholder="Password"
              onChange={(e) => setSignInPassword(e.target.value)}
            />

            <Components.Button type="button" onClick={handleSignIn}>
              Sign In
            </Components.Button>
          </Components.Form>
        </Components.SignInContainer>
        <Components.OverlayContainer signingIn={signIn}>
          <Components.Overlay signingIn={signIn}>
            <Components.LeftOverlayPanel signingIn={signIn}>
              <Components.Title>Already created an account?</Components.Title>
              <Components.Paragraph>
                To keep connected with us please login with your personal info
              </Components.Paragraph>
              <Components.GhostButton onClick={() => toggle(true)}>
                Sign In
              </Components.GhostButton>
            </Components.LeftOverlayPanel>
            <Components.RightOverlayPanel signingIn={signIn}>
              <Components.Title>Hello, Friend!</Components.Title>
              <Components.Paragraph>
                Enter your personal details and start journey with us
              </Components.Paragraph>
              <Components.GhostButton onClick={() => toggle(false)}>
                Sign Up
              </Components.GhostButton>
            </Components.RightOverlayPanel>
          </Components.Overlay>
        </Components.OverlayContainer>
      </Components.Container>
    </div>
  );
};

export default Auth;
