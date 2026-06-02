document.addEventListener('DOMContentLoaded', function() {
    const container = document.getElementById('channel-container');

    // ক্যাশ এড়াতে এবং দ্রুত লোড করতে একটি র্যান্ডম নাম্বার যোগ করা হয়েছে (?v=)
    fetch('playlist.json?v=' + Math.random())
        .then(response => response.json())
        .then(data => {
            container.innerHTML = ''; 

            data.forEach(channel => {
                const li = document.createElement('li');
                
                // loading="lazy" ব্যবহার করায় ডেক্সটপে চ্যানেলগুলো পলকের মধ্যে লোড হবে
                li.innerHTML = `
                    <a href="javascript:void(0);" onclick="player.location.href='${channel.url}'">
                        <img src="${channel.image}" alt="${channel.name}" loading="lazy">
                        <div class="channel-info-box">
                            <p class="channel-title">${channel.name}</p>
                        </div>
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

// রাইট ক্লিক বন্ধ রাখার ফাংশন
document.oncontextmenu = function() { return false; };
