const customerTable = document.querySelector('#bookings-table tbody');
const pointsSpan = document.getElementById('points');

auth.onAuthStateChanged(user=>{
    if(user){
        db.collection('users').doc(user.uid).get().then(doc=>{
            if(!doc.exists || doc.data().role!=='customer'){
                alert('Access denied'); window.location.href='login.html';
            }else{
                pointsSpan.innerText=doc.data().points || 0;
            }
        });
        db.collection('bookings').where('userId','==',user.uid).onSnapshot(snapshot=>{
            customerTable.innerHTML='';
            snapshot.forEach(doc=>{
                const b = doc.data();
                const row = document.createElement('tr');
                row.innerHTML=`<td>${b.service}</td><td>${b.price}</td><td>${b.date}</td><td>${b.status}</td>`;
                customerTable.appendChild(row);
            });
        });
    }else{
        window.location.href='login.html';
    }
});

document.getElementById('logout').addEventListener('click', ()=>{
    auth.signOut().then(()=>window.location.href='login.html');
});

document.getElementById('redeemBtn').addEventListener('click', ()=>{
    const pointsToRedeem = parseInt(document.getElementById('redeemPoints').value);
    const user = auth.currentUser;
    if(!user) return;
    const userRef = db.collection('users').doc(user.uid);
    userRef.get().then(doc=>{
        const currentPoints = doc.data().points || 0;
        if(pointsToRedeem > currentPoints){ alert('Not enough points'); return; }
        userRef.update({points: currentPoints - pointsToRedeem});
        alert('Points redeemed successfully!');
    });
});
