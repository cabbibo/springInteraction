
  // TODO Make it so you can pass in renderer w / h
  function RaycastControls( eye , tip , params ){

    this.intersected;
    this.selected;

    this.eye      = eye;
    this.tip      = tip;

    this.objects  = [];

    var params = params || {};

    
    // The ways the we call up down, 
    // and update selected
    this.upDownEvent        = params.upDownEvent        || this.pinchEvent
    this.selectedUpdate     = params.selectedUpdate     || function(){}      
    
    this.raycaster          = new THREE.Raycaster();
    this.projector          = new THREE.Projector();
    

    this.raycaster.near     = this.eye.near;
    this.raycaster.far      = this.eye.far;

  
  }

  /*

     EVENTS

  */

  

  // You can think of _up and _down as mouseup and mouse down

  RaycastControls.prototype._down = function(){

    this.down();
    
    if( this.intersected ){
     
      //console.log( this.intersected );
      this._select( this.intersected  );

    }

  }

  RaycastControls.prototype.down = function(){}



  RaycastControls.prototype._up = function(){

    this.up();

    if( this.selected ){

      this._deselect( this.selected );

    }

  }

  RaycastControls.prototype.up = function(){}



  RaycastControls.prototype._hoverOut =  function( object ){

    this.hoverOut();
    
    this.objectHovered = false;
    
    if( object.hoverOut ){
      object.hoverOut( this );
    }
  
  };

  RaycastControls.prototype.hoverOut = function(){};



  RaycastControls.prototype._hoverOver = function( object ){
   
    this.hoverOver();
    
    this.objectHovered = true;
    
    if( object.hoverOver ){
      object.hoverOver( this );
    }
  
  };

  RaycastControls.prototype.hoverOver = function(){}



  RaycastControls.prototype._select = function( object ){
   
    this.select();
                
    
    var intersectionPoint = this.getIntersectionPoint( this.intersected );

    this.selected       = object;
    this.intersectionPoint = intersectionPoint;
   
    if( object.select ){
      object.select( this );
    }

  };

  RaycastControls.prototype.select = function(){}


  
  RaycastControls.prototype._deselect = function( object ){
    
    this.selected = undefined;
    this.intersectionPoint = undefined;

    if( object.deselect ){
      object.deselect( this );
    }

    this.deselect();

  };

  RaycastControls.prototype.deselect = function(){}




  /*
  
    Changing what objects we are controlling 

  */

  RaycastControls.prototype.add = function( object ){

    this.objects.push( object );

  };

  RaycastControls.prototype.remove = function( object ){

    for( var i = 0; i < this.objects.length; i++ ){

      if( this.objects[i] == object ){
    
        this.objects.splice( i , 1 );

      }

    }

  };


  
  
  /*

     Update Loop

  */

  RaycastControls.prototype.update = function(){

    if( !this.selected ){

      this.checkForIntersections();

    }else{

      this._updateSelected();

    }

  };

  RaycastControls.prototype._updateSelected = function(){

    this.selectedUpdate();

    if( this.selected.update ){

      this.selected.update( this );

    }

  }
  
  RaycastControls.prototype.updateSelected = function(){};
  
  /*
   
    Checks 

  */

  RaycastControls.prototype.checkForIntersections = function( ){

    var origin    = this.tip;
    var direction = origin.clone()
  
    direction.sub( this.eye.position );
    direction.normalize();

    this.raycaster.set( this.eye.position , direction );
    var intersected =  this.raycaster.intersectObjects( this.objects );

    if( intersected.length > 0 ){

      this._objectIntersected( intersected );

    }else{

      this._noObjectIntersected();

    }

  };

  RaycastControls.prototype.checkForUpDown = function( hand , oHand ){

    if( this.upDownEvent( this.selectionStrength , hand , oHand ) === true ){
    
      this._down();
    
    }else if( this.upDownEvent( this.selectionStrength , hand , oHand ) === false ){
    
      this._up();
    
    }
  
  };




  RaycastControls.prototype.getIntersectionPoint = function( i ){

    var intersected =  this.raycaster.intersectObjects( this.objects );
   
    return intersected[0].point.sub( i.position );

  }


  /*
   
     Raycast Events

  */

  RaycastControls.prototype._objectIntersected = function( intersected ){

    // Assigning out first intersected object
    // so we don't get changes everytime we hit 
    // a new face
    var firstIntersection = intersected[0].object;

    if( !this.intersected ){

      this.intersected = firstIntersection;

      this._hoverOver( this.intersected );


    }else{

      if( this.intersected != firstIntersection ){

        this._hoverOut( this.intersected );

        this.intersected = firstIntersection;

        this._hoverOver( this.intersected );

      }

    }

    this.objectIntersected();

  };

  RaycastControls.prototype.objectIntersected = function(){}

  RaycastControls.prototype._noObjectIntersected = function(){

    if( this.intersected  ){

      this._hoverOut( this.intersected );
      this.intersected = undefined;

    }

    this.noObjectIntersected();

  };

  RaycastControls.prototype.noObjectIntersected = function(){}
 


