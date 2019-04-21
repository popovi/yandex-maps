import fetch from "cross-fetch";

async function fetchFromServer(options) {
    let signal;
    try {
        const controller = new AbortController();
        signal = controller.signal;

        setTimeout(() => {
            controller.abort();
        }, option.timeout || 5000);
    }
    catch (err) {
    }

    try {
        const response = await fetch(options.url, {
            method: options.method || "GET",
            headers: options.headers,
            body: options.body,
            cache: "no-store",
            mode: "cors",
            signal
        });

        if (!response.ok) {
            let error = new Error("Back api server is not ok.");
            throw error;
        }

        return response;
    }
    catch (err) {
        let newError;

        if (err)
            newError = err;
        else
            newError = new Error("Error parsing back-server data");

        throw newError;
    }
}

export { fetchFromServer }