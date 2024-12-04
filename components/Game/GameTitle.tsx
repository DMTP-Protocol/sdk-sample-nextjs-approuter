'use client';
const GameTitle = ({ title }) => (
  <h1 style={{
    position: 'absolute',
    top: 60,
    left: 10,
    fontSize: '28px',
    color: 'white',
    fontWeight: 'bold',
    zIndex: 10,
    textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
  }}>
    {title}
  </h1>
);
export default GameTitle;