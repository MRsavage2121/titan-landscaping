const loginBtn = document.getElementById('loginBtn');
const registerBtn = document.getElementById('registerBtn');

loginBtn.addEventListener('click', (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    auth.signInWithEmailAndPassword(email, password)
        .then(userCredential => {
            const user = userCredential.user;
            // Get user role from Firestore
            db.collection('users').doc(user.uid).get().then(doc=>{
                if(doc.exists){
                    const role = doc.data().role;
                    if(role === 'admin'){
                        window.location.href = 'admin-dashboard.html';
                    } else {
                        window.location.href = 'customer-dashboard.html';
                    }
                } else {
                    alert('No user data found!');
                }
            });
        })
        .catch(error => {
            alert(error.message);
        });
});

registerBtn.addEventListener('click', (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    auth.createUserWithEmailAndPassword(email, password)
        .then(userCredential => {
            const user = userCredential.user;
            // Create Firestore user document
            db.collection('users').doc(user.uid).set({
                email: email,
                role: 'customer',
                points: 0
            }).then(() => {
                alert('Registration successful!');
                window.location.href = 'customer-dashboard.html';
            });
        })
        .catch(error => {
            alert(error.message);
        });
});
