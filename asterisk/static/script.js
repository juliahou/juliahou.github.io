// search julia for helpful comments
// console = words denoting game control and player movement
// words = words that make up poem?
// checkDisplay run every time player moves

var scene = new THREE.Scene();
var consoleScene = new THREE.Scene();

var platform_geo, platform_material, platform_mesh;

var platformAdded = false;
var arriveMsg = false;

platform_geo = new THREE.BoxGeometry(100, 10, 100);
platform_material = new THREE.MeshBasicMaterial({color: 0xadd8e6});
platform_mesh = new THREE.Mesh(platform_geo, platform_material);

platform_mesh.position.set(1600, -150, 0);

var camera = new THREE.PerspectiveCamera(
	75,
	window.innerWidth / window.innerHeight,
	0.1,
	500);
var consoleCamera = new THREE.PerspectiveCamera(
	75,
	window.innerWidth / window.innerHeight,
	0.1,
	500);

// http://stackoverflow.com/a/29269912/1517227
var renderer = new THREE.WebGLRenderer({
	antialias: true
});
renderer.setClearColor(0xffffff);
renderer.autoClear = false;
renderer.setSize(
	window.innerWidth,
	window.innerHeight);
document.body.appendChild(renderer.domElement);

var dirLight = new THREE.DirectionalLight(0xffffff, 1);
dirLight.position.set(100, 100, 50);
scene.add(dirLight);
consoleScene.add(dirLight);

var negativeZ = 0;
var negativeX = 1;
var positiveZ = 2;
var positiveX = 3;

var cameraDistance = 250;
var cameraDir = 0;
var cameraYRotation = 0;
var cameraPosition = new THREE.Vector3(0, 0, cameraDistance);
var rotationX = 0;
var rotationY = 0;

function cameraFollowsLeftTurn(nextPlayerPosition) {
	cameraDir++;

	cameraYRotation = Math.PI / 2 * cameraDir;
	cameraPosition = new THREE.Vector3(map[nextPlayerPosition].x, map[nextPlayerPosition].y, map[nextPlayerPosition].z);
	cameraPosition.add(new THREE.Vector3(
		Math.sin(cameraYRotation) * cameraDistance,
		0,
		Math.cos(cameraYRotation) * cameraDistance
		));
}

function cameraFollowsRightTurn(nextPlayerPosition) {
	cameraDir--;

	cameraYRotation = Math.PI / 2 * cameraDir;
	cameraPosition = new THREE.Vector3(map[nextPlayerPosition].x, map[nextPlayerPosition].y, map[nextPlayerPosition].z);
	cameraPosition.add(new THREE.Vector3(
		Math.sin(cameraYRotation) * cameraDistance,
		0,
		Math.cos(cameraYRotation) * cameraDistance
		));
}

camera.position.z = cameraDistance;
consoleCamera.position.z = cameraDistance;

var font;
var fontLoader = new THREE.FontLoader();
var arrayOfAlphabets = [];

var lmmrfont_json = JSON.parse(JSON.stringify(lmmrfont));
// Make text geometries on fulfillment of empty promise; without it, there's
// weird stuff happening with the order of variables and function calls that
// breaks everything.
const emptyPromise = Promise.resolve();
emptyPromise.then(() => {
 font = fontLoader.parse(lmmrfont_json);
	makeTextGeometries(font);
	init(font);

	// this stuff is for the giant floating letters, not necessary
	/*for (var iter = 0; iter < 7; iter++) {
		var alphabets = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
		var char = alphabets[Math.floor(Math.random() * 52)];
		var giantAlphabetGeometry = new THREE.TextGeometry(char, {
			font: font,
			size: 100 + Math.random() * 10,
			height: 15 + Math.random() * 1.5
		});
		//var giantAlphabetMaterial = new THREE.MeshBasicMaterial({color: 0x222222});
		var giantAlphabetMaterial = new THREE.MeshBasicMaterial({color: 0xFF0000});
		var giantAlphabetMesh = new THREE.Mesh(giantAlphabetGeometry, giantAlphabetMaterial);
		giantAlphabetMesh.position.set(Math.random() * 1600, -100, Math.random() * 1600 - 800);
		giantAlphabetMesh.rotation.x = Math.random() * Math.PI * 2;
		giantAlphabetMesh.rotation.y = Math.random() * Math.PI * 2;
		giantAlphabetMesh.rotation.z = Math.random() * Math.PI * 2;
		scene.add(giantAlphabetMesh);
		arrayOfAlphabets.push(giantAlphabetMesh);
	}*/
});

