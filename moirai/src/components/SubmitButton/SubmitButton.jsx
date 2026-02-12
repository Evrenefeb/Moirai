import './SubmitButton.css'

function SubmitButton ({ onClick }) {
  return (
    <div className="action-area">
      <button className="submit-button" onClick={onClick}>
        <span className="submit-text">Submit✔ </span>
      </button>
    </div>
  );
};

export default SubmitButton;