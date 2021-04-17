import { interpret } from "xstate";
import { inspect } from "@xstate/inspect";
import { bootstrapAuth } from "../auth/machines/bootstrap";

inspect({
    iframe: false,
});

const appDirectory: { [key: string]: any } = {};

export const hookup = (key: string, value: any) => {
    appDirectory[key] = value;
};

export const lookup = (key: string) => {
    return appDirectory[key];
};

export const bootstrap = () => {
    const authRef = interpret(bootstrapAuth, { devTools: true }).start();

    hookup("auth", authRef);
};
