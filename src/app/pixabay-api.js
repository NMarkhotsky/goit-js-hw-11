import axios from 'axios';

const BASE_URL = 'https://pixabay.com/api/';

export class PixabayApiImages {
  constructor() {
    this.searchQuery = '';
    this.page = 1;
    this.per_page = 40;
    this.totalPages = 0;
  }

  async getImages() {
    const searchParams = new URLSearchParams({
      key: '33634172-69812b587cbe0ba586ff0443e',
      q: `${this.searchQuery}`,
      image_type: 'photo',
      orientation: 'horizontal',
      safesearch: true,
      per_page: `${this.per_page}`,
      page: `${this.page}`,
    });

    const { data } = await axios.get(`${BASE_URL}?${searchParams}`);
    return data;
  }

  incrementPage() {
    return (this.page += 1);
  }

  resetPage() {
    return (this.page = 1);
  }

  setTotal(total) {
    return (this.totalPages = total);
  }

  resetTotalPage() {
    return (this.totalPages = 0);
  }

  hasMoreImages() {
    return this.page === Math.ceil(this.totalPages / this.per_page);
  }
}
