import React from 'react';
import Sketch from 'react-p5'
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link, 
  Navigate
} from "react-router-dom";
import { useParams } from 'react-router';
import './App.css';
import { render } from 'react-dom';

// FIREBASE
import { initializeApp } from "firebase/app";
import { getAuth, signInWithRedirect, GoogleAuthProvider, getRedirectResult, onAuthStateChanged, signInAnonymously} from "firebase/auth";
import { getFirestore, collection, doc, getDocs, getDoc, setDoc, updateDoc} from "firebase/firestore"
import { getStorage, ref, uploadBytesResumable, getDownloadURL, listAll, connectStorageEmulator} from "firebase/storage";
import { getDatabase, ref as dbRef, set as dbSet, get as dbGet, update, onValue, remove} from 'firebase/database'

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCKFvY8YAM3x5-tDKILFteUTkYPq10YBms",
  authDomain: "bocce-22d3c.firebaseapp.com",
  projectId: "bocce-22d3c",
  storageBucket: "bocce-22d3c.appspot.com",
  messagingSenderId: "843235506061",
  appId: "1:843235506061:web:44f993806f3d330fdfafc4",
  measurementId: "G-YNNCR9YNFC"
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);
const rtdb = getDatabase();
// console.log(rtdb)
const auth = getAuth();
const googleAuth = GoogleAuthProvider;
const getRedirect = getRedirectResult;
const provider = new GoogleAuthProvider();
const signIn = signInWithRedirect;

let loggedIn = false;
let newUsername = "";
// let usernameAvailable = true;
let globalUserName = null;

function App() {
  // const [user, setUser] = React.useState(auth.currentUser);
  // const [userProPic, setUserProPic] = React.useState(auth.currentUser ? auth.currentUser.providerData[0].photoURL : null)
  // // const [userName, setUserName] = React.useState(auth.currentUser ? auth.currentUser.providerData[0].displayName : null)
  // const [userName, setUserName] = React.useState(null)
  // const [hasUsername, setHasUsername] = React.useState("tbd");
  // const [usernameAvailable, setUsernameAvailable] = React.useState("")
  // const [availabilityMessage, setAvailabilityMessage] = React.useState(true)
  const auth = getAuth();
    signInAnonymously(auth)
      .then(() => {
        console.log("You're signed in anonymously")
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        // ...
  });

  // auth.onAuthStateChanged(function (user) {
  //   console.log("logged in")
  //   console.log(user)
  //   if(user){
  //     loggedIn = true;
  //     // console.log(user.uid)
  //     // console.log("You are now logged in")
  //     if(document.getElementById("myFile")) document.getElementById("myFile").disabled = false;
  //     setUser(user) 
  //     setUserProPic(user.providerData[0].photoURL)
  //     // setUserName(user.providerData[0].displayName)

  //     const userRef = collection(db, "users");
  //     const yourUsername = dbRef(rtdb, "/users/" + auth.currentUser.uid);
  //     dbGet(yourUsername).then((res) => {
  //       if(res._node.value_){
  //         // console.log(res._node.value_)
  //         setUserName(res._node.value_)
  //         globalUserName = res._node.value_;
  //       } else {
  //         setHasUsername(false)
  //         // console.log("Need to create a username")
  //       }
  //     })
    
  //     // If this user already has a username in the realtime database
  //     // update their info
  //     if(userName){
  //       updateDoc(doc(userRef, userName), {
  //         uid: auth.currentUser.uid,
  //         name: auth.currentUser.displayName,
  //         propic: auth.currentUser.providerData[0].photoURL,
  //         username: globalUserName
  //       });
  //     }
  //   }
  // });

  // function login() {
  //   // console.log("LOGIN!")
  //   // console.log(auth.currentUser)
  //   if(!auth.currentUser){
  //       signIn(auth, provider);
  //       getRedirect(auth)
  //       .then((result) => {
  //           // This gives you a Google Access Token. You can use it to access Google APIs.
  //           const credential = googleAuth.credentialFromResult(result);
  //           const token = credential.accessToken;
  //       }).catch((error) => {
  //           // console.log("There was an error")
  //           // Handle Errors here.
  //           const errorCode = error.code;
  //           const errorMessage = error.message;
  //           // The email of the user's account used.
  //           const email = error.email;
  //           // The AuthCredential type that was used.
  //           const credential = googleAuth.credentialFromError(error);
  //           // ...
  //       })
  //   } else {
  //     setUser(auth.currentUser) 
  //   }
  // }

  // function logout() {
  //   auth.signOut().then(() => {console.log("signedout")});
  //   setUser(null) 
  //   setUserProPic(null)
  //   setUserName(null)
  //   window.location.href = '/'
  // }

  // if(hasUsername === false){
  //   return(
  //     <div>
  //       <p>Create a username for your account</p>
  //       <p>- 3-20 characters</p>
  //       <p>- no spaces or special characters</p>
  //       <input id="newusername" onKeyUp={() => {
  //         // console.log("keyup")
  //         newUsername = document.getElementById("newusername").value;

  //         var usernameFormat = /^(\d{3,20}|\w{3,20}){1}$/;;
  //         if(!usernameFormat.test(newUsername)){
  //           if(newUsername.length < 3) { 
  //             setAvailabilityMessage("Username is too short")
  //           } else if(newUsername.length > 20) {
  //              setAvailabilityMessage("Username is too long")
  //           } else {
  //             setAvailabilityMessage("Username cannont contain any spaces or special characters")
  //           }
  //           setUsernameAvailable(false)
  //         } else {
  //           dbGet(dbRef(rtdb, "/users/")).then((res) => {
  //             setUsernameAvailable(true)
  //             setAvailabilityMessage("")
  //             res.forEach((username) => {
  //               if(username._node.value_ == newUsername){
  //                 setUsernameAvailable(false)
  //                 setAvailabilityMessage("Sorry that username is already taken")
  //                 // console.log("MATCH")
  //               }
  //             })
  //           })
  //         }
  //     }}></input>
  //     <p>{availabilityMessage}</p>
  //       <button onClick={() => {
  //         dbSet(dbRef(rtdb, "/users/" + auth.currentUser.uid), newUsername)
  //         setUserName(newUsername)
  //         setHasUsername(true)
  //         globalUserName = newUsername;
  //         const userRef = collection(db, "users");
  //         setDoc(doc(userRef, newUsername), {
  //           uid: auth.currentUser.uid,
  //           name: auth.currentUser.displayName,
  //           propic: auth.currentUser.providerData[0].photoURL,
  //           username: globalUserName
  //         });
  //       }} disabled={!usernameAvailable}> Create Account</button>
  //     </div>
  //   )
  // } else {
    return (
      <Router>
        <div id="entireApp">
          {/* <h1>{userName}</h1> */}
          <nav className="nav-bar">
            <div className='header'>
              {/* <Link to={"/user/" + userName}><img className="profile" src={userProPic}/></Link> */}
              <h1 id="cvrpl">Bocce</h1>
            </div>
            <ul className="nav-bar-links">
              {/* <li className="nav-bar-link">
                <Link to="/">Home</Link>
              </li> */}
              <li className="nav-bar-link">
                <Link to="/play">Play!</Link>
              </li>
              {/* <li className="nav-bar-link">
                <Link to="/users">Users</Link>
              </li>
              <li className="nav-bar-link">
                <Link to="/uploadsong">+ Upload Orginal</Link>
              </li> */}
            </ul>
            {/* <button className="login" onClick={login}> Login </button>
            <button className="logout" onClick={logout}> Logout </button> */}
          </nav>

          <Routes>
            <Route path="/about" element={<Room/>}></Route>
            <Route path="/play" element={<Play/>}></Route>
            <Route path="/users" element={<Users/>}> </Route>
            <Route path="/uploadsong" element={<UploadSong/>}></Route>
            <Route path="/uploadcover" element={<UploadCover/>}></Route>
            <Route path="/user/:username" element={<UserProfile/>}> </Route>
            <Route path="/user/:username/:content" element={<UserContent/>}> </Route>
            <Route path="/user/:username/:originals" element={<UserContent/>}> </Route>
            <Route path="/user/:username/:originals/:song" element={<UserOriginal/>}> </Route>
            <Route path="/user/:username/:covers" element={<UserContent/>}> </Route>
            <Route path="/user/:username/:covers/:artist" element={<UserContent/>}> </Route>
            <Route path="/user/:username/:covers/:artist/:song" element={<UserCover/>}> </Route>
            <Route path="/user/:username/:likes" element={<UserContent/>}> </Route>
            <Route path="/user/:username/:matches" element={<UserContent/>}> </Route>
            <Route path="/user/:username/:matches/:match" element={<UserContent/>}> </Route>
            <Route path="/:roomid" element={<Room/>}> </Route>
            <Route path="/" element={<Home/>}> </Route>
          </Routes>
        </div>
      </Router>
    );
}

