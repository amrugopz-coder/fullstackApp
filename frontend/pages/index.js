import { useEffect, useState } from "react";
import Link from "next/link";
import PostModal from "../components/PostModal";

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const postsPerPage = 10;

  useEffect(() => {
    // Step 1: Sync posts from dummy API to DB
    fetch("${process.env.NEXT_PUBLIC_API_BASE}/api/syncPosts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({}),
    })
      .then((res) => res.json())
      .then((syncData) => {
        console.log("Sync result:", syncData);

        // Step 2: Fetch posts from DB after sync
        fetch("/api/getPosts")
          .then((res) => res.json())
          .then((data) => {
            setPosts(data.posts || []);
          })
          .catch((err) => console.error("Fetching posts failed:", err));
      })
      .catch((err) => console.error("Sync failed:", err));
  }, []);

  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleCreatePost = (newPost) => {
    setPosts([newPost, ...posts]);
    setCurrentPage(1); // show the new post on the first page
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold">Posts</h1>
        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2 bg-green-600 text-white rounded"
        >
          + New Post
        </button>
      </div>

      <table className="w-full border-collapse border border-gray-300">
        <thead className="bg-gray-100">
          <tr>
            <th className="border border-gray-300 px-4 py-2 text-left">Title</th>
            <th className="border border-gray-300 px-4 py-2">Details</th>
          </tr>
        </thead>
        <tbody>
          {currentPosts.map((post) => (
            <tr key={post.id} className="hover:bg-gray-50">
              <td className="border border-gray-300 px-4 py-2">{post.title}</td>
              <td className="border border-gray-300 px-4 py-2 text-center">
                <Link href={`/post/${post.id}`}>
                  <span className="text-blue-600 cursor-pointer underline">View</span>
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="flex mt-4 space-x-2">
        {[...Array(Math.ceil(posts.length / postsPerPage))].map((_, idx) => (
          <button
            key={idx}
            onClick={() => paginate(idx + 1)}
            className={`px-3 py-1 border rounded ${
              currentPage === idx + 1 ? "bg-blue-600 text-white" : "bg-white"
            }`}
          >
            {idx + 1}
          </button>
        ))}
      </div>

      {/* Create Post Modal */}
      <PostModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onCreate={handleCreatePost}
      />
    </div>
  );
}
