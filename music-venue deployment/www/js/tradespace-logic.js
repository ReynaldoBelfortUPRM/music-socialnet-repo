//------------------Tradespace Wall functionality-----------------
var wall= new Freewall("#freewall");
	wall.reset({
		selector:'.brick',
		animate:true,
		cellW: 200,
		cellH:'auto',
		onResize:function(){
			wall.fitWidth();
		}
	});

wall.fitWidth();

	wall.container.find('.brickimg').load(function(){
		wall.fitWidth();
	});

	//For adding new content boxes.
	$("#btnAddAnn").click(function(){		

			varhtmlBox='<divclass="brick"><divclass="container-fluid"><divclass="row"><h4>GibsonLesPaul</h4></div><divclass="row"><divid="carousel1"class="carouselslide"data-ride="carousel"><!--Indicators--><olclass="carousel-indicators"><lidata-target="#carousel1"data-slide-to="0"class="active"></li><lidata-target="#carousel1"data-slide-to="1"></li><lidata-target="#carousel1"data-slide-to="2"></li></ol><!--Wrapperforslides--><divclass="carousel-inner"><divclass="itemactive"><imgsrc="file:///C:/Program%20Files%20(x86)/Pinegrow%20Web%20Designer/placeholders/img8.jpg"alt=""/><divclass="carousel-caption"><h3>Slide1title</h3><p>Slide1description.</p></div></div><divclass="item"><imgsrc="file:///C:/Program%20Files%20(x86)/Pinegrow%20Web%20Designer/placeholders/img1.jpg"alt=""/><divclass="carousel-caption"><h3>Slide2title</h3><p>Slide2description.</p></div></div><divclass="item"><imgsrc="file:///C:/Program%20Files%20(x86)/Pinegrow%20Web%20Designer/placeholders/img7.jpg"alt=""/><divclass="carousel-caption"><h3>Slide3title</h3><p>Slide3description.</p></div></div></div><!--Controls--><aclass="leftcarousel-control"href="#carousel1"data-slide="prev"><spanclass="glyphiconglyphicon-chevron-left"></span></a><aclass="rightcarousel-control"href="#carousel1"data-slide="next"><spanclass="glyphiconglyphicon-chevron-right"></span></a></div></div><divclass="row"><p>Proinidfelislacinia,dictumnullaet,consecteturdolor.Duisvariusturpistinciduntfinibushendrerit.</p></div></div></div>';

			wall.appendBlock(htmlBox);
		});


	////Forside-menu:
	//$('#test-panel').scotchPanel({
	//	containerSelector:'body',//AsajQuerySelector
	//	direction:'left',//Makeittoggleinfromtheleft
	//	duration:300,//Speedinmshowfastyouwantittobe
	//	transition:'ease',//CSS3transitiontype:linear,ease,ease-in,ease-out,ease-in-out,cubic-bezier(P1x,P1y,P2x,P2y)
	//	clickSelector:'.toggle-panel',//Enablestogglingwhenclickingelementsofthisclass
	//	distanceX:'70%',//Sizefothetoggle
	//	enableEscapeKey:true//ClickingEscwillclosethepanel
	//	});

	//Forside-menu:
	$('#slider').slideReveal({//Parameterwouldbethetargetelementthatwillbeslided
	trigger:$("#btnSide"),//Theelementthatwilltriggerthesidemenu
	push:false
	});


	// //Tree view for slide panel
	// $(function () {
	//     $('.tree li:has(ul)').addClass('parent_li').find(' > span').attr('title', 'Collapse this branch');
	//     $('.tree li.parent_li > span').on('click', function (e) {
	//         var children = $(this).parent('li.parent_li').find(' > ul > li');
	//         if (children.is(":visible")) {
	//             children.hide('fast');
	//             $(this).attr('title', 'Expand this branch').find(' > i').addClass('icon-plus-sign').removeClass('icon-minus-sign');
	//         } else {
	//             children.show('fast');
	//             $(this).attr('title', 'Collapse this branch').find(' > i').addClass('icon-minus-sign').removeClass('icon-plus-sign');
	//         }
	//         e.stopPropagation();
	//     });
	// });