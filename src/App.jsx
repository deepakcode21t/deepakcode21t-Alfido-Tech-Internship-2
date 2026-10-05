import { useEffect, useState } from "react";
import { Link, Route, Routes, useNavigate, useParams } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
const emptyForm = { name: "", description: "", price: "", category: "", inStock: true };

function Navbar() {
  return <nav className="navbar">
    <Link className="brand" to="/">Product Manager</Link>
    <div className="nav-links"><Link to="/">Products</Link><Link to="/add">Add Product</Link></div>
  </nav>;
}

function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadProducts = async () => {
    try {
      setLoading(true); setError("");
      const res = await fetch(`${API_URL}/products`);
      const result = await res.json();
      if (!res.ok) throw new Error(result.message || "Failed to load products");
      setProducts(result.data || []);
    } catch (err) {
      setError(`${err.message}. Make sure Task 1 backend is running on port 5000.`);
    } finally { setLoading(false); }
  };

  useEffect(() => { loadProducts(); }, []);

  const deleteProduct = async (id) => {
    if (!window.confirm("Delete this product?")) return;
    try {
      const res = await fetch(`${API_URL}/products/${id}`, { method: "DELETE" });
      const result = await res.json();
      if (!res.ok) throw new Error(result.message || "Delete failed");
      setProducts(current => current.filter(p => p._id !== id));
    } catch (err) { setError(err.message); }
  };

  if (loading) return <div className="status">Loading products...</div>;

  return <section>
    <div className="page-header">
      <div><h1>Products</h1><p>Manage products using the REST API.</p></div>
      <Link className="button primary" to="/add">+ Add Product</Link>
    </div>
    {error && <div className="alert">{error}</div>}
    {products.length === 0 ? <div className="empty">
      <h2>No products found</h2><p>Add your first product to see it here.</p>
      <Link className="button primary" to="/add">Add Product</Link>
    </div> : <div className="grid">
      {products.map(product => <article className="card" key={product._id}>
        <div className="card-top">
          <span className="category">{product.category}</span>
          <span className={product.inStock ? "stock yes" : "stock no"}>
            {product.inStock ? "In stock" : "Out of stock"}
          </span>
        </div>
        <h2>{product.name}</h2>
        <p className="description">{product.description || "No description provided."}</p>
        <div className="price">₹{Number(product.price).toLocaleString("en-IN")}</div>
        <div className="actions">
          <Link className="button" to={`/edit/${product._id}`}>Edit</Link>
          <button className="button danger" onClick={() => deleteProduct(product._id)}>Delete</button>
        </div>
      </article>)}
    </div>}
  </section>;
}

function ProductForm({ editMode = false }) {
  const navigate = useNavigate();
  const { id } = useParams();
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(editMode);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!editMode) return;
    (async () => {
      try {
        const res = await fetch(`${API_URL}/products/${id}`);
        const result = await res.json();
        if (!res.ok) throw new Error(result.message || "Product not found");
        setForm({
          name: result.data.name || "",
          description: result.data.description || "",
          price: result.data.price ?? "",
          category: result.data.category || "",
          inStock: result.data.inStock ?? true
        });
      } catch (err) { setError(err.message); }
      finally { setLoading(false); }
    })();
  }, [editMode, id]);

  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    setForm(current => ({ ...current, [name]: type === "checkbox" ? checked : value }));
  };

  const handleSubmit = async e => {
    e.preventDefault(); setError("");
    if (!form.name.trim() || !form.category.trim() || form.price === "") {
      setError("Product name, price and category are required."); return;
    }
    try {
      setSaving(true);
      const res = await fetch(`${API_URL}/products${editMode ? `/${id}` : ""}`, {
        method: editMode ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, price: Number(form.price) })
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.errors?.join(", ") || result.message || "Request failed");
      navigate("/");
    } catch (err) { setError(err.message); }
    finally { setSaving(false); }
  };

  if (loading) return <div className="status">Loading product...</div>;

  return <section className="form-section">
    <div className="page-header">
      <div><h1>{editMode ? "Edit Product" : "Add Product"}</h1>
      <p>{editMode ? "Update an existing product." : "Create a new product."}</p></div>
    </div>
    {error && <div className="alert">{error}</div>}
    <form className="form-card" onSubmit={handleSubmit}>
      <label>Product Name<input name="name" value={form.name} onChange={handleChange} placeholder="Wireless Mouse" /></label>
      <label>Description<textarea name="description" value={form.description} onChange={handleChange} placeholder="Ergonomic wireless mouse" rows="4" /></label>
      <div className="two-col">
        <label>Price<input name="price" type="number" min="0" value={form.price} onChange={handleChange} placeholder="799" /></label>
        <label>Category<input name="category" value={form.category} onChange={handleChange} placeholder="Electronics" /></label>
      </div>
      <label className="checkbox"><input name="inStock" type="checkbox" checked={form.inStock} onChange={handleChange} /> Product is in stock</label>
      <div className="form-actions">
        <Link className="button" to="/">Cancel</Link>
        <button className="button primary" disabled={saving}>{saving ? "Saving..." : editMode ? "Update Product" : "Create Product"}</button>
      </div>
    </form>
  </section>;
}

function NotFound() {
  return <div className="empty"><h1>Page not found</h1><Link className="button primary" to="/">Go to Products</Link></div>;
}

export default function App() {
  return <>
    <Navbar />
    <main className="container">
      <Routes>
        <Route path="/" element={<Products />} />
        <Route path="/add" element={<ProductForm />} />
        <Route path="/edit/:id" element={<ProductForm editMode />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </main>
  </>;
}