

function initHands(){

  var handLMat = G.materials.wireframe.clone();
  var handLGeo = G.geometries.icosahedron1;
  handL = new THREE.Mesh( 
    handLGeo,
    handLMat
  );
  handL.material.color.setRGB( 1 , .2 , .2 );
  handL.scale.multiplyScalar( .01 );
  scene.add( handL );

  var handRGeo = G.geometries.icosahedron1;
  var handRMat = G.materials.wireframe.clone();
  handR = new THREE.Mesh( 
    handRGeo,
    handRMat
  );
  handR.material.color.setRGB( .2 , .2 , 1 );
  handR.scale.multiplyScalar( .01 );
  scene.add( handR );

  handR.fingers = [];
  for( var i = 0; i < 25; i++ ){
    var mesh = new THREE.Mesh( handRGeo , handRMat );
    mesh.scale.multiplyScalar( .003 );
    mesh.velocity = new THREE.Vector3();
    scene.add( mesh );
    handR.fingers.push( mesh );

  }

  handL.fingers = [];
  for( var i = 0; i < 25; i++ ){
    var mesh = new THREE.Mesh( handLGeo , handLMat );
    mesh.scale.multiplyScalar( .003 );
    mesh.velocity = new THREE.Vector3();
    scene.add( mesh );
    handL.fingers.push( mesh );
  }



  controlsLeft  = new RaycastControls( camera , handL.position );
  controlsRight = new RaycastControls( camera , handR.position );


}


function updateHands(){

  if( frame ){
    oFrame = frame;
  }else{
    oFrame = controller.frame();
  }
  
  frame = controller.frame();

  handL.active = false;
  handR.active = false;

  lHandL = false;
  lHandR = false;

  if( frame.hands[0] ){

    var hand = frame.hands[0];
    var type = hand.type;

    if( type == "left" ){

      setPosition( hand.palmPosition , handL.position );

      handL.active = true;
      lHandL = hand;

      setFingerPositions( hand , handL );
      setTipVelocity( hand , handL );

    }else if( type == "right" ){
    
      setPosition( hand.palmPosition , handR.position );
    
      handR.active = true;
      lHandR = hand;

      setFingerPositions( hand , handR );
      setTipVelocity( hand , handR );

    }


    if( frame.hands[1] ){

      var hand = frame.hands[1];
      var type = hand.type
      if( type == "left" ){

        setPosition( hand.palmPosition , handL.position );
        
        handL.active = true;
        lHandL = hand;

        setFingerPositions( hand , handL );
        setTipVelocity( hand , handL );


      }else if( type == "right" ){
      
        setPosition( hand.palmPosition , handR.position );
    
        handR.active = true;
        lHandR = hand;

        setFingerPositions( hand , handR );
        setTipVelocity( hand , handR );


      }

    }


  }


  if( handL.active ){

    var oHand = false;
    if( oFrame.hands[0] ){
      if( oFrame.hands[0].type == 'left' ){
        oHand = oFrame.hands[0];
      }
    }

    if( oFrame.hands[1] ){
      if( oFrame.hands[1].type =='left'){
        oHand = oFrame.hands[0];
      }
    }

    if( oHand ){

      if( oHand.pinchStrength < .5 && lHandL.pinchStrength >= .5 ){
        controlsLeft._down();
      }

      if( oHand.pinchStrength > .5 && lHandL.pinchStrength <= .5 ){
        controlsLeft._up();
      }

    }

  }


  if( handR.active ){

    var oHand = false;
    if( oFrame.hands[0] ){
      if( oFrame.hands[0].type == 'right' ){
        oHand = oFrame.hands[0];
      }
    }

    if( oFrame.hands[1] ){
      if( oFrame.hands[1].type =='right'){
        oHand = oFrame.hands[0];
      }
    }

    if( oHand ){

      if( oHand.pinchStrength < .5 && lHandR.pinchStrength >= .5 ){
        controlsRight._down();
      }

      if( oHand.pinchStrength > .5 && lHandR.pinchStrength <= .5 ){
        controlsRight._up();
      }

    }

  }


}

function leapToScene( position  ){

  var p =  position;  
  return [ 
    p[0] * .001,
    p[1] * .001,
    p[2] * .001
  ]

}


function setFingerPositions( leapHand , threeHand ){

  for( var i = 0; i < 25; i++ ){

    var fI = Math.floor( i / 5 );
    var bI = i % 5;

    var leapPos = leapHand.fingers[ fI ].positions[ bI ];
    var threePos = threeHand.fingers[i].position;

    setPosition( leapPos , threePos );


  }

}

function setTipVelocity( leapHand , threeHand ){

  var leapVel  = leapHand.fingers[1].tipVelocity;
  var threeVel = threeHand.fingers[9].velocity;

  setPosition( leapVel , threeVel );

}
function setPosition( leapPos ,  threePos ){

  var p = leapToScene( leapPos );
  
  if( VR == true ){
    
    tv1.set( -p[0] , -p[2] , -p[1] );
    threePos.copy( camera.position );
    tv1.applyQuaternion( camera.quaternion );
    threePos.add( tv1 );

  }else{

    threePos.copy( camera.position );
    tv1.set( p[0] , p[1] -.3 , p[2] - .3 );
    tv1.applyQuaternion( camera.quaternion );
    threePos.add( tv1 );

  }


}
