const time_slots = [9,10,11,12,13,14,15,16,17]
const today = moment()

function displayToday() {
    var $currentDay = $("#currentDay")
    $currentDay.text(today.format("dddd, MMMM Do"));
}

function makeTimeCard(hour) {
    let $newRow = $("<div>").addClass("row")
    let tell = (hour>12 && "pm") || (hour<=12 && "am");  // Short circuit to determine if appending "am" or "pm" to the class name
    let columns = ["hour", "when", "saveBtn"]
    columns.forEach( item => {
        switch (item) {
            case "hour":
                let temp = hour;
                if (hour>12) {
                    temp -= 12
                }
                $newRow.append($("<div>").addClass("col "+item+" "+item+hour).text(temp + tell))
                break;
            case "when":
                let diff = today.diff(moment({h: hour}), "hours")

                if (diff > 0) {
                    $newRow.append($("<div>").addClass("col-9 past").append($("<textarea>")).addClass("textarea "+item+hour))
                } else if (diff < 0) {
                    $newRow.append($("<div>").addClass("col-9 future").append($("<textarea>")).addClass("textarea "+item+hour))
                } else if (diff == 0) {
                    $newRow.append($("<div>").addClass("col-9 present").append($("<textarea>")).addClass("textarea "+item+hour))
                }
                break;
            case "saveBtn":
                $newRow.append($("<div>").addClass("col "+item+" "+hour).attr("style", "position: relative;").on("click", event => saveData(event))
                .append($("<img>").addClass("img-fluid  saveImg").attr("src","../Assets/images/saveImg.png")
                .attr("style", "max-width: 15px; max-height: 15px; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%)")))  // Add the save image
                break;
        }
    })

    $("#times").append($newRow);
}

function saveData(event) {
    let class_name = event.target.className.split(" ")[2];
    let text = $(".when"+class_name).children().val();

    localStorage.setItem(".when"+class_name, text)
}

function retrieveLocal() {
    let saves = [];
    for (index = 0; index < localStorage.length; index++) {
        localStorage.key(index).includes(".when") && (saves.push([localStorage.key(index), localStorage.getItem(localStorage.key(index))]))
    }

    if (saves.length > 0) {
        saves.forEach( item => {
            $(item[0]).children().val(item[1])
        })
    }
}

displayToday()
time_slots.forEach(time => makeTimeCard(time))
retrieveLocal()