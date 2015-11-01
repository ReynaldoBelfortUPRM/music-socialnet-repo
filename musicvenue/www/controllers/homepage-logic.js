var temp = '<div class="brick {size}" style="background-color: {color};">'+
'<div class="cover">'+
'Content {size}'+ 
'</div>'+
'</div>"';




var htmlpost="";
htmlpost += "<div class=\"brick {size}\" style=\"background-color: {color};\">";
htmlpost += "	<div class=\"cover\">";
htmlpost += "		<div class=\"row\">";
htmlpost += "			<div class=\"col-md-7\">";
htmlpost += "				<a href=\"#\">";
htmlpost += "					<img class=\"img-responsive\" src=\"http:\/\/www.wallpusher.com\/blog\/wp-content\/uploads\/2010\/05\/Guitar-Photoshoot-3-700x300.jpg\" alt=\"\">";
htmlpost += "				<\/a>";
htmlpost += "				<a class=\"btn \" href=\"#\">Comment<\/a>";
htmlpost += "				<a class=\"btn\" id=\"deleteEvent\" href=\"#\" >Like<\/a>";
htmlpost += "			<\/div>";
htmlpost += "			<div class=\"col-md-5\">";
htmlpost += "				<h3>Person Name<\/h3>";
htmlpost += "				<p>Post Data<\/p>";
htmlpost += "				<div class=\"row\">";
htmlpost += "				<\/div>";
htmlpost += "			<\/div>";
htmlpost += "		<\/div>";
htmlpost += "	<\/div>";
htmlpost += "<\/div>";
htmlpost += "";



var htmlnewpost="";
htmlnewpost += "<div class=\"brick {size}\" style=\"background-color: {color};\">";
htmlnewpost += "	<div class=\"cover\">";
htmlnewpost += "		<div class=\"row\">";
htmlnewpost += "			<div class=\"col-md-7\">";
htmlnewpost += "				<a href=\"#\">";
htmlnewpost += "				 <form class=\"form-signin\"> '";
htmlnewpost += "				<div class=\"row\">";
htmlnewpost += "				<h1>     <\/h1>";
htmlnewpost += "				<\/div>";
htmlnewpost += "						<input id=\"postInput\" class=\"form-control\" style=\"width:35em; height:5em\" placeholder=\"Write Something\" required autofocus>   	";
htmlnewpost += "						<br\/>";
htmlnewpost += "				<\/form>";
htmlnewpost += "					<img class=\"img-responsive\" src=\"http:\/\/www.wallpusher.com\/blog\/wp-content\/uploads\/2010\/05\/Guitar-Photoshoot-3-700x300.jpg\" alt=\"\">";
htmlnewpost += "				<\/a>";
htmlnewpost += "				<a class=\"btn btn-primary editEventBtn\" href=\"#\">Comment<\/a>";
htmlnewpost += "				<a class=\"btn btn-primary\" id=\"deleteEvent\" href=\"#\" >Like<\/a>";
htmlnewpost += "			<\/div>";
htmlnewpost += "			<div class=\"col-md-5\">";
htmlnewpost += "				<h3>Make a Post<\/h3>";
htmlnewpost += "						<button class=\"btn\" type=\"submit\">Post<\/button>";
htmlnewpost += "				<div class=\"row\">";
htmlnewpost += "				<\/div>";
htmlnewpost += "			<\/div>";
htmlnewpost += "		<\/div>";
htmlnewpost += "	<\/div>";
htmlnewpost += "<\/div>";











var sizes = ["size34"];
var colour = [
	"rgb(142, 68, 173)",
	"rgb(211, 84, 0)",
	"rgb(0, 106, 63)",
	"rgb(135, 0, 0)",
	"rgb(39, 174, 96)",
	"rgb(192, 57, 43)",
	"rgb(41, 128, 185)",
	"rgb(243, 156, 18)"
];

var html = '', size = '', color = '', limitItem = 10
;
//Generating HTML code
for (var i = 0; i < limitItem; ++i) {
	size = sizes[sizes.length * Math.random() << 0];
	color = colour[colour.length * Math.random() << 0];
	//html += temp.replace(/\{size\}/g, size).replace("{color}", color);
	//html += temp.replace("{color}", color).replace("{num}", i);
	
	if(i==0){
		html += htmlnewpost.replace("{color}", color).replace("{num}", i);

	}
	else{	
		html += htmlpost.replace("{color}", color);
	}
}

$("#freewall").html(html);

//Functions
$(function() {
	var wall = new Freewall("#freewall");
	//Re-sizing blocks
	// var dna = $(".free-wall .flex-layout");
	// wall.unsetFilter();
	// wall.fixSize({
	//   block: dna,
	//   width: 150,
	//   height: 150
	// });

	wall.reset({
		selector: '.brick',
		animate: true,
		cellW: 600,
		//cellH: 'auto',
		// fixSize: 1,
		gutterY: 30,
		//gutterX: 50,
		onResize: function() {			
			wall.fitWidth();
			//wall.refresh();
		}
	});

	wall.fitWidth();
});	
