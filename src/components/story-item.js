// src/components/story-item.js

import DBHelper from '../utils/db-helper.js';

class StoryItem extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  set data(d) {
    this._data = d;
    this.render();
  }

  get data() {
    return this._data;
  }

  async render() {
    const d = this._data || {};
    const isFavorited = await DBHelper.getFavoriteStory(d.id);

    this.shadowRoot.innerHTML = `
      <style>
        .card {
          background: white;
          padding: 12px;
          border-radius: 8px;
          cursor: pointer;
          transition: box-shadow 0.2s;
          position: relative;
        }
        .card:hover { box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1); }
        img {
          width: 100%; height: 180px; object-fit: cover;
          border-radius: 6px; background-color: #eee;
        }
        h3 { margin: 8px 0 6px; font-size: 1.1rem; color: #333; }
        p { margin: 0; font-size: 0.9rem; color: #666; }
        small { display: block; margin-top: 10px; font-size: 0.8rem; color: #888; }
        .favorite-btn {
          position: absolute;
          top: 18px;
          right: 18px;
          font-size: 2rem;
          background: none; border: none; cursor: pointer;
          color: rgba(255, 255, 255, 0.9);
          text-shadow: 0 0 5px rgba(0,0,0,0.7);
          padding: 0; margin: 0; width: auto;
          line-height: 1;
        }
      </style>

      <article class="card" role="article" aria-labelledby="t">
        ${d.photoUrl ? `<img src="${d.photoUrl}" alt="Gambar cerita oleh ${d.name || 'Anonim'}"/>` : ''}
        
        <!-- PENJELASAN: Tombol ini berfungsi untuk menyimpan (Create) dan menghapus (Delete) dari IndexedDB -->
        <button class="favorite-btn" aria-label="Toggle Favorit">${isFavorited ? '❤️' : '🤍'}</button>

        <h3 id="t">${d.name || 'Anonim'}</h3>
        <p>${d.description || ''}</p>
        <small>${new Date(d.createdAt).toLocaleString('id-ID')}</small>
      </article>
    `;

    this.shadowRoot.querySelector('.favorite-btn').addEventListener('click', async (e) => {
        e.stopPropagation();
        const storyId = this._data.id;
        
        if (await DBHelper.getFavoriteStory(storyId)) {
            await DBHelper.deleteFavoriteStory(storyId);
            console.log('Cerita dihapus dari favorit!');
        } else {
            await DBHelper.putFavoriteStory(this._data);
            console.log('Cerita ditambahkan ke favorit!');
        }
        this.render(); 
    });
  }
}

customElements.define('story-item', StoryItem);
export default StoryItem;