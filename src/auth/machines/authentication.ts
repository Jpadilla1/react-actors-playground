import { createMachine } from "xstate";
import { sendParent } from "xstate/lib/actions";
import { AUTH_COOKIE_NAME } from "../constants";

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
                entry: sendParent("USER_AUTHENTICATED", { delay: 3000 }),
            },
            notAuthenticated: {
                entry: sendParent("USER_NOT_AUTHENTICATED", { delay: 3000 }),
            },
        },
    },
    {
        services: {
            checkAuthValidity: () => {
                return new Promise<void>((resolve, reject) => {
                    const cookieName = localStorage.getItem(AUTH_COOKIE_NAME);

                    if (!cookieName?.startsWith("access")) {
                        reject();
                    }

                    resolve();
                });
            },
        },
    }
);