var smallTextGeometries = [];
var largeTextGeometries = [];

var allString = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ,. *:";

var letterHeight = 9;
var reserveMultiplier = 0.7;

function makeTextGeometries(font) {
	for (var i = 0; i < allString.length; i++) {
		var smallGeometry = new THREE.TextGeometry(
			allString[i],
			{
				font: font,
				size: letterHeight * reserveMultiplier,
				height: 0.1
			}
			);
		smallTextGeometries.push(smallGeometry);

		var largeGeometry = new THREE.TextGeometry(
			allString[i],
			{
				font: font,
				size: letterHeight,
				height: 0.1
			}
			);
		largeTextGeometries.push(largeGeometry);
	}
}

function getSmallTextGeometry(character) {
	var index = allString.indexOf(character);
	if (character != -1) {
		return smallTextGeometries[index];
	}
}

function getLargeTextGeometry(character) {
	var index = allString.indexOf(character);
	if (character != -1) {
		return largeTextGeometries[index];
	}
}

// thing types
var player_type = -1;
var line_type = 0;
var path_type = 1;
var horizontal_path_type = 1.5;
var tree_type = 2;
var alphabet_type = 3;
var word_type = 4;
var star_type = 5;
var help_type = 6;

function getIntroString(type) {
	/*switch (type) {
		case player_type:
			return "He is there the whole time. ";
			break;
		case line_type:
			return "He comes across a line. ";
			break;
		case path_type:
			return "He sees a path extending in front of him. ";
			break;
		case horizontal_path_type:
			return "He sees a path extending in front of him. ";
			break;
		case tree_type:
			return "He looks aboves and sees a tree. ";
			break;
		case alphabet_type:
			return "He perceives that this space is filled with alphabets. ";
			break;
		case word_type:
			return "idk fam. "
			break;
	}*/
	return ""
}

var phrases = ["and rewrite you                                       ", "as if God Himself had decided to erase                ", "but it all seemed to fade into whitespace             ", "spoke with confidence, loud and red                   ", "and you tried. you raised your voice                  ", "to see the forest for the trees                       ", "to rip away whatever fears you’d stapled to your chest", "she told you to let in the light                      ", "too linear.                                           ", "and told you it was too sad                           ", "the night your mother read your first published story ", "and written into footnotes.                           ", "before you were punctured by asterisks                ", "the last time you were here was years ago             "];

function getFormerString(type) {
	switch (type) {
		case player_type:
			return "************************** ";
			break;
		case line_type:
			return "look behind you ";
			break;
		case path_type:
			return "what do you see? "
		case tree_type:
			return "only traveler and tree ";
			break;
		case horizontal_path_type:
			return "an ink-speckled sky "
			break;
		case alphabet_type:
			return "a heartbeat "
			break;
		case word_type:
			return phrases.pop();
			break;
		case star_type:
			return "*";
			break;
		case help_type:
			return "Press 'f' to move forward. You cannot go back."
	}
}

var things = [];
var encounters = [false]; // length = # of types of things

function shuffle(a) {
    var j, x, i;
    for (i = a.length; i; i--) {
        j = Math.floor(Math.random() * i);
        x = a[i - 1];
        a[i - 1] = a[j];
        a[j] = x;
    }
}

