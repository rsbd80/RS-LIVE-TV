document.addEventListener('DOMContentLoaded', function() {
    const container = document.getElementById('channel-container');

    // JSON ফাইল থেকে চ্যানেল লোড করা
    fetch('playlist.json')
        .then(response => response.json())
        .then(data => {
            data.forEach(channel => {
                const li = document.createElement('li');
                
                // এখানে সরাসরি প্লেয়ারে লোড না করে, আমাদের তৈরি করা watchChannelWithAd ফাংশনটি কল করা হয়েছে
                li.innerHTML = `
                    <a href="javascript:void(0);" onclick="watchChannelWithAd('${channel.url}')">
                        <img src="${channel.image}" alt="${channel.name}">
                    </a>
                `;
                container.appendChild(li);
            });
        })
        .catch(error => {
            console.error('Error loading playlist:', error);
            container.innerHTML = '<p style="color:red; font-size:10px;">Error!</p>';
        });
});

// রাইট ক্লিক বন্ধ করার ফাংশন
function disableClick() {
    document.oncontextmenu = function() { return false; };
}
