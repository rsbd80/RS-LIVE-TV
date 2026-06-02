let isProcessing = false; // বাটন লক করার জন্য ভ্যারিয়েবল

document.addEventListener('keydown', function(event) {
    // যদি প্রসেসিং চলছে, তবে নতুন ইনপুট ব্লক করো
    if (isProcessing) return;

    const items = Array.from(document.querySelectorAll('#channel-container li'));
    const active = document.activeElement;
    let index = items.indexOf(active);

    if (index === -1 && items.length > 0) {
        items[0].focus();
        return;
    }

    if (event.keyCode === 40 || event.keyCode === 38 || event.keyCode === 13) {
        isProcessing = true; // প্রসেস শুরু
        
        if (event.keyCode === 40) { // Down
            event.preventDefault();
            if (index + 1 < items.length) items[index + 1].focus();
        } else if (event.keyCode === 38) { // Up
            event.preventDefault();
            if (index - 1 >= 0) items[index - 1].focus();
        } else if (event.keyCode === 13) { // OK
            if (active.tagName === 'LI') active.click();
        }

        // ৩০০ মিলি-সেকেন্ড পর আবার ইনপুট গ্রহণ করবে
        setTimeout(() => { isProcessing = false; }, 300);
    }
});
