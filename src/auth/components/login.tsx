import { useActor } from "@xstate/react";
import { Container, Box, TextField, Button } from "@material-ui/core";
import { lookup } from "../../bootstrap";

export const Login = () => {
    const auth = lookup("auth") as any;

    const [state, send] = useActor(auth.state.context.loginRef) as any;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const values = {
            user: (e.target as any)["username"].value,
            pass: (e.target as any)["password"].value,
        };

        send({
            type: "attemptLogin",
            ...values,
        });
    };

    return (
        <Container maxWidth="sm">
            <form onSubmit={handleSubmit}>
                <Box p={3}>
                    <Box marginBottom={2}>
                        <TextField
                            id="username"
                            type="text"
                            label="Username"
                            variant="outlined"
                        />
                    </Box>
                    <Box marginBottom={2}>
                        <TextField
                            id="password"
                            type="password"
                            label="Password"
                            variant="outlined"
                        />
                    </Box>
                    <Button variant="contained" color="primary" type="submit">
                        Login
                    </Button>
                    {state.matches("failure") && (
                        <p style={{ color: "tomato" }}>{state.context.error}</p>
                    )}
                </Box>
            </form>
        </Container>
    );
};
