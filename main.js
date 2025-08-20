// Modals
const serviceBoxes = document.querySelectorAll('.service-box');
const modals = document.querySelectorAll('.modal');
const closes = document.querySelectorAll('.close');

serviceBoxes.forEach(box=>{
    box.addEventListener('click', ()=>{
        const modalId = box.dataset.modal;
        const modal = document.getElementById(modalId);
        if(modal) modal.style.display = 'flex';
    });
});

closes.forEach(span=>{
    span.addEventListener('click', ()=>{
        span.parentElement.parentElement.style.display='none';
    });
});

window.onclick = function(event) {
    modals.forEach(modal=>{
        if(event.target==modal) modal.style.display='none';
    });
}

// Booking logic
const bookButtons = document.querySelectorAll('.book-btn');
bookButtons.forEach(btn=>{
    btn.addEventListener('click', ()=>{
        const service = btn.dataset.service;
        const price = parseFloat(btn.dataset.price);
        const user = firebase.auth().currentUser;
        if(!user){ alert('Please login first'); return; }
        const date = new Date().toLocaleDateString();
        db.collection('bookings').add({
            userId:user.uid,
            service:service,
            price:price,
            date:date,
            status:'pending'
        }).then(()=>{
            // Add points
            const points = Math.floor(price/10);
            const userRef = db.collection('users').doc(user.uid);
            userRef.update({points: firebase.firestore.FieldValue.increment(points)});
            alert('Booking successful! Points added: '+points);
        });
    });
});
