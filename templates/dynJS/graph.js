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
        p.background(50);
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
//var sketchOne = new p5(sketchOneFunction, 'myContainer1');

// function to create an instanced p5js sketch.  Essential for cases in which multiple sketches on the same page are needed.
var sketchTwoFunction = function(p)  // the argument "p" here could be any variable.  It will be our reference for our sketch
{
    // object used to draw lines across the screen
    var Waveform = 
    {
        y : 0,  // incrementally defined below for each waveform
        yNew : 0,
        thickness : 0.5,  // 2.5
        ySpacing : 2.5,  // spacing between two waveforms // 10
        leftBorder : 7,
        rightBorder : 250,
        numberOfPoints : 0,  // defined with for loop below
        pointSpacing : 15,  // spacing is also used to determine the number of points
        points : [],  // 2D list of x,y point locations
        speed : 0.35,
    }
    
    var topWaveformYPosition = 70;
    Waveform.numberOfPoints = (Waveform.rightBorder - Waveform.leftBorder) / Waveform.pointSpacing;
    console.log("number of points", Waveform.numberOfPoints);
    
    var numberOfWaveforms = 20;
    var waveforms = [];
    for (var i = 0; i < numberOfWaveforms; i += 1)
    {
        // jquery extend to copy without reference
        let tmp = $.extend(true, {}, Waveform);
        tmp.y = i * tmp.ySpacing + topWaveformYPosition;
        tmp.yNew = i * tmp.ySpacing + topWaveformYPosition;
        tmp.points.push([tmp.rightBorder, tmp.y])  // populate points with first point
        waveforms.push(tmp);
    }
    console.log(waveforms);

    // number stream object that will fade into lines
    var NumberStream = 
    {
        y : 0,
        ySpacing : 6.25,
        thickness : 0.3,
        leftBorder : 243,
        rightBorder : 285,
        numberOfPoints : 0,
        pointSpacing : 10,
        numbers : [],
        speed : 0.35,
    }

    var topNumberStreamYPosition = 73;
    NumberStream.numberOfPoints = (NumberStream.rightBorder - NumberStream.leftBorder) / NumberStream.pointSpacing;
    console.log("number of number streams", NumberStream.numberOfPoints);
    
    var numberOfNumberStream = 8;
    var numberStreams = [];
    for (var i = 0; i < numberOfNumberStream; i += 1)
    {
        // jquery extend to copy without reference
        let tmp = $.extend(true, {}, NumberStream);
        tmp.y = i * tmp.ySpacing + topNumberStreamYPosition;
        tmp.numbers.push([tmp.rightBorder, tmp.y, getRandomArbitrary(0, 1).toFixed(3)])  // populate points with first point
        numberStreams.push(tmp);
    }
    console.log(numberStreams);

    p.setup = function()
    {
        p.createCanvas(880, 720);
        p.frameRate(30);
        // p.noLoop();  // remember to uncomment this when not testing
    }

    var waitToMoveLinesCount = 0;

    var backgroundColor = [220, 221, 217];
    var blueColor = [18, 56, 140];
    var yellowColor = [234, 187, 0];
    var brownColor = [91, 51, 14];
    var resetTo = 140;
    var countToAmount = 95;
    var onCounter = countToAmount + 5;
    p.draw = function()
    {  
        p.background(backgroundColor);
        // text for check out my work and logic for subtle flashing to draw the eye to work
        p.strokeWeight(0);
        p.textSize(32);
        p.textFont('Georgia');
        p.fill(blueColor);
        var leftSideTextPosition = 16;
        p.text('Check out my', leftSideTextPosition, 58);

        // if (onCounter > countToAmount)
        // {
        //     onCounter -= 0.55;
        //     // console.log("counting up", onCounter);
        //     p.fill(56, onCounter * 1.2, 210);
        //     // p.textStyle(p.BOLD);
        // }
        // else
        // {
        //     onCounter = resetTo;
        //     // console.log("reset");
            
        // }
        p.text('work', 266, 58);
        
        // Lines moving across the screen
        p.stroke(blueColor); // Change the color of lines
        var arrayLength = waveforms.length;
        p.strokeWeight(waveforms[0].thickness);
        for (var i = 0; i < arrayLength; i += 1)
        {
            
            // update point position for next drawing to screen
            for (var j = 0; j < waveforms[i].points.length; j += 1)
            {
                waveforms[i].points[j][0] -= waveforms[i].speed;
            }

            // add new dot at given frequency
            // if the last dot in the array is far enough away from the right side add another dot
            if (waveforms[i].rightBorder - waveforms[i].points[waveforms[i].points.length - 1][0] > waveforms[i].pointSpacing)
            {
                if (waitToMoveLinesCount < 77)
                {
                    waveforms[i].yNew = waveforms[i].y;
                }
                else
                {
                    waveforms[i].yNew = waveforms[i].y +  getRandomArbitrary(-2.75, 2.75);
                }
                waveforms[i].points.push([waveforms[i].rightBorder, waveforms[i].yNew]);
            }

            // get rid of old dots once they have pass the left border
            if (waveforms[i].points[0][0] < waveforms[i].leftBorder)
            {
                waveforms[i].points.splice(0, 1);
            }

            // connect some lines
            for (var j = 0; j < waveforms[i].points.length; j += 1)
            {
                // first dot and there is only one dot in the list
                if (j == 0 && waveforms[i].points.length == 1)
                {
                    p.line(waveforms[i].points[j][0], waveforms[i].points[j][1], waveforms[i].rightBorder, waveforms[i].yNew);
                    p.line(waveforms[i].points[j][0], waveforms[i].points[j][1], waveforms[i].leftBorder, waveforms[i].yNew);
                }
                else if (j == 0) // first dot in the list
                {
                    p.line(waveforms[i].points[j][0], waveforms[i].points[j][1], waveforms[i].leftBorder, waveforms[i].points[j][1]);
                    p.line(waveforms[i].points[j][0], waveforms[i].points[j][1], waveforms[i].points[j + 1][0], waveforms[i].points[j + 1][1]);
                }
                else if (j == waveforms[i].points.length - 1) // last dot in the list
                {
                    p.line(waveforms[i].points[j][0], waveforms[i].points[j][1], waveforms[i].rightBorder, waveforms[i].yNew);
                }
                else  // every other dot in the list
                {
                    p.line(waveforms[i].points[j][0], waveforms[i].points[j][1], waveforms[i].points[j + 1][0], waveforms[i].points[j + 1][1]);
                }
            }
        }
        waitToMoveLinesCount += 1;

        // numbers moving across the screen
        p.stroke(brownColor); // Change the color of numbers
        p.fill(brownColor);
        p.textSize(3);
        p.textFont('Courier New');
        var arrayLength = numberStreams.length;
        p.strokeWeight(numberStreams[0].thickness);
        for (var i = 0; i < arrayLength; i += 1)
        {
            // update point position for next drawing to screen
            for (var j = 0; j < numberStreams[i].numbers.length; j += 1)
            {
                if (numberStreams[i].numbers[j][2] > 0.2)  // only display numbers above this value
                {
                    p.text(numberStreams[i].numbers[j][2].toString(), numberStreams[i].numbers[j][0], numberStreams[i].numbers[j][1])
                }
                numberStreams[i].numbers[j][0] -= numberStreams[i].speed;
            }

            // add new dot at given frequency
            // if the last dot in the array is far enough away from the right side add another dot
            if (numberStreams[i].rightBorder - numberStreams[i].numbers[numberStreams[i].numbers.length - 1][0] > numberStreams[i].pointSpacing)
            {
                numberStreams[i].numbers.push([numberStreams[i].rightBorder, numberStreams[i].y, getRandomArbitrary(0, 1).toFixed(3)]);
            }

            // get rid of old dots once they have pass the left border
            if (numberStreams[i].numbers[0][0] < numberStreams[i].leftBorder)
            {
                numberStreams[i].numbers.splice(0, 1);
            }
        }

        // draw rectangles over the jarring movement
        p.fill(backgroundColor)
        p.stroke(backgroundColor)
        p.rect(5, 65, 16, 57, 2);  // left side rectangle
        p.rect(236, 65, 15, 57, 2);  // rectangle between numbers and lines
        p.rect(285, 65, 15, 57, 2);  // rectangle on far right side
    }

    

    function getRandomArbitrary(min, max) {
        return Math.random() * (max - min) + min;
    }
}
// p5js instance mode where we initialize our sketch inside of function sketchOneFunction and call it using new p5()
// sketchOneFunction is the function used to create our instanced sketch
// myContainer is the div html element where our sketch will be located on the page 
var sketchTwo = new p5(sketchTwoFunction, 'myContainer2');
