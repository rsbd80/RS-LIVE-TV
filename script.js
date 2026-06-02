document.addEventListener('DOMContentLoaded', function() {
    const container = document.getElementById('channel-container');

    fetch('playlist.json?t=' + Date.now())
        .then(response => response.json())
        .then(data => {
            container.innerHTML = ''; 

            data.forEach((channel, index) => {
                const li = document.createElement('li');
                
                // ১. রিমোট ফোকাস ধরার জন্য tabindex যোগ করা হয়েছে
                li.setAttribute('tabindex', '0');
                
                // চ্যানেল আইটেমের ডিজাইন
                li.innerHTML = `
                    <div style="display: block; text-decoration: none; pointer-events: none; width: 100%;">
                        <img src="${channel.image}" alt="${channel.name}" loading="lazy">
                        <div class="channel-info-box">
                            <p class="channel-title">${channel.name}</p>
                        </div>
                    </div>
                `;

                // ২. চ্যানেল ক্লিক ইভেন্ট
                li.addEventListener('click', function() {
                    const player = window.frames['player'] || document.getElementsByName('player')[0];
                    if (player) {
                        player.location.href = channel.url;
                    }
                });
                
                container.appendChild(li);
            });

            // ৩. প্লেলিস্ট লোড সম্পন্ন হওয়ার পর রিমোটের প্রথম চ্যানেলে অটো-ফোকাস
            const firstChannel = container.querySelector('li');
            if (firstChannel) {
                firstChannel.focus();
            }
        })
        .catch(error => {
            console.error('Error loading playlist:', error);
            container.innerHTML = '<p style="color:red; font-size:10px; text-align:center; padding:20px;">Playlist Load Error!</p>';
        });
});

// ৪. রিমোট কন্ট্রোল মাস্টার লজিক (কিবোর্ড ইভেন্ট)
document.addEventListener('keydown', function(event) {
    const items = Array.from(document.querySelectorAll('#channel-container li'));
    const active = document.activeElement;
    let index = items.indexOf(active);

    // যদি ফোকাস লিস্টের বাইরে থাকে, তবে প্রথম চ্যানেলে ফোকাস পাঠান
    if (index === -1 && items.length > 0) {
        items[0].focus();
        return;
    }

    if (event.keyCode === 40) { // রিমোট ডাউন
        event.preventDefault();
        if (index + 1 < items.length) items[index + 1].focus();
    } else if (event.keyCode === 38) { // রিমোট আপ
        event.preventDefault();
        if (index - 1 >= 0) items[index - 1].focus();
    } else if (event.keyCode === 13) { // রিমোট ওকে
        if (active.tagName === 'LI') active.click();
    }
});

// ৫. ফোকাস হলে অটো স্ক্রোল
window.addEventListener('focus', function(event) {
    if (event.target && event.target.tagName === 'LI') {
        event.target.scrollIntoView({ block: 'center', behavior: 'smooth' });
    }
}, true);
