Reverie:
I want to design an online game drawing inspiration from Dixit and Muse. 
I will have a folder or repository of cards called “Story cards” which all contain beautiful complex dreamy artworks. 
There is another set of cards which are called constraints. These contain semantic constraints such as “A fictional character in a movie” or “a 5 letter word with an e in it”
New game leads you to a game setup screen. 
The game allows you to choose game modes: Either cooperative or competitive(only for 4+ players) You can also choose win conditions i.e either the winning team is first to 10 points or the game consists of 15 rounds (the numbers can be customized)
There is only 1 device in this game, all players look at it. 
First screen: Display Game title “Reverie”. Have buttons for “How to Play”, “New Game” and “About”


Gameplay
The game screen includes team/player information on the top right corner along with their scores (starting with 0). It also indicates which team’s turn it is currently.
Initially, a team is chosen at random and the storyteller is picked at random from that team. In subsequent turns, we cycle through each player in each team for the role of story teller.   
The screen tells team 1’s storyteller *player 1 name* to view the screen while everyone else in team 1 has to look away or close eyes - tap when ready. When this is done, player 1 clicks the screen.
Player 1 and everyone else in team 2 can now see a single story card. They also see a constraint card. They are prompted to think of a clue. They are given 30 seconds to click the “Ready with the clue!” button. There is a countdown timer in the top center of the screen- turns red when 10 seconds left. 
This gives an audio cue and other Team 1 members may open their eyes. The story teller speaks out the clue in the room to the other players. Everyone now sees the “Guessing Screen”
The guessing screen has 6 “story cards”. One of them is the same as the one the story teller saw. There is a 1min 30s timer counting down in the top center of the screen. 
The guessers have to select an answer. They click on their guessed story card.
If it is the right one, a confetti animation and cheer sound is played and +1 is added to that team’s score
If it is wrong, they are met with a “wrong answer” audio and the correct card is revealed. 
Control shifts to the other team, starting with a storyteller from their team.
Gameplay continues until a win condition is met and the winning team is displayed after a drumroll. 



File structure:

reverie/
    -app/
        -api/
            -constraints/
                -route.ts
            -story-cards/
                -route.ts

        -game/
            -play/
                -page.tsx
            -page.tsx

        -public/
            -images/
            -story-cards/
            -constraints.json

