import React, { useState, useEffect, useRef } from 'react';
import './chat-app.css';
import $ from 'jquery';
import { useParams, useNavigate } from 'react-router-dom';
import { getUser } from './user'; // Adjust the path as per your directory structure
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { formatDistanceToNow, parseISO } from 'date-fns';

import axios from 'axios';


export default function Chat_app() {
    function changeFavicon(url) {
        var link = document.querySelector("link[rel*='icon']") || document.createElement('link');
        link.type = 'image/x-icon';
        link.rel = 'icon';
        link.href = url;
        document.getElementsByTagName('head')[0].appendChild(link);
    }

    // Example usage:
    changeFavicon('HK chatApp logo.png');

    const [showOptions, setShowOptions] = useState(false);
    const [members, setMembers] = useState([]);
    const [authenticated_user, setAuthenticated_user] = useState([]);
    const [message, setMessage] = useState('');
    const [userDetails, setUserDetails] = useState(null);
    const navigate = useNavigate();
    
    const [messages, setMessages] = useState([]);
    const [isConnected, setIsConnected] = useState(false); // Manage connection state
    const [receiver, setReceiver] = useState(''); // New state variable for receiver
    const [selectedMember, setSelectedMember] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredMembers, setFilteredMembers] = useState(members);

    
  // // Function to handle search input change
  // const handleSearchChange = (e) => {
  //   setSearchQuery(e.target.value);
  // };

  // // Filter members based on the search query
  // const filteredMembers = members.filter(member => 
  //   member.username.toLowerCase().includes(searchQuery.toLowerCase())
  // );

  // if (filteredMembers){
  //   $('.members').hide();
  //   $('#filtered-members').show();

  // }
  // else{
  //   $('.members').show();
  //   $('#filtered-members').hide();

  // }
  // // Log the filtered members to the console
  // console.log('Filtered Members:', filteredMembers);
    
    const ws = useRef(null);

    const msgPageRef = useRef(null);
    const messagesEndRef = useRef(null); // Ref for scrolling

    const login = (user) => {
      console.log("Toast function:", toast);
      console.log("User:", user);
  
      toast(`${user} is logged in now !`, {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
      });
  };

      useEffect(() => {
        const user = localStorage.getItem('user');
        console.log("User from localStorage:", user);
        const userTimestamp = localStorage.getItem('userTimestamp');
        
        // console.log(userTimestamp.toString()); 
        console.log("User from localStorage:", userTimestamp);

        const csrfToken = $('[name=csrfmiddlewaretoken]').val();
        console.log("CSRF Token:", csrfToken);
    
        if (user) {
            console.log("Calling login function");
            // login(user);  
            console.log("Toast function:", toast);
  
            console.log("login function called");
    
            $.ajax({
                url: 'http://127.0.0.1:8000/chat_app/after_login/',
                method: 'POST',
                data: { user: user },
                headers: {
                    'X-CSRFToken': csrfToken
                },
                success: function(response) {
                    if (response.status === 'success') {
                        setUserDetails(response.message);
                        setMessage('');
                    } else {
                        setMessage(response.message);
                    }
                    console.log("user details");
                    console.log('http://127.0.0.1:8000' + response.message.image);
                },
                error: function(xhr, status, error) {
                    console.error('Error status:', status);
                    console.error('Error message:', error);
                    console.error('XHR response:', xhr.responseText);
                    setMessage('An error occurred: ' + xhr.responseText);
                }
            });
        } else {
            setMessage('User not found in local storage');
        }
    
        return () => {
            console.log("Cleaning up");
        };
    }, []);
    
    useEffect(() => {
        $.ajax({
            url: 'http://127.0.0.1:8000/chat_app/show_all_members/',
            method: 'GET',
            dataType: 'json',
            success: function(data) {
                setMembers(data.status);
                console.log("All members:", data.status.map(member => ({
                    username: member.username,
                    image: member.image,
                    time: member.time
                })));
            },
            error: function(error) {
                console.error('There was an error fetching the members!', error);
            }
        });
    }, []);

    const user = getUser();

    const handleClick = (event) => {
        event.currentTarget.classList.toggle("change");
        setShowOptions(!showOptions); // Toggle showOptions state
    }

    const handlelogout = () => {

      const logout = () => toast(`${user} is logging out!`, {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
        });


        $.ajax({
            url: 'http://localhost:8000/chat_app/logout/', // Your Django logout endpoint
            method: 'GET', // Use GET or POST as per your Django view
            success: function(response) {
                console.log(response.message);
                
                localStorage.removeItem('user'); // Clear user from localStorage
                localStorage.removeItem('userTimestamp'); // Clear user from localStorage

                logout();
                setTimeout(() => {
                  window.location.href = 'http://localhost:3000/home/'
  
                }, 2000);
               
                // navigate('/home');

                // Perform any additional actions on successful logout
            },
            error: function(xhr, status, error) {
                console.error('Error logging out:', error);
                // Handle error state appropriately
            }
        });
    }

    $("user-image").onerror = function() {
        this.src = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcShw5IQLKadP1pwhLBkOw2IJ358eMjTu0_3UfPYgkv72iy0CNrw85qshBS33QppKZ0NiqQ&usqp=CAU';
        this.alt = 'Displaying alternative image due to error';
    };

    const handleMemberClick = (member) => {
        setSelectedMember(member);
        setReceiver(member.username); // Set the receiver state when a member is selected
        console.log('Selected member:', member);
        
    };

    const fetchMessages = async () => {
      try {
          const response = await fetch('http://127.0.0.1:8000/chat_app/messages/');
          const data = await response.json();
          console.log(data); // Log the entire response to see the structure
  
          if (Array.isArray(data)) {
              // Define your user and receiver variables
              const user = getUser(); // Assuming getUser() returns the current user's username
              const receiver = selectedMember ? selectedMember.username : ''; // Ensure selectedMember is set
              console.log(user,receiver); //
              // Filter messages based on the sender and receiver conditions
              const filteredMessages = data.filter(message => 
                  (message.sender__username === user && message.receiver__username === receiver) ||
                  (message.sender__username === receiver && message.receiver__username === user)
              );
  
              console.log("Filtered messages:", filteredMessages);
              displayMessages(filteredMessages); // Display filtered messages
              console.log("Messages fetched and displayed");
          } else {
              console.error('Unexpected response format:', data);
          }
      } catch (error) {
          console.error('Error fetching messages:', error);
      }
  };
    
    


