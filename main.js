// Select all booking buttons
const bookButtons = document.querySelectorAll('.book-btn');

bookButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        const user = firebase.auth().currentUser;

        if (!user) {
            alert('Please login or register first.');
            return;
        }

        // Get service info from button data attributes
        const service = btn.getAttribute('data-service');
        const price = parseFloat(btn.getAttribute('data-price'));
        const date = new Date().toLocaleString();

        // Check if user document exists
        const userRef = db.collection('users').doc(user.uid);
        userRef.get().then(doc => {
            if (!doc.exists) {
                // Create user doc if missing
                userRef.set({
                    email: user.email,
                    role: 'customer',
                    points: 0
                });
            }

            // Add booking
            db.collection('bookings').add({
                userId: user.uid,
                service: service,
                price: price,
                date: date,
                status: 'pending'
            }).then(() => {
                // Update points (1 point per $10)
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