class Home extends React.Component {
  render() {
    return (
      <div className="Home">
        <h2>Home</h2>
      </div>
    ) 
  }
}

function Room() {
  const { roomid } = useParams();
  let players = [];
  let you = "Player1";

  let round = 0;

  let balls = [];
  let systemVelocity = 0;
  let distances = [];

  let topSpeed = 50;

  let yourTurnFade = 100;

  // Database values
  let ball = 0;
  let oppX = 0;
  let oppY = 0;

  let ptX = 0; 
  let ptY = 0;

  let rolling = false;

  let damping = 0.99675
  let vThrow = 9;  // Rolling damping
  let eball = 0.8;
  let eWall = 0.3;

  let x = 0;
  let y = 0;

  let toShoot = false;  // when true means a line is drawn and on mouseUp ball will throw

  // Scoring system is a little complicated 
  // Need to keep track of the score during the round 
  // and then assign the score.value to the redTotal or greenTotal when the round ends
  let score = {
    team: null,
    value: 0
  };
  let redScore = 0;
  let redTotalScore = 0;
  let greenScore = 0;
  let greenTotalScore = 0;

  let winningScore = 5;
  
  let playersTurn = "Player1";

  let waitingForPlayer2 = true;

  let gameOver = false;
  let gameOverMessage = "Game Over"

  auth.onAuthStateChanged(function (user) {
    dbGet(dbRef(rtdb, "/" + roomid + "/Players")).then((res) => {
      res.forEach((player) => {
        players.push(player.ref._path.pieces_[2])
      })
      dbSet(dbRef(rtdb, "/" + roomid + "/Players/Player" + (players.length+1)), auth.currentUser.uid)
      you = "Player" + + (players.length+1);

      // If you're the first player in the room
      if(players.length + 1 == 1){
        
      }
    }).then(() => {
      const dbState = dbRef(rtdb, "/" + roomid + "/state");
      onValue(dbState, (snapshot) => {
        let jsonState = JSON.parse(snapshot._node.value_);
        if(playersTurn != you){
          ball = jsonState.ball;
          rolling = jsonState.rolling;
          toShoot = jsonState.toShoot;
          x = jsonState.x;
          y = jsonState.y;
          if(!toShoot){
            oppX = jsonState.mouse[0];
            oppY = jsonState.mouse[1];

            if(oppX < 100){
              oppX = 100;
            } else if(oppX > 140){
              oppX = 140;
            }
  
            if(oppY < 200){
              oppY = 200;
            } else if(oppY > 440){
              oppY = 440;
            }

          } else {
            ptX = jsonState.mouse[0];
            ptY = jsonState.mouse[1];
          }
          balls = jsonState.balls;
          greenScore = jsonState.greenScore;
          redScore = jsonState.redScore;
          greenTotalScore = jsonState.greenTotalScore;
          redTotalScore = jsonState.redTotalScore;
          round = jsonState.round;
        }
        // ball = jsonState.ball;
        // // if(ball != 0) rolling = false;
        // if(ball == -1) {
        //   round += 1;
        //   ball += 1;
        //   redTotalScore = redScore;
        //   balls = [];
        //   greenTotalScore = greenScore;
        //   rolling = false;
        //   score = {
        //     team: null,
        //     value: 0
        //   };
        // } 
        // if((ball + round) % 2 == 0) playersTurn = "Player1"
        // if((ball + round) % 2 == 1) playersTurn = "Player2"
        // if(score.team == "red"){
        //   redScore = redTotalScore + score.value;
        //   greenScore = greenTotalScore;
        // }
        // if(score.team == "green"){
        //   greenScore = greenTotalScore + score.value
        //   redScore = redTotalScore;
        // }
        // // console.log(jsonState)
      })

      onValue(dbRef(rtdb, "/" + roomid + "/Players"), (snapshot) => {
        console.log(snapshot._node.children_.root_.key)
        if(snapshot._node.children_.root_.key == "Player2") {
          waitingForPlayer2 = false;
        }
      })

      // If the user exits the page
      // window.onbeforeunload = function (e) {
      //   var message = "If you leave the game will end!",
      //   e = e || window.event;
      //   // For IE and Firefox
      //   if (e) {
      //     e.returnValue = message;
      //   }
      
      //   // For Safari
      //   return message;
      // };

      window.onbeforeunload = function(){
        // const yourPlayer = dbRef(rtdb, "/" + roomid + "/Players/" + you)
        gameOverMessage = "The other player left :("
        gameOver = true;
        const yourRoom = dbRef(rtdb, "/" + roomid)
        dbSet(yourRoom, null);
        // dbSet(yourPlayer, null)
        // dbGet(theRoom).then((res) => {
        //   remove(res._node.value_)
        // })
        var message = "If you leave the game will end!",
        e = e || window.event;
        // For IE and Firefox
        if (e) {
          e.returnValue = message;
          // dbGet(theRoom).then((res) => {
          //   res.remove();
          // })
        }
        window.location.href = '/';
        return "You've left the game?";
      };

    })
  });

  function bocceBall(x, y, vx, vy) {
    this.x = x;
    this.y = y;
    this.vx = vx; 
    this.vy = vy;
  }
  
  const setup = (p5, canvasParentRef) => {
    p5.createCanvas(1400, 600).parent(canvasParentRef)
    p5.frameRate(30)
    let state = {
      rolling: rolling,
      mouse: [p5.mouseX, p5.mouseY],
      toShoot: toShoot,
      balls: balls,
      ball: ball, 
      round: round, 
      redTotalScore: redTotalScore,
      greenTotalScore: greenTotalScore,
      redScore: redScore,
      greenScore: greenScore
    }
    dbSet(dbRef(rtdb, "/" + roomid + "/state"), JSON.stringify(state))

    p5.mousePressed = () => {
      if(playersTurn == you && mouseInCourt(p5.mouseX, p5.mouseY, 100 - 15, 200 - 15, 600*2 + 30, 120*2 + 30) && rolling == false && waitingForPlayer2 == false && gameOver == false){
        toShoot = true;
        let state = {
          rolling: rolling,
          mouse: [p5.mouseX, p5.mouseY],
          toShoot: toShoot,
          balls: balls,
          ball: ball, 
          round: round, 
          redTotalScore: redTotalScore,
          greenTotalScore: greenTotalScore,
          redScore: redScore,
          greenScore: greenScore
        }
        dbSet(dbRef(rtdb, "/" + roomid + "/state"), JSON.stringify(state))
      }
    }

    p5.mouseReleased = () => {
      if(playersTurn == you && rolling == false && toShoot == true && waitingForPlayer2 == false && gameOver == false) {
        if(Math.sqrt(vThrow[0]**2 + vThrow[1]**2) > topSpeed){
          let theta = p5.atan2(vThrow[1], vThrow[0])
          vThrow[0] = topSpeed * Math.cos(theta);
          vThrow[1] = topSpeed * Math.sin(theta);
        } 
        balls.push(new bocceBall(x, y, vThrow[0], vThrow[1]))
        rolling = true;
        toShoot = false;

        let state = {
          rolling: rolling,
          mouse: [p5.mouseX, p5.mouseY],
          toShoot: toShoot,
          balls: balls,
          ball: ball, 
          round: round, 
          redTotalScore: redTotalScore,
          greenTotalScore: greenTotalScore,
          redScore: redScore,
          greenScore: greenScore
        }
        dbSet(dbRef(rtdb, "/" + roomid + "/state"), JSON.stringify(state))
      }
    }
  }
  
  const draw = p5 => {
    if(greenTotalScore >= winningScore && greenTotalScore >= redTotalScore + 2){
      gameOver = true;
      gameOverMessage = "GREEN WINS!"
    } else if(redTotalScore >= winningScore && redTotalScore >= greenTotalScore + 2){
      gameOver = true;
      gameOverMessage = "RED WINS!"
    }


    if((ball + round) % 2 == 0) playersTurn = "Player1"
    if((ball + round) % 2 == 1) playersTurn = "Player2"

    p5.background(70, 130, 70)

    // Draw the court
    p5.fill(140, 150, 125)
    p5.rect(100 - 15, 200 - 15, 600*2 + 30, 120*2 + 30)

    // Draw the foul line
    p5.stroke(255)
    p5.line(140 + 15, 200 - 15, 140 + 15, 440 + 15)
    p5.stroke(0)

    // Draw the scoreboard
    p5.textSize(40)
    p5.fill(255, 100, 100)
    p5.rect(575, 100, 125, 50)
    p5.fill(255)
    p5.text(redScore, 590, 140)
    p5.fill(100, 255, 100)
    p5.rect(575 + 150, 100, 125, 50)
    p5.fill(255)
    p5.text(greenScore, 575 + 175, 140)

    if(you == "Player1" && waitingForPlayer2){
      p5.text("Wating for Player2...", 100, 100)
    }

    if(gameOver) {
      p5.text(gameOverMessage, 600, 325)
    }

    // p5.text(round, 100, 100)

    if(playersTurn == you && yourTurnFade > 0 && toShoot == false){
      p5.text("Your Turn", 600, 500)
      if(yourTurnFade > -1) yourTurnFade -= 1;
    } else if(playersTurn != you) {
      yourTurnFade = 100;
    } else if (toShoot == true){
      yourTurnFade = 0;
    }

    // The active ball
    if(playersTurn == you){
      if(rolling == false){

        // Draw the ball
        if(balls.length == 0) {
          p5.fill(255)
          p5.ellipse(x, y, 16)
        } else if((balls.length + round) % 2 == 0){
          p5.fill(200, 30, 30)
          p5.ellipse(x, y, 30)
        } else {
          p5.fill(30, 200, 30)
          p5.ellipse(x, y, 30)
        }

        if(p5.mouseIsPressed && toShoot){
          p5.line(x, y, p5.mouseX, p5.mouseY)
          vThrow = [(p5.mouseX - x) / 10, (p5.mouseY - y)/10];
        } else {
          if(p5.mouseX > 100 && p5.mouseX < 140){
            x = p5.mouseX;
          } else if(p5.mouseX < 100){
            x = 100;
          } else if(p5.mouseX > 140){
            x = 140;
          }

          if(p5.mouseY > 200 && p5.mouseY < 440){
            y = p5.mouseY;
          } else if(p5.mouseY < 200){
            y = 200;
          } else if(p5.mouseY > 440){
            y = 440;
          }
        }
      } 
    // Not your turn
    } else {
      if(!rolling){
        if(balls.length == 0){
          p5.fill(255);
          p5.circle(oppX, oppY, 14)
        } else if((balls.length + round) % 2 == 0){
          p5.fill(200, 30, 30)
          p5.circle(oppX, oppY, 30)
        } else {
          p5.fill(30, 200, 30)
          p5.circle(oppX, oppY, 30)
        }
        if(toShoot){
          p5.line(oppX, oppY, ptX, ptY)
        } 
      }
      
      for(let i = 0; i < balls.length; i++){
        if(i == 0){
          p5.fill(255);
          p5.circle(balls[i].x, balls[i].y, 14)
        } else if((i + round) % 2 == 0){
          p5.fill(200, 30, 30)
          p5.circle(balls[i].x, balls[i].y, 30)
        } else {
          p5.fill(30, 200, 30)
          p5.circle(balls[i].x, balls[i].y, 30)
        }
      }

      p5.fill(255)
      // systemVelocity = 0;

      // for(let i = 0; i < balls.length; i++){
      //   systemVelocity += p5.sqrt(balls[i].vx**2 + balls[i].vy**2)
      // }

      // p5.text(systemVelocity, 100, 150)


      // // SCORING (not your turn)
      // if(balls.length > 1) {
      //   let stop = false;
      //   let closestPlayer;
      //   let roundScore = 0;
      //   distances = [];
      //   // console.log(balls.length)
      //   for(let i = 1; i < balls.length; i++) {
      //     distances.push(p5.dist(balls[0].x, balls[0].y, balls[i].x, balls[i].y))
      //   }
      //   // console.log(distances)
      //   let failsafe = 0
      //   roundScore = 0;
      //   while(stop == false){
      //     let closestBall = {
      //       value: Math.min(...distances), 
      //       index: distances.indexOf(Math.min(...distances))
      //     }
      //     distances[ closestBall.index ] = 10000;
          
      //     if(closestBall.index % 2 == 0){
      //       if(closestPlayer == "red"){
      //         stop = true;
      //         break;
      //       }
      //       closestPlayer = "green"
      //       roundScore += 1;
      //       score = {
      //         team: "green",
      //         value: roundScore
      //       }
      //     } else {
      //       if(closestPlayer == "green"){
      //         stop = true;
      //         break;
      //       }
      //       closestPlayer = "red"
      //       roundScore += 1;
      //       score = {
      //         team: "red",
      //         value: roundScore
      //       }
      //     }
      //     failsafe += 1;
      //     if(failsafe > 10) {
      //       stop = true;
      //       break;
      //     }
      //   }
      //   if(score.value == 11)  score.value = 1;

      //   if(score.team == "red"){
      //     redScore = redTotalScore + score.value;
      //     greenScore = greenTotalScore;
      //   }
      //   if(score.team == "green"){
      //     greenScore = greenTotalScore + score.value
      //     redScore = redTotalScore;
      //   }
      //   // if((ball + round) % 2 == 0) playersTurn = "Player1"
      //   // if((ball + round) % 2 == 1) playersTurn = "Player2"
      // }

      // if(rolling && systemVelocity < 0.01){
      //   if(ball + 1 == 9){
      //     round += 1;
      //     console.log("FUCK FUCK FUCKFUCK ")
      //     // dbSet(dbRef(rtdb, "/" + roomid + "/ball"), 0)
      //     ball = 0;
      //     redTotalScore = redScore;
      //     balls = [];
      //     greenTotalScore = greenScore;
      //     rolling = false;
      //     score = {
      //       team: null,
      //       value: 0
      //     };
      //   }
      //   rolling = false;
      // }
    }

    

    //  Collision handling
    p5.fill(255)
    systemVelocity = 0;
    if(playersTurn == you){
      // Handle the collisions of the system of balls on the court
      for(let k = -5; k < 5; k++){
        for(let i = 0; i < balls.length; i++){

          // If a ball is going slow enough make it's velocity zero
          if(p5.sqrt(balls[i].vx**2 + balls[i].vy**2) < 0.01){
            balls[i].vx = 0;
            balls[i].vy = 0
          }
  
          if(k == 4){
            if(i == 0){
              p5.fill(255);
              p5.circle(balls[i].x, balls[i].y, 14)
            } else if((i + round) % 2 == 0){
              p5.fill(200, 30, 30)
              p5.circle(balls[i].x, balls[i].y, 30)
            } else {
              p5.fill(30, 200, 30)
              p5.circle(balls[i].x, balls[i].y, 30)
            }
          }
          
  
          // Step 1/4 frame ahead
          balls[i].x += balls[i].vx/10;
          balls[i].vx *= damping;
          balls[i].y += balls[i].vy/10;
          balls[i].vy *= damping;
  
          if(i == 0){
            if(balls[i].x < 100 - 7) {
              balls[i].vx *= -eWall;
              balls[i].x = 100 - 7;
              // balls[i].x += balls[i].vx;
            }
            if(balls[i].x > 1300 + 7) {
              balls[i].vx *= -eWall;
              balls[i].x = 1300 + 7;
              // balls[i].x += balls[i].vx;
            }
            if(balls[i].y < 200 - 7){
              balls[i].vy *= -eWall;
              balls[i].y = 200 - 7;
              // balls[i].y += balls[i].vy;
            }
            if(balls[i].y > 440 + 7){
              balls[i].vy *= -eWall;
              balls[i].y = 440 + 7;
              // balls[i].y += balls[i].vy;
            }
          } else {
            if(balls[i].x < 100) {
              balls[i].vx *= -eWall;
              balls[i].x = 100;
              // balls[i].x += balls[i].vx;
            }
            if(balls[i].x > 1300) {
              balls[i].vx *= -eWall;
              balls[i].x = 1300;
              // balls[i].x += balls[i].vx;
            }
            if(balls[i].y < 200){
              balls[i].vy *= -eWall;
              balls[i].y = 200;
              // balls[i].y += balls[i].vy;
            }
            if(balls[i].y > 440){
              balls[i].vy *= -eWall;
              balls[i].y = 440;
              // balls[i].y += balls[i].vy;
            }
          }
          
          for(let j = i; j < balls.length; j++){
            if(i == 0){
              if(i != j && p5.dist(balls[j].x, balls[j].y, balls[i].x, balls[i].y) < 15 + 8){
                let x1 = [balls[j].x, balls[j].y];
                let x2 = [balls[i].x, balls[i].y];
                let v1 = [balls[j].vx, balls[j].vy];
                let v2 = [balls[i].vx, balls[i].vy];
                
                let num1 = dotProduct(vectorSub(v1,v2), vectorSub(x1,x2));        // Numerator 1
                let num2 = vectorSub(x1,x2);                                      // Numerator 2
                let den1 = vectorMag(vectorSub(x1,x2))**2;                        // Denominator 1
      
                
                let num3 = dotProduct(vectorSub(v2,v1), vectorSub(x2,x1));        // Numerator 3
                let num4 = vectorSub(x2,x1);                                      // Numerator 4
                let den2 = vectorMag(vectorSub(x2,x1))**2;                        // Denominator 2
      
                let newv1 = vectorSub(v1, vectorMult(num2,(num1/den1)));
                let newv2 = vectorSub(v2, vectorMult(num4,(num3/den2)));
  
                // Update the positions
                // balls[j].x -= balls[j].vx;
                // balls[j].y -= balls[j].vy;
                balls[i].x -= balls[i].vx/5;
                balls[i].y -= balls[i].vy/5;
                
                // Update the velocities
                balls[j].vx = newv1[0] * 0.6;
                balls[j].vy = newv1[1] * 0.6;
                balls[i].vx = newv2[0] * 1.5;
                balls[i].vy = newv2[1] * 1.5;
                
                // Update the positions
                // balls[j].x += balls[j].vx/4;
                // balls[j].y += balls[j].vy/4;
                balls[i].x += balls[i].vx/10;
                balls[i].y += balls[i].vy/10;
              }
            } else {
              if(i != j && p5.dist(balls[j].x, balls[j].y, balls[i].x, balls[i].y) < 30){
                let x1 = [balls[j].x, balls[j].y];
                let x2 = [balls[i].x, balls[i].y];
                let v1 = [balls[j].vx, balls[j].vy];
                let v2 = [balls[i].vx, balls[i].vy];
      
                
                let num1 = dotProduct(vectorSub(v1,v2), vectorSub(x1,x2));        // Numerator 1
                let num2 = vectorSub(x1,x2);                                      // Numerator 2
                let den1 = vectorMag(vectorSub(x1,x2))**2;                        // Denominator 1
      
                
                let num3 = dotProduct(vectorSub(v2,v1), vectorSub(x2,x1));        // Numerator 3
                let num4 = vectorSub(x2,x1);                                      // Numerator 4
                let den2 = vectorMag(vectorSub(x2,x1))**2;                        // Denominator 2
      
                let newv1 = vectorSub(v1, vectorMult(num2,(num1/den1)));
                let newv2 = vectorSub(v2, vectorMult(num4,(num3/den2)));
  
                // Revert to previous positions
                // balls[j].x -= balls[j].vx;
                // balls[j].y -= balls[j].vy;
                balls[i].x -= balls[i].vx/10;
                balls[i].y -= balls[i].vy/10;
                
                // Update the velocities
                balls[j].vx = newv1[0] * eball;
                balls[j].vy = newv1[1] * eball;
                balls[i].vx = newv2[0] * eball;
                balls[i].vy = newv2[1] * eball;
                
                // Update the positions
                // balls[j].x += balls[j].vx/4;
                // balls[j].y += balls[j].vy/4;
                balls[i].x += balls[i].vx/10;
                balls[i].y += balls[i].vy/10;
              }
            }
          }
          if(k == 4) systemVelocity += p5.sqrt(balls[i].vx**2 + balls[i].vy**2)
        }
      }

      if(balls.length > 1) {
        let stop = false;
        let closestPlayer;
        let roundScore = 0;
        distances = [];
        // console.log(balls.length)
        for(let i = 1; i < balls.length; i++) {
          distances.push(p5.dist(balls[0].x, balls[0].y, balls[i].x, balls[i].y))
        }
        // console.log(distances)
        let failsafe = 0
        roundScore = 0;
        while(stop == false){
          let closestBall = {
            value: Math.min(...distances), 
            index: distances.indexOf(Math.min(...distances))
          }
          distances[ closestBall.index ] = 10000;
          
          if((closestBall.index + round) % 2 == 0){
            if(closestPlayer == "red"){
              stop = true;
              break;
            }
            closestPlayer = "green"
            roundScore += 1;
            score = {
              team: "green",
              value: roundScore
            }
          } else {
            if(closestPlayer == "green"){
              stop = true;
              break;
            }
            closestPlayer = "red"
            roundScore += 1;
            score = {
              team: "red",
              value: roundScore
            }
          }
          failsafe += 1;
          if(failsafe > 10) {
            stop = true;
            break;
          }
        }
        if(score.value == 11)  score.value = 1;

        if(score.team == "red"){
          redScore = redTotalScore + score.value;
          greenScore = greenTotalScore;
        }
        if(score.team == "green"){
          greenScore = greenTotalScore + score.value
          redScore = redTotalScore;
        }
        // if((ball + round) % 2 == 0) playersTurn = "Player1"
        // if((ball + round) % 2 == 1) playersTurn = "Player2"
      }

      if(rolling && systemVelocity < 0.01){
          if(ball + 1 == 9){
            redTotalScore = redScore;
            greenTotalScore = greenScore;
            if(greenTotalScore >= winningScore && greenTotalScore >= redTotalScore + 2){
              gameOver = true;
              gameOverMessage = "GREEN WINS!"
            } else if(redTotalScore >= winningScore && redTotalScore >= greenTotalScore + 2){
              gameOver = true;
              gameOverMessage = "RED WINS!"
            }
            if(!gameOver){
              round += 1;
              // dbSet(dbRef(rtdb, "/" + roomid + "/ball"), 0)
              ball = 0;
              balls = [];
              rolling = false;
              score = {
                team: null,
                value: 0
              };
              let state = {
                rolling: false,
                mouse: [p5.mouseX, p5.mouseY],
                toShoot: toShoot,
                balls: balls,
                ball: ball, 
                round: round, 
                redTotalScore: redTotalScore,
                greenTotalScore: greenTotalScore,
                redScore: redScore,
                greenScore: greenScore
              }
              dbSet(dbRef(rtdb, "/" + roomid + "/state"), JSON.stringify(state))
            }
        } else {
          // dbSet(dbRef(rtdb, "/" + roomid + "/ball"), ball+1)
          ball += 1;
          let state = {
            rolling: false,
            mouse: [p5.mouseX, p5.mouseY],
            toShoot: toShoot,
            balls: balls,
            ball: ball, 
            round: round, 
            redTotalScore: redTotalScore,
            greenTotalScore: greenTotalScore,
            redScore: redScore,
            greenScore: greenScore
          }
          dbSet(dbRef(rtdb, "/" + roomid + "/state"), JSON.stringify(state))
        }
        rolling = false;
      }
      if(systemVelocity < 0.01) systemVelocity = 0;
      // Calculate and sort ball distances to white ball

      let state = {
        rolling: rolling,
        mouse: [p5.mouseX, p5.mouseY],
        toShoot: toShoot,
        balls: balls,
        ball: ball, 
        round: round, 
        redTotalScore: redTotalScore,
        greenTotalScore: greenTotalScore,
        redScore: redScore,
        greenScore: greenScore
      }
      dbSet(dbRef(rtdb, "/" + roomid + "/state"), JSON.stringify(state))
    }
  }
  return <Sketch setup={setup} draw={draw} />
}

