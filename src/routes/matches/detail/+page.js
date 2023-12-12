export function load({ url }) {
    const id = parseInt(url.searchParams.get('id'));
    return {
        id
    };
}