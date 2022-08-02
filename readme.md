# Project 1: Extremely Angry Asteroids

So, this is essentially an attempt at creating the classic Asteroids arcade game. You pilot a ship entering an asteroid field, and have to dodge and shoot down incoming asteroids.

Draw ship
Move ship with wasd/arrow keys
Rotate ship with mouse position relative to ship position
Shoot a projectile originating from the ship toward the mouse position
Generate targets at edge of screen (or perhaps offscreen?)
Send them moving in 
Have collision with both projectiles (destroy, increase score) and player (die, lose life)

23/07/2022

Began project, started on the first task of making a controllable spaceship on screen. To do this I created a canvas object in html then used js to draw a green rectangle to serve as the ship. Movement was handled by adding event listeners for the arrow keys and W, A, S and D, and creating an if else chain to increment or decrement the X and Y offset the rectangle would be drawn from (if else chain will likely be refactored to a switch later). Extra code was added to prevent the ship from flying off screen (essentially if the offset of X or Y would result in the ship being out of bounds, the offending offset would be set instead to the max value it could be without crossing the canvas border). This went smoothly overall.

The second task was to allow the ship to rotate. In this case I wanted it to spin with the mouse, so created a mousemove event listener and used the X and Y positions of the mouse to find the angle to rotate the ship to. This did NOT go smoothly at all.

So, first issue was that instead of rotating toward the mouse and stopping, the ship would instead spin around one corner at incredibly high speeds, while also leaving a massive trail of previously rendered rectangles. The latter of these was caused by putting the ctx.rotate method in between the beginPath and closePath, and placing it before instead greatly reduced the amount of trail being left behind (though some still remains). The former was partially fixed by adding a resetTransform function call to the beginning of the main draw loop (along with clearRect), thus resetting the angle of the ship every frame so that it would be rotated once more from the origin, rather than letting it be rotated over and over by the same amount even when the mouse was held stationary. What this didn't fix however was the fact that the entire canvas was getting rotated, rather than just the ship. After some searching and discussing with Kevin (one of our instructors), we happened upon a potential solution from stack overflow:

https://stackoverflow.com/questions/40120470/javascript-making-image-rotate-to-always-look-at-mouse-cursor

With some experimentation, we found that this approach would create a rotating object that could also be moved around a canvas and also not affect other elements drawn within it; this will however likely require my existing movement code to be refactored. There are some code samples from this and from Kevin that I'm going to be going over to assist with that.


27-30/07/2022

-expand out, but:
-attempted rotation code, did work but could not work out a way to not have the rotation affect the direction of movement; chose to refactor all visual elements to be circular to avoid having to rotate them (flying saucers)
-began work on projectile code; works by drawing a bullet that follows the ship position, then when the mouse is clicked snapshotting its position and changing its X and Y coordinates each frame for 60 frames according to the difference between the snapshotted player position at the time of firing, and the mouse position at the time of firing.
-Fires, but currently the direction of fire, though affected by mouse position, does not translate 1:1 to where the player will see their mouse. Also doesn't impart a uniform speed to the projectile, affected by mouse position.