//JavaScript doesn't get run until the HTML is finished loading
$(document).ready(function () {

    //gitignore key variable
    var myKey = config.MY_KEY;
   
    //Movies array
    var movies = ["FIGHT CLUB", "ALMOST FAMOUS", "THE DARK KNIGHT", "THE EMPIRE STRIKES BACK", "JURASSIC PARK", "MEMENTO",
        "THE SHAWSHANK REDEMPTION", "CATCH ME IF YOU CAN", "ELF", "BACK TO THE FUTURE"];

    //Calls functon to create a button    
    buttonCreate();

    //Function to create bugton
    function buttonCreate() {
        $("#button-display").empty();
        for (var i = 0; i < movies.length; i++) {
            var movieButton = $("<button class='btn btn-danger'>");
            movieButton.addClass("movie");
            movieButton.attr("movie-data", movies[i]);
            movieButton.text(movies[i]);
            $("#button-display").append(movieButton);
        }
    }

  
    // Adding click event listener to all buttons
    $("#gif-button").on("click", function () {
        // Grabbing and storing the property value from the button
        var movie = $("#movie-input").val().toUpperCase();
        movies.push(movie);
        buttonCreate();
        return false;  
    });

    $("#movie-input").keydown(function(event){
        if(event.keyCode == 13) {
            var movie = $("#movie-input").val().toUpperCase();
            movies.push(movie);
            $("#movie-input").val("");
            buttonCreate();
            return false;
        }
        });

    //on click to call GifDisplay function
    $(document).on("click", ".movie", gifDisplay);

    //queryURL using the movie name
    function gifDisplay() {
        $("#populate-gifs").html("");
        var film = $(this).attr("movie-data");
        var random = Math.floor(Math.random() * 21);
        var queryURL = "https://api.giphy.com/v1/gifs/search?q=" + film + "&limit=10&offset=" + random + "&api_key=" + myKey;

        // Performing an AJAX request with the queryURL
        $.ajax({
            url: queryURL,
            method: "GET"
        })
            // After data comes back from the request
            .then(function (response) {
                // storing the data from the AJAX request in the results variable
                var results = response.data;
                for (var i = 0; i < results.length; i++) {
                    // Div tag is created and strored
                    var movieDiv = $("<div>");
                    var p = $("<p>").text("Rating: " + results[i].rating);
                    // Image tag is created and stored
                    var movieImage = $("<img>");
                    // Setting the src attribute of the image to a property pulled off the result item
                    movieImage.addClass("gif");
                    movieImage.attr("src", results[i].images.fixed_height_still.url);
                    movieImage.attr("data-state", "still");
                    movieImage.attr("animateUrl", results[i].images.fixed_height.url);
                    movieImage.attr("stillUrl", results[i].images.fixed_height_still.url);
                    //Appending the paragraph and image tag to the movieDiv
                    movieDiv.append(p);
                    movieDiv.append(movieImage);

                    // The movieDiv is prepended to the HTML under populate-gifs
                    $("#populate-gifs").prepend(movieDiv);
                };
            });
    };
});

// If the clicked image's state is still then animate, if anmiated then change to still
$(document).on("click", ".gif", function () {
    var state = $(this).attr("data-state");
    if (state === "still") {
        $(this).attr("src", $(this).attr("animateURL"));
        $(this).attr("data-state", "animate");
    } else {
        $(this).attr("src", $(this).attr("stillURL"));
        $(this).attr("data-state", "still");
    }
})