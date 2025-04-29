document.addEventListener("DOMContentLoaded", () => {
    const productForm = document.getElementById("product-form");
    const productsTableBody = document.querySelector("#products-table tbody");
    const productIdInput = document.getElementById("product-id");
    const saveButton = document.getElementById("save-button");
    const cancelButton = document.getElementById("cancel-button");

    const API_URL = "/api/products"; // Base URL for our Flask API

    // Function to fetch products and populate the table
    const fetchProducts = async () => {
        try {
            const response = await fetch(API_URL);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const products = await response.json();
            renderTable(products);
        } catch (error) {
            console.error("Erro ao buscar produtos:", error);
            productsTableBody.innerHTML = `<tr><td colspan="7">Erro ao carregar produtos: ${error.message}</td></tr>`;
        }
    };

    // Function to render the products table
    const renderTable = (products) => {
        productsTableBody.innerHTML = ""; // Clear existing rows
        if (!products || products.length === 0) {
            productsTableBody.innerHTML = "<tr><td colspan=\"7\">Nenhum produto cadastrado.</td></tr>";
            return;
        }
        products.forEach(product => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${escapeHTML(product.name)}</td>
                <td>${escapeHTML(product.section)}</td>
                <td>R$ ${product.price.toFixed(2).replace(".", ",")}</td>
                <td><img src="${escapeHTML(product.image || 
'img/placeholder.png')}" alt="${escapeHTML(product.name)}" width="50" onerror="this.src=\'img/placeholder.png\'"></td>
                <td>${escapeHTML(product.whatsapp || "-")}</td>
                <td>${escapeHTML(product.discord || "-")}</td>
                <td class="actions">
                    <button class="edit-btn" data-id="${product.id}" title="Editar">✏️</button>
                    <button class="delete-btn" data-id="${product.id}" title="Excluir">🗑️</button>
                </td>
            `;
            productsTableBody.appendChild(row);
        });

        // Add event listeners for edit and delete buttons
        document.querySelectorAll(".edit-btn").forEach(button => {
            button.addEventListener("click", handleEdit);
        });
        document.querySelectorAll(".delete-btn").forEach(button => {
            button.addEventListener("click", handleDelete);
        });
    };

    // Handle form submission (Add or Update)
    productForm.addEventListener("submit", async (event) => {
        event.preventDefault();
        const formData = new FormData(productForm);
        const productData = Object.fromEntries(formData.entries());
        // Convert price to number
        productData.price = parseFloat(productData.price);

        const productId = productIdInput.value;
        const method = productId ? "PUT" : "POST";
        const url = productId ? `${API_URL}/${productId}` : API_URL;

        try {
            const response = await fetch(url, {
                method: method,
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(productData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
            }

            resetForm();
            fetchProducts(); // Refresh table
            alert(`Produto ${productId ? 'atualizado' : 'adicionado'} com sucesso!`);

        } catch (error) {
            console.error("Erro ao salvar produto:", error);
            alert(`Erro ao salvar produto: ${error.message}`);
        }
    });

    // Handle Edit button click
    const handleEdit = async (event) => {
        const id = event.target.dataset.id;
        try {
            const response = await fetch(`${API_URL}/${id}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const product = await response.json();

            // Populate form
            productIdInput.value = product.id;
            document.getElementById("name").value = product.name;
            document.getElementById("section").value = product.section;
            document.getElementById("price").value = product.price.toFixed(2);
            document.getElementById("image").value = product.image || "";
            document.getElementById("whatsapp").value = product.whatsapp || "";
            document.getElementById("discord").value = product.discord || "";

            saveButton.textContent = "Atualizar Produto";
            cancelButton.style.display = "inline-block";
            window.scrollTo(0, 0); // Scroll to top to see the form
        } catch (error) {
            console.error("Erro ao buscar produto para edição:", error);
            alert("Erro ao carregar dados do produto para edição.");
        }
    };

    // Handle Delete button click
    const handleDelete = async (event) => {
        const id = event.target.dataset.id;
        if (!confirm("Tem certeza que deseja excluir este produto?")) {
            return;
        }

        try {
            const response = await fetch(`${API_URL}/${id}`, {
                method: "DELETE",
            });

            if (!response.ok) {
                 const errorData = await response.json();
                throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
            }

            fetchProducts(); // Refresh table
            alert("Produto excluído com sucesso!");

        } catch (error) {
            console.error("Erro ao excluir produto:", error);
            alert(`Erro ao excluir produto: ${error.message}`);
        }
    };

    // Handle Cancel Edit button click
    cancelButton.addEventListener("click", resetForm);

    // Function to reset the form
    function resetForm() {
        productForm.reset();
        productIdInput.value = "";
        saveButton.textContent = "Adicionar Produto";
        cancelButton.style.display = "none";
    }

    // Function to escape HTML special characters
    function escapeHTML(str) {
        if (str === null || str === undefined) return '';
        return str.toString()
                .replace(/&/g, "&amp;")
                .replace(/</g, "&lt;")
                .replace(/>/g, "&gt;")
                .replace(/"/g, "&quot;")
                .replace(/'/g, "&#039;");
    }

    // Initial load of products
    fetchProducts();
});