// class thing
var thing = function(type, position) {
	this.ID = things.length;
	this.type = type;
	this.isDisplayed = false;
	this.isFormed = false;
	this.position = position;

	this.numLettersRequired;
	this.numLettersFormed = 0;
	this.positions = [];
	this.colors = [];

	switch (this.type) {
		case player_type:
			this.numLettersRequired = 295;
			this.isBlob = true;

			for (var x = 0; x < 100; x++) {
				var vec = new THREE.Vector3(
					Math.random() * 30 - 15,
					Math.random() * 30 - 15,
					Math.random() * 30 - 15
					);
				vec.setLength(15);
				vec.add(new THREE.Vector3(0, 80, 0));
				this.positions.push(vec);
				if (Math.random() > 0.5) {
					this.colors.push(0x000044);
				} else {
					this.colors.push(0x000022);
				}
			}

			for (var x = 0; x < 200; x++) {
				var vec = new THREE.Vector3(
					Math.random() * 30 - 15,
					Math.random() * 105 - 40,
					Math.random() * 30 - 15
					);
				this.positions.push(vec);
				if (Math.random() > 0.5) {
					this.colors.push(0x000033);
				} else {
					this.colors.push(0x000055);
				}
			}
			break;

		case line_type:
			this.numLettersRequired = 30;

			var bottom = new THREE.Vector3(this.position.x, this.position.y, this.position.z);
			var top = new THREE.Vector3(this.position.x, this.position.y + 100 + Math.random() * 100, this.position.z);

			var total = (this.numLettersRequired - 1);
			for (var x = 0; x <= total; x++) {
				this.positions.push(new THREE.Vector3(
					bottom.x + (top.x - bottom.x) * x / total,
					bottom.y + (top.y - bottom.y) * x / total,
					bottom.z + (top.z - bottom.z) * x / total
				));
				this.colors.push(0x000000);
			}
			shuffle(this.positions);
			break;

		case path_type:
			this.numLettersRequired = 77;

			var bottomLeftFront = new THREE.Vector3(this.position.x - 30, this.position.y - 5, this.position.z + 50);
			var topRightBack = new THREE.Vector3(this.position.x + 30, this.position.y + 5, this.position.z - 50);

			for (var x = bottomLeftFront.x; x <= topRightBack.x; x += 10) {
				for (var z = bottomLeftFront.z; z >= topRightBack.z; z -= 10) {
					this.positions.push(new THREE.Vector3(
						x + Math.random() * 20 - 10,
						this.position.y - Math.random() * 10,
						z + Math.random() * 20 - 10
						));
					var r = Math.floor(Math.random() * 3);
					switch (r) {
						case 0:
							this.colors.push(0x333333);
							break;

						case 1:
							this.colors.push(0x666666);
							break;

						case 2:
							this.colors.push(0x000000);
							break;
					}
				}
			}
			break;
		case horizontal_path_type:
			this.numLettersRequired = 60;

			var bottomLeftFront = new THREE.Vector3(this.position.x - 50, this.position.y - 5, this.position.z + 30);
			var topRightBack = new THREE.Vector3(this.position.x + 50, this.position.y + 5, this.position.z - 30);

			for (var x = bottomLeftFront.x; x <= topRightBack.x; x += 10) {
				for (var z = bottomLeftFront.z; z >= topRightBack.z; z -= 10) {
					this.positions.push(new THREE.Vector3(
						x + Math.random() * 20 - 10,
						this.position.y - Math.random() * 10,
						z + Math.random() * 20 - 10
						));
					var r = Math.floor(Math.random() * 3);
					switch (r) {
						case 0:
							this.colors.push(0x333333);
							break;

						case 1:
							this.colors.push(0x666666);
							break;

						case 2:
							this.colors.push(0x000000);
							break;
					}
				}
			}
			break;

		case alphabet_type:
			this.numLettersRequired = 1;

			this.positions.push(new THREE.Vector3(this.position.x, this.position.y, this.position.z));

			this.colors.push(0xff0000);

			break;

		case tree_type:
			var height = 50 + Math.random() * 100;
			this.numLettersRequired = 70;
			for (var y = 0; y < 70; y++) {
				this.positions.push(new THREE.Vector3(
					this.position.x + Math.random() * 4 - 2,
					this.position.y + y / 30 * height + Math.random() * 4 - 2,
					this.position.z + Math.random() * 4 - 2
					));
				var r = Math.floor(Math.random() * 3);
				if (r == 0) {
					this.colors.push(0x002200);
				}
				else if (r == 1) {
					this.colors.push(0x001100);
				}
				else if (r == 2) {
					this.colors.push(0x000000);
				}
			}

			var climberY = 0;
			var numBranches = Math.floor(Math.random() * 5) + 10;
			for (var b = 0; b < numBranches; b++) {
				climberY += Math.random() * (height - climberY);
				var angle = Math.random() * Math.PI * 2;
				var riseY = Math.random() * climberY;
				var radius = Math.random() * climberY;

				var numNodesOnBranch = Math.floor(Math.random() * 10) + 10
				for (var c = 0; c < numNodesOnBranch; c++) {
					this.positions.push(new THREE.Vector3(
						this.position.x + Math.cos(angle) * radius * c / numNodesOnBranch,
						this.position.y + climberY + riseY * c / numNodesOnBranch,
						this.position.z + Math.sin(angle) * radius * c / numNodesOnBranch
						));
				}
				this.numLettersRequired += numNodesOnBranch;
			}
			break;
		case word_type:
			this.numLettersRequired = 54;

			var bottomLeftFront = new THREE.Vector3(this.position.x - 30, this.position.y - 5, this.position.z + 50);
			var topRightBack = new THREE.Vector3(this.position.x + 30, this.position.y + 5, this.position.z - 50);

			for (var x = bottomLeftFront.x; x <= topRightBack.x; x += 10) {
				for (var z = bottomLeftFront.z; z >= topRightBack.z; z -= 10) {
					this.positions.push(new THREE.Vector3(
						x + Math.random() * 20 - 10,
						this.position.y - Math.random() * 10,
						z + Math.random() * 20 - 10
						));
					var r = Math.floor(Math.random() * 3);
					switch (r) {
						case 0:
							this.colors.push(0xFF0000);
							break;

						case 1:
							this.colors.push(0xFF0000);
							break;

						case 2:
							this.colors.push(0xFF0000);
							break;
					}
				}
			}
			break;
		/*case help_type:
			this.numLettersRequired = 46;

			this.positions.push(new THREE.Vector3(
				100,
				100,
				100
				));
			this.colors.push(0x000000);
			break;*/
		case star_type:
			this.numLettersRequired = 1;

			this.positions.push(new THREE.Vector3(this.position.x, this.position.y, this.position.z));

			this.colors.push(0x000000);

			break;
	}
}

