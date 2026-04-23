export interface VapidKeyPair {
    publicKey: string;
    privateKey: string;
}

export function bufferToB64(buffer: ArrayBuffer): string {
    const uint8Array = new Uint8Array(buffer);
    let binary = "";
    for (let i = 0; i < uint8Array.byteLength; i++) {
        binary += String.fromCharCode(uint8Array[i]!);
    }

    const base64 = btoa(binary);
    return base64
        .replace(/\+/g, "-")
        .replace(/\//g, "_")
        .replace(/=+$/, "");
}

export async function generateVapidKeys(): Promise<VapidKeyPair> {
    const keyPair = await window.crypto.subtle.generateKey(
        {
            name: "ECDSA",
            namedCurve: "P-256",
        },
        true, // extractable
        ["sign", "verify"]
    );

    const publicKeyBuffer = await window.crypto.subtle.exportKey(
        "raw",
        keyPair.publicKey
    );

    const jwk = await window.crypto.subtle.exportKey("jwk", keyPair.privateKey);

    return {
        publicKey: bufferToB64(publicKeyBuffer),
        privateKey: jwk.d!,
    };
}