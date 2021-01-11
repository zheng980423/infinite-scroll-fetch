const postsContainer = document.getElementById('posts-container');
const loading = document.querySelector('.loader');
const filter = document.querySelector('.filter');

let limit = 5;
let page = 1;
let enableFetch = true;
//fetch post data
async function getPosts() {
  const res = await fetch(
    `https://jsonplaceholder.typicode.com/posts?_limit=${limit}&_page=${page}`
  );
  const data = await res.json();
  return data;
}
//显示post到DOM中
async function showPosts() {
  const posts = await getPosts();
  posts.forEach(post => {
    const postEl = document.createElement('div');
    postEl.classList.add('post');
    postEl.innerHTML = `
    <div class='number'>${post.id}</div>
    <div class='post-info'>
    <h2 class = 'post-title'>${post.title}</h2>
    <p class='post-body'>${post.body}</p>
    </div>
    `;
    postsContainer.appendChild(postEl);
  });
}
//showloader 并且获取更多post
function showLoading() {
  loading.classList.add('show');

  setTimeout(() => {
    loading.classList.remove('show');

    setTimeout(() => {
      page++;
      showPosts();
    }, 300);
  }, 1000);
}

//通过input过滤posts
function filterPosts(e) {
  if (e.target.value === '') {
    enableFetch = true;
  } else {
    enableFetch = false;
  }
  const term = e.target.value.toUpperCase();
  const posts = document.querySelectorAll('.post');
  posts.forEach(post => {
    const title = post.querySelector('.post-title').innerText.toUpperCase();
    const body = post.querySelector('.post-body').innerText.toUpperCase();
    if (title.indexOf(term) > -1 || body.indexOf(term) > -1) {
      post.style.display = 'flex';
    } else {
      post.style.display = 'none';
    }
  });
}

//显示初始的post
showPosts();

window.addEventListener('scroll', () => {
  const { scrollTop, scrollHeight, clientHeight } = document.documentElement;

  //修补了显示randompost的bug
  if (scrollHeight - scrollTop === clientHeight && enableFetch === true) {
    showLoading();
  }
});

filter.addEventListener('input', filterPosts);
