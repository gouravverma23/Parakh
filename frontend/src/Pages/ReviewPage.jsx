import { useLocation } from "react-router-dom";

function ReviewPage() {
  const location = useLocation();

  return (
    <div style={{ padding: "20px" }}>
      <h1>Question Review Page</h1>

      <pre>
        {JSON.stringify(location.state, null, 2)}
      </pre>
    </div>
  );
}

export default ReviewPage;