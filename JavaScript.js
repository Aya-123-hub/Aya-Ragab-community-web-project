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
    const pdfFile = document.getElementById('blog-pdf').files[0];
    const docFile = document.getElementById('blog-doc').files[0];

    if (title && content) {
        // Convert image and files to Base64 if available
        let image = '';
        let pdf = '';
        let doc = '';
        
        if (imageFile) {
            const reader = new FileReader();
            reader.readAsDataURL(imageFile);
            reader.onload = function() {
                image = reader.result; // Base64 image string
                // If there are files, read them
                if (pdfFile) {
                    const pdfReader = new FileReader();
                    pdfReader.readAsDataURL(pdfFile);
                    pdfReader.onload = function() {
                        pdf = pdfReader.result; // Base64 PDF string
                        // Handle doc file similarly
                        if (docFile) {
                            const docReader = new FileReader();
                            docReader.readAsDataURL(docFile);
                            docReader.onload = function() {
                                doc = docReader.result; // Base64 Doc string
                                // Save blog once all files are processed
                                saveBlogToServer(title, content, image, pdf, doc);
                            };
                        } else {
                            saveBlogToServer(title, content, image, pdf, doc);
                        }
                    };
                } else {
                    saveBlogToServer(title, content, image, pdf, doc);
                }
            };
        }
    } else {
        alert('Please fill in all required fields.');
    }
}

// Save blog to local storage or server
function saveBlogToServer(title, content, image, pdf, doc) {
    const blog = {
        title,
        content,
        imageUrl: image,
        pdfUrl: pdf || null,
        docUrl: doc || null,
        approved: false,
        comments: []
    };

    let blogs = JSON.parse(localStorage.getItem('blogs')) || [];
    blogs.push(blog);
    localStorage.setItem('blogs', JSON.stringify(blogs));

    alert('Blog submitted successfully. Awaiting admin approval.');
    document.getElementById('blog-form').reset();
    loadBlogsFromServer();
}

// Load blogs from the local storage
function loadBlogsFromServer() {
    const blogDisplay = document.getElementById('blog-display');
    blogDisplay.innerHTML = ''; // Clear the current display

    let blogs = JSON.parse(localStorage.getItem('blogs')) || [];

    blogs.forEach((blog, index) => {
        if (blog.approved) {
            const blogBox = document.createElement('div');
            blogBox.classList.add('blog-box');

            const img = document.createElement('img');
            img.src = blog.imageUrl;
            blogBox.appendChild(img);

            const h3 = document.createElement('h3');
            h3.textContent = blog.title;
            blogBox.appendChild(h3);

            const p = document.createElement('p');
            p.textContent = blog.content;
            blogBox.appendChild(p);

            if (blog.pdfUrl) {
                const pdfLink = document.createElement('a');
                pdfLink.href = blog.pdfUrl;
                pdfLink.textContent = 'Download PDF';
                pdfLink.target = '_blank';
                blogBox.appendChild(pdfLink);
            }

            if (blog.docUrl) {
                const docLink = document.createElement('a');
                docLink.href = blog.docUrl;
                docLink.textContent = 'Download Document';
                docLink.target = '_blank';
                blogBox.appendChild(docLink);
            }

            blogDisplay.appendChild(blogBox);
        }
    });
}

// Admin approval logic
function approveBlog(blogIndex) {
    let blogs = JSON.parse(localStorage.getItem('blogs')) || [];
    blogs[blogIndex].approved = true;
    localStorage.setItem('blogs', JSON.stringify(blogs));
    loadBlogsFromServer();
}

// Admin login functionality
function adminLogin() {
    const pass = document.getElementById('admin-pass').value;
    if (pass === ADMIN_PASSWORD) {
        document.getElementById('admin-password').style.display = 'none';
        document.getElementById('admin-section').style.display = 'block';
        loadPendingBlogs();
    } else {
        alert('Incorrect password.');
    }
}

