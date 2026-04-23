import { get as getVal, set as setVal } from "idb-keyval";
import { bufferToB64, generateVapidKeys } from "./lib/vapid.js";

const DOM = {
    "main": document.querySelector("#main") as HTMLDivElement
};

interface PushData {
    vapidPrivate: string;
    expTime: number;
    endpoint: string;
    keys: {
        p256dh: string;
        auth: string;
    };
};

const register = async (): Promise<PushData> => {
    const swReg = await navigator.serviceWorker.register("src/sw.ts", {
        "type": "module"
    });

    const keys = await generateVapidKeys();

    await (await swReg.pushManager.getSubscription())?.unsubscribe();

    const pushSub = await swReg.pushManager.subscribe({
        "userVisibleOnly": true,
        "applicationServerKey": keys.publicKey
    });

    const data = {
        "vapidPrivate": keys.privateKey,
        "endpoint": pushSub.endpoint,
        "expTime": pushSub.expirationTime,
        "keys": {
            "auth": bufferToB64(pushSub.getKey("auth")!),
            "p256dh": bufferToB64(pushSub.getKey("p256dh")!)
        }
    } as PushData;

    await setVal("push-data", data);
    return data;
};

const displayData = async (data: PushData) => {
    DOM.main.innerHTML = "";

    const textArea = document.createElement("textarea");
    textArea.disabled = true;
    textArea.textContent = JSON.stringify(data);
    DOM.main.appendChild(textArea);

    // https://stackoverflow.com/a/48460773
    textArea.style.height = textArea.scrollHeight + "px";

    const copyBtn = document.createElement("button");
    copyBtn.textContent = "Copy to Clipboard";
    copyBtn.onclick = async () => {
        await navigator.clipboard.writeText(JSON.stringify(data));
    };
    DOM.main.appendChild(copyBtn);

    const registerBtn = document.createElement("button");
    registerBtn.textContent = "Re-register";
    registerBtn.onclick = async () => {
        await displayData(await register());
    };
    DOM.main.appendChild(registerBtn);
};

window.onload = async () => {
    await displayData(await getVal("push-data") ?? await new Promise((resolve) => {
        const button = document.createElement("button");
        button.innerText = "Register Push";
        button.onclick = () => {
            register().then(resolve);
        };
        DOM.main.innerHTML = "";
        DOM.main.appendChild(button);
    }));
};