import { createImageCardMarkup } from './markup';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { fetchImages } from './apiService';

const searchForm = document.getElementById('search-form');
const gallery = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.load-more');

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
    loadMoreBtn.classList.add('hidden');
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

        if (currentPage * 40 < totalHits) {
            loadMoreBtn.classList.remove('hidden');
        } else {
            loadMoreBtn.classList.add('hidden');
            Notiflix.Notify.info(
                "We're sorry, but you've reached the end of search results."
            );
        }
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
loadMoreBtn.addEventListener('click', handleLoadMore);
