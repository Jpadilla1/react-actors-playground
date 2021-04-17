import { assign, createMachine, sendParent } from "xstate";
import { AUTH_COOKIE_NAME } from "../constants";

export const loginMachine = createMachine(
    {
        initial: "idle",
        context: {
            error: null,
        },
        states: {
            idle: {
                on: {
                    attemptLogin: "attemptingLogin",
                },
            },
            attemptingLogin: {
                invoke: {
                    src: "makeLoginRequest",
                    onDone: "success",
                    onError: "failure",
                },
            },
            failure: {
                entry: assign((_, { data }: any) => ({ error: data.error })),
                on: {
                    attemptLogin: {
                        target: "attemptingLogin",
                        actions: assign<any>(() => ({ error: null })),
                    },
                },
            },
            success: {
                entry: sendParent("LOGIN_SUCCESS"),
            },
        },
    },
    {
        services: {
            makeLoginRequest: (_, { user, pass }) =>
                new Promise<void>((resolve, reject) => {
                    if (user === pass && user === "jpadilla") {
                        resolve();
                        localStorage.setItem(AUTH_COOKIE_NAME, "access-token");
                    } else {
                        reject({ error: "failed to login" });
                    }
                }),
        },
    }
);
