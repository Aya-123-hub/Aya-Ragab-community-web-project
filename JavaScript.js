document.addEventListener('DOMContentLoaded', function() {
    // Load blogs from local storage on page load
    loadBlogsFromLocalStorage();
});

function createBlog() {
    // Get the form values
    const title = document.getElementById('blog-title').value;
    const content = document.getElementById('blog-content').value;
    const imageFile = document.getElementById('blog-image').files[0];
    const fileFile = document.getElementById('blog-file').files[0];

    if (title && content) {
        // Convert image and file to Base64 (if available)
        let image = '';
        let file = '';
        if (imageFile) {
            const reader = new FileReader();
            reader.readAsDataURL(imageFile);
            reader.onload = function() {
                image = reader.result;  // Base64 image string
                if (fileFile) {
                    const fileReader = new FileReader();
                    fileReader.readAsDataURL(fileFile);
                    fileReader.onload = function() {
                        file = fileReader.result;  // Base64 file string
                        saveBlog(title, content, image, file);
                    };
                } else {
                    saveBlog(title, content, image, file);
                }
            };
        } else {
            saveBlog(title, content, image, file);
        }

        // Clear form fields
        document.getElementById('blog-form').reset();
    } else {
        alert('Please fill out all required fields.');
    }
}

function saveBlog(title, content, image, file) {
    // Get existing blogs from local storage
    const blogs = JSON.parse(localStorage.getItem('blogs')) || [];

    // Add new blog to the list
    blogs.push({ title, content, image, file });

    // Save updated blogs list back to local storage
    localStorage.setItem('blogs', JSON.stringify(blogs));

    // Display the new blog
    displayBlog({ title, content, image, file });
}

function loadBlogsFromLocalStorage() {
    // Get blogs from local storage
    const blogs = JSON.parse(localStorage.getItem('blogs')) || [];

    // Display each blog
    blogs.forEach(blog => displayBlog(blog));
}

function displayBlog(blog) {
    // Create a new blog box
    const blogBox = document.createElement('div');
    blogBox.className = 'blog-box';

    // Add image if available
    if (blog.image) {
        const imgElement = document.createElement('img');
        imgElement.src = blog.image;
        blogBox.appendChild(imgElement);
    }

    // Add the title and content
    const blogTitle = document.createElement('h3');
    blogTitle.textContent = blog.title;
    const blogContent = document.createElement('p');
    blogContent.textContent = blog.content;

    blogBox.appendChild(blogTitle);
    blogBox.appendChild(blogContent);

    // Add file link if available
    if (blog.file) {
        const fileLink = document.createElement('a');
        fileLink.href = blog.file;
        fileLink.textContent = 'Download Attached File';
        fileLink.download = 'file';
        blogBox.appendChild(fileLink);
    }

    // Like and Dislike buttons
    const likeDislikeDiv = document.createElement('div');
    likeDislikeDiv.className = 'like-dislike-buttons';

    const likeButton = document.createElement('button');
    likeButton.textContent = 'Like 👍';
    let likeCount = 0;
    likeButton.addEventListener('click', () => {
        likeCount++;
        likeButton.textContent = `Like 👍 (${likeCount})`;
    });

    const dislikeButton = document.createElement('button');
    dislikeButton.textContent = 'Dislike 👎';
    let dislikeCount = 0;
    dislikeButton.addEventListener('click', () => {
        dislikeCount++;
        dislikeButton.textContent = `Dislike 👎 (${dislikeCount})`;
    });

    likeDislikeDiv.appendChild(likeButton);
    likeDislikeDiv.appendChild(dislikeButton);

    blogBox.appendChild(likeDislikeDiv);

    // Append the blog to the list
    document.getElementById('blog-list').appendChild(blogBox);
}
