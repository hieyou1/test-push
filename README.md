# test-push

Simple site to test the [Web Push API](https://developer.mozilla.org/en-US/docs/Web/API/Push_API).

## Usage
1. Go to [push.mikeylab.com](https://push.mikeylab.com) and register.
2. Make a valid Web Push request to the endpoint shown - just pass through the [options](https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorkerRegistration/showNotification), optionally with a value for the `title` key.

In case you don't have push infrastructure ready, the [web-push CLI](https://github.com/web-push-libs/web-push#command-line) works well and is easy to set-up - a CLI command builder is built into the site to make it easier to send test notifications.

## License
MIT