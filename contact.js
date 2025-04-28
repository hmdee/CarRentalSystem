  $(document).ready(function() {
    $('#contactForm').submit(function(e) {
      e.preventDefault();
      alert('Your message has been sent successfully!');
      $(this).trigger('reset');
    });
  });