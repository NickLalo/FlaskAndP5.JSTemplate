function post_new_graph()
{
    // perform async AJAX Request
    $.ajax(
        // put all of the info about the request into JSON
        {
            // specify the method and url
            type: "POST",
            url: "post_new_graph"
        // .done specifies action to take when we get the response.  Positional arguments for anonymous function are:
        // data as plain text and status as "success", or "done"
        }).done(function(data, status)
        {
            if(status == "success")
            {
                graphData = data;
                // p5js code to redraw the sketch for a specific canvas
                sketchOne.redraw();
                sketchTwo.redraw();
            }
        })
}
// pass python var to js var using flask and jinja by marking our variable safe so we don't escape any characters
var graphData = {{graphData | safe}};

// function to create an instanced p5js sketch.  Essential for cases in which multiple sketches on the same page are needed.
var sketchOneFunction = function(p)  // the argument "p" here could be any variable.  It will be our reference for our sketch
{
    p.setup = function()
    {
        p.createCanvas(880, 720);
        p.noLoop();
    }

    p.draw = function()
    {
        var x = 280;
        var y;  // will be set in the initial for loop
    
        var connector = 
        {
            text: "a",
            x: 60,
            y: 360
        };

        p.background(50);
        p.textSize(40);
        p.fill(255);
        p.textAlign(p.LEFT, p.CENTER);  // be sure to use "p." or whatever variable you defined in the arguments when referencing p5js library objects
        p.textSize(56);
        p.text(connector.text, connector.x, connector.y);

        var nextConnector = 
        {
            text: "",
            x: 0,
            y: 0,
        };
        p.print(graphData);
        var keyList = [];
        var count = 0;
        for (var key in graphData)
        {
            if (count != 0)
            {
                keyList.push(key);
            }
            count +=1;
        }
        p.print(keyList);

        count = 0;
        // iterate through the column
        for (var key in graphData)
        {
            y = 130;
            // update next connector before iterating through letters
            nextConnector.text = keyList[count];

            // iterate through the items in each column
            for (var letter in graphData[key])
            { 
                // determine nextConnector start point
                if (graphData[key][letter] == nextConnector.text)
                {
                    nextConnector.x = x;
                    nextConnector.y = y;
                }

                // put the text on the screen
                p.textSize(40);
                p.fill(255);
                p.noStroke();
                p.textSize(56);
                p.textAlign(p.LEFT, p.CENTER);
                p.text(graphData[key][letter], x, y);

                // connect the current letter to the previous layer
                p.stroke(150);
                p.strokeWeight(0.5);
                p.line(connector.x + 30, connector.y, x, y);

                // update the y position for next letter
                y += 230;
            }
            // update connector
            p.print(connector);
            p.print(nextConnector);
            connector = JSON.parse(JSON.stringify(nextConnector));  // hacky workaround to copy object without reference

            count += 1;
            
            // update x position for next column
            x += 230;
        }

    }
}
// p5js instance mode where we initialize our sketch inside of function sketchOneFunction and call it using new p5()
// sketchOneFunction is the function used to create our instanced sketch
// myContainer is the div html element where our sketch will be located on the page 
var sketchOne = new p5(sketchOneFunction, 'myContainer1')



// pass python var to js var using flask and jinja by marking our variable safe so we don't escape any characters
var graphData = {{graphData | safe}};

// function to create an instanced p5js sketch.  Essential for cases in which multiple sketches on the same page are needed.
var sketchOneFunction = function(p)  // the argument "p" here could be any variable.  It will be our reference for our sketch
{
    p.setup = function()
    {
        p.createCanvas(880, 720);
        p.noLoop();
    }

    p.draw = function()
    {
        var x = 280;
        var y;  // will be set in the initial for loop
    
        var connector = 
        {
            text: "a",
            x: 60,
            y: 360
        };

        p.background(50);
        p.textSize(40);
        p.fill(255);
        p.textAlign(p.LEFT, p.CENTER);  // be sure to use "p." or whatever variable you defined in the arguments when referencing p5js library objects
        p.textSize(56);
        p.text(connector.text, connector.x, connector.y);

        var nextConnector = 
        {
            text: "",
            x: 0,
            y: 0,
        };
        p.print(graphData);
        var keyList = [];
        var count = 0;
        for (var key in graphData)
        {
            if (count != 0)
            {
                keyList.push(key);
            }
            count +=1;
        }
        p.print(keyList);

        count = 0;
        // iterate through the column
        for (var key in graphData)
        {
            y = 130;
            // update next connector before iterating through letters
            nextConnector.text = keyList[count];

            // iterate through the items in each column
            for (var letter in graphData[key])
            { 
                // determine nextConnector start point
                if (graphData[key][letter] == nextConnector.text)
                {
                    nextConnector.x = x;
                    nextConnector.y = y;
                }

                // put the text on the screen
                p.textSize(40);
                p.fill(255);
                p.noStroke();
                p.textSize(56);
                p.textAlign(p.LEFT, p.CENTER);
                p.text(graphData[key][letter], x, y);

                // connect the current letter to the previous layer
                p.stroke(150);
                p.strokeWeight(0.5);
                p.line(connector.x + 30, connector.y, x, y);

                // update the y position for next letter
                y += 230;
            }
            // update connector
            p.print(connector);
            p.print(nextConnector);
            connector = JSON.parse(JSON.stringify(nextConnector));  // hacky workaround to copy object without reference

            count += 1;
            
            // update x position for next column
            x += 230;
        }

    }
}
// p5js instance mode where we initialize our sketch inside of function sketchOneFunction and call it using new p5()
// sketchOneFunction is the function used to create our instanced sketch
// myContainer is the div html element where our sketch will be located on the page 
var sketchTwo = new p5(sketchOneFunction, 'myContainer2')
