/**
 * HW 3: Calendar 
 * Kaitlyn Hennessy
 * kmh319
 */

var express = require("express");
var path = require("path");
var logger = require("morgan");
var app = express();

const monthNames = ["", "January", "February", "March", "April",
"May", "June", "July", "August", "September", "October",
"November", "December"];  
let displayMonth = 0;
let displayYear = 0;

/**
 * Routes
 */
app.set("views", path.resolve(__dirname, "views"));
app.set("view engine", "ejs");

app.get("/", function(request, response) {
  response.redirect("/calendar");
});

app.get("/calendar", function(request, response){
  let month = request.query.month;
  let year = request.query.year;

  // Move back one year
  if (year === "minus"){
    year = parseInt(displayYear) - 1;
    console.log("Redirecting to: /calendar?month=" + displayMonth + "&year=" + year);
    response.redirect("/calendar?month=" + displayMonth + "&year=" + year);
  }
  // Move back one month
  else if (month === "minus"){
    if (displayMonth !== 1){
      month = parseInt(displayMonth) - 1;
      year = displayYear;
    }
    else{
      month = 12;
      year = parseInt(displayYear) - 1;
    }

    console.log("Redirecting to: /calendar?month=" + month + "&year=" + year);
    response.redirect("/calendar?month=" + month + "&year=" + year);
  }
  // Move forward one month
  else if (month === "plus"){
    if (displayMonth != 12){
      month = parseInt(displayMonth) + 1;
      year = displayYear;
    }
    else{
      month = 1;
      year = parseInt(displayYear) + 1;
    }

    console.log("Redirecting to: /calendar?month=" + month + "&year=" + year);
    response.redirect("/calendar?month=" + month + "&year=" + year);
  }
  // Move forward one year
  else if (year === "plus"){
    month = displayMonth;
    year = parseInt(displayYear) + 1;
    console.log("Redirecting to: /calendar?month=" + displayMonth + "&year=" + year);
    response.redirect("/calendar?month=" + displayMonth + "&year=" + year);
  }
  // Creating calendar from query
  else{
    month = parseInt(request.query.month);
    year = parseInt(request.query.year);

    if ((isNaN(month) && (isNaN(year)))){
      month = "month";
      year = "year";
    }

    else{
      if ((month < 1) || (month > 12))    // Month given doesn't exist
        response.status(404).send('Illegal month');

      else if ((year.toString().length !== 4))
        response.status(404).send('Illegal year');
    }
    
    let cal = buildTable(month, year);
    let tblHeader = monthNames[cal[1]] + " " + cal[2];
    
    response.render("calendar", {
      tblHead: tblHeader,
      calBody: cal[0]
    });
  }
});

app.use(function(request, response) {
  response.statusCode = 404;
  response.end("404!");
});
app.use(logger("dev"));

app.listen(3000);









/**
 * CALENDAR CREATION
 */


/**
 * Build the table using values retrieved from the provded calendar function.
 * 
 * @param {*} monthTemp 
 * @param {*} yearTemp 
 */
function buildTable(monthTemp, yearTemp){
  let calArr = getCalendar(monthTemp, yearTemp);
  let outArr = calArr[0];
  let finalHTML = "";
  let todayDate;
  let today = new Date();
  let monthInt = parseInt(today.getMonth()) + 1;

  if (calArr[2] === today.getFullYear()){
    if (calArr[1] === monthInt){
      todayDate = today.getDate();
    }
  }

  for (let i = 0; i < outArr.length; i++){
    let tempHTML = "<tr>";
    for (let j = 0; j < 7; j++){
        if ((todayDate === outArr[i][j]) && (todayDate))
          tempHTML += "<td style='background: #ffc992;'>";
        else
          tempHTML += "<td>";

        if (outArr[i][j])
          tempHTML += outArr[i][j];
        else
          tempHTML += "";

        tempHTML += "</td>";
    }
    tempHTML += "</tr>";
    finalHTML += tempHTML;
  }
  return [finalHTML, calArr[1], calArr[2]];
}


/**
 * Slightly modified version of demo calendar.
 * 
 * @param {*} mth 
 * @param {*} yr 
 */
function getCalendar(mth, yr){
  if (mth === "month") {
      let today = new Date();
      displayMonth = today.getMonth() + 1;
      displayYear = today.getFullYear();

  } else {
      displayMonth = parseInt(mth);
      displayYear = yr;
  }

  // Calculate the last day of the month taking leap year into account
  if (displayMonth === 4 || displayMonth === 6 || displayMonth === 9 || displayMonth === 11)
      lastDay = 30;
  else if (displayMonth !== 2)
      lastDay = 31;
  else if (displayYear % 4 === 0 && (displayYear % 100 !== 0 || displayYear % 400 === 0))
      lastDay = 29;
  else
      lastDay = 28;

  let out = [];
  // Use the day of the week number for the first day of the month to set the day
  // number of the calendar cell in the upper left corner. This will be < 1 if the cell is supposed to be blank.
  let firstDayOfMonth = new Date(displayYear, displayMonth-1, 1);
  let dday = 1 - firstDayOfMonth.getDay();

  // When done is true, stop printing the calendar.
  let done = false;

  for (let row = 1; !done; ++row) {
      let tempArr = [];
      for (let colday = 1; colday <= 7 && !done; ++colday, ++dday) {
          if (dday < 1)
              tempArr.push("");
          else 
              tempArr.push(dday);
              done = (dday === lastDay);
      }
      out.push(tempArr);
  }
  return [out, displayMonth, displayYear];
}