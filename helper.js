const fs = require("fs");
const config = require("./config.json");

let allWorkflowsList = {};
let appList = [];

function load() {
  //load data from json file
  //create buttons for each workflow
  //assign allworkflowlist to equal this json file
}

function save() {
  if (
    appList.length == 0 ||
    document.getElementById("nameFlow").value == "" ||
    document.getElementById("nameFlow").value in allWorkflowsList
  ) {
    alert(
      "Make sure to name your workflow, the name has not already been assigned to an existing workflow and that you have selected atleast one task to perform."
    );
  } else {
    let nameFlow = document.getElementById("nameFlow").value;
    allWorkflowsList[nameFlow] = appList;
    appList = [];
    console.log(allWorkflowsList);

    fs.writeFile("config.json", JSON.stringify(allWorkflowsList), (err) => {
      // Checking for errors
      if (err) throw err;

      console.log("Done writing"); // Success
    });

    let newWorkflow = document.createElement("button");
    newWorkflow.setAttribute("id", nameFlow);
    newWorkflow.innerHTML = "Load '" + nameFlow + "'";

    newWorkflow.onclick = function () {
      //console.log(allWorkflowsList[this.id]);
      for (let app in allWorkflowsList[this.id]) {
        const { spawn } = require("child_process");
        spawn("open", [allWorkflowsList[this.id][app]]);
      }
    };

    document.getElementById("allWorkflows").appendChild(newWorkflow);

    document.getElementById("addedPaths").innerHTML = "";
    document.getElementById("nameFlow").value = "";
  }
}

function reset() {
  appList = [];
  document.getElementById("addedPaths").innerHTML = "";
}

const { ipcRenderer } = require("electron");

const addBtn = document.getElementById("addApp");

addBtn.addEventListener("click", (event) => {
  ipcRenderer.send("open-file-dialog");
});

ipcRenderer.on("selected-directory", (event, path) => {
  appList.push(path);
  //console.log(appList);

  //document.getElementById("thePara").innerHTML = "you selected: " + path[0];
  let anApp = document.createElement("p");
  anApp.innerHTML = "You added: " + path[0];
  document.getElementById("addedPaths").appendChild(anApp);
});
