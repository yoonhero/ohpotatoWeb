import { ApolloProvider, useReactiveVar } from "@apollo/client";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Home from "./screens/Home";
import Login from "./screens/Login";
import NotFound from "./screens/NotFound";
import { isLoggedInVar, darkModeVar, client } from "./apollo";
import { ThemeProvider } from "styled-components";
import { darkTheme, GlobalStyles, lightTheme } from "./styles";
import SignUp from "./screens/SignUp";
import routes from "./routes";
import { HelmetProvider } from "react-helmet-async";
import Layout from "./components/Layout";
import EditProfile from "./screens/EditProfile";
import SearchUsers from "./screens/SearchUsers";
import Room from "./screens/Room";

function App() {
  const isLoggedIn = useReactiveVar(isLoggedInVar);

  const darkMode = useReactiveVar(darkModeVar);
  return (
    <ApolloProvider client={ client }>
      <HelmetProvider>
        <ThemeProvider theme={ darkMode ? darkTheme : lightTheme }>
          <GlobalStyles />
          <Router>
            <Switch>
              <Route path={ routes.home } exact>
                { isLoggedIn ? (
                  <Layout>
                    <Home />
                  </Layout>
                ) : (
                  <Login />
                ) }
              </Route>
              { !isLoggedIn ? (
                <Route path={ routes.signUp } exact>
                  <SignUp />
                </Route>
              ) : null }

              <Route path={ `/edit/:username/` }>
                <Layout>
                  <EditProfile />
                </Layout>
              </Route>
              <Route path={ `/search/:keyword/` }>
                <Layout>
                  <SearchUsers />
                </Layout>
              </Route>
              <Route path={ `/room/:id/` }>
                <Room />
              </Route>
              <Route>
                <Layout>
                  <NotFound />
                </Layout>
              </Route>
            </Switch>
          </Router>
        </ThemeProvider>
      </HelmetProvider>
    </ApolloProvider>
  );
}

export default App;
