import { useEffect, useState } from "react";
import "./App.css";

const API = "http://product-management-api-47ko.onrender.com/api";

function App() {
  const [activeTab, setActiveTab] = useState("products");

  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [products, setProducts] = useState([]);

  const [categoryName, setCategoryName] = useState("");
  const [subCategoryName, setSubCategoryName] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState("");

  const [product, setProduct] = useState({
    productName: "",
    productCode: "",
    categoryId: "",
    subCategoryId: "",
    brand: "",
    mrp: "",
    price: "",
  });

  const [editingCategoryId, setEditingCategoryId] = useState(null);
  const [editingSubCategoryId, setEditingSubCategoryId] = useState(null);
  const [editingProductId, setEditingProductId] = useState(null);

  useEffect(() => {
    loadCategories();
    loadSubCategories();
    loadProducts();
  }, []);

  // =========================
  // CATEGORY
  // =========================

  async function loadCategories() {
    const response = await fetch(`${API}/categories`);
    const data = await response.json();
    setCategories(data);
  }

  async function saveCategory() {
    if (!categoryName.trim()) {
      alert("Enter category name");
      return;
    }

    const url = editingCategoryId
      ? `${API}/categories/${editingCategoryId}`
      : `${API}/categories`;

    const method = editingCategoryId ? "PUT" : "POST";

    const response = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        categoryName,
      }),
    });

    if (!response.ok) {
      alert("Failed to save category");
      return;
    }

    setCategoryName("");
    setEditingCategoryId(null);
    await loadCategories();
  }

  function editCategory(category) {
    setCategoryName(category.categoryName);
    setEditingCategoryId(category.id);
    setActiveTab("categories");
  }

  async function deleteCategory(id) {
    if (!window.confirm("Delete this category?")) return;

    const response = await fetch(`${API}/categories/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      alert("Cannot delete category. It may be used by a subcategory.");
      return;
    }

    await loadCategories();
    await loadSubCategories();
    await loadProducts();
  }

  // =========================
  // SUBCATEGORY
  // =========================

  async function loadSubCategories() {
    const response = await fetch(`${API}/subcategories`);
    const data = await response.json();
    setSubCategories(data);
  }

  async function saveSubCategory() {
    if (!subCategoryName.trim() || !selectedCategoryId) {
      alert("Enter subcategory and select category");
      return;
    }

    const url = editingSubCategoryId
      ? `${API}/subcategories/${editingSubCategoryId}`
      : `${API}/subcategories`;

    const method = editingSubCategoryId ? "PUT" : "POST";

    const response = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        subCategoryName,
        categoryId: Number(selectedCategoryId),
      }),
    });

    if (!response.ok) {
      alert("Failed to save subcategory");
      return;
    }

    resetSubCategoryForm();
    await loadSubCategories();
  }

  function editSubCategory(subCategory) {
    setSubCategoryName(subCategory.subCategoryName);
    setSelectedCategoryId(subCategory.category.id);
    setEditingSubCategoryId(subCategory.id);
    setActiveTab("subcategories");
  }

  async function deleteSubCategory(id) {
    if (!window.confirm("Delete this subcategory?")) return;

    const response = await fetch(`${API}/subcategories/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      alert("Cannot delete subcategory. It may be used by a product.");
      return;
    }

    await loadSubCategories();
    await loadProducts();
  }

  function resetSubCategoryForm() {
    setSubCategoryName("");
    setSelectedCategoryId("");
    setEditingSubCategoryId(null);
  }

  // =========================
  // PRODUCT
  // =========================

  async function loadProducts() {
    const response = await fetch(`${API}/products`);
    const data = await response.json();
    setProducts(data);
  }

  function handleProductChange(event) {
    const { name, value } = event.target;

    setProduct((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  async function saveProduct() {
    if (
      !product.productName ||
      !product.productCode ||
      !product.categoryId ||
      !product.subCategoryId ||
      !product.brand ||
      !product.mrp ||
      !product.price
    ) {
      alert("Please fill all product fields");
      return;
    }

    const url = editingProductId
      ? `${API}/products/${editingProductId}`
      : `${API}/products`;

    const method = editingProductId ? "PUT" : "POST";

    const body = {
      productName: product.productName,
      productCode: product.productCode,
      categoryId: Number(product.categoryId),
      subCategoryId: Number(product.subCategoryId),
      brand: product.brand,
      mrp: Number(product.mrp),
      price: Number(product.price),
    };

    const response = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const message = await response.text();
      alert(message || "Failed to save product");
      return;
    }

    resetProductForm();
    await loadProducts();
  }

  function editProduct(productData) {
    setProduct({
      productName: productData.productName,
      productCode: productData.productCode,
      categoryId: productData.category.id,
      subCategoryId: productData.subCategory.id,
      brand: productData.brand,
      mrp: productData.mrp,
      price: productData.price,
    });

    setEditingProductId(productData.id);
    setActiveTab("products");
  }

  async function deleteProduct(id) {
    if (!window.confirm("Delete this product?")) return;

    const response = await fetch(`${API}/products/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      alert("Failed to delete product");
      return;
    }

    await loadProducts();
  }

  function resetProductForm() {
    setProduct({
      productName: "",
      productCode: "",
      categoryId: "",
      subCategoryId: "",
      brand: "",
      mrp: "",
      price: "",
    });

    setEditingProductId(null);
  }

  // Only show subcategories belonging to selected category
  const filteredSubCategories = subCategories.filter(
    (subCategory) =>
      String(subCategory.category?.id) === String(product.categoryId)
  );

  return (
    <div className="app">
      <header>
        <h1>Product Management System</h1>
        <p>Spring Boot + PostgreSQL</p>
      </header>

      <nav>
        <button
          className={activeTab === "products" ? "active" : ""}
          onClick={() => setActiveTab("products")}
        >
          Products
        </button>

        <button
          className={activeTab === "categories" ? "active" : ""}
          onClick={() => setActiveTab("categories")}
        >
          Categories
        </button>

        <button
          className={activeTab === "subcategories" ? "active" : ""}
          onClick={() => setActiveTab("subcategories")}
        >
          Subcategories
        </button>
      </nav>

      <main>
        {/* ================= PRODUCTS ================= */}

        {activeTab === "products" && (
          <section>
            <div className="form-card">
              <h2>{editingProductId ? "Edit Product" : "Add Product"}</h2>

              <div className="form-grid">
                <input
                  name="productName"
                  placeholder="Product Name"
                  value={product.productName}
                  onChange={handleProductChange}
                />

                <input
                  name="productCode"
                  placeholder="Product Code"
                  value={product.productCode}
                  onChange={handleProductChange}
                />

                <select
                  name="categoryId"
                  value={product.categoryId}
                  onChange={(e) => {
                    handleProductChange(e);

                    setProduct((previous) => ({
                      ...previous,
                      categoryId: e.target.value,
                      subCategoryId: "",
                    }));
                  }}
                >
                  <option value="">Select Category</option>

                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.categoryName}
                    </option>
                  ))}
                </select>

                <select
                  name="subCategoryId"
                  value={product.subCategoryId}
                  onChange={handleProductChange}
                >
                  <option value="">Select Subcategory</option>

                  {filteredSubCategories.map((subCategory) => (
                    <option key={subCategory.id} value={subCategory.id}>
                      {subCategory.subCategoryName}
                    </option>
                  ))}
                </select>

                <input
                  name="brand"
                  placeholder="Brand"
                  value={product.brand}
                  onChange={handleProductChange}
                />

                <input
                  name="mrp"
                  type="number"
                  placeholder="MRP"
                  value={product.mrp}
                  onChange={handleProductChange}
                />

                <input
                  name="price"
                  type="number"
                  placeholder="Price"
                  value={product.price}
                  onChange={handleProductChange}
                />
              </div>

              <button className="primary" onClick={saveProduct}>
                {editingProductId ? "Update Product" : "Add Product"}
              </button>

              {editingProductId && (
                <button className="secondary" onClick={resetProductForm}>
                  Cancel
                </button>
              )}
            </div>

            <div className="table-card">
              <h2>Products</h2>

              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Code</th>
                    <th>Category</th>
                    <th>Subcategory</th>
                    <th>Brand</th>
                    <th>MRP</th>
                    <th>Price</th>
                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {products.map((item) => (
                    <tr key={item.id}>
                      <td>{item.id}</td>
                      <td>{item.productName}</td>
                      <td>{item.productCode}</td>
                      <td>{item.category?.categoryName}</td>
                      <td>{item.subCategory?.subCategoryName}</td>
                      <td>{item.brand}</td>
                      <td>₹{item.mrp}</td>
                      <td>₹{item.price}</td>

                      <td>
                        <button
                          className="edit"
                          onClick={() => editProduct(item)}
                        >
                          Edit
                        </button>

                        <button
                          className="delete"
                          onClick={() => deleteProduct(item.id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* ================= CATEGORIES ================= */}

        {activeTab === "categories" && (
          <section>
            <div className="form-card">
              <h2>
                {editingCategoryId ? "Edit Category" : "Add Category"}
              </h2>

              <input
                placeholder="Category Name"
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
              />

              <button className="primary" onClick={saveCategory}>
                {editingCategoryId ? "Update Category" : "Add Category"}
              </button>

              {editingCategoryId && (
                <button
                  className="secondary"
                  onClick={() => {
                    setCategoryName("");
                    setEditingCategoryId(null);
                  }}
                >
                  Cancel
                </button>
              )}
            </div>

            <div className="table-card">
              <h2>Categories</h2>

              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Category Name</th>
                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {categories.map((category) => (
                    <tr key={category.id}>
                      <td>{category.id}</td>
                      <td>{category.categoryName}</td>

                      <td>
                        <button
                          className="edit"
                          onClick={() => editCategory(category)}
                        >
                          Edit
                        </button>

                        <button
                          className="delete"
                          onClick={() => deleteCategory(category.id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* ================= SUBCATEGORIES ================= */}

        {activeTab === "subcategories" && (
          <section>
            <div className="form-card">
              <h2>
                {editingSubCategoryId
                  ? "Edit Subcategory"
                  : "Add Subcategory"}
              </h2>

              <select
                value={selectedCategoryId}
                onChange={(e) => setSelectedCategoryId(e.target.value)}
              >
                <option value="">Select Category</option>

                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.categoryName}
                  </option>
                ))}
              </select>

              <input
                placeholder="Subcategory Name"
                value={subCategoryName}
                onChange={(e) => setSubCategoryName(e.target.value)}
              />

              <button className="primary" onClick={saveSubCategory}>
                {editingSubCategoryId
                  ? "Update Subcategory"
                  : "Add Subcategory"}
              </button>

              {editingSubCategoryId && (
                <button
                  className="secondary"
                  onClick={resetSubCategoryForm}
                >
                  Cancel
                </button>
              )}
            </div>

            <div className="table-card">
              <h2>Subcategories</h2>

              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Subcategory</th>
                    <th>Category</th>
                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {subCategories.map((subCategory) => (
                    <tr key={subCategory.id}>
                      <td>{subCategory.id}</td>
                      <td>{subCategory.subCategoryName}</td>
                      <td>{subCategory.category?.categoryName}</td>

                      <td>
                        <button
                          className="edit"
                          onClick={() => editSubCategory(subCategory)}
                        >
                          Edit
                        </button>

                        <button
                          className="delete"
                          onClick={() =>
                            deleteSubCategory(subCategory.id)
                          }
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}

export default App;
