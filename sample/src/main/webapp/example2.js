var labelType, useGradients, nativeTextSupport, animate;

(function() {
  var ua = navigator.userAgent,
      iStuff = ua.match(/iPhone/i) || ua.match(/iPad/i),
      typeOfCanvas = typeof HTMLCanvasElement,
      nativeCanvasSupport = (typeOfCanvas == 'object' || typeOfCanvas == 'function'),
      textSupport = nativeCanvasSupport 
        && (typeof document.createElement('canvas').getContext('2d').fillText == 'function');
  //I'm setting this based on the fact that ExCanvas provides text support for IE
  //and that as of today iPhone/iPad current text support is lame
  labelType = (!nativeCanvasSupport || (textSupport && !iStuff))? 'Native' : 'HTML';
  nativeTextSupport = labelType == 'Native';
  useGradients = nativeCanvasSupport;
  animate = !(iStuff || !nativeCanvasSupport);
})();

var Log = {
  elem: false,
  write: function(text){
    if (!this.elem) 
      this.elem = document.getElementById('log');
    this.elem.innerHTML = text;
    this.elem.style.left = (500 - this.elem.offsetWidth / 2) + 'px';
  }
};


function init(){
  // init data
  var json = [
     
      { "adjacencies": [
                      {
                        "nodeTo": "Square", 
                        "nodeFrom": "Geometry", 
                        "data": {}
                      }, 
                      {
                        "nodeTo": "Triangle", 
                        "nodeFrom": "Geometry", 
                        "data": {}
                      }, 
                      {
                        "nodeTo": "Rhombus", 
                        "nodeFrom": "Geometry", 
                        "data": {}
                      }, 
                      {
                        "nodeTo": "Trapezoid", 
                        "nodeFrom": "Geometry", 
                        "data": {}
                      }, 
                      {
                        "nodeTo": "Rectangle", 
                        "nodeFrom": "Geometry", 
                        "data": {}
                      }, 
                      {
                        "nodeTo": "Quadraletral", 
                        "nodeFrom": "Geometry", 
                        "data": {}
                      }
                    ], 
                    "data": {
                      "$color": "#70A35E", 
                      "$type": "triangle"
                    }, 
                    "id": "Geometry Class", 
                    "name": "Geometry Class"
                  }
      
   
  ];
  // end
  // init ForceDirected
  var fd = new $jit.ForceDirected({
    //id of the visualization container
    injectInto: 'infovis',
    //Enable zooming and panning
    //with scrolling and DnD
    Navigation: {
      enable: true,
      type: 'Native',
      //Enable panning events only if we're dragging the empty
      //canvas (and not a node).
      panning: 'avoid nodes',
      zooming: 10 //zoom speed. higher is more sensible
    },
    // Change node and edge styles such as
    // color and width.
    // These properties are also set per node
    // with dollar prefixed data-properties in the
    // JSON structure.
    Node: {
      overridable: true,
      dim: 7
    },
    Edge: {
      overridable: true,
      color: '#23A4FF',
      lineWidth: 0.4
    },
    // Add node events
    Events: {
      enable: true,
      type: 'Native',
      //Change cursor style when hovering a node
      onMouseEnter: function() {
        fd.canvas.getElement().style.cursor = 'move';
      },
      onMouseLeave: function() {
        fd.canvas.getElement().style.cursor = '';
      },
      //Update node positions when dragged
      onDragMove: function(node, eventInfo, e) {
        var pos = eventInfo.getPos();
        node.pos.setc(pos.x, pos.y);
        fd.plot();
      },
      //Implement the same handler for touchscreens
      onTouchMove: function(node, eventInfo, e) {
        $jit.util.event.stop(e); //stop default touchmove event
        this.onDragMove(node, eventInfo, e);
      }
    },
    //Number of iterations for the FD algorithm
    iterations: 200,
    //Edge length
    levelDistance: 130,
    // This method is only triggered
    // on label creation and only for DOM labels (not native canvas ones).
    onCreateLabel: function(domElement, node){
      // Create a 'name' and 'close' buttons and add them
      // to the main node label
      var nameContainer = document.createElement('span'),
          closeButton = document.createElement('span'),
          style = nameContainer.style;
      nameContainer.className = 'name';
      nameContainer.innerHTML = node.name;
      closeButton.className = 'close';
      closeButton.innerHTML = 'x';
      domElement.appendChild(nameContainer);
      domElement.appendChild(closeButton);
      style.fontSize = "0.8em";
      style.color = "#ddd";
      //Fade the node and its connections when
      //clicking the close button
      closeButton.onclick = function() {
        node.setData('alpha', 0, 'end');
        node.eachAdjacency(function(adj) {
          adj.setData('alpha', 0, 'end');
        });
        fd.fx.animate({
          modes: ['node-property:alpha',
                  'edge-property:alpha'],
          duration: 500
        });
      };
      //Toggle a node selection when clicking
      //its name. This is done by animating some
      //node styles like its dimension and the color
      //and lineWidth of its adjacencies.
      nameContainer.onclick = function() {
        //set final styles
        fd.graph.eachNode(function(n) {
          if(n.id != node.id) delete n.selected;
          n.setData('dim', 7, 'end');
          n.eachAdjacency(function(adj) {
            adj.setDataset('end', {
              lineWidth: 0.4,
              color: '#23a4ff'
            });
          });
        });
        if(!node.selected) {
          node.selected = true;
          node.setData('dim', 17, 'end');
          node.eachAdjacency(function(adj) {
            adj.setDataset('end', {
              lineWidth: 3,
              color: '#36acfb'
            });
          });
        } else {
          delete node.selected;
        }
        //trigger animation to final styles
        fd.fx.animate({
          modes: ['node-property:dim',
                  'edge-property:lineWidth:color'],
          duration: 500
        });
        // Build the right column relations list.
        // This is done by traversing the clicked node connections.
        
/*
        jQuery.getJSON("http://www.khanacademy.org/api/v1/commoncore?lightweight=1&structured=1",
        		  {
        		  },
        		  function(data) {
        			     		        arr = []
        		        for(var event in data){
        		            var dataCopy = data[event]
        		            for(key in dataCopy){
        		                if(key.match(/start|end/)){
        		                    // needs more specific method to manipulate date to your needs
        		                    dataCopy[key] = new Date(dataCopy[key])
        		                }
        		            }
        		            arr.push(dataCopy)
        		        }

        		        alert( JSON.stringify(arr) )
        		  });
*/
        
       // jQuery.getJSON('http://www.khanacademy.org/api/v1/commoncore?lightweight=1&structured=1', function(data11) {
        //	  var items = [];

        	 /* $.each(data, function(key, val) {
        	    items.push('<li id="' + key + '">' + val + '</li>');
        	  });

        	  $('<ul/>', {
        	    'class': 'my-new-list',
        	    html: items.join('')
        	  }).appendTo('body');
*/        	  
        	 // alert("aaa"+data11)
        	//});

/*     var  data2 = JSON.parse('{"cc_description": "Describe objects in the environment using names of shapes, and describe the relative positions of these objects using terms such as above, below, beside, in front of, behind, and next to.", "videos": [], "standard": "K.G.1", "cc_cluster": "Identify and describe shapes (squares, circles, triangles, rectangles, hexagons, cubes, cones, cylinders, and spheres).", "exercises": [], "cc_url": "http://www.corestandards.org/the-standards/mathematics/kindergarten/geometry/#k-g-1"}, {"cc_description": "Correctly name shapes regardless of their orientations or overall size.", "videos": [], "standard": "K.G.2", "cc_cluster": "Identify and describe shapes (squares, circles, triangles, rectangles, hexagons, cubes, cones, cylinders, and spheres).", "exercises": [], "cc_url": "http://www.corestandards.org/the-standards/mathematics/kindergarten/geometry/#k-g-2"}, {"cc_description": "Identify and describe shapes (squares, circles, triangles, rectangles, hexagons, cubes, cones, cylinders, and spheres).", "videos": [], "standard": "K.G.3", "cc_cluster": "Identify and describe shapes (squares, circles, triangles, rectangles, hexagons, cubes, cones, cylinders, and spheres).", "exercises": [], "cc_url": "http://www.corestandards.org/the-standards/mathematics/kindergarten/geometry/#k-g-3"}, {"cc_description": "Analyze, compare, create, and compose shapes.", "videos": [], "standard": "K.G.4", "cc_cluster": "Analyze, compare, create, and compose shapes.", "exercises": [], "cc_url": "http://www.corestandards.org/the-standards/mathematics/kindergarten/geometry/#k-g-4"}, {"cc_description": "Model shapes in the world by building shapes from components (e.g., sticks and clay balls) and drawing shapes.", "videos": [], "standard": "K.G.5", "cc_cluster": "Analyze, compare, create, and compose shapes.", "exercises": [], "cc_url": "http://www.corestandards.org/the-standards/mathematics/kindergarten/geometry/#k-g-5"}, {"cc_description": "Analyze, compare, create, and compose shapes.", "videos": [], "standard": "K.G.6", "cc_cluster": "Analyze, compare, create, and compose shapes.", "exercises": [], "cc_url": "http://www.corestandards.org/the-standards/mathematics/kindergarten/geometry/#k-g-6"}]} ')

     
     
        arr = []
        for(var event in data){
            var dataCopy = data[event]
            for(key in dataCopy){
                if(key.match('cc_url')){
                	dataCopy = dataCopy[key])

                }
            }
        
            arr.push(dataCopy)
        }

*/      //  alert( JSON.stringify(arr) )

        
        var html = "<h4>" + node.name + "</h4><b> Useful Resources:</b><ul><li>",
            list = [];
        node.eachAdjacency(function(adj){
        /*  if(adj.getData('alpha')&& node.name=='Rhombus') {list.push("http://www.corestandards.org/the-standards/mathematics/kindergarten/geometry/#k-g-6");
          list.push("http://www.youtube.com/user/EducatorVids?v=4gNC79qWikU&feature=pyv");
          list.push("ClassNotes.pdf");
          list.push("http://www.khanacademy.org/math/geometry/basic-geometry");}
          
          if(adj.getData('alpha')&& node.name=='Rhombus') {list.push("http://www.corestandards.org/the-standards/mathematics/kindergarten/geometry/#k-g-6");
          list.push("http://www.youtube.com/user/EducatorVids?v=4gNC79qWikU&feature=pyv");
          list.push("http://www.khanacademy.org/math/geometry/basic-geometry");}
        
          
          if(adj.getData('alpha')&& node.name=='Start1') {list.push("http://www.corestandards.org/the-standards/mathematics/kindergarten/geometry/#k-g-6");
          list.push("http://www.youtube.com/user/EducatorVids?v=4gNC79qWikU&feature=pyv");
          list.push("ClassNotes.pdf");
        
          if(adj.getData('alpha')&& node.name=='Square') {list.push("http://www.corestandards.org/the-standards/mathematics/kindergarten/geometry/#k-g-6");
          list.push("http://www.youtube.com/user/EducatorVids?v=4gNC79qWikU&feature=pyv");
          list.push("ClassNotes.pdf");
          list.push("http://www.khanacademy.org/math/geometry/basic-geometry");}*/
          list.push("<a src='ClassNotes.pdf'> Class Notes</a>  </li><li><a src='http://www.khanacademy.org/math/geometry/basic-geometry'>"+
          		"Khan Academy</a> </li><li> <a src='http://www.youtube.com/user/EducatorVids?v=4gNC79qWikU&feature=pyv'>Educator.com videos</a> ");
          
          
          
        });
        //append connections information
        $jit.id('inner-details').innerHTML = html + list.join("</li><li>") + "</li></ul>";
      };
    },
    // Change node styles when DOM labels are placed
    // or moved.
    onPlaceLabel: function(domElement, node){
      var style = domElement.style;
      var left = parseInt(style.left);
      var top = parseInt(style.top);
      var w = domElement.offsetWidth;
      style.left = (left - w / 2) + 'px';
      style.top = (top + 10) + 'px';
      style.display = '';
    }
  });
  // load JSON data.
  fd.loadJSON(json);
  // compute positions incrementally and animate.
  fd.computeIncremental({
    iter: 40,
    property: 'end',
    onStep: function(perc){
      Log.write(perc + '% loaded...');
    },
    onComplete: function(){
      Log.write('Cognitive Learning Map');
      fd.animate({
        modes: ['linear'],
        transition: $jit.Trans.Elastic.easeOut,
        duration: 2500
      });
    }
  });
  // end
}