function mouseInCourt(x, y, courtX, courtY, courtW, courtH) {
  if(x > courtX && x < courtX + courtW && y > courtY && y < courtY + courtH){
    return true;
  } else {
    return false;
  }
}

function dotProduct(a,b){
  // Dot product of a*b (inner product/ scalar product)
  let product = 0;
  
  if (a.length !== b.length){
    return undefined;
  }
  else{
    for(let i = 0; i < a.length; i++){
      product += a[i]*b[i];
    }
    return product; // this is a scalar (just a number)
  }
}

function vectorMag(v){
  // Vector magnitude
  let mag = 0;
  for(let i of v){
    mag += i**2
  }
  return Math.sqrt(mag); // this is also a scalar
}

function vectorSub(a,b){
  // Subtracts vector b from vector a
  let sub = []
  
  if (a.length !== b.length){
    return undefined;
  }
  else{
    for(let i = 0; i < a.length; i++){
      sub[i] = a[i]-b[i];
    }
    return sub; // this is a vector
  }
}

function vectorMult(v,s){
  // Multiplies vector (v) by scalar (s)
  let mult = [];
  for(let i = 0; i < v.length; i++){
    mult[i] = v[i]*s;
  }
  return mult; // This is also a vector
}

function About() {
  const setup = (p5, canvasParentRef) => {
    p5.createCanvas(500, 400).parent(canvasParentRef)
  }
  
  const draw = p5 => {
    p5.background(255, 130, 20)
    p5.ellipse(p5.mouseX, 100, 100)
    p5.ellipse(300, 100, 100)
  }
  
  return <Sketch setup={setup} draw={draw} />
  // return (
  //   <div class="About">
  //     <h2>About</h2>
  //     <canvas id="canvas"></canvas>
  //   </div>
  // )
}

