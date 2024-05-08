const express = require("express");
const {fork} = require("child_process");
const app = express();

app.get("/", (req, res) => {
  return res.send("Welcome");
});

app.get("/sync-function", (req, res) => {
  let sum = longComputation();
  res.send({sum});
});

app.get("/async-function", async(req, res) => {
  let sum = await asyncLongComputation();
  res.send({sum});
});

/*
whenever a request comes to this route and in it we are spinning
up the child process and that runs on separate thred and therefore 
it utilizes the full power of your CPU 

 */
app.get("/forking", (req, res) => {
  let child = fork("./longtask.js"); // child process 
  child.send("start"); // sending message to start computation
  child.on("message",(sum)=>{
    return res.send({sum})
  })
});

function longComputation() {
  let sum = 0;
  for (let i = 0; i < 1e9; i++) {
    sum += i;
  }
  return sum;
}

function asyncLongComputation() {
  return new Promise((resolve, reject) => {
    let sum = 0;
    for (let i = 0; i < 1e9; i++) {
      sum += i;
    }
    resolve(sum);
  });
}

app.listen(8000, () => {
  console.log(`Server is running on ${8000}`);
});
