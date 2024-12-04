'use client';
const GameObject = ({ position, onClick, imageUrl }) => (
  <img
    src={imageUrl}
    style={{
      position: 'absolute',
      left: `${position.x}px`,
      top: `${position.y}px`,
      cursor: 'pointer',
      transition: 'all 0.3s ease',
    }}
    onClick={onClick}
    alt="Game Object"
  />
);
export default GameObject;