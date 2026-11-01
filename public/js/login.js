$(document).ready( () => {

    $(".register").hide();
    $(".log-in-button").addClass("active");

    // register
    $(".register-button").on("click", () => {
        $(".register-button").addClass("active");
        $(".log-in-button").removeClass("active");

        $(".register").show();
    });

    // log-in
    $(".log-in-button").on("click", () => {
        $(".log-in-button").addClass("active");
        $(".register-button").removeClass("active");

        $(".register").hide();
    });
});