function Play() {
  return (
    <div class="Play">
      <h2>Click below to create a game, then send the link to a friend to play.</h2>
      <Link to={"/" + auth.currentUser.uid + "/"}>Click here to start a game!</Link>
    </div>
  )
}


function Users() {
  // const [usersArray, setUsersArray] = React.useState([])
  // React.useEffect(() => {
  //   let dbUsernames = [];
  //   // let numberOfUsers = 0;
  //   dbGet(dbRef(rtdb, "/users/")).then((res) => {
  //     res.forEach((u) => {
  //       // let userImgSrc;
  //       // numberOfUsers += 1;
  //       if(u._node.value_ != "default") {
  //         dbUsernames.push(<li key={u._node.value_}><Link to={"/user/" + u._node.value_}>{u._node.value_}</Link></li>)
  //       }
  //     })
  //   }).then(() => {
  //     setUsersArray(dbUsernames)
  //   })
  // }, [])
  
  return (
    <div className="Users">
      <h2>Users</h2>
      {/* <nav>
        <ul>
          {usersArray}
        </ul>
      </nav> */}
    </div>
  )
}

function UserProfile() {
  // const { username } = useParams();
  // const [userPic, setUserPic] = React.useState(null);
  // const [userOriginals, setUserOriginals] = React.useState(null);
  // const [userCovers, setUserCovers] = React.useState(null);
  // const [aboutMe, setAboutMe] = React.useState(null);

  // let originalsComponentArray = [];
  // let coversComponentArray = [];
  // let uid;

  // React.useEffect(() => {
  //   // console.log("This will only run once!")
  //   getDoc(doc(db, "users", username)).then((docSnap) => {
  //     let profs = [];
  //     // console.log(docSnap.data())
  //     uid = docSnap.data().uid;
  //     setUserPic(docSnap.data().propic)
  //     console.log(docSnap.data().propic)
  //   }).then(() => {
  //     const storage = getStorage();
  //     const originalsRef = ref(storage, uid + '/originals');
  //     listAll(originalsRef)
  //     .then((res) => {
  //       res.items.forEach((itemRef) => {
  //         let songPath = itemRef._location.path_.split('/')
  //         getDownloadURL(itemRef).then((url) => {
  //           let songFileName = songPath[songPath.length-1].slice(0,-4);

  //           // If filename has spaces in it add dashes
  //           if(songFileName.split(' ').length > 1){
  //             let songWords = songFileName.split(' ');
  //             songFileName = "";
  //             for(let i = 0; i < songWords.length; i++){
  //               if(i != songWords.length - 1) {
  //                 songFileName = songFileName.concat(songWords[i],'-');
  //               } else {
  //                 songFileName = songFileName.concat(songWords[i])
  //               }
  //             }
  //           }
  //           originalsComponentArray.push(<li key={url}><Link to={"/user/" + username + "/originals/" + songFileName}>{songPath[songPath.length-1].slice(0,-4)}</Link></li>);
  //         }).then(() => {
  //           if(originalsComponentArray.length == res.items.length) setUserOriginals(originalsComponentArray)
  //         }).catch((error) => {
  //           console.log(error)
  //         })
  //       });
  //     }).catch((error) => {
  //       // Uh-oh, an error occurred!
  //     });

  //     const coversRef = ref(storage, uid + '/covers');
  //     // console.log(coversRef)
  //     let numberOfCovers = 0;
  //     let originalArtist;
  //     let originalSongName;
  //     listAll(coversRef)
  //     .then((res) => {
  //       for(let i = 0; i < res.prefixes.length; i++){
  //         let artistRef = ref(storage, res.prefixes[i]._location.path_);
  //         listAll(artistRef)
  //         .then((art) => {
  //           for(let k = 0; k < art.prefixes.length; k++){
  //             let songRef = ref(storage, art.prefixes[k]._location.path_)
  //             listAll(songRef).then((song) => {
  //               for(let j = 0; j < song.items.length; j++){
  //                 numberOfCovers += 1;
  //                 // console.log(song.items[0]._location.path_)
  //                 let songPath = song.items[j]._location.path_.split('/');
  //                 getDownloadURL(song.items[j]).then((url) => {
  //                   originalArtist = song.items[0]._location.path_.split('/')[2]; 
  //                   originalSongName = song.items[0]._location.path_.split('/')[3];

  //                   // Replace spaces with dashes in song name
  //                   if(originalSongName.split(' ').length > 1){
  //                     let songWords = originalSongName.split(' ');
  //                     originalSongName = "";
  //                     for(let i = 0; i < songWords.length; i++){
  //                       if(i != songWords.length - 1) {
  //                         originalSongName = originalSongName.concat(songWords[i],'-');
  //                       } else {
  //                         originalSongName = originalSongName.concat(songWords[i])
  //                       }
  //                     }
  //                   }
  //                   coversComponentArray.push(<li key={url}><Link to={"/user/" + username + "/covers/" + originalArtist + "/" + originalSongName}>{originalArtist + " - " + song.items[0]._location.path_.split('/')[3]}</Link></li>);
  //                 }).then(() => {
  //                   // console.log(numberOfCovers)
  //                   if(coversComponentArray.length == numberOfCovers) {
  //                     setUserCovers(coversComponentArray)
  //                   }
  //                 }).catch((error) => {
  //                   console.log(error)
  //                 })
  //               }
  //             })
  //           }
  //         })
  //       }
  //     }).catch((error) => {
  //       // Uh-oh, an error occurred!
  //     });
  //   })

  //   getDoc(doc(db, "users/" + username + "/About/UserInfo/")).then((docSnap) => {
  //     if(docSnap.data()) setAboutMe(<p>{docSnap.data().Info}</p>)
  //     console.log(aboutMe)
  //   })
  // }, [username])

  // if(username == globalUserName) {
    return (
      <div className="UserProfile">
        <h2>Profile</h2>
      </div>
    );
  // } else {
  //   return (
  //     <div className="UserProfile">
  //       <h2>{username}</h2>
  //       <img src={userPic}/>
  //       <h3>About:</h3>
  //       <div style={{whiteSpace: "pre-wrap"}}>{aboutMe}</div>
  //       <h3>Originals</h3>
  //       <nav>
  //         <ul>
  //           {userOriginals}
  //         </ul>
  //       </nav>

  //       <h3>Covers</h3>
  //       <nav>
  //         <ul>
  //           {userCovers}
  //         </ul>
  //       </nav>
  //     </div>
  //   );
  // }
}