thing.prototype.assignNewDestination = function() {
	if (!this.isBlob) {
		return;
	}

	if (this.type == player_type) {
		var r = Math.floor(Math.random() * 50);
		if (r == 0) {
			var vec = new THREE.Vector3(
				Math.random() * 30 - 15,
				Math.random() * 30 - 15,
				Math.random() * 30 - 15
				);
			vec.setLength(15);
			vec.add(new THREE.Vector3(0, 80, 0));
			vec.add(this.position);
			return vec;
		} else {
			var vec = new THREE.Vector3(
				Math.random() * 30 - 15,
				Math.random() * 105 - 40,
				Math.random() * 30 - 15
				);
			vec.x *= Math.cos(((vec.y + 40) / 75) * Math.PI / 2);
			vec.z *= Math.cos(((vec.y + 40) / 75) * Math.PI / 2);
			vec.add(this.position);
			return vec;
		}
	}
}

// 0 = east
// 1 = north
// 2 = west
// 3 = south

var eastOkay = false;
var northOkay = false;
var westOkay = false;
var southOkay = false;

var forwardOkay = false;
var leftOkay = false;
var backOkay = false;
var rightOkay = false;

var map = [
	new THREE.Vector3(0, -40, 0),
	new THREE.Vector3(400, -40, 0),
	new THREE.Vector3(800, -40, 0),
	new THREE.Vector3(1200, -40, 0),
	new THREE.Vector3(1600, -40, 0),
	new THREE.Vector3(2000, -40, 0),
	new THREE.Vector3(2400, -40, 0),
	new THREE.Vector3(2800, -40, 0),
	new THREE.Vector3(3200, -40, 0),
	new THREE.Vector3(3600, -40, 0),
	new THREE.Vector3(4000, -40, 0),
	new THREE.Vector3(4400, -40, 0),
	new THREE.Vector3(4800, -40, 0),
	new THREE.Vector3(5200, -40, 0),
  new THREE.Vector3(5600, -40, 0)
];
var coordsMap = [
	[0, 0],
	[1, 0],
	[2, 0],
	[3, 0],
	[4, 0],
	[5, 0],
	[6, 0],
	[7, 0],
	[8, 0],
	[9, 0],
	[10, 0],
	[11, 0],
	[12, 0],
	[13, 0],
	[14, 0],
	[15, 0]
];

function getMapIndexFromCoords(x, z) {
	for (var i = 0; i < coordsMap.length; i++) {
		if (coordsMap[i][0] == x && coordsMap[i][1] == z) {
			return i;
		}
	}
}

var currentDirection = 0;
var currentCoordX = 0;
var currentCoordZ = 0;
var playerPosition = 0;
var visibility = 400;

function makeTreesAndLinesBetween(v1, v2) {
	var trees = Math.floor(Math.random() * 3);
	for (var t = 0; t < trees; t++) {
		var f = Math.random();
		makeThing(tree_type, new THREE.Vector3(
			v1.x + (v2.x - v1.x) * f,
			v1.y + (v2.y - v1.y) * f,
			v1.z + (v2.z - v1.z) * f
			));
	}

	var lines = Math.floor(Math.random() * 7);
	for (var l = 0; l < lines; l++) {
		var f = Math.random();
		makeThing(line_type, new THREE.Vector3(
			v1.x + (v2.x - v1.x) * f,
			v1.y + (v2.y - v1.y) * f,
			v1.z + (v2.z - v1.z) * f
			));
	}
}

