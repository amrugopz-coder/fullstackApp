export default function PostModal({ isOpen, onClose, onCreate }) {
    if (!isOpen) return null;
  
    let title = "";
    let body = "";
  
    const handleSubmit = (e) => {
      e.preventDefault();
      if (title.trim() && body.trim()) {
        onCreate({
          id: Math.floor(Math.random() * 10000) + 100, // Fake ID
          title,
          body,
        });
        onClose();
      }
    };
  
    return (
      <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
        <div className="bg-white rounded p-6 w-[90%] max-w-md shadow-lg">
          <h2 className="text-xl font-bold mb-4">Create New Post</h2>
          <form onSubmit={handleSubmit}>
            <label className="block mb-2 font-semibold">Title:</label>
            <input
              type="text"
              className="w-full border p-2 mb-4"
              onChange={(e) => (title = e.target.value)}
            />
            <label className="block mb-2 font-semibold">Body:</label>
            <textarea
              className="w-full border p-2 mb-4"
              rows="4"
              onChange={(e) => (body = e.target.value)}
            />
            <div className="flex justify-end space-x-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border rounded"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded"
              >
                Create
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }
  