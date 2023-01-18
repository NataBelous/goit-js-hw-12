const fetchImages = (query, page = 1) => {
  return fetch(`https://pixabay.com/api/?key=32885127-fc6b1a42da5ff34b30684e2fb&q=${query}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}`)
    .then((response) => {
      if (!response.ok) {
        throw new Error(response.status);
      }
      return response.json();
    });
}

export default fetchImages;