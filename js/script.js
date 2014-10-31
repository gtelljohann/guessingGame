$("#guess_form").submit(submitGuess);
$("#restart").click(restartGame);
$("#forfeit").click(forfeit);

var num = Math.ceil(100 * Math.random());
var guesses = [];
var max_guesses = 5;
var hot_dist = 10;
var current_dist;
var prev_dist = 100;
var game_over, hot_cold_type, hot_message, higher_lower_message;
var alert_types = {correct:"alert-success", hot:"alert-danger", cold:"alert-info", repeat:"alert-warning"};

function submitGuess(submission) {
	submission.preventDefault();
	var guess = $("#guess_form").children().children().first().val();
	$("#guess_form").children().children().first().val("");
	if (game_over) return;

// Test whether in bounds
	if (!inBounds(guess)) return;

// If it's already been guessed, reject the guess
	if (alreadyGuessed(guess)) {
		notifyPlayer(guess + " has already been guessed!", alert_types["repeat"]);
		return;
	}
	else {
		guesses.push(guess);
		updateGuessesRemaining();
		current_dist = Math.abs(guess-num);
		updatePreviousGuesses(guess);

	}

// If it's the correct answer, congratulate the player
	if (guess == num) {
		endGame(true);
		return;
	}

// Endgame
	if (guesses.length >= max_guesses) {
		endGame(false);
		return;
	}

// Determine how hot the guess is
	if (current_dist < hot_dist) {
		hot_message = "Your guess is hot, ";
		hot_cold_type = alert_types["hot"];
	}
	else {
		hot_message = "Your guess is cold, ";
		hot_cold_type = alert_types["cold"];
	}
	if (guesses.length > 1) {
		if (current_dist < prev_dist) {
			hot_message += "is warmer than your last guess, ";
		} else if (current_dist == prev_dist) {
			hot_message += "is just as warm as your last guess, ";
		} else {
			hot_message += "is cooler than your last guess, ";
		}
	}
	prev_dist = current_dist;
	
	if (guess > num) higher_lower_message = "and is too high.";
	else higher_lower_message = "and is too low.";

// Notify the player
	notifyPlayer(guess + ": " + hot_message + higher_lower_message, hot_cold_type); 
	
}

function updatePreviousGuesses(guess) {
	var hot_class;
	if (current_dist < hot_dist) hot_class = "hot";
	else hot_class = "cold";
	if (guess == num) hot_class = "correct";
	$("#prev_guesses").children().first().after("<div class=\"col-md-1 marked\"><span class=\"h3 " 
		+ hot_class + "\">" + guess + "</span></div>");
}

function updateGuessesRemaining() {
	var remaining = max_guesses - guesses.length;
	$("#guesses_remaining").replaceWith("<span class=\"h3\" id=\"guesses_remaining\">" + remaining + "</span>");
}

function inBounds(guess) {
	if (guess % 1 != 0) {
		notifyPlayer(guess + " is not an integer. Please enter an integer from 1 to 100.", alert_types["repeat"]);
		return false;
	}
	if ((guess < 1)||(guess > 100)) {
		notifyPlayer(guess + " is out of bounds. Please enter a number from 1 to 100.", alert_types["repeat"]);
		return false;
	}
	return true;
}

function forfeit() {
	if (game_over) return;
	endGame(false);
}

function endGame(winner) {
	game_over = true;
	if (winner) { 
		notifyPlayer("<img src=\"images/winning.jpg\" \\> " + num + " is correct! Press the Start Over button below to play again.", alert_types["correct"]);
	} else {
		notifyPlayer("The answer was " + num + ". Better luck next time!  Press the Start Over button below to try again.", 
			alert_types["repeat"]);
	}
}

function restartGame() {
	guesses = [];
	num = Math.ceil(100*Math.random());
	clearNotifications();
	game_over = false;
	updateGuessesRemaining();
	$(".marked").remove();
	prev_dist = 100;
}

function clearNotifications() {
	$("#notification").empty();
}

function notifyPlayer(message, type) {
	clearNotifications();
	$("#notification").append("<div class=\"h4 alert " + type + " role=\"alert\">"
		+ message + "</div>");

}

function alreadyGuessed(guess) {
	for (var i = 0; i < guesses.length; i++) {
		if (guess == guesses[i]) return true;
	}
	return false;
}
