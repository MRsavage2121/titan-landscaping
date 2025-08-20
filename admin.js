const bookingsTable = document.querySelector('#bookings-table tbody');
auth.onAuthStateChanged(user=>{
    if(user){
        db.collection('users').doc(user.uid).get().then(doc=>{
            if(!doc.exists || doc.data().role!=='admin'){
                alert('Access denied'); window.location.href='login.html';
            }
        });
        db.collection('bookings').onSnapshot(snapshot=>{
            bookingsTable.innerHTML='';
            snapshot.forEach(doc=>{
                const b = doc.data();
                const row = document.createElement('tr');
                row.innerHTML = `<td>${b.userId}</td>
                                 <td>${b.service}</td>
                                 <td>${b.price}</td>
                                 <td>${b.date}</td>
                                 <td>${b.status}</td>
                                 <td>
                                   <select data-id="${doc.id}" class="status-select">
                                     <option value="pending">Pending</option>
                                     <option value="completed">Completed</option>
                                     <option value="cancelled">Cancelled</option>
                                   </select>
                                 </td>`;
                bookingsTable.appendChild(row);
                row.querySelector('.status-select').value=b.status;
                row.querySelector('.status-select').addEventListener('change', e=>{
                    const newStatus=e.target.value;
                    db.collection('bookings').doc(e.target.dataset.id).update({status:newStatus});
                });
            });
        });
    }else{
        window.location.href='login.html';
    }
});

document.getElementById('logout').addEventListener('click', ()=>{
    auth.signOut().then(()=>window.location.href='login.html');
});