const displayMessages = (messages, user) => {
  const messageContainer = document.getElementById('message-container');
  messageContainer.innerHTML = ''; // Clear existing messages

  messages.forEach((message) => {
      const messageElement = document.createElement('div');

      const member = members.find(member => member.username === message.sender__username);

      // Default image if member not found
      const memberImage = member ? `http://127.0.0.1:8000${member.image}` : 'default-image.png';
      console.log("sender:",message.sender__username);
      const username = localStorage.getItem('user');
      console.log("logged in: ",username);
      if (username === message.sender__username ) {
          // Outgoing message
          console.log("sender == user ");
          messageElement.className = 'outgoing-chats';
          messageElement.innerHTML = `
              <div class="outgoing-chats-img">
                  <img class="img" id="sender-receiver-img" src="${memberImage}" />
              </div>
              <div class="outgoing-msg">
                  <div class="outgoing-chats-msg">
                      <p class="message">${message.content}</p>
                      <span class="time">${formatTime(message.time)}</span>
                  </div>
              </div>
          `;
      } else {
          console.log("sender == receiver ");
          // Incoming message

          messageElement.className = 'received-chats';
          messageElement.innerHTML = `
              <div class="received-chats-img">
                  <img  id="sender-receiver-img" src="${memberImage}" />
              </div>
              <div class="received-msg">
                  <div class="received-msg-inbox">
                      <p class="single-msg">${message.content}</p>
                      <span class="time">${formatTime(message.time)}</span>
                  </div>
              </div>
          `;
      }

      messageContainer.appendChild(messageElement);
  });
};
    const formatTime = (timestamp) => {
        const date = new Date(timestamp);
        return `${date.getHours()}:${date.getMinutes()} | ${date.toLocaleDateString()}`;
    };

    const connectWebSocket = () => {
        const roomName = [user, receiver].sort().join('_');
        console.log("Room name: ", roomName);
        ws.current = new WebSocket(`ws://localhost:8000/ws/chat/${roomName}/`);
        ws.current.onopen = () => {
            console.log('WebSocket connection established');
            setIsConnected(true);
        };

        ws.current.onclose = (event) => {
            console.log('WebSocket connection closed:', event);
            setIsConnected(false);
        };

        ws.current.onerror = (error) => {
            console.error('WebSocket error:', error);
        };

        ws.current.onmessage = (event) => {
            const data = JSON.parse(event.data);
            console.log('Message from server:', data);

              // Function to get member image based on username
    const getMemberImage = (username) => {
      const member = members.find((m) => m.username === username);
      return member ? member.image : 'default.png'; // Default image if user not found
  };

  // Update the message container
  const messageContainer = document.getElementById('message-container');
  const messageElement = document.createElement('div');

  if (data.sender === user) {
      // Outgoing message
      console.log("Message from sender:", data.sender);
      const senderImage = getMemberImage(data.sender);
      console.log(senderImage);
      messageElement.className = 'outgoing-chats';
      messageElement.innerHTML = `
          <div class="outgoing-chats-img" ref={msgPageRef}>
                <img class="img" id="sender-receiver-img" src="http://127.0.0.1:8000${senderImage}" alt="Sender" />
           </div>
          <div class="outgoing-msg">
              <div class="outgoing-chats-msg">
                  <p class="message">${data.text}</p>
                  <span class="time">${formatTime(new Date())}</span>
              </div>
          </div>
      `;
  } else {
      // Incoming message
      const receiverImage = getMemberImage(data.sender); // Assuming the sender is the receiver
      messageElement.className = 'received-chats';
      messageElement.innerHTML = `
          <div class="received-chats-img" ref={msgPageRef}>
               <img id="sender-receiver-img" src="http://127.0.0.1:8000${receiverImage}" alt="Receiver" />
          </div>
          <div class="received-msg">
              <div class="received-msg-inbox">
                  <p class="single-msg">${data.text}</p>
                  <span class="time">${formatTime(new Date())}</span>
              </div>
          </div>
      `;
  }


            messageContainer.appendChild(messageElement);
        };
    };

    useEffect(() => {
        fetchMessages();
        if (user && receiver) {
            connectWebSocket();
        }

        return () => {
            if (ws.current) {
                ws.current.close();
            }
        };
    }, [user, receiver]); // Update the WebSocket connection whenever the user or receiver changes

    // Scroll to bottom whenever messages change
    useEffect(() => {
      scrollToBottom();
  }, [messages]); // Depend on messages


    const handleSendMessage = async () => {
        if (!message.trim()) {
            console.error('Message cannot be empty');
            return;
        }

        if (!isConnected) {
            console.error('WebSocket is not connected');
            return;
        }
        scrollToBottom();
        scrollToBottom2();

        const messageObject = {
            text: String(message),
            sender: String(user),
            receiver: selectedMember ? String(selectedMember.username) : "unknown",
        };

        console.log('Sending message:', messageObject);
        ws.current.send(JSON.stringify(messageObject));
        setMessage('');

       
    };
    

    const scrollToBottom = () => {
      const chatsElement = document.querySelector('.msg-page');
      if (chatsElement) {
        chatsElement.scrollTop = chatsElement.scrollHeight;
      }
    };
    const scrollToBottom2 = () => {
      const chatsElement = document.querySelector('#chats');
      if (chatsElement) {
        chatsElement.scrollTop = chatsElement.scrollHeight;
      }
    };

    // The useEffect hook to handle scrolling

    useEffect(() => {
      if (msgPageRef.current) {
        msgPageRef.current.scrollTop = msgPageRef.current.scrollHeight;
      }
    }, [messages]);
  

    const handleInputChange = (e) => {
        setMessage(e.target.value);
    };
  //   useEffect(() => {
  //     if (messagesEndRef.current) {
  //         messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
  //     }
  // }, [messages]);
  
