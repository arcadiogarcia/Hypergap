var canvas = document.getElementById("canvas");
var context = canvas.getContext("2d");

var width = window.innerWidth;
var height = window.innerHeight;

canvas.width = width;
canvas.height = height;

var radius = canvas.width / 1000;

var xsquares = 10;
var ysquares = 10;
var nstars = 200;
var squaresizex = width / xsquares;
var squaresizey = height / ysquares;

var stars = [];

for (var i = 0; i < nstars; i++) {
    var square = Math.floor(i / (nstars / (xsquares * ysquares)));
    var squarex = square % xsquares;
    var squarey = Math.floor(square / xsquares);


    var x = squarex * squaresizex + Math.random() * squaresizex;
    var y = squarey * squaresizey + Math.random() * squaresizey;
    var z = 1 + Math.random();
    var r = (Math.random() * 255) | 0;
    var g = (Math.random() * 255) | 0;
    var t = 50 + Math.random() * 50;

    stars.push({ x: x, y: y, z: z, r: r, g: g, t: t });
}

var t = 0;

function draw() {
    context.fillStyle = "#030303";
    if (exit == true) {
        context.globalAlpha=0.1;
    }
    context.fillRect(0, 0, width, height);
    context.globalAlpha=1;
    var base_radius;
    stars.forEach(function (s) {
        var x = s.x, y = s.y;
        base_radius = 2 + Math.floor(radius * s.z * (0.5 + Math.sin(2 * Math.PI * (t % s.t) / s.t)));
        if (exit === true) {
            var cx = width * 0.63, cy = height * 0.7;
            var scale = Math.pow(1.05, exittimer) / 20 + 1;
            x = (x - cx) * scale + cx;
            y = (y - cy) * scale + cy;
            base_radius *= scale;
        }

        context.globalAlpha=1-Math.sin(2 * Math.PI * (t % s.t) / s.t);
        context.fillStyle = "rgba(" + s.r + "," + s.g + "," + (s.r + s.g) + ",0.4)";
        context.beginPath();
        context.arc(x, y, base_radius * 2, 0, 2 * Math.PI, false);
        context.fill();

        context.fillStyle = "rgba(" + s.r + "," + s.g + "," + (s.r + s.g) + ",0.6)";
        context.beginPath();
        context.arc(x, y, base_radius, 0, 2 * Math.PI, false);
        context.fill();

        context.globalAlpha=1;
        context.fillStyle = "#FFF";
        context.beginPath();
        context.arc(x, y, base_radius / 2, 0, 2 * Math.PI, false);
        context.fill();

        s.y += s.z;
        if (s.y > height) {
            s.y -= height;
        }
    });
    t += 1;

    drawGAP([
        { x: 0.65, y: 0.25 },
        { x: 0.7, y: 0.65 },
        { x: 0.68, y: 0.6 },
        { x: 0.57, y: 0.9 },
        { x: 0.55, y: 0.5 },
        { x: 0.59, y: 0.54 },
    ]);

    drawTitle(t);
    exittimer++;
    if(exittimer>150){
        window.location="menu.html";
    }
    requestAnimationFrame(draw);
}
draw();


function drawGAP(p) {
    context.fillStyle = "#000";
    context.beginPath();
    var p0 = p.shift();
    if (exit === true) {
        var cx = width * 0.625, cy = height * 0.7;
        var scale = Math.pow(1.05, exittimer) / 20 + 1;
        context.moveTo(((width * p0.x) - cx) * scale + cx, ((height * p0.y) - cy) * scale + cy);
        p.forEach(function (x) { context.lineTo(((width * x.x) - cx) * scale + cx, ((height * x.y) - cy) * scale + cy); });
    } else {
        context.moveTo(width * p0.x, height * p0.y);
        p.forEach(function (x) { context.lineTo(width * x.x, height * x.y); });
    }
    context.closePath();
    context.fill();
    context.strokeStyle="#111";
    context.lineWidth=2;
    context.stroke();
};


