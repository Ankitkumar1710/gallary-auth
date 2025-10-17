"use client";

import { useState, useEffect } from "react";

export default function ImageGallery() {
  const [images, setImages] = useState([]);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const perPage = 10; // compulsory 10 images per page
  const totalPages = 10;

  // Fetch images
  useEffect(() => {
    fetch(`https://picsum.photos/v2/list?page=${page}&limit=50`) // fetch extra to filter duplicates
      .then((res) => res.json())
      .then((data) => {
        // remove duplicate authors and take first 10
        const unique = [];
        const seen = new Set();
        for (let img of data) {
          if (!seen.has(img.author)) {
            unique.push(img);
            seen.add(img.author);
          }
          if (unique.length === perPage) break;
        }
        setImages(unique);
      })
      .catch((err) => console.error(err));
  }, [page]);

  // Handle search
  const filteredImages = search
    ? images.filter((img) =>
        img.author.toLowerCase().includes(search.toLowerCase())
      )
    : images;

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      {/* Search Bar */}
      <div style={{ marginBottom: "20px", textAlign: "center" }}>
        <input
          type="text"
          placeholder="Search by title..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            padding: "10px",
            width: "300px",
            border: "1px solid #ccc",
            borderRadius: "4px",
          }}
        />
      </div>

      {/* Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(5, 1fr)", // 5 columns for 10 images = 2 rows
          gap: "20px",
        }}
      >
        {filteredImages.map((img) => (
          <div
            key={img.id}
            style={{
              border: "1px solid #ccc",
              borderRadius: "8px",
              overflow: "hidden",
              boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
              textAlign: "center",
            }}
          >
            <img
              src={`https://picsum.photos/id/${img.id}/300/200`}
              alt={img.author}
              style={{ width: "100%", height: "150px", objectFit: "cover" }}
            />
            <div style={{ padding: "10px", fontWeight: "bold", fontSize: "14px" }}>
              {img.author}
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          marginTop: "20px",
          gap: "8px",
          flexWrap: "wrap",
        }}
      >
        {[...Array(totalPages)].map((_, i) => (
          <button
            key={i + 1}
            onClick={() => setPage(i + 1)}
            style={{
              padding: "8px 12px",
              border: "1px solid #007BFF",
              borderRadius: "4px",
              backgroundColor: page === i + 1 ? "#007BFF" : "#fff",
              color: page === i + 1 ? "#fff" : "#007BFF",
              cursor: "pointer",
            }}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
}
