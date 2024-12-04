'use client';
const ScorePanel = ({ score }) => (
  <div style={{
    position: 'absolute',
    top: 10,
    left: 10,
    fontSize: '24px',
    color: 'white',
    fontWeight: 'bold',
    zIndex: 10, 
    textShadow: '2px 2px 4px rgba(0,0,0,0.5)', // Optional: add a text shadow for better visibility on varying backgrounds
  }}>
    Score: {score}
  </div>
);
export default ScorePanel;