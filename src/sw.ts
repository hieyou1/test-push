// To support types [https://github.com/microsoft/TypeScript/issues/14877]
declare const self: ServiceWorkerGlobalScope;

self.addEventListener("push", (e) => {
    e.waitUntil((async () => {
        try {
            const data = await e.data!.json();
            new Notification(data.title ?? "Notification received", data as any);
        } catch (e) {
            if (e instanceof Error) {
                new Notification("Invalid notification", {
                    "body": `Invalid notification: ${e.name}: ${e.message}`
                });
            } else {
                new Notification("Invalid notification sent", {
                    "body": `Invalid notification: ${e}`
                });
            }
        }
    })());
});