//   $('.members').click(function() {
//     // Reset the color of all members
//     $('.members').css('color', 'white');
//     // Change the color of the clicked member
//     $(this).css('color', 'rgb(84, 223, 227)');
// });  
// $('#filtered-members').click(function() {
//   // Reset the color of all members
//   $('#filtered-members').css('color', 'white');
//   // Change the color of the clicked member
//   $(this).css('color', 'rgb(84, 223, 227)');
// });


const checkAndRemoveUser = () => {
  const user = localStorage.getItem('user');
  const userTimestamp = localStorage.getItem('userTimestamp');

  if (user && userTimestamp) {
      const currentTime = new Date().getTime();
      const twoDaysInMillis = 2 * 24 * 60 * 60 * 1000; // 2 days in milliseconds

      if (currentTime - userTimestamp > twoDaysInMillis) {
          localStorage.removeItem('user');
          localStorage.removeItem('userTimestamp');
          console.log('User removed after 2 days');
      }
  }
};

useEffect(() => {
  checkAndRemoveUser();
}, []);

const formatLastLogin = (lastLogin) => {
  return formatDistanceToNow(parseISO(lastLogin), { addSuffix: true });
};


  // Filter members based on the search query
  useEffect(() => {
    // Update filteredMembers whenever searchQuery changes
    setFilteredMembers(
      members.filter(member =>
        member.username.toLowerCase().includes(searchQuery.toLowerCase())
      )
    );
  }, [searchQuery, members]);

  useEffect(() => {
    // Event listener for search input
    $('#search').on('input', function () {
      let inputVal = $(this).val();
      console.log(inputVal); // Log the current value of the input field

      setSearchQuery(inputVal); // Update searchQuery state based on input

      if (inputVal.trim() !== '') {
        $('.search-icon').css('display', 'inline');

        // Handle visibility of filtered and all members
        if (filteredMembers.length > 0) {
          $('.members').hide();
          $('#filtered-members').show();
        } else {
          $('.members').show();
          $('#filtered-members').hide();
        }

        // Log the filtered members
        console.log("Filtered Members:", filteredMembers);

      } else {
        $('.search-icon').css('display', 'none');
        $('#filtered-members').hide();
      }
    });

    // Cleanup the event listener on component unmount
    return () => {
      $('#search').off('input');
    };
  }, [filteredMembers]);
  console.log("filtered Members: " + filteredMembers);


