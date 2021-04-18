import { useActor } from "@xstate/react";
import { Container, Box } from "@material-ui/core";
import { lookup } from "../../bootstrap";
import { useEffect } from "react";

export const Login = () => {
    const auth = lookup("auth") as any;

    const [state, send] = useActor(auth.state.context.loginRef) as any;

    useEffect(() => {
        const searchParams = new URLSearchParams(window.location.search);

        send({
            type: "init",
            code: searchParams.get("code"),
            state: searchParams.get("state"),
        });
    }, [send]);

    return (
        <Container maxWidth="sm">
            <Box p={3}>
                <p>Current State: {state.value}</p>
                {state.matches("login") && (
                    <button
                        onClick={() => {
                            send({
                                type: "attemptLogin",
                                redirectUri: window.location.origin + "/",
                            });
                        }}
                    >
                        Login
                    </button>
                )}
            </Box>
        </Container>
    );
};
