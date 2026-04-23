// To support types [https://github.com/microsoft/TypeScript/issues/14877]
declare const self: ServiceWorkerGlobalScope;

self.addEventListener("push", (e) => {
    e.waitUntil((async () => {
        try {
            const data = await e.data!.json();
            await self.registration.showNotification(data.title ?? "Notification received", data as any);
        } catch (e) {
            if (e instanceof Error) {
                await self.registration.showNotification("Invalid notification", {
                    "body": `Invalid notification: ${e.name}: ${e.message}`
                });
            } else {
                await self.registration.showNotification("Invalid notification sent", {
                    "body": `Invalid notification: ${e}`
                });
            }
        }
    })());
});