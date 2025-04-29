document.addEventListener('DOMContentLoaded', () => {
    const productGrids = {
        'poe2-products': 'Path of Exile 2',
        'ragnarok-products': 'Ragnarok',
        'dofus-products': 'Dofus'
    };

    const currentGridId = Object.keys(productGrids).find(id => document.getElementById(id));

    if (currentGridId) {
        fetch('../data/products.json') // Adjust path if needed
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(products => {
                const gridElement = document.getElementById(currentGridId);
                const sectionName = productGrids[currentGridId];
                const sectionProducts = products.filter(p => p.section === sectionName);

                if (sectionProducts.length === 0) {
                    gridElement.innerHTML = '<p>Nenhum produto encontrado nesta seção.</p>';
                    return;
                }

                sectionProducts.forEach(product => {
                    const card = createProductCard(product);
                    gridElement.appendChild(card);
                });
            })
            .catch(error => {
                console.error('Erro ao carregar produtos:', error);
                const gridElement = document.getElementById(currentGridId);
                if(gridElement) {
                    gridElement.innerHTML = '<p>Ocorreu um erro ao carregar os produtos. Tente novamente mais tarde.</p>';
                }
            });
    }
});

function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card';

    const img = document.createElement('img');
    // Use a placeholder if image URL is empty or invalid
    img.src = product.image && product.image.trim() !== '' ? product.image : 'img/placeholder.png'; // Assuming a placeholder image exists
    img.alt = product.name;
    img.onerror = () => { img.src = 'img/placeholder.png'; }; // Fallback placeholder
    card.appendChild(img);

    const name = document.createElement('h3');
    name.textContent = product.name;
    card.appendChild(name);

    const price = document.createElement('p');
    price.className = 'price';
    // Format price to Brazilian Real (R$)
    price.textContent = `R$ ${product.price.toFixed(2).replace('.', ',')}`;
    card.appendChild(price);

    const buyButton = document.createElement('button');
    buyButton.textContent = 'Comprar';
    buyButton.onclick = () => handlePurchase(product);
    card.appendChild(buyButton);

    return card;
}

function handlePurchase(product) {
    // Default values from user request
    const defaultWhatsapp = '+5511997387181';
    const defaultDiscord = 'https://discord.gg/fnNEM6tR';

    const whatsappNumber = product.whatsapp || defaultWhatsapp;
    const discordLink = product.discord || defaultDiscord;

    // Clean WhatsApp number (remove non-digits)
    const cleanWhatsappNumber = whatsappNumber.replace(/\D/g, '');

    const message = encodeURIComponent(`Olá! Tenho interesse em comprar ${product.name} do Superloot.gg.`);
    const whatsappUrl = `https://wa.me/${cleanWhatsappNumber}?text=${message}`;

    // For now, just redirect to WhatsApp. Option to choose can be added later.
    // Maybe show a small modal asking user to choose WhatsApp or Discord?
    // For simplicity, starting with WhatsApp only as per initial flow description.
    console.log(`Redirecionando para WhatsApp: ${whatsappUrl}`);
    window.open(whatsappUrl, '_blank');

    // Potential future implementation for choice:
    /*
    const choice = confirm(`Comprar ${product.name}. Deseja finalizar via WhatsApp ou Discord?\nOK = WhatsApp, Cancelar = Discord`);
    if (choice) {
        window.open(whatsappUrl, '_blank');
    } else {
        // How to handle Discord? Just open the link? Or is there a way to pre-fill?
        // Discord links usually just go to a server/channel.
        // Maybe copy a message to clipboard?
        navigator.clipboard.writeText(`Olá! Tenho interesse em comprar ${product.name} do Superloot.gg.`).then(() => {
            alert('Mensagem copiada! Cole no Discord.');
            window.open(discordLink, '_blank');
        }).catch(err => {
            console.error('Erro ao copiar para clipboard:', err);
            window.open(discordLink, '_blank'); // Open link anyway
        });
    }
    */
}

// Placeholder for main.js functionality if needed
document.addEventListener('DOMContentLoaded', () => {
    // Add active class to current page link in header
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('header nav a');
    navLinks.forEach(link => {
        if (link.getAttribute('href') === currentPage) {
            link.classList.add('active');
        }
    });

    // Community section link
    const communityLink = document.querySelector('#community a');
    if (communityLink) {
        communityLink.href = 'https://discord.gg/fnNEM6tR'; // Set the Discord link
        communityLink.target = '_blank'; // Open in new tab
    }
});

