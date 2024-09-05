import React,{useEffect} from 'react'
import './home.css';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

export default function Home() {

  gsap.registerPlugin(ScrollTrigger);

  useEffect(() => {
    gsap.to('.cube', {
      rotationY: 360,
      rotationX: 360,
      duration: 10,
      repeat: -1,
      ease: 'linear'
    });

       
    gsap.from("#hk-img", {
      scale:0.8,
      duration: 3.2,
      repeat: true,
      // delay:5.2,
      // scrollTrigger: {
      //   trigger: "#hk-img",
      //   scroller: "body",
      //   scrub: 5,
      //   start: "top 50%",
      //   end: "bottom 40%",
      //   // markers: true,
      // }
    });


    // gsap.from("#lady-img", {
    //   x: 320,
    //   duration: 10.2,
    //   delay:5.2,
    //   // repeat: true,
    //   // scrollTrigger: {
    //   //   trigger: "#lady-img",
    //   //   scroller: "body",
    //   //   scrub: 5,
    //   //   start: "top 40%",
    //   //   end: "bottom 40%",
    //   //   // markers: true,
    //   // }
    // });

    gsap.to("#lady-img", {
      x: 320,
      y:-40,
      duration: 0.1,
    
    });

    gsap.to("#lady-img", {
      x: -20,
      opacity:1,
      y:-40,
      duration: 4,
    });


    // gsap.to("#lady-img", {
    //   x: 30,
    //   duration: 10.2,
    //   delay:5.2,
    //   scrollTrigger: {
    //     trigger: "#lady-img",
    //     scroller: "body",
    //     scrub: 5,
    //     start: "top 50%",
    //     end: "bottom 40%",
    //     markers: true,
    //   }
    // });

    
    gsap.from("#head", {
      x: 30,
      duration: 10.2,
      delay:5.2,
      scrollTrigger: {
        trigger: "#head",
        scroller: "body",
        scrub: 5,
        start: "top 50%",
        end: "bottom 40%",
        // markers: true,
      }
    });
    
    // gsap.from("#man-img", {
    //   x: -320,
    //   duration: 10.2,
    //   delay:5.2,
    //   scrollTrigger: {
    //     trigger: "#man-img",
    //     scroller: "body",
    //     scrub: 5,
    //     start: "top 40%",
    //     end: "bottom 40%",
    //     // markers: true,
    //   }
    // });


    gsap.to("#man-img", {
      x: -420,
      duration: 0.1, 
    });

    gsap.to("#man-img", {
      opacity:1,
      x: 40,
      y:-100,
      duration: 4,  
      scrollTrigger: {
            trigger: "#man-img",
            scroller: "body",
            scrub: 5,
            start: "top 40%",
            end: "bottom 40%",
            // markers: true,
          }
    });

    
  }, []);



  return (
    <>
  <div className="bg-image">
<br />
    <div className="img">
      <img id="hk-img" src="HK chatApp.png" alt="" />
    </div>
<br />
<br />

<div className="mix">
  <img id="lady-img" src="lady-img.png"></img>
  <div id="head" >
   <span  id="slogan">Powerful<span className='instant-messaging'>&nbsp;  Instant Messaging &nbsp;</span> platform for efficient customer communication. </span>
  </div>
</div>
<br />

<div className='man-section'>
<div className="content"   >
<div id="about-app">Establish personalized and quick conversation with your customers through the chat applications they're familiar with. Your service teams can establish two-way communication with customers, while you can streamline all conversations within a single portal.

</div>

</div>
<img id="man-img" src="man-img.png"></img>

</div>

<br />    

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

</div>
</>
  )
}


