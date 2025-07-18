// /pages/post/[id].js
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function PostDetail() {
  const router = useRouter();
  const { id } = router.query;

  const [post, setPost] = useState(null);
  const [editedTitle, setEditedTitle] = useState("");
  const [loading, setLoading] = useState(true);
  const [wordCount, setWordCount] = useState(null);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!id) return;

    console.log("🚀 useEffect triggered with id:", id);

    fetch(`/api/post/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Post not found");
        return res.json();
      })
      .then((data) => {
        setPost(data);
        setEditedTitle(data.title);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching post:", err);
        setError("Post not found");
        setLoading(false);
      });
  }, [id]);

  const runAnalysis = async () => {
    try {
      const res = await fetch("http://localhost:8080/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: post.body }),
      });

      if (!res.ok) throw new Error("Analysis failed");

      const data = await res.json();
      setWordCount(data.wordCount);
      setError("");
    } catch (err) {
      console.error("Error during analysis:", err);
      setError("Failed to analyze post.");
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage("");

    try {
      const res = await fetch(`/api/post/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title: editedTitle }),
      });

      if (!res.ok) throw new Error("Save failed");

      const updated = await res.json();
      setPost(updated);
      setMessage("✅ Title saved!");
    } catch (err) {
      console.error("Save error:", err);
      setMessage("❌ Failed to save title.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p className="p-6">Loading...</p>;
  if (!post) return <p className="p-6 text-red-500">Post not found.</p>;

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Post Details</h1>

      <div className="mb-4">
        <label className="block font-semibold mb-1">Title (editable):</label>
        <input
          className="border p-2 w-full mb-2"
          value={editedTitle}
          onChange={(e) => setEditedTitle(e.target.value)}
        />
        <button
          onClick={handleSave}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          disabled={saving}
        >
          {saving ? "Saving..." : "💾 Save Title"}
        </button>
        {message && <p className="mt-2 text-sm text-blue-700">{message}</p>}
      </div>

      <div className="mb-4">
        <label className="block font-semibold mb-1">Post Body:</label>
        <p className="border p-2 bg-gray-100">{post.body}</p>
      </div>

      <button
        onClick={runAnalysis}
        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Analyze
      </button>

      {wordCount !== null && (
        <div className="mt-4">
          <label className="block font-semibold mb-1 text-green-700">🧠 Word Count:</label>
          <input
            type="text"
            className="border p-2 w-full bg-green-100 text-green-800 font-bold"
            value={`${wordCount} words`}
            readOnly
          />
        </div>
      )}

      {error && (
        <div className="mt-4 text-red-600 font-semibold">{error}</div>
      )}
    </div>
  );
}
