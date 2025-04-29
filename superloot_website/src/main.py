# -*- coding: utf-8 -*-
import sys
import os
import json
from functools import wraps
from flask import Flask, request, jsonify, render_template, redirect, url_for, session, send_from_directory

sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))

app = Flask(__name__, template_folder="../templates", static_folder="../public")
app.secret_key = os.urandom(24) # Needed for session management

DATA_FILE = os.path.join(os.path.dirname(__file__), "..", "data", "products.json")

# --- Admin Credentials ---
ADMIN_USERNAME = "SuperLootAdmin"
ADMIN_PASSWORD = "Superl00t"

# --- Helper Functions ---
def read_products():
    try:
        with open(DATA_FILE, "r") as f:
            return json.load(f)
    except (FileNotFoundError, json.JSONDecodeError):
        return []

def write_products(products):
    with open(DATA_FILE, "w") as f:
        json.dump(products, f, indent=2)

def login_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if "logged_in" not in session:
            return redirect(url_for("admin_login"))
        return f(*args, **kwargs)
    return decorated_function

# --- Frontend Routes (Serving HTML) ---
@app.route("/")
def index():
    return send_from_directory(app.static_folder, "index.html")

@app.route("/<path:filename>")
def serve_static(filename):
    # Serve other static files like html, css, js, images
    return send_from_directory(app.static_folder, filename)

# --- Admin Routes ---
@app.route("/admin", methods=["GET"])
@login_required
def admin_panel():
    return render_template("admin_panel.html")

@app.route("/admin/login", methods=["GET", "POST"])
def admin_login():
    error = None
    if request.method == "POST":
        username = request.form.get("username")
        password = request.form.get("password")
        if username == ADMIN_USERNAME and password == ADMIN_PASSWORD:
            session["logged_in"] = True
            return redirect(url_for("admin_panel"))
        else:
            error = "Credenciais inválidas. Tente novamente."
    # If GET or login failed, show login page
    if "logged_in" in session:
         return redirect(url_for("admin_panel")) # Redirect if already logged in
    return render_template("admin_login.html", error=error)

@app.route("/admin/logout", methods=["POST"])
def admin_logout():
    session.pop("logged_in", None)
    return redirect(url_for("admin_login"))

# --- API Routes (CRUD for Products) ---
@app.route("/api/products", methods=["GET"])
@login_required
def get_products():
    products = read_products()
    return jsonify(products)

@app.route("/api/products/<string:product_id>", methods=["GET"])
@login_required
def get_product(product_id):
    products = read_products()
    product = next((p for p in products if p["id"] == product_id), None)
    if product:
        return jsonify(product)
    else:
        return jsonify({"message": "Produto não encontrado"}), 404

@app.route("/api/products", methods=["POST"])
@login_required
def add_product():
    if not request.json:
        return jsonify({"message": "Dados inválidos"}), 400
    
    new_product = request.json
    products = read_products()
    
    # Basic validation
    if not all(k in new_product for k in ("name", "section", "price", "image")):
         return jsonify({"message": "Campos obrigatórios ausentes"}), 400
    
    # Generate a simple ID (consider using UUID in a real app)
    new_product["id"] = f"prod_{len(products) + 1}_{os.urandom(4).hex()}"
    # Ensure price is float
    try:
        new_product["price"] = float(new_product["price"])
    except ValueError:
         return jsonify({"message": "Preço inválido"}), 400

    # Set defaults if optional fields are empty
    new_product["whatsapp"] = new_product.get("whatsapp") or "+5511997387181"
    new_product["discord"] = new_product.get("discord") or "https://discord.gg/fnNEM6tR"

    products.append(new_product)
    write_products(products)
    return jsonify(new_product), 201

@app.route("/api/products/<string:product_id>", methods=["PUT"])
@login_required
def update_product(product_id):
    if not request.json:
        return jsonify({"message": "Dados inválidos"}), 400

    products = read_products()
    product_index = next((i for i, p in enumerate(products) if p["id"] == product_id), None)

    if product_index is None:
        return jsonify({"message": "Produto não encontrado"}), 404

    updated_data = request.json
    # Ensure price is float
    try:
        if "price" in updated_data:
            updated_data["price"] = float(updated_data["price"])
    except ValueError:
         return jsonify({"message": "Preço inválido"}), 400

    # Update fields provided in the request
    for key, value in updated_data.items():
        if key != "id": # Don't allow changing the ID
            products[product_index][key] = value
            
    # Ensure defaults if optional fields are empty after update
    products[product_index]["whatsapp"] = products[product_index].get("whatsapp") or "+5511997387181"
    products[product_index]["discord"] = products[product_index].get("discord") or "https://discord.gg/fnNEM6tR"

    write_products(products)
    return jsonify(products[product_index])

@app.route("/api/products/<string:product_id>", methods=["DELETE"])
@login_required
def delete_product(product_id):
    products = read_products()
    initial_length = len(products)
    products = [p for p in products if p["id"] != product_id]

    if len(products) == initial_length:
        return jsonify({"message": "Produto não encontrado"}), 404

    write_products(products)
    return jsonify({"message": "Produto excluído com sucesso"}), 200

if __name__ == "__main__":
    # Use 0.0.0.0 to make it accessible externally if needed
    app.run(host="0.0.0.0", port=5000, debug=True) # Use debug=False in production