function UserContent() {
  const song = useParams()['content'];
  // let coverVersions = {artist1: song, artist: song, artist: song, 'Cover4'};
  // console.log(song)
  return (
    <div>
      {/* <h2>{song}</h2> */}
    </div>
  );
}

function UserOriginal() {
  // const song = useParams()['song'];
  // const user = useParams()['username']
  // const [songComponent, setSongComponent] = React.useState(null);
  // const [coversComponent, setCoversComponent] = React.useState(<p>No covers yet</p>);
  // const [songInfo, setSongInfo] = React.useState(null);
  // let coveredBy = ["Allen", "Brian", "Cindy", "Daniel"];
  // let uid;
  // // console.log(song)

  // Convert dashes to spaces in song name
  // let undashedSong = "";
  // if(song.split('-').length > 1){
  //   let songWords = song.split('-');
  //   for(let i = 0; i < songWords.length; i++){
  //     if(i != songWords.length - 1) {
  //       undashedSong = undashedSong.concat(songWords[i],' ');
  //     } else {
  //       undashedSong = undashedSong.concat(songWords[i])
  //     }
  //   }
  // } else {
  //   undashedSong = song;
  // }


  // React.useEffect(() => {
  //   // console.log("This will only run once!")
    
  //   // getData();
  //   getDoc(doc(db, "users", user)).then((docSnap) => {
  //     // let profs = [];
  //     // console.log(docSnap.data())
  //     uid = docSnap.data().uid;
  //     // setUserPic(docSnap.data().propic)
  //     // console.log(docSnap.data().propic)
  //   }).then(() => {
  //     const storage = getStorage();
  //     const itemRef = ref(storage, uid + '/originals/'+ undashedSong + ".mp3");
  //     getDownloadURL(itemRef).then((url) => {
  //       // console.log(url)
  //       setSongComponent(<SongPlayer songSource={url} songName = {undashedSong} />)
  //     }).catch((error) => {
  //       console.log(error)
  //     })
  //   })

  //   getDoc(doc(db, "users/" + user + "/Originals/" + undashedSong)).then((docSnap) => {
  //     // console.log(docSnap.data())
  //     let coverVersions = docSnap.data();
  //     let coversArray = [];
  //     // console.log(coverVersions)
  //     for (const coverArtist in coverVersions) {
  //       // console.log(coverArtist, coverVersions[coverArtist]);
  //       // console.log("user/" + coverArtist + "/Covers/" + user + "/" + song)
  //       if(coverArtist != 'default'){
  //         coversArray.push(
  //           <li key={coverArtist + song}>
  //             <Link to={"/user/" + coverArtist + "/Covers/" + user + "/" + song}>{coverArtist}</Link>
  //           </li>
  //         )
  //       }
  //     }
  //     if(coversArray.length > 0) setCoversComponent(coversArray)
  //   })

  //   getDoc(doc(db, "users/" + user + "/Originals/" + undashedSong + "/Info/SongInfo")).then((docSnap) => {
  //     if(docSnap.data()) setSongInfo(<p>{docSnap.data().Lyrics}</p>)
  //   })

  // }, [])

  // if(user != globalUserName) {
    return (
      <div className="Original">
        <h1>HI</h1>
      </div>
    );
  // } else {
  //   return (
  //     <div className="Original">
  //       <h2>{undashedSong}</h2>
  //       <div>{songComponent}</div>
  //       {/* <input></input> */}
  //       <p>Description, Lyics, Tabs etc.</p>
  //       <textarea id="songInfo" style={{whiteSpace: "pre-wrap"}}></textarea>
  //       <button onClick={() => {
  //         const infoRef = collection(db, "users/" + globalUserName + "/Originals/" + undashedSong + "/Info/");
  //         setSongInfo(document.getElementById("songInfo").value)
  //         setDoc(doc(infoRef, "SongInfo"), {
  //           Lyrics: document.getElementById("songInfo").value
  //         });
  //       }}>SAVE</button>
  //       <div style={{whiteSpace: "pre-wrap"}}>{songInfo}</div>
  //       <h3>Cover Versions by</h3>
  //       <nav className="Original">
  //         {coversComponent}
  //       </nav>
  //     </div>
  //   );
  // }
}

