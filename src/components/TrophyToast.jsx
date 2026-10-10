export default function TrophyToast({ show, text }) {
  return (
    <div className={`toast${show ? ' show' : ''}`} role="status">
      <div style={{ fontSize: '1.6rem' }} aria-hidden>
        🏆
      </div>
      <div>
        <h4>TROPHY UNLOCKED</h4>
        <p>{text || 'Nice clear!'}</p>
      </div>
    </div>
  );
}
