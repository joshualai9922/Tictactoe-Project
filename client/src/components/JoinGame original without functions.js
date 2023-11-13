// import React, { useState } from "react";
// import { useChatContext, Channel } from "stream-chat-react";
// import Game from "./Game";
// import CustomInput from "./CustomInput";
// function JoinGame() {
//   const [rivalUsername, setRivalUsername] = useState("");
//   const { client } = useChatContext();
//   const [channel, setChannel] = useState(null);
//   const createChannel = async () => {
//     const response = await client.queryUsers({ name: { $eq: rivalUsername } });

//     if (response.users.length === 0) {
//       alert("User not found");
//       return;
//     }

//     const newChannel = await client.channel("messaging", {
//       members: [client.userID, response.users[0].id],
//     });

//     await newChannel.watch();
//     setChannel(newChannel);
//   };

//   ////////////////GAME HISTORY//////////////

//    /////to get cookie by name
//    function getCookieValue(cookieName) {
//     const cookies = document.cookie.split(";").map(cookie => cookie.trim().split("="));
//     for (const [name, value] of cookies) {
//       if (name === cookieName) {
//         return value;
//       }
//     }
//     return null; // Return null if the cookie is not found
//   }

//   const userName = getCookieValue("firstName")
  
//   const [gameHistory, setGameHistory] = useState([]); 
//   const getHistory = async () => {
//     try {
//       const response = await fetch("http://localhost:3001/gameHistory");
//       const jsonData = await response.json();

//       setGameHistory(jsonData);
//     } catch (err) {
//       console.error(err.message);
//     }
//   };

//   useEffect(() => {
//     getHistory();
//   }, []);
// ////////////////////////////////////////////////DATA LOGIC//////////////////////////////////////////////////////////////////////////////
//   // Assuming gameHistory is the original array you provided


// // Filter games where userName is in either name1 or name2
// const filteredGames = gameHistory.filter(
//   (history) => history.name1 === userName || history.name2 === userName
// );

// // Modify the result based on the conditions
// const modifiedGames = filteredGames.map((history) => {
//   let opponentName = history.name1 === userName ? history.name2 : history.name1;

//   if (history.result === 'tie') {
//     return {
//       ...history,
//       result: 'tie',
//       name: opponentName,
//     };
//   } else if (history.result === 'win') {
//     const isOddCount = history.count % 2 !== 0;
//     const isUserWinner = (history.name1 === userName && isOddCount) || (history.name2 === userName && !isOddCount);

//     return {
//       ...history,
//       result: isUserWinner ? 'win' : 'lose',
//       name: opponentName,
//     };
//   } else {
//     // Handle other cases if needed
//     return history;
//   }
// });
//   return (
//     <>
//       {channel ? (
//         <Channel channel={channel} Input={CustomInput}>
//           <Game channel={channel} setChannel={setChannel} />
//         </Channel>
//       ) : (
//         <div className="joinGame">
//           <h4>Create Game</h4>
//           <input
//             placeholder="Username of rival..."
//             onChange={(event) => {
//               setRivalUsername(event.target.value);
//             }}
//           />
//           <button onClick={createChannel}> Join/Start Game</button>
//           <Fragment>
//       {" "}                                                         {/* TABLE----------------------------------------------------------------- */}
//       <table class="table mt-5 text-center">
//         <thead>
//           <tr>
//             <th>Opponent</th>
//             <th>Result</th>
//           </tr>
//         </thead>

//         <tbody>
//           {/* <tr>
//             <td>John</td>
//             <td>Win</td>
//           </tr> */}
//           {modifiedGames.map(history => (
//             <tr key={history.game_id}>
//               <td>{history.name}</td>
//               <td>{history.result}</td>
//             </tr>
//           ))}
//           {/* {gameHistory.map(history => (
//             <tr key={history.game_id}>
//               <td>{history.name}</td>
//               <td>{history.result}</td>
//             </tr>
//           ))} */}

          
//         </tbody>
//       </table>
//     </Fragment>
//         </div>

//       )}
//     </>
//   );
// }

// export default JoinGame;
