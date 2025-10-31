Tech Challenge - Recipe App
https://img.shields.io/badge/React%2520Native-20232A?style=flat&logo=react
https://img.shields.io/badge/TypeScript-007ACC?style=flat&logo=typescript
https://img.shields.io/badge/Node.js-339933?style=flat&logo=node.js
https://img.shields.io/badge/Expo-1B1F23?style=flat&logo=expo
https://img.shields.io/badge/SQLite-003B57?style=flat&logo=sqlite

Description
This is a React Native application for managing and viewing recipes. Users can register, log in, view recipes, mark them as favorites, like or dislike recipes, and search recipes using an AI prompt. The app follows the Figma design: Figma link.

Features
User Authentication: Register and login functionality

Recipe Management: Browse, view, and interact with recipes

Favorites System: Mark recipes as favorites

Like/Dislike: Rate recipes with like/dislike functionality

AI-Powered Search: Search recipes using natural language prompts

Responsive Design: Optimized for both iOS and Android

Technologies Used
Frontend
React Native

TypeScript

React Navigation

Expo

AsyncStorage for local storage

Ionicons for icons

Backend (Optional)
Node.js

Express

SQLite for database

REST API endpoints for authentication and recipes

Design
Figma for UI/UX

Project Structure
text
Tech-Challenge-Tapptitude/
├── RecipeFinder/          # React Native frontend code
├── server/               # Local API server (Node.js + Express + SQLite)
├── assets/               # Images and resources used in the app
└── README.md
Screenshots
Login
https://assets/login_recipe.png

Register
https://assets/registee_recipefinder.png

Home and Favorites
https://assets/home.png

Recipe Details 1
https://assets/recipedetails2.png

Recipe Details 2
https://assets/recipedetails.png

Prerequisites
Before running this application, make sure you have the following installed:

Node.js (v14 or higher)

npm or yarn

Expo CLI

iOS Simulator (for Mac) or Android Studio (for Android development)

Expo Go app on your physical device (optional)

Installation & Setup
Frontend Setup
Clone the repository:

bash
git clone https://github.com/oanamariasilivastru/Tech-Challenge-Tapptitude.git
Navigate to the frontend folder:

bash
cd Tech-Challenge-Tapptitude/RecipeFinder
Install dependencies:

bash
npm install
Start the app:

bash
npx expo start
Run on your preferred platform:

Press a to run on Android emulator

Press i to run on iOS simulator

Scan the QR code with Expo Go app (on your physical device)

Backend Setup (Optional)
Navigate to the server folder:

bash
cd server
Install dependencies:

bash
npm install
Run the server:

bash
node server.js
The API will be available at http://localhost:3000/api

API Endpoints
Authentication
POST /api/register - User registration

POST /api/login - User login

Recipes
GET /api/recipes - Get all recipes

GET /api/recipes/:id - Get specific recipe

POST /api/recipes/search - AI-powered recipe search

POST /api/recipes/:id/favorite - Mark recipe as favorite

POST /api/recipes/:id/like - Like a recipe

POST /api/recipes/:id/dislike - Dislike a recipe

Environment Variables
Create a .env file in the root directory with the following variables:

text
API_BASE_URL=http://localhost:3000/api
EXPO_PUBLIC_API_KEY=your_api_key_here
