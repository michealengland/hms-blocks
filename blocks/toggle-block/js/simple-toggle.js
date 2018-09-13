$(".hms-toggle-expander").click(function() {
  $(this).next().toggleClass("open");
  $(this).toggleClass("active");
});

// Add .fill class to .gridinfo parent container.
$('.hms-toggle-expander').on('click', function(e) {
if (e.target !== this)
  return;

$(this).parent( ".gridinfo" ).toggleClass( "fill" );
});
