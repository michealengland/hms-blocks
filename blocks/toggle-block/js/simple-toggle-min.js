$(".hms-toggle-expander").click(function(){$(this).next().toggleClass("open"),$(this).toggleClass("active")}),$(".hms-toggle-expander").on("click",function(t){t.target===this&&$(this).parent(".gridinfo").toggleClass("fill")});