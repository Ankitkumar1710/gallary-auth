"use client";

import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import { getToken, removeToken, getCurrentUser, isTokenValid } from "../lib/auth";

export default function HomePage() {
  const [images, setImages] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  const itemsPerPage = 12;

  useEffect(() => {
    const token = getToken();
    if (!token || !isTokenValid(token)) {
      removeToken();
      window.location.href = "/login";
    }
  }, []);

  useEffect(() => {
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
  }, []);

  const filteredImages = images.filter(
    (img, index, self) =>
      img.author.toLowerCase().includes(search.toLowerCase()) &&
      index === self.findIndex((i) => i.author === img.author)
  );

  const startIndex = (page - 1) * itemsPerPage;
  const displayImages = filteredImages.slice(startIndex, startIndex + itemsPerPage);
  const totalPages = Math.ceil(filteredImages.length / itemsPerPage);

  const handleLogout = () => {
    removeToken();
    window.location.href = "/login";
  };

  if (loading) return <Layout><p>Loading...</p></Layout>;

  return (
    <Layout>
      <div className="gallery-container">

        {/* Header */}
        <div className="header">
          <div className="welcome">
            <h2>Welcome, {getCurrentUser()}</h2>
          </div>
          <button className="logout-btn" onClick={handleLogout}>Logout</button>
        </div>

        {/* Search */}
        <input
          className="search-bar"
          type="text"
          placeholder="Search by author"
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
        />

        {/* Image Grid */}
        <div className="grid">
          {displayImages.map((img) => (
            <div key={img.id} className="card">
              <img src={img.download_url} alt={img.author} />
              <div className="card-footer">
                <h3>{img.author}</h3>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="pagination">
          <button
            onClick={() => setPage(prev => Math.max(prev - 1, 1))}
            disabled={page === 1}
            className="prev-next"
          >
            Prev
          </button>
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              className={i + 1 === page ? "active" : ""}
              onClick={() => setPage(i + 1)}
            >
              {i + 1}
            </button>
          ))}
          <button
            onClick={() => setPage(prev => Math.min(prev + 1, totalPages))}
            disabled={page === totalPages}
            className="prev-next"
          >
            Next
          </button>
        </div>
      </div>

      <style jsx>{`
        .gallery-container {
          max-width: 1200px;
          margin: 40px auto;
          padding: 0 20px;
        }

        /* Header */
        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 15px 20px;
          background: linear-gradient(90deg, #6a11cb, #2575fc);
          border-radius: 12px;
          color: white;
          margin-bottom: 25px;
          box-shadow: 0 8px 20px rgba(0,0,0,0.15);
        }

        .header .welcome h2 {
          margin: 0;
          font-size: 20px;
          font-weight: bold;
        }

        .logout-btn {
          padding: 10px 18px;
          background: #ff4d4f;
          border: none;
          border-radius: 25px;
          font-weight: bold;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .logout-btn:hover {
          background: #d9363e;
          transform: scale(1.05);
        }

        /* Search */
        .search-bar {
          width: 100%;
          padding: 12px 15px;
          margin-bottom: 25px;
          border-radius: 25px;
          border: 1px solid #ccc;
          font-size: 16px;
          transition: border 0.3s ease, box-shadow 0.3s ease;
        }

        .search-bar:focus {
          outline: none;
          border-color: #2575fc;
          box-shadow: 0 0 8px rgba(37, 117, 252, 0.3);
        }

        /* Grid */
        .grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
          gap: 20px;
        }

        .card {
          background: white;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 8px 20px rgba(0,0,0,0.1);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }

        .card:hover {
          transform: translateY(-5px);
          box-shadow: 0 15px 30px rgba(0,0,0,0.2);
        }

        .card img {
          width: 100%;
          height: 200px;
          object-fit: cover;
        }

        .card-footer {
          padding: 12px;
          text-align: center;
          background: #fafafa;
        }

        .card h3 {
          font-size: 16px;
          color: #333;
          margin: 0;
        }

        /* Pagination */
        .pagination {
          margin-top: 30px;
          display: flex;
          justify-content: center;
          gap: 10px;
          flex-wrap: wrap;
        }

        .pagination button {
          padding: 8px 14px;
          border: none;
          background: #f0f0f0;
          cursor: pointer;
          border-radius: 25px;
          font-weight: bold;
          transition: all 0.3s ease;
        }

        .pagination button:hover {
          background: #2575fc;
          color: white;
          transform: scale(1.05);
        }

        .pagination button.active {
          background: #2575fc;
          color: white;
          transform: scale(1.05);
        }

        .pagination button.prev-next {
          background: #e0e0e0;
        }

        .pagination button.prev-next:hover {
          background: #1890ff;
          color: white;
        }

        @media (max-width: 768px) {
          .grid { grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); }
        }

        @media (max-width: 480px) {
          .grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </Layout>
  );
}
