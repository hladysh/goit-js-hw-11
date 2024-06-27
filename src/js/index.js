import { createImageCardMarkup } from './markup';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { fetchImages } from './apis-service';

const searchForm = document.getElementById('search-form');
const gallery = document.querySelector('.gallery');

let searchQuery = '';
let currentPage = 1;
let simpleLightbox;

const handleSearch = async (event) => {
    event.preventDefault();
    searchQuery = event.target.elements.searchQuery.value.trim();
    if (searchQuery === '') {
        return Notiflix.Notify.failure('Please enter a search query.');
    }

    currentPage = 1;
    gallery.innerHTML = '';
    await loadImages();
};

const loadImages = async () => {
    try {
        const { hits, totalHits } = await fetchImages(searchQuery, currentPage);
        if (hits.length === 0) {
            Notiflix.Notify.failure(
                'Sorry, there are no images matching your search query. Please try again.'
            );
            return;
        }

        const markup = hits.map((hit) => createImageCardMarkup(hit)).join('');
        gallery.insertAdjacentHTML('beforeend', markup);
        if (currentPage === 1) {
            Notiflix.Notify.success(`Hooray! We found ${totalHits} images.`);
        }

        simpleLightbox = new SimpleLightbox('.gallery a');
        simpleLightbox.refresh();

    } catch (error) {
        console.error('Error fetching images:', error);
        Notiflix.Notify.failure('Something went wrong. Please try again later.');
    }
};

const handleLoadMore = async () => {
    currentPage += 1;
    await loadImages();
};

// Додавання інфініт скролл
window.addEventListener('scroll', () => {
    const { scrollTop, clientHeight, scrollHeight } = document.documentElement;
    if (scrollTop + clientHeight >= scrollHeight - 5) {
        handleLoadMore();
    }
});

searchForm.addEventListener('submit', handleSearch);
