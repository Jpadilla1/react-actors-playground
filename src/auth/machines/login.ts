import { createMachine, sendParent } from "xstate";
import { getAuth0Client } from "../providers/auth0";

export const loginMachine = createMachine(
    {
        id: "loginMachine",
        initial: "idle",
        states: {
            idle: {
                on: {
                    init: [
                        {
                            target: "authCallback",
                            cond: "hasAuthParameters",
                        },
                        {
                            target: "login",
                        },
                    ],
                },
            },
            login: {
                on: {
                    attemptLogin: "redirectToLogin",
                },
            },
            redirectToLogin: {
                invoke: {
                    src: "makeRedirectToLogin",
                    onDone: "redirectingToLoginPage",
                    onError: "unexpectedError",
                },
            },
            authCallback: {
                invoke: {
                    src: "handleAuthCallback",
                    onDone: "success",
                    onError: "unexpectedError",
                },
            },
            unexpectedError: {},
            redirectingToLoginPage: {},
            success: {
                entry: sendParent("LOGIN_SUCCESS"),
            },
        },
    },
    {
        services: {
            makeRedirectToLogin: async (_, { redirectUri }: any) => {
                const auth0Client = await getAuth0Client();
                return auth0Client.loginWithRedirect({
                    redirect_uri: redirectUri,
                });
            },
            handleAuthCallback: async () => {
                const auth0Client = await getAuth0Client();
                return auth0Client.handleRedirectCallback();
            },
        },
        guards: {
            hasAuthParameters: (_, { code, state }) => code && state,
        },
    }
);