function UserCover() {
  // const song = useParams()['song'];
  // const user = useParams()['username'];  // Cover artist
  // const artist = useParams()['artist'];  // Original artist
  // const [songComponent, setSongComponent] = React.useState(null);
  // let uid;
  // let coveredBy = ["Allen", "Brian", "Cindy", "Daniel"];
  // // console.log(song)

  // // Convert dashes to spaces in song name
  // let undashedSong = "";
  // if(song.split('-').length > 1){
  //   let songWords = song.split('-');
  //   for(let i = 0; i < songWords.length; i++){
  //     if(i != songWords.length - 1) {
  //       undashedSong = undashedSong.concat(songWords[i],' ');
  //     } else {
  //       undashedSong = undashedSong.concat(songWords[i])
  //     }
  //   }
  // } else {
  //   undashedSong = song;
  // }

  // React.useEffect(() => {
  //   // console.log("This will only run once!")
    
  //   // getData();
  //   getDoc(doc(db, "users", user)).then((docSnap) => {
  //     // let profs = [];
  //     // console.log(docSnap.data())
  //     uid = docSnap.data().uid;
  //     // setUserPic(docSnap.data().propic)
  //     // console.log(docSnap.data().propic)
  //   }).then(() => {
  //     const storage = getStorage();

  //     const userRef = collection(db, "users/" + artist + "/Originals/");
  //     getDoc(doc(userRef, undashedSong)).then((songFile) => {
  //       // console.log(songFile._document.data.value.mapValue.fields[user].stringValue.split('/')[3])
  //       const itemRef = ref(storage, uid + '/covers/'+ artist + "/" + songFile._document.data.value.mapValue.fields[user].stringValue.split('/')[3]);
  //       listAll(itemRef).then((song) => {
  //         // console.log(song.items[0]._location.path_)
  //         // console.log(itemRef)
  //         getDownloadURL(ref(storage, song.items[0]._location.path_)).then((url) => {
  //           // console.log(url)
  //           setSongComponent(<SongPlayer songSource={url} songName = {song} />)
  //         }).catch((error) => {
  //           console.log(error)
  //         })
  //       })
  //     });
  //   })
  // }, [])

  return (
    <div className="Cover">
      <h4>Hello</h4>
    </div>
  );
}

