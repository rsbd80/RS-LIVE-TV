document.addEventListener('DOMContentLoaded', function() {
    const container = document.getElementById('channel-container');

    // ক্যাশ এড়ানোর জন্য টাইমস্ট্যাম্প
    fetch('playlist.json?t=' + Date.now())
        .then(response => {
            if (!response.ok) throw new Error('Network response was not ok');
            return response.json();
        })
        .then(data => {
            container.innerHTML = ''; 

            data.forEach((channel) => {
                const li = document.createElement('li');
                li.setAttribute('tabindex', '0');
                
                li.innerHTML = `
                    <div class="channel-wrapper" style="pointer-events: none;">
                        <img src="${channel.image}" alt="${channel.name}" loading="lazy">
                        <p class="channel-title">${channel.name}</p>
                    </div>
                `;

                li.addEventListener('click', function() {
                    const player = document.getElementsByName('player')[0];
                    if (player) {
                        player.src = channel.url; // এখানে player.src ব্যবহার করা ভালো
                    }
                });
                
                container.appendChild(li);
            });

            // লোড হওয়ার পর প্রথম চ্যানেলে ফোকাস
            const firstChannel = container.querySelector('li');
            if (firstChannel) firstChannel.focus();
        })
        .catch(error => {
            console.error('Playlist load error:', error);
            container.innerHTML = '<p style="color:red; text-align:center;">ফাইল লোড হয়নি!</p>';
        });
});

// রিমোট কন্ট্রোল লজিক (লকসহ)
let isProcessing = false;
document.addEventListener('keydown', function(event) {
    if (isProcessing) return;
    
    const items = Array.from(document.querySelectorAll('#channel-container li'));
    const active = document.activeElement;
    let index = items.indexOf(active);

    if (event.keyCode === 40 || event.keyCode === 38 || event.keyCode === 13) {
        isProcessing = true;
        if (event.keyCode === 40 && index + 1 < items.length) items[index + 1].focus();
        else if (event.keyCode === 38 && index - 1 >= 0) items[index - 1].focus();
        else if (event.keyCode === 13 && active.tagName === 'LI') active.click();
        
        setTimeout(() => { isProcessing = false; }, 200);
    }
});
