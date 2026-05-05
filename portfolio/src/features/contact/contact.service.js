export async function sendContactMessage(data) {
    return new Promise(resolve => {
        window.setTimeout(() => resolve({ status: 'success', data }), 500);
    });
}
