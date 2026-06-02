document.addEventListener('DOMContentLoaded', function() {
    const container = document.getElementById('channel-container');

    // ডেক্সটপে ফাস্ট লোড করতে এবং ব্রাউজার ক্যাশ এড়াতে Date.now() ব্যবহার করা হয়েছে
    fetch('playlist.json?t=' + Date.now())
        .then(response => response.json())
        .then(data => {
            container.innerHTML = ''; 

            data.forEach(channel => {
                const li = document.createElement('li');
                
                // রিমোট কন্ট্রোল ইঞ্জিনের সুবিধার্থে li এলিমেন্টেই tabindex সেট করা হলো
                li.setAttribute('tabindex', '0');
                
                li.innerHTML = `
                    <a href="javascript:void(0);" style="display: block; text-decoration: none; pointer-events: none;">
                        <img src="${channel.image}" alt="${channel.name}" loading="lazy">
                        <div class="channel-info-box">
                            <p class="channel-title">${channel.name}</p>
                        </div>
                    </a>
                `;

                // চ্যানেল প্লে করার একক (১ ক্লিক) ইভেন্ট লিসেনার
                li.addEventListener('click', function() {
                    if (window.frames['player']) {
                        window.frames['player'].location.href = channel.url;
                    } else {
                        player.location.href = channel.url;
                    }
                });
                
                container.appendChild(li);
            });
        })
        .catch(error => {
            console.error('Error loading playlist:', error);
            container.innerHTML = '<p style="color:red; font-size:10px;">Error!</p>';
        });
});
