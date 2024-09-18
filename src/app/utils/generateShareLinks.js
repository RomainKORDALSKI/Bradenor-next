export const generateShareLinks = (event) => {
    const eventUrl = encodeURIComponent(`http://localhost:3000/events/${event.ville}`);
    const eventTitle = encodeURIComponent(event.ville);
    const eventDescription = encodeURIComponent(`Découvrez cet événement intéressant à ${event.ville} le ${new Date(event.date).toLocaleDateString('fr-FR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })}.`);
  
    const facebookShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${eventUrl}&quote=${eventDescription}`;
    const instagramShareUrl = `https://www.instagram.com/?url=${eventUrl}`;
  
    return { facebookShareUrl, instagramShareUrl };
  };
  