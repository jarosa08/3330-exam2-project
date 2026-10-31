function calculatePace(){
    // ex.
    // 7:15 time
    // 65% percent
    // 435 seconds
    // 11.15 step1
    // .15 step2
    // 9 step3
    // 11:09 step4

    // time inputted
    let mileTime = document.querySelector("#mile-time").value;

    // handling percent value
    // if greater than 150, make 150
    if (document.querySelector("#desired-percentage").value > 150)
        document.querySelector("#desired-percentage").value = 150;
    // if less than 0, make 0
    else if (document.querySelector("#desired-percentage").value < 0)
        document.querySelector("#desired-percentage").value = 0;
    else {}

    // percent inputted
    let percent = document.querySelector("#desired-percentage").value * .01;

    // search for numbers in string variable mileTime(time)
    let matches = mileTime.match(/\d+/g);
    
    // variables to hold numbers from time string
    let minutes = 0, seconds = 0;
    
    // numbers extracted from time string
    if (matches) {
        // turning minutes from string type variable to number type
        if (matches[0])
            minutes = Number(matches[0]);

        // turning seconds from string type variable to number type
        if (matches[1])
        {
            // if seconds only has 1 digit, add 0 in back assuming it's missing
            if (matches[1].length == 1)
                seconds = Number(matches[1] + 0)
            else
                seconds = Number(matches[1]);
        }
    }

    // total seconds
    let totalSeconds = (minutes*60)+seconds;

   
    // for sunday run
    // 435/.70=621.43
    // 621.43/60=10.36
    // .36*60=21.6 ->22
    // 10:22


    // if percent is not empty, give pace, else, '-'
    if (percent)
        document.querySelector("#desired-pace").innerHTML = calculate(totalSeconds, percent); // step4a;
    else
        document.querySelector("#desired-pace").innerHTML = "-";

    // if miletime is not empty, fill out items, else '-'
    if (mileTime) {
        // recovery with 65%
        document.querySelector("#recovery-pace").innerHTML = calculate(totalSeconds, .65);
        // sunday with 70%
        document.querySelector("#sunday-pace").innerHTML = calculate(totalSeconds, .70);
        // tempo with 80%
        document.querySelector("#tempo-pace").innerHTML = calculate(totalSeconds, .80);    
    } else {
        // recovery
        document.querySelector("#recovery-pace").innerHTML = "-";
        // sunday
        document.querySelector("#sunday-pace").innerHTML = "-";
        // tempo
        document.querySelector("#tempo-pace").innerHTML = "-";    
    }
}

// pass total seconds and percent in terms of .00
function calculate(totalSeconds, percentage) {
    // 1. (totalseconds / percentage)/60 -> find percentage of seconds and divide by 60 to get overall minutes
    let step1 = (totalSeconds/percentage)/60;
    // 2. (overall minutes - rounded minutes) -> subtract overall minutes and rounded overall minutes to find seconds
    let step2 = step1 - Math.floor(step1);
    // 3. round seconds*60 -> find correct seconds
    let step3 = Math.round(step2*60);

    // if seconds is greater than 10, put together minutes:seconds, else add 0 in front of seconds
    if (step3 > 10)
        return (step1-step2) + ":" + step3;
    else
        return (step1-step2) + ":" + "0" + step3;
}