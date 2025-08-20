// Expand/Collapse logic
document.addEventListener('DOMContentLoaded', () => {
  const toggles = document.querySelectorAll('.service-toggle');

  toggles.forEach(btn => {
    btn.addEventListener('click', () => {
      const details = btn.nextElementSibling;

      // Close other open sections
      document.querySelectorAll('.service-details.open').forEach(openEl => {
        if (openEl !== details) {
          openEl.style.maxHeight = null;
          openEl.classList.remove('open');
          const chev = openEl.previousElementSibling?.querySelector('.chevron');
          if (chev) chev.textContent = '▼';
        }
      });

      // Toggle current
      if (details.classList.contains('open')) {
        details.style.maxHeight = null;
        details.classList.remove('open');
        btn.querySelector('.chevron').textContent = '▼';
      } else {
        details.classList.add('open');
        details.style.maxHeight = details.scrollHeight + 'px';
        btn.querySelector('.chevron').textContent = '▲';
      }
    });
  });

  // Booking handlers
  document.querySelectorAll('.book-service').forEach(bookBtn => {
    bookBtn.addEventListener('click', async (e) => {
      const details = e.target.closest('.service-details');
      const serviceName = details.getAttribute('data-service');
      const select = details.querySelector('.price-select');
      const price = parseFloat(select.value);
      const tier = select.options[select.selectedIndex].dataset.tier || 'Standard';
      const summary = details.querySelector('.summary')?.textContent?.trim() || '';

      const user = auth.currentUser;
      if (!user) {
        alert('Please login or register to book this service.');
        window.location.href = 'login.html';
        return;
      }

      try {
        // Ensure user doc exists
        const userRef = db.collection('users').doc(user.uid);
        const snap = await userRef.get();
        if (!snap.exists) {
          await userRef.set({ email: user.email, role: 'customer', points: 0 });
        }

        // Add booking
        await db.collection('bookings').add({
          userId: user.uid,
          service: serviceName,
          tier: tier,
          price: price,
          description: summary,
          date: new Date().toISOString(),
          status: 'pending'
        });

        // Points: 1 per $10
        const pointsToAdd = Math.floor(price / 10);
        await userRef.update({
          points: firebase.firestore.FieldValue.increment(pointsToAdd)
        });

        // Go to confirmation
        const params = new URLSearchParams({
          service: serviceName,
          tier,
          price: String(price),
          desc: summary
        });
        window.location.href = `confirmation.html?${params.toString()}`;
      } catch (err) {
        alert('Error booking service: ' + err.message);
      }
    });
  });
});