function drawTitle(t) {
    var t1 = 40, t2 = 40, w = 2;
    if (t < t1) {
        context.globalAlpha=1-t/(t1+t2);
        context.fillRect(0, 0, width, height);
        context.globalAlpha=1;
        context.save();
        context.beginPath();
        context.moveTo(width * 0.7 - t * width * 0.4 / t1, 0);
        context.lineTo(width * 0.7 - t * width * 0.4 / t1 + w, 0);
        context.lineTo(width * 0.7 - t * width * 0.4 / t1 - 5 * w, height);
        context.lineTo(width * 0.7 - t * width * 0.4 / t1 - 6 * w, height);
        context.clip();
        context.strokeStyle = "#FFF";
        context.lineWidth = 5;
        context.font = "100px Xolonium";
        context.textAlign = "center";
        context.textBaseline = "middle";
        context.strokeText("hyper", width / 2 - 30, height / 2 - 100);
        context.strokeText("gap", width / 2 + 80, height / 2 - 40);
        context.restore();
        context.fillStyle = "#FFF";
        context.fillStyle = "#000";
    } else if (t < t1 + t2) {
        context.globalAlpha=1-t/(t1+t2);
        context.fillRect(0, 0, width, height);
        context.globalAlpha=1;
        context.save();
        context.beginPath();
        context.moveTo(width * 0.3, 0);
        context.lineTo(width * 0.3 + (t - t1) * width * 0.4 / t2 + w, 0);
        context.lineTo(width * 0.3 + (t - t1) * width * 0.4 / t2 - 5 * w, height);
        context.lineTo(width * 0.3, height);
        context.clip();
        context.strokeStyle = "#AAA";
        context.lineWidth = 5;
        context.font = "100px Xolonium";
        context.textAlign = "center";
        context.textBaseline = "middle";
        context.fillStyle = "#FFF";
        context.fillText("hyper", width / 2 - 30, height / 2 - 100);
        context.fillText("gap", width / 2 + 80, height / 2 - 40);
        context.strokeText("hyper", width / 2 - 30, height / 2 - 100);
        context.strokeText("gap", width / 2 + 80, height / 2 - 40);
        context.restore();

        context.save();
        context.beginPath();
        context.moveTo(width * 0.3 + (2 + t - t1) * width * 0.4 / t2, 0);
        context.lineTo(width * 0.3 + (2 + t - t1) * width * 0.4 / t2 + w, 0);
        context.lineTo(width * 0.3 + (2 + t - t1) * width * 0.4 / t2 - 5 * w, height);
        context.lineTo(width * 0.3 + (2 + t - t1) * width * 0.4 / t2 - 6 * w, height);
        context.clip();
        context.strokeStyle = "#AAA";
        context.lineWidth = 5;
        context.font = "100px Xolonium";
        context.textAlign = "center";
        context.textBaseline = "middle";
        context.fillStyle = "#FFF";
        context.strokeText("hyper", width / 2 - 30, height / 2 - 100);
        context.strokeText("gap", width / 2 + 80, height / 2 - 40);
        context.restore();
    } else {
        if (exit != true) {
            exit = false;
        }
        context.fillStyle = "#FFF";
        context.strokeStyle = "#222";
        context.lineWidth = 5;
        context.font = "100px Xolonium";
        context.textAlign = "center";
        context.textBaseline = "middle";
        var x1 = width / 2 - 30, x2 = width / 2 + 80, y1 = height / 2 - 100, y2 = height / 2 - 40;
        if (exit === true) {
            var cx = width * 0.62, cy = height * 0.44;
            var scale = Math.pow(1.2, exittimer) / 20 + 1;
            x1 = (x1 - cx) * scale + cx;
            y1 = (y1 - cy) * scale + cy;
            x2 = (x2 - cx) * scale + cx;
            y2 = (y2 - cy) * scale + cy;
            context.font = (100*scale)+"px Xolonium";
        }
        context.fillText("hyper", x1, y1);
        context.fillText("gap", x2, y2);
        context.strokeText("hyper", x1, y1);
        context.strokeText("gap", x2, y2);
    }
};


var exittimer, exit;
document.addEventListener("keydown", function () {
    if (exit === false) {
        exit = true;
        exittimer = 0;
    }
});

document.addEventListener("click", function () {
    if (exit === false) {
        exit = true;
        exittimer = 0;
    }
});