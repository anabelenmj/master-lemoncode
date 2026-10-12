import { Router } from "#core/router";
import { AuthProvider } from "#core/auth";


const App = () => {
  return (
    <AuthProvider>
      <Router />
    </AuthProvider>)
};

export default App;
