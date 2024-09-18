export const generateMapLinks = (rue, departement, code_postal) => {
    const address = `${rue}, ${departement}, ${code_postal}`;
    const encodedAddress = encodeURIComponent(address);
    const wazeLink = `https://waze.com/ul?q=${encodedAddress}`;
    const googleMapsLink = `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`;
    return { wazeLink, googleMapsLink };
};