# Exported from Render on 2024-04-25T10:09:53Z
services:
- type: web
  name: ChatByKumar
  runtime: node
  repo: https://github.com/CoderKumarS/ChatByKumar
  plan: free
  envVars:
  - key: MONOGO_URI
    sync: false
  region: singapore
  buildCommand: npm install
  startCommand: node app.js
version: "1"
> `Link :` https://chatbykumar.onrender.com  
