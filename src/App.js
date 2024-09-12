import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useParams } from "react-router-dom";
import './App.css';


// User Profile Page 
function User() {
  let { username } = useParams();
  let [userData, setUserData] = useState(null);
  let [error, setError] = useState(null);

  useEffect(() => {
    if (username) {
      fetch(`https://api.github.com/users/${username}`)
        .then(response => {
          if (!response.ok) {
            throw new Error('User not found');
          }
          return response.json();
        })
        .then(data => {
          setUserData(data);
          console.log(data)
          setError(null);
        })
        .catch(err => {
          setError(err.message);
          setUserData(null); 
        });
    }
  }, [username]);

  return (
    <div className="App">
      {error ? (
        <p>{error}</p>
      ) : userData ? (
        <div>
          <h1>{userData.name}</h1>
          <h1>{userData.login}</h1>
          <img src={userData.avatar_url} alt={`${userData.name}'s avatar`} style={{ borderRadius: '50%', width: '150px', height: '150px' }} />
          <p>{userData.bio}</p>
          <p>{userData.location}</p>
          <p>Followers: {userData.followers}</p>
          <p>Following: {userData.following}</p>
          <p>Public repos: {userData.public_repos}</p>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}

// Repos info page 
function Repos () {

  let { username } = useParams();
  let [reposData, setReposData] = useState(null);
  let [error, setError] = useState(null);

  useEffect(() => {
    if (username) {
      fetch(`https://api.github.com/users/${username}/repos`)
        .then(response => {
          if (!response.ok) {
            throw new Error('Repo not found');
          }
          return response.json();
        })
        .then(data => {
          const sortedData = data.sort((a, b) => (b.stargazers_count || 0) - (a.stargazers_count || 0));
          setReposData(sortedData);
          setError(null);
        })
        .catch(err => {
          setError(err.message);
          setReposData(null);
        });
    }
  }, [username]);


  return (
    <div className="App">
      {error ? (
        <p>{error}</p>
      ) : reposData ? (
        
        <div>
     {reposData.map((repo) => (


        <p key={repo.id}>
          {repo.name} {repo.stargazers_count} stars
          <br />
          {repo.description}
        </p>
      ))}
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/:username" element={<User />} />
        <Route path="/:username/repos" element={<Repos />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
