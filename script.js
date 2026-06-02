document.addEventListener('DOMContentLoaded', function() {
    const container = document.getElementById('channel-container');

    // JSON ফাইল থেকে চ্যানেল লোড করা
    fetch('playlist.json')
        .then(response => response.json())
        .then(data => {
            // আগের লিস্ট পরিষ্কার করা
            container.innerHTML = ''; 

            data.forEach(channel => {
                const li = document.createElement('li');
                
                // শুধু লোগো ইমেজ রাখা হয়েছে, কোনো টেক্সট নেই
                li.innerHTML = `
                    <a href="javascript:void(0);" onclick="player.location.href='${channel.url}'">
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

// রাইট ক্লিক বন্ধ রাখার ফাংশন
document.oncontextmenu = function() { return false; };
