document.addEventListener('DOMContentLoaded', function () {

    // Function to get the query parameter from the URL
    function getQueryParam(param) {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get(param);
    }

    // Function to extract the blog post title from the URL
    function getBlogPostTitle() {
        const url = new URL(window.location.href);
        const pathParts = url.pathname.split('/');
        return pathParts[pathParts.length - 1].replace(/-/g, ' ');
    }

    // Function to update dynamic links
    function updateDynamicLinks() {
        const tootId = getQueryParam('toot_id');
        const blogPostTitle = getBlogPostTitle();

        // Update Mastodon Reply Button and Links
        if (tootId) {
            const mastodonReplyUrl = `https://m.otter.homes/@ming/${tootId}`;
            document.getElementById('mastodon-reply-button').href = mastodonReplyUrl;
            document.getElementById('mastodon-thread-link').href = mastodonReplyUrl;
            document.getElementById('mastodon-thread-link-en').href = mastodonReplyUrl;
        }

        // Update Email Reply Button
        if (blogPostTitle) {
            const emailSubject = `Comment on ${blogPostTitle}`;
            const emailBody = `在這裏寫下您的留言…… Your comment here...`;
            document.getElementById('email-reply-button').href = `mailto:hizmy@keemail.me?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;
        }
    }

    async function fetchComments() {
        const tootId = getQueryParam('toot_id');
        if (!tootId) {
            document.getElementById('comments').innerHTML = '<p>🙈看不見任何留言。 No comments found.</p>';
            return;
        }

        const apiUrl = `https://m.otter.homes/api/v1/statuses/${tootId}/context`;
        try {
            const response = await fetch(apiUrl);
            if (!response.ok) {
                throw new Error(`HTTP 錯誤！ HTTP error! Status: ${response.status}`);
            }
            const data = await response.json();

            // Check if the `descendants` array exists and is not empty
            if (!data.descendants || data.descendants.length === 0) {
                document.getElementById('comments').innerHTML = '<p>你好，探險者。此処乃偏野寒地，坐待四海旅人。成為第一個留言的人吧。No comments yet. Be the first to comment!</p>';
                return;
            }

            let commentsHtml = '';
            data.descendants.forEach(comment => {
                commentsHtml += `
                    <div class="comment">
                        <div class="comment-author">${comment.account.display_name} (@${comment.account.username})</div>
                        <div class="comment-content">${comment.content}</div>
                    </div>
                `;
            });

            document.getElementById('comments').innerHTML = commentsHtml;
        } catch (error) {
            console.error('Error fetching comments:', error);
            document.getElementById('comments').innerHTML = `<p>載入留言時出錯。Error loading comments: ${error.message}</p>`;
        }
    }

    // Update dynamic links when the page loads
    updateDynamicLinks();

    // Fetch comments when the page loads
    fetchComments();

    // Back-to-Top Button Logic
    window.onscroll = function() {
        const backToTopButton = document.getElementById('back-to-top');
        if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
            backToTopButton.style.display = 'block';
        } else {
            backToTopButton.style.display = 'none';
        }
    };
});

// Function to toggle the collapsible guideline
function toggleGuideline() {
    const guidelineContent = document.querySelector('.guideline-content');
    const guidelineIcon = document.querySelector('.guideline-icon');
    if (guidelineContent.style.display === 'block') {
        guidelineContent.style.display = 'none';
        guidelineIcon.textContent = '+';
    } else {
        guidelineContent.style.display = 'block';
        guidelineIcon.textContent = '-';
    }
}
