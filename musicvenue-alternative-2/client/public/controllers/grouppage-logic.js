// var temp = "<div class='brick {size}' style='background-color: {color};'><div class='cover'>Content {size} </div></div>";
// var sizes = ["size31"];
// var colour = [
// 	"rgb(142, 68, 173)",
// 	"rgb(211, 84, 0)",
// 	"rgb(0, 106, 63)",
// 	"rgb(135, 0, 0)",
// 	"rgb(39, 174, 96)",
// 	"rgb(192, 57, 43)",
// 	"rgb(41, 128, 185)",
// 	"rgb(243, 156, 18)"
// ];
// var html = '', size = '', color = '', limitItem = 20;
// //Generating HTML code
// for (var i = 0; i < limitItem; ++i) {
// 	size = sizes[sizes.length * Math.random() << 0];
// 	color = colour[colour.length * Math.random() << 0];
// 	html += temp.replace(/\{size\}/g, size).replace("{color}", color);
// 	//html += temp.replace("{color}", color).replace("{num}", i);
// }

// $("#freewall").html(html);

// //Functions
// $(function() {
// 	var wall = new Freewall("#freewall");
// 	//Re-sizing blocks
// 	// var dna = $(".free-wall .flex-layout");
// 	// wall.unsetFilter();
// 	// wall.fixSize({
// 	//   block: dna,
// 	//   width: 150,
// 	//   height: 150
// 	// });

// 	wall.reset({
// 		selector: '.brick',
// 		animate: true,
// 		cellW: 600,
// 		//cellH: 'auto',
// 		// fixSize: 1,
// 		gutterY: 30,
// 		//gutterX: 50,
// 		onResize: function() {			
// 			wall.fitWidth();
// 			//wall.refresh();
// 		}
// 	});

// 	wall.fitWidth();
// });	
