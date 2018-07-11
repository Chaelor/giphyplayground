$("document").ready(function () {
    //HTML selectors
    var buttons = $(".buttons");
    var newButton = $(".new-button");
    var gifDisplay = $(".gif-display");

    //Where we will store our buttons
    var btnArray = ["Cat", "Dog", "Lizard"];
    var storageArray = [];

    //Storage for keys
    var storageCounter = 0;
    var fromStorage = getStorage();

    //Retrieve past button submissions
    function getStorage() {

        var values = [],
            keys = Object.keys(localStorage),
            i = keys.length;

        while (i--) {
            values.push(localStorage.getItem(keys[i]));
        }

        return values;
    }


    //Initial render for 3 animal buttons
    function buttonRender() {
        //Make the HTML blank for future loadings of this
        buttons.html("");
        //For animals in the btn array, create buttons
        for (let i = 0; i < btnArray.length; i++) {
            buttons.append("<button data-gif='" + btnArray[i] + "' class='btn main-btn--styles'>" + btnArray[i] + "</button>");
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
            buttons.append("<button data-gif='" + storedKey + "' class='btn main-btn--styles'>" + storedKey + "</button>");
        }
        //Clear the from storage array.
        fromStorage = [];
    }

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
        storageCounter = 0;
        //Re-populate array with inital choices
        btnArray = ["Cat", "Dog", "Lizard"];
        //Create the three initial buttons
        for (let i = 0; i < btnArray.length; i++) {
            buttons.append("<button data-gif='" + btnArray[i] + "' class='btn main-btn--styles'>" + btnArray[i] + "</button>");
        }
    });

    //Clicked on an animal button do this
    $("body").on("click", ".main-btn--styles", function () {
        //Clear the HTML where the GIFs are displayed
        gifDisplay.html("");

        //Get the data you will be searching
        var gifGet = $(this).attr("data-gif");

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
                console.log(response);
                //Display all the gif returned. Loop through them all
                for (let i = 0; i < results.length; i++) {
                    //Declaring variables
                    //Store a div selector into gifDiv
                    var gifDiv = $("<div class='item'>");
                    //Store the rating from the gif into a var
                    var rating = results[i].rating;
                    //Store a p tag and the rating into "p"
                    var p = $("<p>").text("Rating: " + rating);
                    //Store an img tag in variable gifImage
                    var gifImage = $("<img class='active'>");

                    //Give the img tag above a source to display the picture 
                    gifImage.attr("src", results[i].images.fixed_height.url);
                    //Give the img tag an animate data-attr
                    gifImage.attr("data-animate", results[i].images.fixed_height.url);
                    //Give the img tag a still data-attribute
                    gifImage.attr("data-still", results[i].images.fixed_height_still.url);
                    //Give the gif a class to signal whether it is still or not.
                    gifImage.attr("data-state", "animated");
                    //Add the rating p tag after the image
                    gifDiv.prepend(p);
                    //Display the image in the gif var
                    gifDiv.prepend(gifImage);

                    //Display the rating and gif image in actual html
                    gifDisplay.prepend(gifDiv);
                };
            });
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
        }//I SHOULD HAVE PUT THIS IN THE ELSE STATEMENT BUT YOLO
        if (state === "still") {
            $(this).attr("src", animate);
            $(this).attr("data-state", "animated");
        }
    })


    //Initial button render call.
    buttonRender();
});