(() => {
    const container = document.getElementById('posts-container');
    const sentinel = document.getElementById('scroll-sentinel');
    let currentPage = 1;
    const pageSize = 10;
    let loading = false;
  
    // 将 JSON 数据转换成 HTML 片段，这里复用 postslist.njk 的渲染结果
    function renderPosts(posts) {
      return posts.map(post => `
        <article class="post-item">
          <h2><a href="${post.url}">${post.data.title}</a></h2>
          <p>${post.data.description || ''}</p>
        </article>
      `).join('');
    }
  
    // 加载下一页
    async function loadNextPage() {
      if (loading) return;
      loading = true;
      currentPage += 1;
      const url = `/posts/page/${currentPage}.json`;
      try {
        const res = await fetch(url);
        if (!res.ok) throw new Error('No more posts');
        const json = await res.json();
        const html = renderPosts(json.posts);
        container.insertAdjacentHTML('beforeend', html);
        loading = false;
      } catch (err) {
        // 没有更多内容时，取消观察
        observer.disconnect();
        console.log('All posts loaded');
      }
    }
  
    // 通过 Intersection Observer 监听哨兵
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          loadNextPage();  // 当 scroll-sentinel 可见时，加载下一页 :contentReference[oaicite:0]{index=0}
        }
      });
    }, {
      root: null,
      rootMargin: '0px',
      threshold: 1.0
    });
  
    observer.observe(sentinel);
  })();
  