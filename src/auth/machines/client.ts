import { createMachine } from "xstate";
import { sendParent } from "xstate/lib/actions";
import { AUTH_COOKIE_NAME } from "../constants";

export const clientMachine = createMachine(
    {
        id: "clientMachine",
        initial: "loading",
        states: {
            loading: {
                invoke: {
                    src: "initializeClient",
                    onDone: "success",
                },
            },
            success: {
                entry: sendParent("CLIENT_INITIALIZED", { delay: 3000 }),
            },
        },
    },
    {
        services: {
            initializeClient: () => {
                return new Promise<void>((resolve) => {
                    const cookieName = localStorage.getItem(AUTH_COOKIE_NAME);

                    if (!cookieName) {
                        localStorage.setItem(AUTH_COOKIE_NAME, "client-token");
                    }

                    resolve();
                });
            },
        },
    }
);
