import createAuth0Client, { Auth0Client } from "@auth0/auth0-spa-js";
import { AUTH0_CLIENT_ID, AUTH0_DOMAIN } from "../constants";

export let auth0Client: Auth0Client | null = null;

export const getAuth0Client = async () => {
    if (auth0Client) {
        return auth0Client;
    }

    auth0Client = await createAuth0Client({
        domain: AUTH0_DOMAIN!,
        client_id: AUTH0_CLIENT_ID!,
    });

    return auth0Client;
};
