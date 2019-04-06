/** @file httprequests.js */

export function post(url = ``, data = {}) {
    return fetch(url, {
        method: "POST", 
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    })
    .then(response => response.json()); 
}

export function get(url = ``) {
    return fetch(url, {
        method: "GET", 
        credentials: "include",
    })
    .then(response => response.json()); 
}