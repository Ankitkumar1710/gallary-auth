"use client";

import { useEffect, useState } from "react";
import { getToken, removeToken, getCurrentUser, isTokenValid } from "../lib/auth";

export default function HomePage() {
  const [images, setImages] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);

  const itemsPerPage = 16; // 4x4 grid
  const idleTimeLimit = 2 * 60 * 1000; // 2 minutes
  let idleTimeout;

  // ----------------------
  // LOGOUT FUNCTION
  // ----------------------
  const logoutUser = (message) => {
    removeToken();
    window.location.href = `/login?message=${encodeURIComponent(message)}`;
  };

  // ----------------------
  // RESET IDLE TIMER
  // ----------------------
  const resetIdleTimer = () => {
    clearTimeout(idleTimeout);
    idleTimeout = setTimeout(() => {
      logoutUser("You've been logged out due to inactivity.");
    }, idleTimeLimit);
  };

  // ----------------------
  // INITIAL SETUP
  // ----------------------
  useEffect(() => {
    if (!isTokenValid()) {
      logoutUser("You've been logged out.");
      return;
    }

    const fetchImages = async () => {
      try {
        const res = await fetch("https://picsum.photos/v2/list?page=1&limit=200");
        const data = await res.json();
        setImages(data);
      } catch (err) {
        console.error("Error fetching images:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchImages();

    // Idle detection
    resetIdleTimer();
    const events = ["mousemove", "keydown", "click", "scroll"];
    events.forEach((e) => window.addEventListener(e, resetIdleTimer));

    // Periodic JWT validation
    const interval = setInterval(() => {
      if (!isTokenValid()) logoutUser("Your session has expired.");
    }, 10000);

    return () => {
      clearTimeout(idleTimeout);
      clearInterval(interval);
      events.forEach((e) => window.removeEventListener(e, resetIdleTimer));
    };
  }, []);

  // ----------------------
  // FILTER & PAGINATION
  // ----------------------
  const filteredImages = images.filter(
    (img, index, self) =>
      img.author.toLowerCase().includes(search.toLowerCase()) &&
      index === self.findIndex((i) => i.author === img.author)
  );

  const startIndex = (page - 1) * itemsPerPage;
  const displayImages = filteredImages.slice(startIndex, startIndex + itemsPerPage);
  const totalPages = Math.ceil(filteredImages.length / itemsPerPage);

  if (loading) return <div className="center"><p>Loading...</p></div>;

  return (
    <div className="gallery-container">
      {/* Header */}
      <div className="header">
        <h2>Welcome, {getCurrentUser()}</h2>
        <button className="logout-btn" onClick={() => logoutUser("You've been logged out.")}>Logout</button>
      </div>

      {/* Search */}
      <input
        className="search-bar"
        type="text"
        placeholder="Search by author"
        value={search}
        onChange={(e) => { setSearch(e.target.value); setPage(1); }}
      />

      {/* Grid */}
      <div className="grid">
        {displayImages.map((img) => (
          <div key={img.id} className="card">
            <img src={img.download_url} alt={img.author} />
            <div className="overlay">
              <button onClick={() => setSelectedImage(img)}>View Details</button>
            </div>
            <h3>{img.author}</h3>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="pagination">
        <button onClick={() => setPage(p => Math.max(p-1,1))} disabled={page===1}>Prev</button>
        {Array.from({ length: totalPages }, (_, i) => (
          <button key={i} className={i+1===page?"active":""} onClick={() => setPage(i+1)}>{i+1}</button>
        ))}
        <button onClick={() => setPage(p => Math.min(p+1,totalPages))} disabled={page===totalPages}>Next</button>
      </div>

      {/* Image Details Modal */}
      {selectedImage && (
        <div className="modal-overlay" onClick={() => setSelectedImage(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <img src={selectedImage.download_url} alt={selectedImage.author} />
            <h3>{selectedImage.author}</h3>
            <p>Dimensions: {selectedImage.width} x {selectedImage.height}</p>
            <p>URL: <a href={selectedImage.url} target="_blank">{selectedImage.url}</a></p>
            <button className="close-btn" onClick={() => setSelectedImage(null)}>Close</button>
          </div>
        </div>
      )}

      <style jsx>{`
        .gallery-container { max-width:1200px; margin:40px auto; padding:0 20px; }
        .header { display:flex; justify-content:space-between; align-items:center; padding:15px 20px; background:linear-gradient(90deg,#6a11cb,#2575fc); border-radius:12px; color:white; margin-bottom:25px; box-shadow:0 8px 20px rgba(0,0,0,0.15);}
        .logout-btn { padding:10px 18px; background:#ff4d4f; border:none; border-radius:25px; font-weight:bold; cursor:pointer; transition:0.3s;}
        .logout-btn:hover { background:#d9363e; transform:scale(1.05);}
        .search-bar { width:100%; padding:12px 15px; margin-bottom:25px; border-radius:25px; border:1px solid #ccc; font-size:16px; transition:0.3s;}
        .search-bar:focus { outline:none; border-color:#2575fc; box-shadow:0 0 8px rgba(37,117,252,0.3);}
        .grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(250px,1fr)); gap:20px;}
        .card { position:relative; background:white; border-radius:12px; overflow:hidden; box-shadow:0 8px 20px rgba(0,0,0,0.1); transition:transform 0.3s ease, box-shadow 0.3s ease; cursor:pointer;}
        .card:hover { transform:translateY(-5px); box-shadow:0 15px 30px rgba(0,0,0,0.2);}
        .card img { width:100%; height:200px; object-fit:cover; }
        .card h3 { padding:12px; text-align:center; margin:0; font-size:16px; color:#333; }

        /* Overlay for View Details */
        .overlay { position:absolute; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.5); display:flex; justify-content:center; align-items:center; opacity:0; transition:opacity 0.3s ease; border-radius:12px;}
        .card:hover .overlay { opacity:1; }
        .overlay button { padding:10px 20px; background:#2575fc; border:none; color:white; font-weight:bold; border-radius:8px; cursor:pointer; transition:background 0.3s ease, transform 0.2s ease;}
        .overlay button:hover { background:#6a11cb; transform:scale(1.05); }

        .pagination { margin-top:30px; display:flex; justify-content:center; gap:10px; flex-wrap:wrap; }
        .pagination button { padding:8px 14px; border:none; border-radius:25px; cursor:pointer; font-weight:bold; background:#f0f0f0; transition:all 0.3s;}
        .pagination button:hover { background:#2575fc; color:white; transform:scale(1.05);}
        .pagination button.active { background:#2575fc; color:white; transform:scale(1.05);}
        .center { display:flex; justify-content:center; align-items:center; height:100vh; }

        /* Modal */
        .modal-overlay { position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.5); display:flex; justify-content:center; align-items:center; z-index:1000; }
        .modal-content { background:white; border-radius:12px; padding:20px; max-width:500px; width:90%; text-align:center; position:relative; }
        .modal-content img { width:100%; height:auto; border-radius:8px; margin-bottom:15px; }
        .modal-content h3 { margin:5px 0; }
        .modal-content p { margin:5px 0; font-size:14px; color:#555; }
        .modal-content a { color:#2575fc; text-decoration:none; }
        .close-btn { margin-top:15px; padding:8px 15px; border:none; border-radius:8px; background:#ff4d4f; color:white; cursor:pointer; transition:0.3s; }
        .close-btn:hover { background:#d9363e; transform:scale(1.05); }
      `}</style>
    </div>
  );
}
