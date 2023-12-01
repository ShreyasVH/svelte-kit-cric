export function load({ url }) {
    const year = parseInt(url.searchParams.get('year')) || (new Date()).getFullYear();
    return {
        year
    };
}