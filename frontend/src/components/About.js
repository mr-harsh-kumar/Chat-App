import React,{useEffect} from 'react'
import './about.css';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

export default function About() {
  gsap.registerPlugin(ScrollTrigger);

  
  useEffect(() => {

    gsap.to('.cube', {
      rotationY: 360,
      rotationX: 360,
      duration: 10,
      repeat: -1,
      ease: 'linear'
    });


  // gsap.from("#founder-img", {
  //   opacity:0,
  //   x:200,
  //   duration: 4.2,
   
   
  // });

  
  // gsap.from(".about-founder", {
  //   opacity: 0.4,
  //   scale:2,
  //   y:40,
  //   duration: 4.2,
  // }); 
  // gsap.to(".about-founder", {
  //   opacity: 0,
  //   scale:2,
  //   y:40,
  //   duration: 4.2,
  // });

  gsap.to("#founder-img", {
    opacity:1,
    scale:1.1,
    y:-70,
    x:40,
    duration:4,
  }
  )

  gsap.to(".about-founder", {
    opacity: 1,
    x:40,
    // scale:2,
    y:-40,
    duration: 4.2,
  }); 
  gsap.to("#imp", {
      opacity: 1,
      // x:40,
      // scale:2,
      y:-10,
      duration: 4,
    }); 

    gsap.to("#content", {
      opacity: 1,
      // x:40,
      // scale:2,
      y:-40,
      duration: 2,
    }); 
    gsap.to("#harsh", {
      opacity: 1,
      // x:40,
      scale:2,
      // y:-40,
      duration: 2,
    }); 

}, []);

  return (
    
    <>
  <div className="bg-image">

  <br />
  <br />
  <div className="img">
      <img id="hk-img" src="HK chatApp.png" alt="" />
    </div>
  <br />
  <br />

  <div className="about-section">
    <div className="founder-img">
      <img id="founder-img" src="harsh-photo-remove-bg.png"></img>
      <div className='about-founder' id="founder"><strong>Founder of HK Chat-App : </strong></div>
      <div className='about-founder' id="harsh"><strong>Harsh Kumar</strong></div>
    </div>
    <div id='content' className='container'>
    <span id="imp"><span className='hk-chat-app'>&nbsp;&nbsp;HK ChatApp&nbsp;&nbsp;</span> is dedicated to revolutionizing the way people communicate. With a deep understanding of technology and user experience, they have created a platform that seamlessly integrates powerful instant messaging capabilities with intuitive design. Their commitment to innovation and excellence is evident in every aspect of HK chatApp, making it a standout choice for efficient customer communication. Under their leadership, HK chatApp is poised to set new standards in the world of digital communication.</span>
    </div>
  </div>
   <div className="cubeContainer">
      <div className="cube">
        <div className="cube__face front"></div>
        <div className="cube__face back"></div>
        <div className="cube__face right"></div>
        <div className="cube__face left"></div>
        <div className="cube__face top"></div>
        <div className="cube__face bottom"></div>
      </div>
    </div>
    <br />
    <br />
    <br />
    <br />

</div>
</>
  )
}
