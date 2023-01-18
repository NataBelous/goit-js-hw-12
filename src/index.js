import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { axios } from 'axios';
import SimpleLightbox from "simplelightbox";
import fetchImages from './js/fetchImages';

import "simplelightbox/dist/simple-lightbox.min.css";
import './css/styles.css';

const refs = {
  searchForm: document.querySelector('.search-form'),
  galleryContainer: document.querySelector('.gallery'),
  loadMoreBtn: document.querySelector('.load-more'),
}

let page = 1;
let searchQuery = '';

const gallery = new SimpleLightbox('.gallery a');

const loadPage = () => {
  fetchImages(searchQuery, page)
    .then((images) => {
      if (images.hits.length === 0) {
        if (page === 1) {
          Notify.failure('Sorry, there are no images matching your search query. Please try again.');
          return;
        } else {
          throw new Error('No more images');
        }
      }

      const markup = images.hits.map(image => renderImageCard(image)).join('');
      refs.galleryContainer.insertAdjacentHTML('beforeend', markup);
      refs.loadMoreBtn.classList.remove('is-hidden');

      gallery.refresh();

      if (page === 1) {
        Notify.info(`Hooray! We found ${images.totalHits} images.`);
      } else {
        const { height: cardHeight } = refs.galleryContainer.firstElementChild.getBoundingClientRect();
        window.scrollBy({ top: cardHeight * 2, behavior: 'smooth' });
      }

      page += 1;
    })
    .catch(() => {
      Notify.failure('We\'re sorry, but you\'ve reached the end of search results.');
      refs.loadMoreBtn.classList.add('is-hidden');
    });
};

const onSearch = (event) => {
  event.preventDefault();

  page = 1
  searchQuery = event.target.searchQuery.value.trim();
  if (!searchQuery) return;
  refs.galleryContainer.innerHTML = '';

  loadPage();
};

const renderImageCard = (image) => {
  return `
  <div class="photo-card">
    <a href="${image.largeImageURL}">
      <img src="${image.webformatURL}" alt="${image.tags}" loading="lazy" />
    </a>
    <div class="info">
      <p class="info-item">
        <b>Likes</b>
        ${image.likes}
      </p>
      <p class="info-item">
        <b>Views</b>
        ${image.views}
      </p>
      <p class="info-item">
        <b>Comments</b>
        ${image.comments}
      </p>
      <p class="info-item">
        <b>Downloads</b>
        ${image.downloads}
      </p>
    </div>
  </div>`;
}

refs.searchForm.addEventListener('submit', onSearch);
refs.loadMoreBtn.addEventListener('click', loadPage);


