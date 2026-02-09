* {
  box-sizing: border-box;
  font-family: Arial, sans-serif;
}

body {
  background: linear-gradient(135deg, #1d2671, #c33764);
  min-height: 100vh;
  margin: 0;
  color: #fff;
}

.container, .dashboard {
  background: rgba(0,0,0,0.35);
  padding: 25px;
  border-radius: 12px;
  width: 90%;
  max-width: 900px;
  margin: 40px auto;
}

h2 {
  text-align: center;
}

input, button {
  width: 100%;
  padding: 10px;
  margin: 6px 0;
  border-radius: 6px;
  border: none;
}

button {
  background: #ff9800;
  font-weight: bold;
  cursor: pointer;
}

button:hover {
  background: #ffc107;
}

.grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
}

.card {
  background: rgba(0,0,0,0.45);
  padding: 15px;
  border-radius: 10px;
}

small {
  display: block;
  text-align: center;
  margin-top: 5px;
}

pre {
  background: #000;
  padding: 10px;
  border-radius: 6px;
}