$("document").ready(function () {

    //HTML selectors
    var buttons = $(".buttons");
    var newButton = $(".new-button");
    var gifDisplay = $(".gif-display");

    //Where we will store our buttons
    var btnArray = ["Cat", "Dog", "Lizard"];
    var storageArray = [];

    //Storage for keys
    var storageCounter = 1;
    var fromStorage = getStorage();
    var gifGet;

    //Actual variables
    var lastChoice = "";

    function apiCall() {

        //Concatenate the URL
        var queryURL = "https://api.giphy.com/v1/gifs/search?q=" +
            gifGet + "&api_key=dc6zaTOxFJmzC&limit=10";
        
        //Async javascript and xml call
        $.ajax({
            //This is the concatenated URL 
            url: queryURL,
            //Method for the ajax call
            method: "GET"
        })//THIS IS THE PROMISE
            .then(function (response) {

                //Log what you get into the results variable
                var results = response.data;
                console.log(response.data);
                //Display all the gif returned. Loop through them all
                for (let i = 0; i < results.length; i++) {
                    //Declaring variables
                    //Store a div selector into gifDiv
                    var gifDiv = $("<div class='item'>");
                    //Store the rating from the gif into a var
                    var rating = results[i].rating;
                    //Store the title
                    var gifTitle = results[i].title;
                    //Store a p tag and the rating into "p"
                    var pRating = $("<p>").text("Rating: " + rating.toUpperCase());
                    //Store a p tag and the title
                    var pTitle = $("<p class='uppercase'>").text("Gif Title: " + gifTitle.toUpperCase());
                    //Store an img tag in variable gifImage
                    var gifImage = $("<img class='active'>");
                    //Make a button to download the gif
                    var buttonDownloader = $("<a href='" + results[i].images.fixed_height.url + "' download class='main-a-download' target='_blank'>").text("Download!");

                    //Give the img tag above a source to display the picture 
                    gifImage.attr("src", results[i].images.fixed_height.url);
                    //Give the img tag an animate data-attr
                    gifImage.attr("data-animate", results[i].images.fixed_height.url);
                    //Give the img tag a still data-attribute
                    gifImage.attr("data-still", results[i].images.fixed_height_still.url);
                    //Give the gif a class to signal whether it is still or not.
                    gifImage.attr("data-state", "animated");
                    //Add the download link!
                    gifDiv.prepend(buttonDownloader);
                    //Display the image in the gif var
                    gifDiv.prepend(gifImage);
                    //Add the title and rating p tag before the image
                    gifDiv.prepend(pRating);
                    gifDiv.prepend(pTitle);
                    //Display the rating and gif image in actual html
                    gifDisplay.prepend(gifDiv);
                };
            });
    }
    //Retrieve past button submissions
    function getStorage() {

        //Create an array that will have key equal to local storage. key being "keys-#" value-i"
        var values = [],
            keys = Object.keys(localStorage),
            i = keys.length;

        //Loop through localstorage and return keys
        for (var i = 0; i < localStorage.length; i++) {

            keys = Object.keys(localStorage),
                values.push(localStorage.getItem(keys[i]));

        }

        //return the values array
        return values;
    }

    //Initial render for 3 animal buttons
    function buttonRender() {

        //Make the HTML blank for future loadings of this
        buttons.html("");

        //For animals in the btn array, create buttons
        for (let i = 0; i < btnArray.length; i++) {
            buttons.append("<button data-gif='" + btnArray[i] + "' class='btn main-btn--styles produceGifs' id='" + btnArray[i] + "'>" + btnArray[i] + "</button>");
        }

        //For the items in storage loop through array
        for (let i = 0; i < fromStorage.length; i++) {
            //Set the variable storedKey = to the item in the array
            let storedKey = fromStorage[i];
            //Add one to the storage counter so the counter knows where to count from when user submits more data
            storageCounter++;
            //Push what the user had saved into an array.
            btnArray.push(storedKey);
            //Make the buttons appear in the buttons display area
            buttons.append("<button data-gif='" + storedKey + "' class='btn main-btn--styles produceGifs'id='" + storedKey + "'>" + storedKey + "</button>");
        }
        //Clear the from storage array.
        fromStorage = [];
    }

    //On enter key down, submit the form
    $('body').on("keydown", ".input", function (e) {
        //If the use hits enter and only enter
        if (e.which == 13) {
            //Click the submit button
            $('#submit').click();
        }
    });

    //On click functionality for submit button
    $("body").on("click", "#submit", function () {
        //check to see if the text area is empty or not
        if ($(".textarea").val().trim() === "") {
            //if it is empty just clear textarea
            return $(".textarea").val("");
        } else {
            //Make a new variable equal to the text in text area
            var makeNewButton = $(".textarea").val().trim();
            //Empty the text area
            $(".textarea").val("")
            //Push the text to the btnArray
            btnArray.push(makeNewButton);
            //Push button into storage array
            storageArray.push(makeNewButton);
            //Loop through the storage array to give the array index a key and store it
            for (let i = 0; i < storageArray.length; i++) {
                //Set a key in storage equal to "item=whatever item #"
                localStorage.setItem("item-" + storageCounter, storageArray[i]);
            }
            //Render the buttons
            buttonRender();
            //Add one to the storage counter
            storageCounter++;
        }

    })

    //On click functionality for reset button
    $("body").on("click", "#reset", function () {
        ///Empty the buttons div
        $(".buttons").empty();
        //Clear storage
        localStorage.clear();
        //Clear text area
        $(".textarea").val("");
        //Clear the btnArray
        btnArray = [];
        //Clear the storage counter
        storageCounter = 1;
        //Re-populate array with inital choices
        btnArray = ["Cat", "Dog", "Lizard"];
        //Create the three initial buttons
        for (let i = 0; i < btnArray.length; i++) {
            buttons.append("<button data-gif='" + btnArray[i] + "' class='btn main-btn--styles produceGifs'>" + btnArray[i] + "</button>");
        }
        //Clear gif area
        gifDisplay.empty();
    });
    
    //Clicked on an animal button do this
    $("body").on("click", ".produceGifs", function (e) {
        //Set the userChoice to the ID of the button that was clicked
        let userChoice = e.target.id;

        //Convert user choice to a string
        userChoice = userChoice.toString();

        //If statement works properly, to work on getting additional gifs simply remove "gifDisplay.empty from if scope".
        if (userChoice === lastChoice) {
            gifDisplay.empty();
            console.log("if");
            gifGet = $(this).attr("data-gif");
            apiCall();
        } else {
            gifDisplay.empty();
            lastChoice = userChoice;
            console.log("else");
            gifGet = $(this).attr("data-gif");
            apiCall();
        }
    });

    //Click on a gif
    $("body").on("click", "img", function () {
        //State is equal to the state from the gif
        let state = $(this).attr("data-state");
        //This is the url to the animated-running gif
        let animate = $(this).attr("data-animate");
        //This is the url to the still gif
        let still = $(this).attr("data-still");

        //If the state is animated(Starts in this state)
        if (state === "animated") {
            //Change the SRC to the still url
            $(this).attr("src", still);
            //Change the data-state to still
            $(this).attr("data-state", "still")
        }//I SHOULD HAVE PUT THIS IN THE ELSE STATEMENT BUT YOLO -- jk 200 lines even
        if (state === "still") {
            $(this).attr("src", animate);
            $(this).attr("data-state", "animated");
        }
    })

    //Initial button render call.
    buttonRender();
});