function makeThing(type, position) {
	things.push(new thing(type, position));
}

makeThing(player_type, new THREE.Vector3(0, -100, 0));
makeThing(word_type, new THREE.Vector3(0, 200, 100))
makeThing(path_type, new THREE.Vector3(0, -100, 0));

/*makeThing(help_type, new THREE.Vector3(0, 0, 0));*/

var start_lol = 400;
for (var i = 0; i < 20; i++) {
	makeThing(word_type, new THREE.Vector3(start_lol, 200, 100));
	start_lol += 400;
}

var start = 0;
for (var i = 0; i < 20; i++) {
	/*if (start > 0) {
		makeThing(word_type, new THREE.Vector3(start, 200, 100));
	}*/
	for (var j = 1; j <= 4; j++) {
		makeThing(horizontal_path_type, new THREE.Vector3(start + 100*j, -100, 0));
	}
	makeTreesAndLinesBetween(new THREE.Vector3(start, -100, -70), new THREE.Vector3(start+400, -100, -70));
	makeTreesAndLinesBetween(new THREE.Vector3(start, -100, 70), new THREE.Vector3(start+400, -100, 70));
	start += 400;
}

var scene_type = 0;
var console_type = 1;

// class letter
// parameter character must be of length 1
// parameter font must be loaded font
var letter = function(type, character, font) {
	this.type = type;
	this.text = character; // the actual character

	this.thingID = -1; // the ID of the thing (potentially) formed by this character

	this.position = new THREE.Vector3(0, 0, 0);
	this.velocity = new THREE.Vector3(0, 0, 0);
	this.destination = new THREE.Vector3(0, 0, 0);
	this.speed = Math.random() * 1 + 5;

	this.isFree = false;
	this.isDead = false;

	this.geometry;
	if (this.type == scene_type) {
		this.geometry = getSmallTextGeometry(this.text);
	}
	/* else if (this.type == alphabet_type) {
		this.geometry = getRandomGiantTextGeometry(this.text);
	} */
	else {
		this.geometry = getLargeTextGeometry(this.text);
	}
	this.material = new THREE.MeshBasicMaterial({
		color: 0x000000,
		transparent: true,
		opacity: 0
	});
	this.mesh = new THREE.Mesh(this.geometry, this.material);

	this.width = 0;

	this.randomFactor = Math.random() - 0.5;

	// console letters
	this.consoleTickElapsed = 0;
	this.consoleLineIndex = 0;

	// scene letters
	this.sceneTick = 0;
	this.sceneTickToForm = 100;
	this.sceneArrived = false;

	// snowflakes
	this.isSnowflake = false;
}

letter.prototype.calculateWidth = function() {
	this.geometry.computeBoundingBox();
	this.width = this.geometry.boundingBox.max.x - this.geometry.boundingBox.min.x;
}

letter.prototype.setPosition = function(x, y, z) {
	this.position = new THREE.Vector3(x, y, z);
	this.mesh.position.set(this.position.x, this.position.y, this.position.z);
}

letter.prototype.setDestination = function(x, y, z) {
	this.destination = new THREE.Vector3(x, y, z);
}

letter.prototype.update = function() {
	// kept stars from moving off screen (julia)
	if (this.isFree && this.type != star_type) {
		this.material.opacity -= 0.01;
		if (this.material.opacity < 0.05) {
			this.isDead = true;
		}

		if (this.type == console_type) {
			this.velocity.add(new THREE.Vector3(Math.random() - 0.5, Math.random() * 0.5, Math.random() - 0.5)) * 0.5;
			if (this.velocity.length() > this.speed) {
				this.velocity.setLength(this.speed);
			}

			this.position.add(this.velocity);
			this.mesh.position.set(this.position.x, this.position.y, this.position.z);
		} else {
			this.velocity.add(new THREE.Vector3(Math.random() - 0.5, Math.random() * 0.5, Math.random() - 0.5)) * 0.5;
			if (this.velocity.length() > this.speed) {
				this.velocity.setLength(this.speed);
			}

			this.position.add(this.velocity);
			this.mesh.position.set(this.position.x, this.position.y, this.position.z);
		}
	}
	else
	{
		this.material.opacity += 0.1;
		if (this.material.opacity > 1) {
			this.material.opacity = 1;
		}
		// if (this.type == console_type) {
			this.velocity.subVectors(this.destination, this.position);
			this.velocity.divideScalar(10);
			if (this.velocity.length() > this.speed) {
				this.velocity.setLength(this.speed);
			}

			this.position.add(this.velocity);
			this.mesh.position.set(this.position.x, this.position.y, this.position.z);
		// }

		if (this.type == scene_type) {
			this.sceneTickToForm--;
			this.sceneTick++;

			if (this.sceneTickToForm <= 0) {
				// stopped rotating letters (julia)
				//this.mesh.rotation.y = this.sceneTick * this.randomFactor * 0.01;

				if (this.mesh.position.distanceTo(this.destination) < 2) {
					this.sceneArrived = true;
				}
			}
		}
	}
}

