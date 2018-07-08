$("document").ready(function () {
    //HTML selectors
    var buttons = $(".buttons");
    var newButton = $(".new-button");
    var gifDisplay = $(".gif-display");

    //Where we will store our buttons
    var btnArray = ["Cat", "Dog", "Lizard"];

    //Initial render for 3 animal buttons
    function initialRender() {

        //For animals in the btn array, create buttons
        for (let i = 0; i < btnArray.length; i++) {
            buttons.append("<button data-gif='" + btnArray[i] + "' class='btn main-btn--styles'>" + btnArray[i] + "</button>");
        }
    }
    
    //Clicked on an animal button do this
    $("body").on("click", ".main-btn--styles", function() {
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
            url:queryURL,
            //Method for the ajax call
            method: "GET"
        })//THIS IS THE PROMISE
        .then(function(response){

            //Log what you get into the results variable
            var results = response.data;

            //Display all the gif returned. Loop through them all
            for (let i = 0; i < results.length; i++){
                //Declaring variables
                //Store a div selector into gifDiv
                var gifDiv = $("<div class='item'>");
                //Store the rating from the gif into a var
                var rating = results[i].rating;
                //Store a p tag and the rating into "p"
                var p = $("<p>").text("Rating: " + rating);
                //Store an img tag in variable gifImage
                var gifImage = $("<img>");

                //Give the img tag above a source to display the picture 
                gifImage.attr("src", results[i].images.fixed_height.url);

                //Add the rating p tag after the image
                gifDiv.prepend(p);
                //Display the image in the gif var
                gifDiv.prepend(gifImage);

                //Display the rating and gif image in actual html
                gifDisplay.prepend(gifDiv);
            };
        });
    });
    initialRender();
});