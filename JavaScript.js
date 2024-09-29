// Simulated user database for authentication (replace with your actual DB logic)
const users = [
    { username: 'admin', password: 'password123' }, // Example user
];

// Load blogs on page load
document.addEventListener('DOMContentLoaded', function() {
    loadBlogsFromServer();
});

// User Authentication
function authenticateUser(username, password) {
    const user = users.find(u => u.username === username && u.password === password);
    return user !== undefined;
}

// Create Blog Function
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
                image = reader.result; // Base64 image string
                if (fileFile) {
                    const fileReader = new FileReader();
                    fileReader.readAsDataURL(fileFile);
                    fileReader.onload = function() {
                        file = fileReader.result; // Base64 file string
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

// Save Blog to Server
function saveBlog(title, content, image, file) {
    const blog = { title, content, image, file };

    // Send the blog to the server
    fetch('http://localhost:3000/api/blogs', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(blog)
    })
    .then(response => {
        if (response.ok) {
            return response.json();
        }
        throw new Error('Network response was not ok');
    })
    .then(data => {
        console.log('Blog saved with ID:', data.id);
        loadBlogsFromServer(); // Refresh the blog list
    })
    .catch(error => {
        console.error('Error saving blog:', error);
    });
}

// Load Blogs from Server
function loadBlogsFromServer() {
    fetch('http://localhost:3000/api/blogs')
        .then(response => response.json())
        .then(blogs => {
            document.getElementById('blog-list').innerHTML = ''; // Clear current blogs
            blogs.forEach(blog => displayBlog(blog));
        })
        .catch(error => {
            console.error('Error loading blogs:', error);
        });
}

// Display Blog
function displayBlog(blog) {
    const blogBox = document.createElement('div');
    blogBox.className = 'blog-box';

    if (blog.image) {
        const imgElement = document.createElement('img');
        imgElement.src = blog.image;
        blogBox.appendChild(imgElement);
    }

    const blogTitle = document.createElement('h3');
    blogTitle.textContent = blog.title;
    const blogContent = document.createElement('p');
    blogContent.textContent = blog.content;

    blogBox.appendChild(blogTitle);
    blogBox.appendChild(blogContent);

    if (blog.file) {
        const fileLink = document.createElement('a');
        fileLink.href = blog.file;
        fileLink.textContent = 'Download Attached File';
        fileLink.download = 'file';
        blogBox.appendChild(fileLink);
    }

    const actionDiv = document.createElement('div');
    actionDiv.className = 'action-buttons';

    // Like Button
    const likeButton = document.createElement('button');
    likeButton.textContent = 'Like 👍';
    let likeCount = 0;
    likeButton.addEventListener('click', () => {
        likeCount++;
        likeButton.textContent = `Like 👍 (${likeCount})`;
    });

    // Dislike Button
    const dislikeButton = document.createElement('button');
    dislikeButton.textContent = 'Dislike 👎';
    let dislikeCount = 0;
    dislikeButton.addEventListener('click', () => {
        dislikeCount++;
        dislikeButton.textContent = `Dislike 👎 (${dislikeCount})`;
    });

    // I Support Button
    const supportButton = document.createElement('button');
    supportButton.textContent = 'I Support 💪';
    let supportCount = 0;
    supportButton.addEventListener('click', () => {
        supportCount++;
        supportButton.textContent = `I Support 💪 (${supportCount})`;
    });

    // Share Button
    const shareButton = document.createElement('button');
    shareButton.textContent = 'Share 📤';
    shareButton.addEventListener('click', () => {
        // Share blog title and content via navigator.share (for supported browsers)
        if (navigator.share) {
            navigator.share({
                title: blog.title,
                text: blog.content,
                url: window.location.href // Sharing current URL
            }).then(() => {
                console.log('Thanks for sharing!');
            }).catch((error) => {
                console.error('Error sharing:', error);
            });
        } else {
            alert('Your browser does not support sharing functionality.');
        }
    });

    // Append all action buttons
    actionDiv.appendChild(likeButton);
    actionDiv.appendChild(dislikeButton);
    actionDiv.appendChild(supportButton);
    actionDiv.appendChild(shareButton);

    blogBox.appendChild(actionDiv);
    document.getElementById('blog-list').appendChild(blogBox);
}

// Authentication on Login
document.getElementById('login-form').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent default form submission
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    if (authenticateUser(username, password)) {
        alert('Login successful!');
        // Proceed to show blog section or redirect to another page
        document.getElementById('blog-section').style.display = 'block'; // Example action
    } else {
        alert('Invalid username or password. Please try again.');
    }
});