function SongPlayer(props) {
    return (
        <div className="SongPlayer">
            {/* <p >{props.songName ? props.songName.slice(0,-4) : "unnamed"}</p> */}
            <audio controls className="Player">
                <source src={props.songSource} type="audio/mpeg" />
            </audio>
        </div>
    )  
}

function UploadSong() {
  // const [percent, setPercent] = React.useState(null);
  // const [originalUpload, setOriginalUpload] = React.useState(null);
  // const [songName, setSongName] = React.useState(null);
  // const [message, setMessage] = React.useState(null);
  // const [uploadButton, setUploadButton] = React.useState(<input type="file" id="myFile" allow="audio/mp3" name="filename" onChange={(e) => handleFile(e)}></input>);

  // let numberOfOriginals = 0;
  // let numberOfCovers = 0;

  // // auth.onAuthStateChanged(function (user) {
  // //   if(user){
      
  // //   }
  // // });

  // React.useEffect(() => {
  //   const storage = getStorage();
  //     if(auth.currentUser && auth.currentUser.uid != null){
  //       const originalsRef = ref(storage, auth.currentUser.uid + '/originals/');
  //       const coversRef = ref(storage, auth.currentUser.uid + '/covers/');
  //       listAll(originalsRef)
  //       .then((res) => {
  //         // console.log(res.items.length);
  //         numberOfOriginals = res.items.length;
  //       }).then(() => {
  //         listAll(coversRef)
  //         .then((coverArtists) => {
  //           coverArtists.prefixes.forEach((coversOfArtist) => {
  //             listAll(coversOfArtist).then((res) => {
  //               // console.log(res)
  //               numberOfCovers += res.prefixes.length
  //               // console.log("You've made " + numberOfCovers + " covers")
  //               if(numberOfOriginals - numberOfCovers > 0){
  //                 // console.log("You've uploaded " + numberOfOriginals + " originals and " + numberOfCovers + "covers")
  //                 setMessage("You'll be able to upload another original after you submit your next cover");
  //                 setUploadButton(<input type="file" id="myFile" allow="audio/mp3" name="filename" onChange={(e) => handleFile(e)} disabled ></input>);
  //                 return;
  //               } else {
  //                 setMessage("");
  //                 setUploadButton(<input type="file" id="myFile" allow="audio/mp3" name="filename" onChange={(e) => handleFile(e)} ></input>);
  //               }
  //             })
  //           })
  //         })
  //         if(numberOfOriginals - numberOfCovers > 0){
  //           // console.log("You've uploaded " + numberOfOriginals + " originals and " + numberOfCovers + "covers")
  //           setMessage("You'll be able to upload another original after you submit your next cover");
  //           setUploadButton(<input type="file" id="myFile" allow="audio/mp3" name="filename" onChange={(e) => handleFile(e)} disabled ></input>);
  //           return;
  //         } else {
  //           setMessage("");
  //           setUploadButton(<input type="file" id="myFile" allow="audio/mp3" name="filename" onChange={(e) => handleFile(e)} ></input>);
  //         }
  //       }).catch((error) => {
  //         // Uh-oh, an error occurred!
  //       });
  //     } else {
  //       // <Navigate to="/About" />;
  //       window.location.href = '/'
  //       // setUploadButton(<input type="file" id="myFile" allow="audio/mp3" name="filename" onChange={(e) => handleFile(e)} disabled ></input>);
  //       // setMessage("You must be logged in to upload a song.  If you are logged in navigate here from the home page.");
  //     }
  // }, [])

  // function handleFile(e){
  //   let file = e.target.files[0];

  //   const storage = getStorage();

  //   if(file.type != 'audio/mpeg'){
  //     setMessage("File type must be an mp3.");
  //     file = null;
  //     return;
  //   }

  //   var format = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;
  //   let fileNameString = file.name.split('.')[0]
  //   if(format.test(fileNameString)){
  //     setMessage("File name cannont contain any special characters")
  //     file = null;
  //     return;
  //   } 

  //   if(file.size / 1024 / 1024 > 10){
  //     setMessage("File cannot be more than 10mb")
  //     file = null;
  //     return;
  //   }

  //   const metadata = {
  //     contentType: 'audio/mpeg'
  //   };

  //   const storageRef = ref(storage, auth.currentUser.uid + '/originals/' + file.name);

  //   const userRef = collection(db, "users/" + globalUserName + "/Originals/");
  //   // console.log(userRef)
  //   setDoc(doc(userRef, file.name.split('.')[0]), {
  //     default: "path"
  //   });

  //   let feedMessage = globalUserName + " uid: " + auth.currentUser.uid + " uploaded " + file.name.split('.')[0];
  //   dbSet(dbRef(rtdb, "/activity/" + Date.now()), feedMessage)

  //   const uploadTask = uploadBytesResumable(storageRef, file, metadata);

  //   uploadTask.on('state_changed',
  //     (snapshot) => {
  //       // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
  //       const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
  //       setPercent(progress)
  //       // console.log('Upload is ' + progress + '% done');
  //       switch (snapshot.state) {
  //         case 'paused':
  //           // console.log('Upload is paused');
  //           break;
  //         case 'running':
  //           console.log('Upload is running');
  //           break;
  //       }
  //     }, 
  //     (error) => {
  //       // A full list of error codes is available at
  //       // https://firebase.google.com/docs/storage/web/handle-errors
  //       switch (error.code) {
  //         case 'storage/unauthorized':
  //           // console.log("unauthorized")
  //           // User doesn't have permission to access the object
  //           break;
  //         case 'storage/canceled':
  //           // console.log("cancaled")
  //           // User canceled the upload
  //           break;

  //         // ...

  //         case 'storage/unknown':
  //           console.log("unknown")
  //           // Unknown error occurred, inspect error.serverResponse
  //           break;
  //       }
  //     }, 
  //     () => {
  //       // Upload completed successfully, now we can get the download URL
  //       getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
  //         // console.log('File available at', downloadURL);
  //         setOriginalUpload(downloadURL)
  //         setUploadButton(<input type="file" id="myFile" allow="audio/mp3" name="filename" onChange={(e) => handleFile(e)} disabled></input>)
  //       });
  //     }
  //   );
  // }

  return (
    <div className="UploadOriginal">
      <div className="upload">
        <h2>Upload an original:</h2>
      </div>
    </div>
  )
}

