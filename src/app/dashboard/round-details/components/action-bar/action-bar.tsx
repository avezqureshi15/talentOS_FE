import "./action-bar.css";

const ActionBar = () => {
  return (
    <div className="ab-bar">
      <button className="ab-btn ab-btn--reject">REJECT</button>
      <button className="ab-btn ab-btn--potential">POTENTIAL FIT</button>
      <button className="ab-btn ab-btn--advance">ADVANCE</button>
    </div>
  );
};

export default ActionBar;
