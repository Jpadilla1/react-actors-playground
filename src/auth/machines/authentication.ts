import { createMachine } from "xstate";
import { sendParent } from "xstate/lib/actions";
import { getAuth0Client } from "../providers/auth0";

export const authenticationMachine = createMachine(
    {
        id: "authenticationMachine",
        initial: "verifyingCredentials",
        states: {
            verifyingCredentials: {
                invoke: {
                    src: "checkAuthValidity",
                    onDone: "authenticated",
                    onError: "notAuthenticated",
                },
            },
            authenticated: {
                entry: sendParent("USER_AUTHENTICATED"),
            },
            notAuthenticated: {
                entry: sendParent("USER_NOT_AUTHENTICATED"),
            },
        },
    },
    {
        services: {
            checkAuthValidity: async () => {
                const client = await getAuth0Client();
                const isAuthenticated = await client.isAuthenticated();

                if (!isAuthenticated) {
                    throw new Error("User is not authenticated");
                }
            },
        },
    }
);
