$(document).ready( () => {

    // Function to handle switching layouts and inputs requirement status
    function setFormMode(mode) {
        if (mode === 'login') {
            // 1. Highlight active tab button styling
            $('.log-in-button').addClass('active-tab');
            $('.register-button').removeClass('active-tab');
            
            // 2. Hide all elements with the 'register' class
            $('.register').hide();
            
            // 3. Turn off 'required' status for register fields
            $('#first-name-input, #last-name-input, #DOB-input').prop('required', false);
            
            // 4. Update the form destination URL to your login route
            // $('form').attr('action', '/api/users/login');
            
        } else if (mode === 'register') {
            // 1. Highlight active tab button styling
            $('.register-button').addClass('active-tab');
            $('.log-in-button').removeClass('active-tab');
            
            // 2. Show all elements with the 'register' class
            $('.register').show();
            
            // 3. Make the registration input fields strictly required
            $('#first-name-input, #last-name-input, #DOB-input').prop('required', true);
            
            // 4. Update the form destination URL to your registration route
            // $('form').attr('action', '/api/users/register');
        }
    }

    // CLICK EVENT: If they click LOG IN button
    $('.log-in-button').on('click', function() {
        setFormMode('login');
    });

    // CLICK EVENT: If they click REGISTER button
    $('.register-button').on('click', function() {
        setFormMode('register');
    });

    // Run once on load to set the default layout (Starts as Log In mode)
    setFormMode('login');


    // when register button is clicked
    $(".register").hide();
    $(".log-in-button").addClass("active");

    // register
    $(".register-button").on("click", () => {
        $(".register-button").addClass("active");
        $(".log-in-button").removeClass("active");

        $(".register").show();
    });

    // when log-in button is clicked
    $(".log-in-button").on("click", () => {
        $(".log-in-button").addClass("active");
        $(".register-button").removeClass("active");

        $(".register").hide();
    });


    // change account view based off accout type
    let currentAccountType = $("#current-account-type").html();

    // guest , hide organizer and runner buttons
    if (currentAccountType == "GUEST") {
        let organizerItems = document.querySelectorAll(".organizer-only");
        organizerItems.forEach(item => {
            item.style.display = "none";
        });

        let runnerItems = document.querySelectorAll(".runner-only");
        runnerItems.forEach(item => {
            item.style.display = "none";
        });

        // let registeredRaces = document.querySelectorAll(".races-registered");
        // registeredRaces.forEach(item => {
        //     item.style.display = "none";
        // });
    }

    // organizer , hide runner buttons
    if (currentAccountType == "ORGANIZER") {
        let organizerItems = document.querySelectorAll(".organizer-only");
        organizerItems.forEach(item => {
            item.style.display = "block";
        });
        
        let runnerItems = document.querySelectorAll(".runner-only");
        runnerItems.forEach(item => {
            item.style.display = "none";
        });
    }

    // runner , hide organizer buttons
    if (currentAccountType == "RUNNER") {
        let organizerItems = document.querySelectorAll(".organizer-only");
        organizerItems.forEach(item => {
            item.style.display = "none";
        });
        
        let runnerItems = document.querySelectorAll(".runner-only");
        runnerItems.forEach(item => {
            item.style.display = "block";
        });
    }


    // patch 
    $('#editRaceForm').on('submit', async function(e) {
        e.preventDefault(); // Stop the form from causing a full page refresh

        // Grab the unique race URL out of our custom data-url attribute container
        const eventUrl = $('#update-button').attr('data-url');

        // Capture input values and build the payload layout mapping exactly to req.body variables
        const updatedData = {
            name: $('#edit-name-input').val(),
            date: $('#edit-event-input').val(),
            location: $('#edit-location-input').val(),
            info: $('#edit-info-input').val(),
            timedBy: $('#edit-timedBy-input').val()
        };

        try {
            // Dispatch the modern programmatic network request payload
            const response = await fetch(`/race/edit/${eventUrl}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(updatedData)
            });

            const result = await response.json();

            if (response.ok) {
                alert(result.message);
                window.location.href = '/races'; // Redirect cleanly back to your main list layout
            } else {
                alert(`Error: ${result.error}`);
            }
        } catch (error) {
            console.error("Network error executing patch handler:", error);
            alert("Failed to submit updates. Check your network connection.");
        }
    });
});

// register button
function register(buttonElement){
    if (buttonElement.innerText.trim() === "Register") {    
        buttonElement.classList.add("registered");
        buttonElement.innerText = "Registered";
        buttonElement.style.backgroundColor = "#707070";
    } else {            
        buttonElement.classList.remove("registered");
        buttonElement.innerText = "Register";
        buttonElement.style.backgroundColor = "";
    }
}