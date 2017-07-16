// var topLeft = new Point(200, 200);
// var size = new Size(150, 100);
// var rectangle = new Path.Rectangle(topLeft, size);
// //var path = new Path.Ellipse(rectangle);
// rectangle.strokeColor = 'black';

//         var topLeft = new Point(5, 400);
//         var size = new Size(100, 50);
//         var rectangle = new Rectangle(topLeft, size);
//         var path = new Path.Ellipse(rectangle);
//         path.fillColor = 'yellow';

//         var path = new Path.Circle(new Point(50, 50), 25);
//         path.fillColor = 'red';
//         window._json = project.exportJSON();
//         console.log(window._json);
fullData.sort(function(a, b){return b.year-a.year});


var tree = {};

//create tree
for(var i in fullData) {
        var item = fullData[i];
        //add place
        if(tree[item.place] == null) {
                tree[item.place] = {};
        }
        //add person
        if(tree[item.place][item.ID] == null) {
                tree[item.place][item.ID] = [];
        }
        //insert item
        tree[item.place][item.ID].push(item);
}

//now use the tree to create treemaps
var totalPadding = 20;
var totalx = totalPadding;
var totaly = totalPadding;


for(var place in tree) {

        //calc tot size in items
        var totItems = 0;
        for(var person in tree[place]) {
                totItems += tree[place][person].length;
        }
        //define the side size
        var itemSize = 10;
        var padding = 4;

        var side = Math.ceil(Math.sqrt(totItems));
        var sideSize = side * (itemSize + padding) + padding;


        //add the name
        var text = new PointText(new Point(totalx, totaly));
        totaly += text.bounds.height + totalPadding;

        text.fillColor = 'black';
        text.content = place;
        console.log(place);
        var rowheight = 0;

        for(var person in tree[place]) {
                console.log(" - " + person);
                //draw treemap
                var q = new QuantumTree(totalx,totaly,tree[place][person], person);
                rowheight = rowheight > q.height ? rowheight : q.height;
                totalx +=  q.size;
                if(totalx > sideSize) {
                        totalx = totalPadding;
                        totaly += rowheight;
                        rowheight = 0;
                }
        }
        totalx = totalPadding;
        totaly += rowheight + totalPadding;
}

document.body.appendChild(project.exportSVG());


function QuantumTree(_x, _y, _objects, _name){

        var hNum = Math.ceil(Math.sqrt(_objects.length));
        //height, if the result is an integer
        var vNum = Math.ceil(_objects.length/hNum);

        var itemSize = 10;
        var padding = 4;

        this.size = hNum * (itemSize + padding);
        this.height = vNum * (itemSize + padding);

        console.log()

        console.log('nuova quantum')
        console.log(_objects)

        var group = new Group();
        group.id = person;
        //
        // make the  outer container
        var topLeft = new Point(_x, _y);
        var rectSize = new Size(this.size, this.height);
        var rect1 = new Path.Rectangle(topLeft, rectSize);
        rect1.strokeColor = '#706f6f';
        //make the inner container
        // var topLeft = new Point(_x + padding/2, _y + padding/2);
        // var rectSize = new Size(this.size-padding, this.height-padding);
        // var rect2 = new Path.Rectangle(topLeft, rectSize);
        // rect2.strokeColor = 'black';

        group.addChild(rect1);
        //group.addChild(rect2);

        //draw the items
        var xpos = _x + padding/2 + itemSize/2;
        var ypos = _y + padding/2 + itemSize/2;
        for(var oname in _objects) {
                var obj = _objects[oname];
                var c;
                if(obj.type == 'ricevuta') {
                        var c = new Path.Circle(new Point(xpos, ypos), itemSize/2);
                } else {
                        //var c = new Path.RegularPolygon(new Point(xpos, ypos), 3, itemSize/2);
                        var c = new Path();
                        c.add(new Point(xpos, ypos - itemSize/2));
                        c.add(new Point(xpos + itemSize/2, ypos + itemSize/2));
                        c.add(new Point(xpos - itemSize/2, ypos + itemSize/2));
                }
                // c.strokeColor = 'red';
                //set color
                var colors = {
                        'now':'#bd0026',
                        'medium':'#fd8d3c',
                        'past':'#fecc5c'
                }
                c.fillColor = colors[obj.cat];

                group.addChild(c);

                xpos += itemSize + padding;
                if(xpos > this.size + _x) {
                        xpos = _x + padding/2 + itemSize/2;
                        ypos += itemSize + padding;
                }
        }
}