const left_arrow = () => {
  
  setSearchQuery(''); // Clear the search query
}

$(document).ready(function() {
  // Function to handle color change for members
  function handleColorChange(element) {
    // Reset color for all members
    $('.members, .filtered-members').css('color', 'white');
    // Change color for the clicked member
    $(element).css('color', 'rgb(84, 223, 227)');
  }

  // Use event delegation to handle dynamically added elements
  $(document).on('click', '.members', function() {
    handleColorChange(this);
  });

  $(document).on('click', '.filtered-members', function() {
    handleColorChange(this);
  });
});



return(
       <>
           
 
  <div id="body">

 


  {!user && (
  <div className="bg-image">
      <div className='login-message'>
      <br />
      <br />
      <h1 className='login-heading'>Please login</h1>
      <img className='login-image' src="HK chatApp.png" />
    </div>
  
    <ToastContainer
      position="top-right"
      autoClose={2000}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme="light"
      />
      {/* Same as */}
    <ToastContainer />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    
    </div>
  )}  
  {user && (
       
  <div className="bg-image">
  <div>
           {userDetails && (
                <div>
                    <h1>Welcome {userDetails.username}, you are logged in </h1>
                    
                </div>
            )}
            {/* Rest of your chat app UI */}
        </div>
        <div>
        {messages.map((message, index) => (
          <div key={index}>
            <p><strong>{message.sender}</strong>: {message.text}</p>
          </div>
        ))}
        </div>
    <div className="main-box">
      
    <div className="members-place">
    <div className="container" id="main-box1">

      <div id="members-title">
        <span>Members </span>
                  <span className="menu" onClick={handleClick}>
                    <div className="bar1"></div>
                    <div className="bar2"></div>
                    <div className="bar3"></div>
                  </span>
                  
        <div className="dropdown">

        {showOptions && (
                    <div className="dropdown-content show">
                      {userDetails && (
                <div id="user-details">
                    <span >{userDetails.image && <img id="user-image" src={`http://127.0.0.1:8000${userDetails.image}`} alt={`${userDetails.username}'s avatar`} />}</span>
                    <span>
                      <div id="user-name">{userDetails.username}</div>
                    
                      <div id="user-date">Created on :{userDetails.date}</div>
                    
                    </span>
                  </div>
            )}
                      <a id="logout" onClick={handlelogout}>Logout</a>
                    </div>
                  )}
          </div>
   
        <div id="search-box">
        <span id="search-icon"  className="input-group-text search-icon">
                <b><i className="bi bi-arrow-left" onClick={left_arrow}></i></b>

          </span>
          <input id="search" placeholder="  Search ..." value={searchQuery}
          // onChange={handleSearchChange}
          >

          </input>
          
          <span id="search-icon"  className="input-group-text search-icon">
                <i  className="bi bi-search"></i>
          </span>
        </div>
       
        </div>
     
        <div className="all-members">
        {filteredMembers.length > 0 ? (
          filteredMembers.map(member => (
            <div id="filtered-members" key={member.id} onClick={() => handleMemberClick(member)}>
              {localStorage.getItem('user') !== member.username && (
                <span className="member-container">
                  <img
                    src={`http://127.0.0.1:8000${member.image}`}
                    className="mem-image"
                    id="mem-img"
                    alt="Member Image"
                  />
                  <span className="online-icon"></span>
                </span>
              )}
              {localStorage.getItem('user') !== member.username && (
                <span className="about-member">
                  <span className="name">{member.username}</span>
                  <br />
                </span>
              )}
            </div>
          ))
        ) : (
          members.map(member => (
            <div className="members" key={member.id} onClick={() => handleMemberClick(member)}>
              {localStorage.getItem('user') !== member.username && (
                <span className="member-container">
                  <img
                    src={`http://127.0.0.1:8000${member.image}`}
                    className="mem-image"
                    id="mem-img"
                    alt="Member Image"
                  />
                  <span className="online-icon"></span>
                </span>
              )}
              {localStorage.getItem('user') !== member.username && (
                <span className="about-member">
                  <span className="name">{member.username}</span>
                  <br />
                </span>
              )}
            </div>
          ))
        )}
      </div>
    
    </div>
    </div>
    
    
    
    <div  className="container" id="main-box2">

      
      <div className="chat-place">
         {/* msg-header section starts   */}
      <div  className="msg-header">
        <div  className="container1">
        <div  >
            <p  className="active">
               {selectedMember && (
              <span className="selected-member">
                <span>
                  <img id="selected-member-image" src={`http://127.0.0.1:8000${selectedMember.image}`}  className="msgimg" />
                </span>
                <span>
                
                  <p className="selected-member-name">{selectedMember.username}</p>
                  {/* <span id="last-seen" className="last-seen">last seen at 5:30</span> */}
                      <span id="last-seen" className="last-seen">
                                                {selectedMember.last_login ? (
                                                    formatLastLogin(selectedMember.last_login)
                                                ) : (
                                                  new Date(selectedMember.time).toLocaleString()

                                                )}
                      </span>
                </span>

                </span>
              )}
              </p>
          
          </div>
        </div>
      </div>
         {/* msg-header section ends   */}

         {/* Chat inbox    */}
      <div  className="chat-page">
        <div  className="msg-inbox" >
          <div  className="chats" id="chats" ref={msgPageRef}>
               {/* Message container   */}
            
            <div  className="msg-page" ref={msgPageRef}>
          
             

             


              {/* <div id="message-container"  ref={msgPageRef}></div> */}
              <div id="message-container"  ref={msgPageRef}></div>

              <div ref={messagesEndRef} /> {/* This is the end of the messages */}
               

            </div>
          </div>

             {/* msg-bottom section   */}

          <div  className="msg-bottom">
          
          <span id="paperclip-icon" className="input-group-text send-icon">
            <i className="bi bi-paperclip"></i>
            

            </span>
            <span  id="emoji-icon" className="input-group-text send-icon">
        
            <i className="bi bi-emoji-smile"></i>

            </span>
              
            <div  className="input-group">
              
              <input
                type="text"
                value={message}
                onChange={handleInputChange}
                 className="form-control"
                placeholder="Write message..."
                
              />

              
              
            </div>
            <span id="send-icon"  onClick={handleSendMessage} className="input-group-text send-icon">
                <i  className="bi bi-send"></i>
            </span>
          </div>
        </div>
      </div>
    </div>
    </div>
    </div>
    
    <br />
    <br />
    <br />
    <br />
    <br />
    </div>
    
  ) }
   
    </div>

    </>
 );
}


// stop stop stop