letter.prototype.free = function() {
	this.isFree = true;
}

var sceneLetters = [];
var consoleLetters = [];

var sceneString = "";
var consoleString = "";

// julia for some reason height of original text??
var reserveX = 200;
var reserveY = 200;
var currentReserveX = reserveX;
var currentReserveY = reserveY;
var reserveWidth = 280;
var reserveShift = 200;

function addReserveString(s, id, type, position) {
	/*if (type == help_type) {
		console.log("help");
		var l = new letter(scene_type, s[i], font);
		l.thingID = id;
		l.setPosition(0,0,0);

		scene.add(l.mesh);
		sceneLetters.push(l);
	}*/
	for (var i = 0; i < s.length; i++) {
		var l = new letter(scene_type, s[i], font);
		l.thingID = id;
		l.setDestination(currentReserveX, currentReserveY, 0);
		l.setPosition(currentReserveX, currentReserveY - 20 - Math.random() * 5, 0);

		scene.add(l.mesh);
		sceneLetters.push(l);

		currentReserveX += letterWidth * reserveMultiplier;
		if (currentReserveX >= reserveX + reserveWidth) {
			currentReserveX = reserveX;
			currentReserveY -= letterHeight;
		}

		// alert("reset us senpai!");
	}
}

var consoleX = -300;
var consoleY = 200;
var currentConsoleX = consoleX;
var currentConsoleY = consoleY;
var currentLineIndex = 0;
var consoleWidth = 250;
var consoleHeight = -100;
var letterSpacing = 0.275;
var letterWidth = 0;

var gameOver = false;
var playerReadyToMove = false;
var playerMakingMove = false;
var playerMadeMove = false;

function checkDisplayAndStuff() {
	for (var i = 0; i < consoleLetters.length; i++) {
		consoleLetters[i].free();
	}

	var player = things[0];
	for (var i = 0; i < things.length; i++) {
		var t = things[i];
		var dist = t.position.distanceToSquared(player.position);
		if (i == 0 || dist <= visibility * visibility) {
			t.isDisplayed = true;

			if (!encounters[t.type]) {
				encounters[t.type] = true;
				//addConsoleString(getIntroString(t.type));
			}

			if (!t.isFormed) {
				t.isFormed = true;
				var numLetters = t.numLettersRequired;
				formerString = getFormerString(t.type);
				var numLettersPerString = formerString.length;
				var numStrings = Math.ceil(numLetters / numLettersPerString);
				for (var x = 0; x < numStrings; x++) {
					addReserveString(formerString, t.ID, t.type, t.position);
				}
			}
		} // julia: this is why stuff disappears behind you
		else if (t.type != star_type) {
			t.isDisplayed = false;
			if (t.isFormed) {
				t.isFormed = false;
				for (var j = 0; j < sceneLetters.length; j++) {
					var nl = sceneLetters[j];
					if (nl.thingID == t.ID && t.type != word_type) {
						nl.free();
					}
				}
				t.numLettersFormed = 0;
			}
		}
	}

	playerReadyToMove = true;
}

function init(font) {
	var l = new letter(console_type, "a", font);
	l.calculateWidth();
	letterWidth = l.width;

	// main code

	// check which things to display
	// accordingly introduce new things with addConsoleString
	// form the to-be-displayed things, free the no-longer-displayed things
	checkDisplayAndStuff();

	// ask the player to make a move
}

