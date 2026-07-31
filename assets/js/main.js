document.addEventListener('DOMContentLoaded', () => {
  loadInstagramPosts();
});

async function loadInstagramPosts() {
  const container = document.getElementById('instagram-feed');
  if (!container) return;

  const INSTAGRAM_ACCESS_TOKEN = 'TU_INSTAGRAM_ACCESS_TOKEN_AQUI';
  const url = `https://graph.instagram.com/me/media?fields=id,caption,media_type,media_url,permalink,thumbnail_url&limit=3&access_token=${INSTAGRAM_ACCESS_TOKEN}`;

  // Publicaciones de respaldo (Rutas locales de tus imágenes)
  // [0] = Más reciente (Centro), [1] = Segunda (Izquierda), [2] = Tercera (Derecha)
  const fallbackPosts = [
    {
      media_url: 'assets/images/service-metalmecanica.jpg', // Foto de la caja SUMIX (Más reciente)
      permalink: 'https://www.instagram.com/sumix.supply/'
    },
    {
      media_url: 'assets/images/service-electricas.jpg', // Foto del pozo/ingeniero
      permalink: 'https://www.instagram.com/sumix.supply/'
    },
    {
      media_url: 'assets/images/service-desmalezamiento.jpg', // Foto de productos de limpieza
      permalink: 'https://www.instagram.com/sumix.supply/'
    }
  ];

  try {
    let posts = [];
    
    if (INSTAGRAM_ACCESS_TOKEN && INSTAGRAM_ACCESS_TOKEN !== 'TU_INSTAGRAM_ACCESS_TOKEN_AQUI') {
      const response = await fetch(url);
      const data = await response.json();
      
      if (data && data.data && data.data.length >= 3) {
        // Formateamos los 3 posts
        const fetched = data.data.slice(0, 3).map(post => ({
          media_url: post.media_type === 'VIDEO' ? post.thumbnail_url : post.media_url,
          permalink: post.permalink
        }));

        // Reordenamos: [Post2 (Izquierda), Post1 (Centro - Última publicación), Post3 (Derecha)]
        posts = [fetched[1], fetched[0], fetched[2]];
      }
    }
    
    if (posts.length === 0) {
      // Reordenamos las de respaldo igual: Centro (Caja SUMIX) queda en el índice 1
      posts = [fallbackPosts[1], fallbackPosts[0], fallbackPosts[2]];
    }

    renderPosts(posts, container);

  } catch (error) {
    console.warn('Cargando posts de respaldo para Instagram:', error);
    renderPosts([fallbackPosts[1], fallbackPosts[0], fallbackPosts[2]], container);
  }
}

function renderPosts(posts, container) {
  // Asignamos una clase especial 'featured' al elemento del centro (index === 1)
  container.innerHTML = posts.map((post, index) => `
    <div class="insta-card ${index === 1 ? 'featured' : ''}">
      <a href="${post.permalink}" target="_blank" rel="noopener noreferrer">
        <div class="insta-img-wrapper">
          <img src="${post.media_url}" alt="Publicación SUMIX" loading="lazy" />
        </div>
      </a>
      <div class="insta-actions">
        <div class="left-icons">
          <svg class="icon-heart" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
          <svg viewBox="0 0 24 24" fill="none" stroke="#000" stroke-width="2"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>
          <svg viewBox="0 0 24 24" fill="none" stroke="#000" stroke-width="2"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
        </div>
        <svg class="icon-bookmark" viewBox="0 0 24 24" fill="none" stroke="#000" stroke-width="2"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path></svg>
      </div>
    </div>
  `).join('');
}
