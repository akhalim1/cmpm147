// project.js - The aim is to generate a quick Noir introduction to a fictional story.
// Author: Alexander Halim
// Date: 4/6/25

// NOTE: This is how we might start a basic JavaaScript OOP project

// Constants - User-servicable parts
// In a longer project I like to put these in a separate file

// define a class
class MyProjectClass {
  // constructor function
  constructor(param1, param2) {
    // set properties using 'this' keyword
    this.property1 = param1;
    this.property2 = param2;
  }
  
  // define a method
  myMethod() {
    // code to run when method is called
  }
}

function main() {
  const fillers = {
    detective: ["Jack", "Sam", "Rex", "Veronica", "Evelyn", "Frankie"],
    people: ["the window", "the bartender", "a saxophone player who never talks", "a rookie cop", "the club singer", "the priest"],
    item: ["blood stained fedora", "cigarette pack", "matchbook from jazz club", "silver lighter with initials", "napkin with red lipstick", "bullet casings", "photogrpah", "necklace"],
    criminals: ["The Windowmaker", "Lucky Luciano", "The Viper", "Danny Horvitz", "Richard Harrow", "Milky White"],
    locations: ["Blue Swan Jazz Club", "Room 302 at the Bellmont Hotel", "Chinatown Alley", "old warehouse", "St Jude's Cemetery", "train station"],
    message: ["The clock strikes twice", "Trust no one in room 302", "She knows", "They buried the truth", "Follow the redlight", "Do not trust the badge."],
    
  };
  
  const template = `
    $detective has seen a lot in their days but the $item left at the crime scene left $detective pondering longer than usual. 
    Everyone pointed fingers at the usual suspects like the infamous "$criminals" or "$criminals" saying it was quite obvious but this detective knew nothing in this city is ever that simple.
    A tip from $people brought them to the $locations, where a message waited: "$message".
    With only few days to work with and the thundering rain washing away the truth, the clock was ticking.
    Justice was a dirty word in this town and $detective was the only one still trying to stand by it.
  `;

  const slotPattern = /\$(\w+)/;
  const detective = fillers.detective[Math.floor(Math.random() * fillers.detective.length)];

  function replacer(match, name) {
    if (name === "detective") return detective;
    
    let options = fillers[name];
    if (options) {
      return options[Math.floor(Math.random() * options.length)];
    } else {
      return `<UNKNOWN:${name}>`;
    }
  }

  function generate() {
    let story = template;
    while (story.match(slotPattern)) {
      story = story.replace(slotPattern, replacer);
    }

    /* global box */
    $("#box").text(story);
  }

  /* global clicker */
  $("#clicker").click(generate);

  $("#download").click(function () {
    //Credit: https://www.tutorialspoint.com/how-to-create-and-save-text-file-in-javascript
    const story = $("#box").text();
    // create the Blob and store the text
    const blob = new Blob([story], { type: "text/plain" });
    // store it as a downloadable URL
    const url = URL.createObjectURL(blob);

    // create a download link / set the name
    const link = document.createElement("a");
    link.href = url;
    link.download = "noir_story.txt";
    link.click();
  });

  generate();
  // create an instance of the class
  //let myInstance = new MyProjectClass("value1", "value2");

  // call a method on the instance
  //myInstance.myMethod();
}

// let's get this party started - uncomment me
main();