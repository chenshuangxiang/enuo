<li><span>[field:pubdate function='strftime("%Y-%m-%d",@me)'/]</span>
          <h3><b></b><a href="[field:arcurl/]" title="[field:fulltitle/]" target="_blank">[field:fulltitle/]</a></h3>
        </li>
		[field:global name=autoindex runphp="yes"]
		if(@me%5==0)@me="<hr class='lbhr'/>";
		else @me="";
		[/field:global]