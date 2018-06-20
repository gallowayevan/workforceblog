---
template: post.html
title: Help
date: 2018-06-14
permalink: /help
---

<div class="row u-full-width">
  <h3>Help</h3>
  <p>Click this button to return to the home page and load the introductory tutorial. <a href="/" id="tutorial" class="button">Tutorial</a></p>
  <p>Email hpds_online@unc.edu with questions, error reports, or suggestions.</p>
  </div>  
	</div>

<script>
var helpButton = document.getElementById('tutorial');
helpButton.addEventListener("click", function(){document.cookie = "hpds-intro-cookie=run-intro; expires=-1; path=/";});

</script>