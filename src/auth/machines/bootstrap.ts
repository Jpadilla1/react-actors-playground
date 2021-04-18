import { assign, createMachine, spawn } from "xstate";
import { clientMachine } from "./client";
import { authenticationMachine } from "./authentication";
import { loginMachine } from "./login";
import { getAuth0Client } from "../providers/auth0";

export const bootstrapAuth = createMachine(
    {
        id: "bootstrapAuthMachine",
        initial: "checkingClientCreds",
        context: {
            loginRef: undefined,
        },
        states: {
            checkingClientCreds: {
                invoke: {
                    src: clientMachine,
                },
                on: {
                    CLIENT_INITIALIZED: "checkingAuth",
                },
            },
            checkingAuth: {
                invoke: {
                    src: authenticationMachine,
                },
                on: {
                    USER_AUTHENTICATED: "authenticated",
                    USER_NOT_AUTHENTICATED: "requestLogin",
                },
            },
            requestLogin: {
                entry: assign((context: any) => {
                    return {
                        ...context,
                        loginRef: spawn(loginMachine, "login-machine"),
                    };
                }),
                on: {
                    LOGIN_SUCCESS: {
                        target: "authenticated",
                        actions: () => {
                            window.history.replaceState(
                                {},
                                document.title,
                                "/"
                            );
                        },
                    },
                },
            },
            authenticated: {
                on: {
                    logout: "loggingOut",
                },
            },
            loggingOut: {
                invoke: {
                    src: "makeLogoutRequest",
                    onDone: "requestLogin",
                },
            },
        },
    },
    {
        services: {
            makeLogoutRequest: async (_, { redirectTo }: any) => {
                const client = await getAuth0Client();
                return client.logout({
                    returnTo: redirectTo,
                });
            },
        },
    }
);
