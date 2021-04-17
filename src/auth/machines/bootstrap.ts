import { assign, createMachine, sendParent, spawn } from "xstate";
import { clientMachine } from "./client";
import { authenticationMachine } from "./authentication";
import { loginMachine } from "./login";

export const bootstrapAuth = createMachine({
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
        authenticated: {
            // entry: sendParent("AUTHENTICATED"),
        },
        requestLogin: {
            entry: assign((context: any) => {
                return {
                    ...context,
                    loginRef: spawn(loginMachine, "login-machine"),
                };
            }),
            on: {
                LOGIN_SUCCESS: "authenticated",
            },
        },
    },
});
