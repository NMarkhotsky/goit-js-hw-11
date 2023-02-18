import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

import { PixabayApiImages } from './pixabay-api';
import { createMarkupImg } from './createMarkup';
import { refs } from './refs';
import { spinnerPlay, spinnerStop } from './spinner';

refs.form.addEventListener('submit', onSubmitForm);

spinnerPlay();
spinnerStop();

const pixabay = new PixabayApiImages();
const lightboxGallery = new SimpleLightbox('.gallery a');

async function onSubmitForm(e) {
  e.preventDefault();

  clearGallery();
  pixabay.resetPage();

  pixabay.searchQuery = e.currentTarget.searchQuery.value.trim();

  if (pixabay.searchQuery === '') {
    Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );

    spinnerStop();

    return;
  }

  try {
    const { hits, totalHits } = await pixabay.getImages();
    pixabay.setTotal(totalHits);

    if (hits.length === 0) {
      return Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    }

    Notify.success(`Hooray! We found ${totalHits} images.`);

    spinnerPlay();

    const markup = createMarkupImg(hits);
    updateMarkup(markup);

    spinnerStop();
  } catch (error) {
    console.log(error);
    clearGallery();
  }
}

function updateMarkup(markup) {
  refs.gallery.insertAdjacentHTML('beforeend', markup);
  lightboxGallery.refresh();
  smoothScroll();
}

function clearGallery() {
  refs.gallery.innerHTML = '';
}

async function onEntry(entries) {
  spinnerPlay();
  entries.forEach(async entry => {
    try {
      if (pixabay.hasMoreImages()) {
        observer.unobserve(refs.infitity);
        Notify.info(
          "We're sorry, but you've reached the end of search results."
        );
      }
      if (
        entry.isIntersecting &&
        pixabay.query !== '' &&
        refs.gallery.childElementCount !== 0
      ) {
        pixabay.incrementPage();
        const { hits } = await pixabay.getImages();

        const markup = createMarkupImg(hits);
        updateMarkup(markup);
        spinnerStop();
      }

      spinnerStop();
    } catch (error) {
      spinnerStop();
      console.error(error);
    }
  });
}

const observer = new IntersectionObserver(onEntry, {
  rootMargin: '100px',
});

observer.observe(refs.infitity);

function smoothScroll() {
  const { height: cardHeight } = document
    .querySelector('.gallery')
    .firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
}
