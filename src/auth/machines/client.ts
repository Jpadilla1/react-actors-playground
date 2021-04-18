import { createMachine } from "xstate";
import { sendParent } from "xstate/lib/actions";
import { getAuth0Client } from "../providers/auth0";

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
                entry: sendParent("CLIENT_INITIALIZED"),
            },
        },
    },
    {
        services: {
            initializeClient: () => getAuth0Client(),
        },
    }
);