function addConsoleString(s) {
	for (var i = 0; i < s.length; i++) {
		if (s[i] != "\n") {
			var l = new letter(console_type, s[i], font);
			// Change console text position (julia)
			l.setDestination(currentConsoleX, currentConsoleY, -100);
			l.setPosition(currentConsoleX, currentConsoleY + Math.random() - 0.5, -100);
			l.consoleLineIndex = currentLineIndex;

			consoleScene.add(l.mesh);
			consoleLetters.push(l);

			// keep console from continually shifting (julia)
			currentConsoleX += letterWidth;
			if (currentConsoleX >= consoleX + consoleWidth - 5 && s[i] == " ") {
				currentConsoleX = consoleX;
				currentConsoleY -= letterHeight * 1.3;
				currentLineIndex++;
			}
		} else {
			currentConsoleX = consoleX;
			currentConsoleY -= letterHeight * 1.3;
			currentLineIndex++;
		}

		if (currentConsoleY < consoleY + consoleHeight) {
			//currentConsoleY -= letterHeight * 1.3;
			currentConsoleY = consoleY;
			currentLineIndex--;

			for (var j = 0; j < consoleLetters.length; j++) {
				var nl = consoleLetters[j];
				if (nl.consoleLineIndex == 0) {
					nl.free();
				} else {
					nl.destination.add(new THREE.Vector3(0, letterHeight * 1.3, 0));
					nl.consoleLineIndex--;
				}
			}
		}
	}
}

var tick = 0;

function render() {
	requestAnimationFrame(render);

	renderer.clear();
	renderer.setViewport(0, 0, window.innerWidth, window.innerHeight);
	renderer.render(consoleScene, consoleCamera);

	renderer.clearDepth();
	renderer.setViewport(0, 0, window.innerWidth, window.innerHeight);
	renderer.render(scene, camera);

	tick++;
	camera.position.x += (cameraPosition.x - camera.position.x) / 50;
	camera.position.y += (cameraPosition.y - camera.position.y) / 50;
	camera.position.z += (cameraPosition.z - camera.position.z) / 50;

	//camera.rotation.x += (rotationX - camera.rotation.x) / 20;
	//camera.rotation.y += ((cameraYRotation + rotationY) - camera.rotation.y) / 20;
	// julia changed how quickly camera rotated
	camera.rotation.x += (rotationX - camera.rotation.x)/10;
	camera.rotation.y += ((cameraYRotation + rotationY) - camera.rotation.y)/10;

	for (var iter = 0; iter < 1; iter++) {
		var flake = new letter(console_type, "abcdefghijklmnopqrstuvwxyz"[Math.floor(Math.random() * 26)], font);
		flake.isSnowflake = true;
		flake.setPosition(Math.random() * 1600, 300, Math.random() * 1600 - 800);
		flake.setDestination(flake.position.x + Math.random() * 100 - 50, -200, flake.position.z + Math.random() * 100 - 50);
		flake.speed = 2;

		var color;
		var r = Math.floor(Math.random() * 3);
		if (r == 0) {
			color = 0xdddddd;
		}
		else if (r == 1) {
			color = 0xcccccc;
		}
		else if (r == 2) {
			color = 0xaaaaaa;
		}

		flake.mesh.material.color.setHex(color);
		scene.add(flake.mesh);
		consoleLetters.push(flake);
	}

	if (tick == 10) {
		for (var iter = 0; iter < 2500; iter++) {
			var l = new letter(star_type, "*", font);
			var x = Math.random() * 10000 - 2000;
			var y = 250;
			var z = Math.random() * 2000 - 1000;
			l.setDestination(x, y, z);
			l.setPosition(x, y, z);
			l.mesh.material.color.setHex(0x000000);
			scene.add(l.mesh);
			consoleLetters.push(l);
		}
	}

	for (var i = 0; i < consoleLetters.length; i++) {
		var l = consoleLetters[i];
		if (l.isDead) {
			scene.remove(l.mesh);
			consoleLetters.splice(i, 1);
		}
		if (l.isSnowflake && l.position.y < -100) {
			l.free();
		}
		l.update();
	}

	for (var i = 0; i < sceneLetters.length; i++) {
		var l = sceneLetters[i];
		if (l.isDead) {
			scene.remove(l.mesh);
			sceneLetters.splice(i, 1);
		}
		else if ((l.sceneTickToForm == 0) && l.text != " ") {
			l.sceneTickToForm = -1;
			// move them towards characters!
			var t = things[l.thingID];
			if (t.numLettersFormed < t.numLettersRequired) {
				var newDest = t.positions[t.numLettersFormed];
				newDest.add(new THREE.Vector3(
					Math.random() * 4 - 2,
					Math.random() * 4 - 2,
					Math.random() * 4 - 2
					));
				l.mesh.material.color.setHex(t.colors[t.numLettersFormed]);
				// below commented out in order to keep letters from moving (julia)
				//l.setDestination(newDest.x, newDest.y, newDest.z);
				if (t.type != word_type /*&& t.type != help_type*/) {
					l.setDestination(newDest.x, newDest.y, newDest.z);
				}

				t.numLettersFormed++;
			}
			else
			{
				l.free();
			}
		} else if (l.sceneArrived) {
			var t = things[l.thingID];
			if (t.isBlob) {
				var newDest = t.assignNewDestination();
				l.setDestination(newDest.x, newDest.y, newDest.z);
				l.sceneArrived = false;
			}
		}
		l.update();
	}

	if (playerReadyToMove) {
		if (!playerMakingMove) {
			//addConsoleString("\nThe player...\n");

			eastOkay = false;
			northOkay = false;
			westOkay = false;
			southOkay = false;

			forwardOkay = false;
			leftOkay = false;
			backOkay = false;
			rightOkay = false;

			forwardOkay = true;
			backOkay = true;

			playerMakingMove = true;
		}
	}

	if (playerMadeMove) {
		playerReadyToMove = false;
		playerMakingMove = false;
		playerMadeMove = false;

		// julia check this out for new text?
		// senpai will reset you
		currentReserveX = map[playerPosition].x + reserveShift;
		currentReserveY = map[playerPosition].y + reserveShift;
		reserveX = currentReserveX;
		reserveY = currentReserveY;

		checkDisplayAndStuff();
	}

	for (var i = 0; i < arrayOfAlphabets.length; i++) {
		arrayOfAlphabets[i].rotation.y += .02;
	}

}

