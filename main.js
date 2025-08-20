// ================================
// MAIN.JS FOR TITAN HANDYMAN WEBSITE
// ================================

// Get all Book Now buttons
const bookButtons = document.querySelectorAll('.book-btn');

// Firebase references
const auth = firebase.auth();
const db = firebase.firestore();

// FUNCTION: Show service details in modal (if you have modals)
function showServiceSummary(serviceName, price, description) {
    const modal = document.getElementById('serviceModal');
    const modalTitle = document.getElementById('modalTitle');
    const modalPrice = document.getElementById('modalPrice');
    const modalDesc = document.getElementById('modalDescription');

    if(modal && modalTitle && modalPrice && modalDesc){
        modalTitle.innerText = serviceName;
        modalPrice.innerText = `$${price}`;
        modalDesc.innerText = description;
        modal.style.display = 'block';
    }
}

// Close modal function (if needed)
function closeModal() {
    const modal = document.getElementById('serviceModal');
    if(modal) modal.style.display = 'none';
}

// ================================
// BOOKING FUNCTIONALITY
// ================================
bookButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        const user = auth.currentUser;

        if (!user) {
            alert('Please login or register first to book a service.');
            return;
        }

        // Read service info from button data attributes
        const service = btn.getAttribute('data-service');
        const price = parseFloat(btn.getAttribute('data-price'));
        const description = btn.getAttribute('data-desc') || "No description available.";
        const date = new Date().toLocaleString();

        const userRef = db.collection('users').doc(user.uid);

        // Show service summary modal if available
        showServiceSummary(service, price, description);

        // Ensure user document exists
        userRef.get().then(doc => {
            if (!doc.exists) {
                userRef.set({
                    email: user.email,
                    role: 'customer',
                    points: 0
                });
            }

            // Add booking to Firestore
            db.collection('bookings').add({
                userId: user.uid,
                service: service,
                price: price,
                date: date,
                status: 'pending'
            }).then(() => {
                // Calculate points: 1 point per $10
                const pointsToAdd = Math.floor(price / 10);
                userRef.update({
                    points: firebase.firestore.FieldValue.increment(pointsToAdd)
                });

                alert(`Booking successful! You earned ${pointsToAdd} points.`);
            }).catch(error => {
                alert('Error booking service: ' + error.message);
            });
        }).catch(error => {
            alert('Error accessing user data: ' + error.message);
        });
    });
});

// ================================
// OPTIONAL: Logout button
// ================================
const logoutBtn = document.getElementById('logoutBtn');
if(logoutBtn){
    logoutBtn.addEventListener('click', () => {
        auth.signOut().then(() => {
            alert('Logged out successfully!');
            window.location.href = 'index.html';
        });
    });
}

// ================================
// OPTIONAL: Show customer points on dashboard
// ================================
const pointsDisplay = document.getElementById('customerPoints');
auth.onAuthStateChanged(user => {
    if(user && pointsDisplay){
        db.collection('users').doc(user.uid).get().then(doc => {
            if(doc.exists){
                pointsDisplay.innerText = doc.data().points;
            }
        });
    }
});
