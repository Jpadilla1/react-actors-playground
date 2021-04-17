import { useService } from "@xstate/react";
import { Login } from "./auth/components/login";
import { bootstrap, lookup } from "./bootstrap";

bootstrap();

const auth = lookup("auth");

function App() {
    const [state] = useService(auth);

    return (
        <div className="App">
            {state.matches("checkingClientCreds") && (
                <p>Checking client creds...</p>
            )}
            {state.matches("checkingAuth") && <p>Validating auth...</p>}
            {state.matches("requestLogin") && <Login />}
            {state.matches("authenticated") && <p>Authenticated</p>}
        </div>
    );
}

export default App;