render();

// CR-someday jhou: Don't hardcode
$("body").on("mousemove", function(event) {
  //rotationY = -0.389;
  //rotationX = 0.0465;

  //rotationX = -0.1935;
  //rotationY = -0.144;

  if (window.innerWidth < 500) {
  rotationX = 0.0225;
  rotationY = 0.286;
    //console.log("mobile");
    //console.log(window.innerWidth);
  } else {
//console.log("not mobile");
  //  console.log(window.innerWidth);
  rotationY = -(event.pageX - window.innerWidth / 2) * 0.001;
	rotationX = -(event.pageY - window.innerHeight / 2) * 0.001;
  }
    //console.log(rotationX);
  //console.log(rotationY);
});

var zoomed = true;

// CR-someday jhou: Unclear why this simplified version of [move_forward]
// doesn't work properly.
/*function move_forward(event) {
  currentCoordX++;
  console.log("here")
  console.log(currentCoordX);
  playerPosition = getMapIndexFromCoords(currentCoordX, currentCoordZ);

	var movement = new THREE.Vector3();
	movement.subVectors(map[playerPosition], things[0].position);

	things[0].position.add(movement);

	cameraPosition.add(movement);
}*/
function move_forward(event) {
    result = 0;
		if (playerMakingMove) {
			if ((!playerMadeMove) && (result != -3)) {
				playerMadeMove = true;

				currentDirection += result;
				currentDirection %= 4;

				if (currentDirection % 4 == 0) {
					currentCoordX++;
				}
				else if (currentDirection % 4 == 1) {
					currentCoordZ--;
				}
				else if (currentDirection % 4 == 2) {
					currentCoordX--;
				}
				else if (currentDirection % 4 == 3) {
					currentCoordZ++;
				}
				playerPosition = getMapIndexFromCoords(currentCoordX, currentCoordZ);

				var movement = new THREE.Vector3();
        console.log(map[playerPosition], things[0].position);
				movement.subVectors(map[playerPosition], things[0].position);

				things[0].position.add(movement);

				if (result == 0) {
					cameraPosition.add(movement);
				}
				else if (result == 1) {
					cameraFollowsLeftTurn(playerPosition);
				}
				else if (result == 2) {
					cameraPosition.add(movement);
				}
				else if (result == 3) {
					cameraFollowsRightTurn(playerPosition);
				}
			}
		}
}

// CR-someday jhou: attach zoom to a keypress
function zoom(event) {
	if (zoomed) {
		cameraDistance = 350;
		zoomed = false;
	} else {
		cameraDistance = 250;
		zoomed = true;
	}
	cameraPosition.z = cameraDistance;
	camera.position.z = cameraDistance;
}

$("body").on("click", move_forward);