function UploadCover() {
  // const artist = useParams()['username'];  // The original artist
  // const song = useParams()['song'];
  // // console.log("This ARTIST is " + artist);
  // const [percent, setPercent] = React.useState(null);
  // const [coverUpload, setCoverUpload] = React.useState(null);
  // const [songName, setSongName] = React.useState(null);
  // const [message, setMessage] = React.useState(null);
  // const [uploadButton, setUploadButton] = React.useState(<input type="file" id="myFile" allow="audio/mp3" name="filename" onChange={(e) => handleFile(e)} disabled></input>);

  // let numberOfOriginals = 0;
  // let numberOfCovers = 0;

  // // Convert dashes to spaces in song name
  // let undashedSong = "";
  // if(song.split('-').length > 1){
  //   let songWords = song.split('-');
  //   for(let i = 0; i < songWords.length; i++){
  //     if(i != songWords.length - 1) {
  //       undashedSong = undashedSong.concat(songWords[i],' ');
  //     } else {
  //       undashedSong = undashedSong.concat(songWords[i])
  //     }
  //   }
  // } else {
  //   undashedSong = song;
  // }

  // React.useEffect(() => {
  //   if(auth.currentUser && auth.currentUser.uid != null){
  //     setUploadButton(<input type="file" id="myFile" allow="audio/mp3" name="filename" onChange={(e) => handleFile(e)} ></input>)
  //   }
  // }, [])

  // function handleFile(e){
  //   let file = e.target.files[0];

  //   const storage = getStorage();
  //   const originalsRef = ref(storage, auth.currentUser.uid + '/originals/');
  //   const coversRef = ref(storage, auth.currentUser.uid + '/covers/');

  //   if(file.type != 'audio/mpeg'){
  //     setMessage("File type must be an mp3.");
  //     file = null;
  //     return;
  //   }

  //   var format = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;
  //   let fileNameString = file.name.split('.')[0]
  //   if(format.test(fileNameString)){
  //     setMessage("File name cannont contain any special characters")
  //     file = null;
  //     return;
  //   } 

  //   if(file.size / 1024 / 1024 > 10){
  //     setMessage("File cannot be more than 10mb")
  //     file = null;
  //     return;
  //   }

  //   const metadata = {
  //     contentType: 'audio/mpeg'
  //   };

  //   // const storageRef = ref(storage, auth.currentUser.uid + '/covers/' + artist + "/" +  file.name);
  //   const storageRef = ref(storage, auth.currentUser.uid + '/covers/' + artist + "/" + undashedSong + "/" + file.name);


  //   // Write the path to the file's location in Storage in the Firestore Database
  //   const userRef = collection(db, "users/" + artist + "/Originals");
  //   updateDoc(doc(userRef, undashedSong), {
  //     // [auth.currentUser.displayName]: auth.currentUser.uid + '/covers/' + artist + "/" + file.name
  //     [globalUserName]: auth.currentUser.uid + '/covers/' + artist + "/" + undashedSong + "/" + file.name
  //   });

  //   let feedMessage = globalUserName + "uid: " + auth.currentUser.uid + " covered " + undashedSong;
  //   dbSet(dbRef(rtdb, "/activity/" + Date.now()), feedMessage)

  //   const uploadTask = uploadBytesResumable(storageRef, file, metadata);

  //   uploadTask.on('state_changed',
  //     (snapshot) => {
  //       // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
  //       const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
  //       setPercent(progress)
  //       // console.log('Upload is ' + progress + '% done');
  //       switch (snapshot.state) {
  //         case 'paused':
  //           // console.log('Upload is paused');
  //           break;
  //         case 'running':
  //           // console.log('Upload is running');
  //           break;
  //       }
  //     }, 
  //     (error) => {
  //       // A full list of error codes is available at
  //       // https://firebase.google.com/docs/storage/web/handle-errors
  //       switch (error.code) {
  //         case 'storage/unauthorized':
  //           // console.log("unauthorized")
  //           // User doesn't have permission to access the object
  //           break;
  //         case 'storage/canceled':
  //           // console.log("cancaled")
  //           // User canceled the upload
  //           break;

  //         // ...

  //         case 'storage/unknown':
  //           // console.log("unknown")
  //           // Unknown error occurred, inspect error.serverResponse
  //           break;
  //       }
  //     }, 
  //     () => {
  //       // Upload completed successfully, now we can get the download URL
  //       getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
  //         // console.log('File available at', downloadURL);
  //         setCoverUpload(downloadURL)
  //       });
  //     }
  //   );
  // }

  return (
    <div>
      <div className="upload">
        <p>Submit a cover:</p>
      </div>
    </div>
  )
}


function LoadingBar(props) {
  if(props.percent > 0 && props.percent < 100){
      return(
          <div>
              <p>Uploading... {Math.round(props.percent)} %</p>
          </div>
      );
  } else if (props.percent ==  100) {
      return(
          <div>
              <p>Upload Complete!</p>
          </div>
      )
  } else {
      return(
          <div></div>
      )
  }
}

export default App;
