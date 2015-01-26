function Interactable( position ){

  this.innerRadius = .01;
  this.outerRadius = .02;

  this.cutoffSpeed = .4;

  var geo = G.geometries.icosahedron1;
  var mat = G.materials.normal.clone();

  mat.transparent = true;
  mat.opacity = .5;
  mat.needsUpdate = true;

  this.body = new THREE.Mesh( geo , mat );
  this.body.scale.multiplyScalar( this.innerRadius );

  var mat = mat.clone();
  mat.wireframe = true;
  mat.needsUpdate = true;

  this.shell = new THREE.Mesh( geo , mat );
  this.shell.scale.multiplyScalar( this.outerRadius / this.innerRadius );

  this.body.add( this.shell );

  this.position = this.body.position;

  this.position.copy( position );

  // Keeping it so we have the info in
  // terms of camera coordinates
  this.viewPosition = new THREE.Vector3();

  this.active = false;

  var geo = new THREE.Geometry();
  geo.vertices.push( this.position );
  geo.vertices.push( new THREE.Vector3() );

  var mat = new THREE.LineBasicMaterial({
    transparent: true,
    blending: THREE.AdditiveBlending,
  });
  this.line = new THREE.Line( geo , mat );

  scene.add( this.line );
  scene.add( this.body );

  

}

Interactable.prototype.update = function( position , velocity ){

  this.line.geometry.vertices[1].copy( position );
  this.line.geometry.verticesNeedUpdate = true;

  this.setViewPosition( this.position );

  tv1.copy( position );
  tv1.sub( this.position );
  var dist = tv1.length();

  //console.log( tv );
  //console.log( 3 - dist );
  
  this.line.material.color.r = .1 / dist;
  this.line.material.color.g = .1 / dist;
  this.line.material.color.b = .1 / dist;


  //this.line.material.color.r = velocity.x;
  //this.line.material.color.g = velocity.y;
  //this.line.material.color.b = velocity.z;
 
  if( this.selected ){ };
  this.check( position , velocity );
  if( this.selected ){this._updateSelected( position , velocity ) }


}


Interactable.prototype.check = function( position , velocity ){

  this.checkHover( position );

  if( this.selected ){
    this.checkDeselection( position , velocity );
  }else{
    this.checkSelection( position , velocity );
  }

}


Interactable.prototype.setViewPosition = function( position ){

  this.viewPosition.copy( camera.position );
  tv1.copy( position );
  tv1.applyQuaternion( camera.quaternion );
  this.viewPosition.add( tv1 );

}

Interactable.prototype.checkHover = function( position ){

  tv1.copy( this.position );
  tv1.sub( position );

  var dist = tv1.length();

  // If we are within the proper radius
  if( dist < this.outerRadius ){

    if( !this.hovered ){
      this._hoverOver();
    }

  }else{

    if( this.hovered ){
      this._hoverOut();
    }

  }

}

// Check to see if we have selected
Interactable.prototype.checkSelection = function( position , velocity ){

   tv1.copy( position );
  tv1.sub( camera.position );


  var dist = tv1.length();
  tv1.normalize();


  if( this.hovered ){

    var speed = velocity.length();

    tv2.copy( velocity );
    tv2.normalize();

    var match = tv2.dot( tv1 );

    if( match > .6 && speed > this.cutoffSpeed ){

      this._select();

    }

  }

}

Interactable.prototype.checkDeselection = function( position , velocity ){

  tv1.copy( position );
  tv1.sub( camera.position );


  var dist = tv1.length();
  tv1.normalize();


  // If we are within the proper radius
  if( !this.hovered ){ 

    
    var speed = velocity.length();

    tv2.copy( velocity );
    tv2.normalize();

    var match = tv2.dot( tv1 );

    if( match < -.6 && speed > this.cutoffSpeed  ){

      this._deselect();

    }

  }



}

Interactable.prototype._select = function(){

  this.body.scale.multiplyScalar( 1.2 );

  this.selected = true;
  selectedInteractables.push( this );

}

Interactable.prototype._deselect = function(){

  console.log( 'DESEL' );
  this.body.scale.multiplyScalar( 1/1.2 );

  this.selected = false;

  var index = selectedInteractables.indexOf( this );
  
  if( index > -1 ){ selectedInteractables.splice(index, 1); }
  
}

Interactable.prototype._hoverOver = function(){

  console.log('hoverOver');
  this.body.material.opacity = 1;
  this.hovered = true;

}

Interactable.prototype._hoverOut = function(){

  this.body.material.opacity = .5;
  this.hovered = false;

}

Interactable.prototype.select    = function(){};
Interactable.prototype.deselect  = function(){};
Interactable.prototype.hoverOver = function(){};
Interactable.prototype.hoverOut  = function(){};


Interactable.prototype._updateSelected = function( position , velocity ){

  //this.position.copy( position );

  tv1.copy( position );
  tv1.sub( this.position );
  tv1.multiplyScalar( .1 );

  this.position.add( tv1 );


 // tv1.copy( velocity );
 // tv1.multiplyScalar( -1 );
 // this.position.add( tv1 );


}


Interactable.prototype.updateSelected = function(){}

