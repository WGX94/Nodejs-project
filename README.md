The FellowShip Wall – Interactive Engagement Platform
Welcome to the repository for Asmodee’s Global Engagement Platform – a playful and meaningful internal web application designed to foster human connection, collaboration, and a shared sense of belonging across all Asmodee entities worldwide.

## 🚀 Project Overview
This interactive platform is integrated into Asmodee’s Hub and offers a variety of experiences aimed at encouraging communication, recognition, and fun among employees around the globe.

![image](https://github.com/user-attachments/assets/220904d8-6d37-4250-9953-9e7e8ce5c709)

## 🌟 Key Features
Interactive Globe
Explore all Asmodee offices around the world and interact with colleagues by sending cheerful, predefined messages like “Be bold!” or “Have a great day!”.
To create the globe, we used Three.js to have a 3D object, so that we could add the structures and the arcs. 

## Parrot Talk
A short, weekly 5-minute ritual led by each team manager to reflect on one of Asmodee’s core values – shared with the rest of the company afterward.

## Game Connect
A selection of 30 games from Board Game Arena, where employees can challenge a colleague from another office via matchmaking.

## Sink or Sail
Every quarter, employees vote on which 5 new games will be added to the platform next season.

## Pirate’s Council
A peer-to-peer recognition system where employees can award virtual badges to celebrate one another’s contributions.

## Treasure Trail
A fun, gamified leaderboard system that encourages participation through friendly competition.

## 🧰 Tech Stack
Frontend: React.js, SCSS, Nivo (For the radar graphic on the Sink or Sail page)

Backend: Node.js (Express), Knex.js, PostgreSQL

The games are only created in a database, we could not find a public API to integrate BGA's games. 

## 📦 Getting Started
Prerequisites
Node.js >= 18

PostgreSQL

A local .env file with your DB credentials

 ### Installation
_bash_
git clone https://github.com/your-username/asmodee-global-hub.git
cd asmodee-global-hub
npm install

### Running Locally
_bash_
npm run dev  
Make sure your database is seeded and running. (you might need to do a : cd backend, cd app_knex, node app.js to start the server) 

### Sign Up
Fill the different input, after you cannot log in directly beacause no role are update on your account.

To add a role you can go to Postman :
1. You use the method GET with the following url : http://localhost/users

2. You scroll at the bottom and get the id of the user you created

3. You copy the infos of the user into the body and select raw, you can now add a role "A" or "B" in "role"

4. Then you change the method to PUT and send

5. You can now go back to the web page and login to your new account