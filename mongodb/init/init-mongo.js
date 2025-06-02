// Switch to the jobportal database
db = db.getSiblingDB('jobportal');

// Create collections
db.createCollection('users');
db.createCollection('profiles');
db.createCollection('sequences');

// Initialize sequences
db.sequences.insertMany([
    { _id: "users", seq: 0 },
    { _id: "profiles", seq: 0 },
    { _id: "jobs", seq: 0 },
    { _id: "notification", seq: 0 }
]); 